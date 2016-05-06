(function() {
    var keys;
    var transaction;

    function parseBitcoinURL(url) {
        var r = /^bitcoin:([a-zA-Z0-9]{27,34})(?:\?(.*))?$/;
        var match = r.exec(url);
        if (!match) return null;

        var parsed = { url: url }

        if (match[2]) {
            var queries = match[2].split('&');
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].split('=');
                if (query.length == 2) {
                    parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
                }
            }
        }

        parsed.address = match[1];
        return parsed;
    }


    function parseTransactionURL() {
        var result = parseBitcoinURL(decodeURIComponent(location.hash.substr(8)));
        if (result.amount) {
            if (result.amount.indexOf('$') === -1) {
                result.amount = Exchange.BTCtoUSD(result.amount);
            } else {
                result.amount = result.amount.replace('$', '');
            }
        }
        return result;
    }

    function initTransaction() {
        transaction = parseTransactionURL();
        console.log(transaction);
        if (transaction && transaction.amount) {
            $('.send #amount').value = transaction.amount;
        }
    }

    function setBalanceUI(balance) {
        var ui = $('.send #balance');
        ui.textContent = balance;
    }

    window.send = function() {
        var amount = $('.send #amount').value;
        var button = $('.send button');
        button.hidden = true;
        amount = Number(amount);
        amount = Exchange.USDtoBTC(amount);

        var receiver = transaction.address;
        var success = Wallet.pay(amount, receiver, function(success, error) {
            if (!success) {
                return alert(error);
            }
            location = '/';
        });
        if (!success) {
            button.hidden = false;
        }
    }

    function init() {
        keys = Account.getKeyPairFromStorage();
        Account.fetchBalance(setBalanceUI);
        Wallet.init(keys);
        initTransaction();
        if (transaction) {
            updateIdenticon($('.send #identicon'), transaction.address);
        }
        setTimeout(function() {
            $('.send #amount').focus();
        }, 1000);
    }

    $('.send').show = init;
}());
