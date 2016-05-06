(function() {

    var account;


    function setBalanceUI(balance) {
        var ui = $('#balance');
        ui.textContent = balance;
    }


    function registerWalletHandler() {
        $(body).onclick = null;
        var loc = window.location;
        navigator.registerProtocolHandler(
            'bitcoin', loc.protocol + '//' + loc.host + '/?q=%s', 'uebercoin');
    }


    $('header').onclick = function openScanner() {
        location = '#scan';
    };


    //https://insight.bitpay.com/api/tx/d4febac528f9a2c610a1888e4db875171b1b165a8c35a52554eeafa89d16d659

    function init() {
        var keys = Account.getKeyPairFromStorage();
        Account.fetchBalance(setBalanceUI);
        updateIdenticon($('#identicon'), keys.public);
    }
    init();
})()


//https://insight.bitpay.com/api/tx/d4febac528f9a2c610a1888e4db875171b1b165a8c35a52554eeafa89d16d659
