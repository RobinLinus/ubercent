(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var keys = Account.getKeyPairFromStorage();
    var key = keys.private;
    var publicKey = keys.public;
    var lastPaint;

    function getQRCode(key, callback) {
        var img = qr.image(key);
        img.onload = function() {
            callback(img)
        };
    }


    function paintBG() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#EFEFEF";
        ctx.fillRect(0, 0, canvas.width, canvas.width);
    }

    function paintText(key, publicKey) {
        ctx.font = "13px sans-serif";
        ctx.textAlign = "center";
        ctx.strokeText(publicKey, 150, 280);

        ctx.save();
        ctx.translate(284, 284);
        ctx.rotate(-Math.PI / 2);
        ctx.strokeText('ubercent.com', 16, 290);
        ctx.restore();
    }

    function paintQRCode(key, callback) {
        getQRCode(key, function(img) {
            ctx.drawImage(img, 16, 316, 152, 152);
            callback();
        });
    }


    function paintIdenticon() {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 50, 50, 200, 200);
        };
        updateIdenticon(img, keys.public, 200, [240, 240, 240, 255]);
    }


    function paintLogo() {
        var logoUrl = '../images/touch/icon-72x72.png'
        var img = new Image();
        img.onload = function() {
            ctx.save();
            ctx.translate(16, 80);
            ctx.rotate(-Math.PI / 2);
            ctx.drawImage(img, 236, 421, 64, 64);
            ctx.restore();
        };
        img.src = logoUrl;
    }


    function paint() {
        if (publicKey === lastPaint) {
            return;
        }
        lastPaint = publicKey;
        paintBG();
        paintText(key, publicKey);
        paintIdenticon();
        paintLogo();
        paintQRCode(key, function() {
            var dataUrl = canvas.toDataURL();
            var link = document.getElementById('dlLink');
            link.href = dataUrl;
        });
    }

    $('.page.export').show = function() {
        setTimeout(paint, 500);
    }
}())
