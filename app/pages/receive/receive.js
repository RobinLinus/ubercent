(function() {
    var publicKey;

    function init() {
        if (publicKey) {
            //already initialized
            return;
        }
        var keys = Account.getKeyPairFromStorage();
        publicKey = keys.public;
        initUI();
    }

    function initUI() {
        if (!window.qr) {
            return;
        }
        var qrCanvas = $('.receive #qrCode');
        qrCanvas.style.width = '240px';
        qrCanvas.style.height = '240px';
        qr.image({
            image: qrCanvas,
            value: publicKey,
            size: 10,
            level: 'H'
        });
        updateIdenticon($('.receive #identicon'), publicKey);
        var sendMeUrl = encodeURIComponent(location.protocol + '//' + location.host + '/#send?s=' + 'bitcoin:' + publicKey);
        $('.receive #publicKey').textContent = publicKey;
        $('.receive #whatsapp').href = 'whatsapp://send?text=' + sendMeUrl;
        $('.receive #email').href = 'mailto:?Subject=My Bitcoin Address&body=' + sendMeUrl;
        $('.receive #copy').href = 'sms:&body='; + sendMeUrl;
    }

    $('.page.receive').show = init;
}())
