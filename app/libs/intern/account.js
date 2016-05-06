window.Account = new function() {
    var privateKey;
    var publicKey;

    function getKeyPairFromStorage() {
        if (privateKey && publicKey) {
            return {
                public: publicKey,
                private: privateKey
            }
        }
        privateKey = getFromLocalStorage('privateKey');
        if (privateKey) {
            publicKey = getPublicKey(privateKey);
            return {
                public: publicKey,
                private: privateKey
            };
        }
        return createPrivateKey();
    }

    function getFromLocalStorage(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage[key];
        } else {
            console.log('Sorry! No Web Storage support..');
        }
    }

    function getPublicKey(privateKey) {
        var pair = bitcoin.ECPair.fromWIF(privateKey);
        return pair.getAddress();
    }


    function createPrivateKey() {
        var keyPair = bitcoin.ECPair.makeRandom()

        privateKey = keyPair.toWIF();
        publicKey = keyPair.getAddress();

        localStorage.setItem('privateKey', privateKey);

        return {
            public: publicKey,
            private: privateKey
        }
    }



    function fetchBalance(callback) {
        var url = 'https://bitcoin.toshi.io/api/v0/addresses/' + publicKey;
        httpGet(url, function(result) {
            result = result.balance + result.unconfirmed_balance, result.unconfirmed_balance;
            callback(formatBalance(result));
        }, function() {
            callback(formatBalance(0));
        });
    }


    function formatBalance(balance) {
        balance = Exchange.BTCtoUSD(balance);
        var dollars = Math.floor(balance);
        var cents = Math.floor((balance - dollars) * 100);
        cents = cents < 10 ? '0' + cents : cents;
        return dollars + '.' + cents;
    }


    return {
        getKeyPairFromStorage: getKeyPairFromStorage,
        createPrivateKey: createPrivateKey,
        fetchBalance: fetchBalance,
    }
}

