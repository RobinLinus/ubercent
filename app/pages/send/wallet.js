window.Wallet = (function() {
    var fee = 2000;
    var keys;
    var unspentOutputs;
    var unconfirmed;

    function fetchUnspentOutputs(publicKey) {
        var url = 'https://bitcoin.toshi.io/api/v0/addresses/' + publicKey + '/unspent_outputs';
        httpGet(url, function(outputs) {
            console.log(outputs);
            unspentOutputs = outputs;
        });
    }

    function fetchUnconfirmedTransactions(publicKey) {
        var url = 'https://bitcoin.toshi.io/api/v0/addresses/' + publicKey + '/transactions';
        httpGet(url, function(transactions) {
            console.log(transactions);
            unconfirmed = transactions;
        });
    }


    function spendOutput(privateKey, unspentOutput, amount, receiver, callback) {
        if (!unspentOutput) {
            return console.log('output is null');
        }
        if (amount + fee > unspentOutput.amount) {
            return console.log('insufficient funds');
        }
        var prevTxHash = unspentOutput.hash;
        var outputIndex = unspentOutput.index;
        var totalAmount = unspentOutput.amount;
        var txHash = createTransaction(prevTxHash, outputIndex, privateKey, receiver, amount, totalAmount);
        console.log(txHash);
        pushTransaction(txHash, function(result) {
            console.log(result);
            callback();
        });
        return true;
    }

    function createTransaction(prevTxHash, outputIndex, privateKeyWIF, receiver, satoshi, totalAmount) {
        var tx = new bitcoin.TransactionBuilder();

        // Initialize a private key using WIF
        var keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF);
        var publicKey = keyPair.getAddress();
        // Add the input (who is paying):
        // [previous transaction hash, index of the output to use]
        tx.addInput(prevTxHash, outputIndex);

        // Add the output (who to pay to):
        // [payee's address, amount in satoshis]
        var sendAmount = satoshi - fee;
        tx.addOutput(receiver, sendAmount);
        tx.addOutput(publicKey, totalAmount - sendAmount);


        // Sign the first input with the new key
        tx.sign(0, keyPair);
        return tx.build().toHex();
    }

    function pushTransaction(txHash, callback) {
        // alternatives are:
        // http://eligius.st/~wizkid057/newstats/pushtxn.php (supports non-standard transactions)
        // https://btc.blockr.io/tx/push
        // http://bitsend.rowit.co.uk (defunct)
        var pushUrl = 'https://bitcoin.toshi.io/api/v0/transactions';

        function onReceive(result) {
            if (result && !result.error) {
                callback(true);
            } else {
                callback(false, result.error);
            }
        }

        httpPost(pushUrl, onReceive, {
            hex: txHash
        })
    }

    function getPositiveOutputs(publicKey) {
        var result = [];
        if (unconfirmed) {
            result = unconfirmed.unconfirmed_transactions.reduce(function(a1, e1) {
                var data = e1.outputs.reduce(function(a2, e2, index) {
                    return (e2.addresses.indexOf(publicKey) > -1 && !e2.spent) ? { amount: e2.amount, index: index } : a2
                }, null);
                if (data) {
                    data.hash = e1.hash;
                    data.time = e1.block_time;
                    data.unconfirmed = true;
                    a1.push(data);
                }
                return a1;
            }, [])
        }

        if (unspentOutputs) {
            result = result.concat(unspentOutputs.reduce(function(a, e) {
                if (!e.spent) {
                    var data = { amount: e.amount, index: e.output_index, hash: e.transaction_hash };
                    a.push(data);
                }
                return a;
            }, []));
        }

        return result;
    }

    function getOutputsFor(publicKey, amount) {
        var outputs = getPositiveOutputs(publicKey);
        return outputs.filter(function(e) {
            return e.amount >= amount;
        })
    }


    function init(k) {
        keys = k
        fetchUnspentOutputs(keys.public);
        fetchUnconfirmedTransactions(keys.public);
    }

    function pay(amount, receiver, callback) {
        var output = getOutputsFor(keys.public, amount)[0];
        var success = spendOutput(keys.private, output, amount, receiver, callback);
        if (!success) {
            callback(false, 'Insufficient Funds');
        }
    }

    return {
        init: init,
        pay: pay
    }
}())
