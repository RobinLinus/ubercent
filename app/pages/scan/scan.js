(function() {
    var gCtx = null;
    var gCanvas = null;
    var c = 0;
    var stype = 0;
    var gUM = false;
    var webkit = false;
    var moz = false;
    var v = null;
    var stream = null;

    var imghtml = '<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>' +
        '<div id="imghelp">drag and drop a QRCode here' +
        '</div>';

    var vidhtml = '<video id="v" autoplay></video>';

    function handleFile(f) {
        if (f) {
            app.showLoading();
            setTimeout(function() {
                window.resizeImage(f, qrcode.decode, 512);
            }, 50);
        }
    }

    function initCanvas(w, h) {
        gCanvas = $("#qr-canvas");
        gCanvas.style.width = w + "px";
        gCanvas.style.height = h + "px";
        gCanvas.width = w;
        gCanvas.height = h;
        gCtx = gCanvas.getContext("2d");
        gCtx.clearRect(0, 0, w, h);
    }


    var frameTimer;

    function captureToCanvas() {
        if (stype != 1)
            return;
        if (gUM) {
            try {
                gCtx.drawImage(v, 0, 0);
                try {
                    qrcode.decode();
                } catch (e) {
                    console.log(e);
                    frameTimer = setTimeout(captureToCanvas, 200);
                };
            } catch (e) {
                console.log(e);
                frameTimer = setTimeout(captureToCanvas, 200);
            };
        }
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }


    function isCanvasSupported() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    function success(s) {
        stream = s;
        v.src = createObjectURL(stream);
        gUM = true;
    }

    function createObjectURL(file) {
        if (window.webkitURL) {
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    }

    function error(error) {
        gUM = false;
        addFallbackText();
    }

    function load() {
        if (isCanvasSupported() && window.File && window.FileReader) {
            initCanvas(800, 600);
            qrcode.callback = read;
            setwebcam();
        } else {
            addFallbackText();
        }
    }


    function addFallbackText() {
        $("#outdiv").innerHTML = "Click here to scan a code"
    }

    function setwebcam() {
        if (stype == 1) {
            frameTimer = setTimeout(captureToCanvas, 200);
            return;
        }
        var n = navigator;
        $("#outdiv").innerHTML = vidhtml;
        v = $("#v");


        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
            addFallbackText();
            return;
        }

        // List cameras and microphones.

        var videoSourceId;
        navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                devices.forEach(function(device) {
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                    if (device.label.indexOf('back') > -1) {
                        videoSourceId = device.deviceId;
                        console.log('asd', videoSourceId)
                    }
                });
                fetchImage();
            })
            .catch(function(err) {
                console.log(err.name + ": " + err.message);
            });


        function fetchImage() {

            if (n.getUserMedia)
                n.getUserMedia({
                    video: {
                        optional: [{ sourceId: videoSourceId }]
                    },
                    audio: false
                }, success, error);
            else
            if (n.mediaDevices.getUserMedia)
                n.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        optional: [{ sourceId: videoSourceId }]
                    },
                    audio: false
                })
                .then(success)
                .catch(error);
            else
            if (n.webkitGetUserMedia) {
                webkit = true;
                n.webkitGetUserMedia({
                    video: {
                        optional: [{ sourceId: videoSourceId }]
                    },
                    audio: false
                }, success, error);
            } else
            if (n.mozGetUserMedia) {
                moz = true;
                n.mozGetUserMedia({
                    video: {
                        optional: [{ sourceId: videoSourceId }]
                    },
                    audio: false
                }, success, error);
            } else {
                addFallbackText();
            }

            stype = 1;
            frameTimer = setTimeout(captureToCanvas, 200);
        }
    }

    function setimg() {
        if (stype == 2)
            return;
        $("#outdiv").innerHTML = imghtml;
        $("#qrimg").style.opacity = 1.0;
        $("#webcamimg").style.opacity = 0.2;
        var qrfile = $("#qrfile");
        stype = 2;
    }


    function read(a) {
        console.log(a);
        app.showLoading(false);
        if (a && a.indexOf && a.indexOf('error') !== -1) {
            return alert(a);
        }
        stop();
        vibrateNotify();
        setTimeout(function() {
            vibrateNotify();
            var privateKey = /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/

            if (privateKey.test(a)) {
                localStorage.setItem('privateKey', a);
                return location = '/';
                // if (confirm('Do you want to Import this Wallet?')) {

                // }
            }
            a = a.replace('bitcoin:', '');
            location = '#send?s=bitcoin:' + a;
        }, 200)
    }

    function vibrateNotify() {
        // enable vibration support
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }


    function stop() {
        stype = 0;

        if (window.mediaStream && mediaStream.stop) {
            mediaStream.stop();
        }
        if (stream && stream.getTracks && stream.getTracks()[0]) {
            stream.getTracks()[0].stop();
        }
        clearTimeout(frameTimer);
        v.src = null;
    }


    makeFileInput($('.scan .content'), handleFile);
    makeFileDrop(document.body, handleFile);
    $('.scan .content').addEventListener('click', function() {
        clearTimeout(frameTimer);
        v.src = '';
    })

    $('.scan').show = function() {
        setTimeout(load, 800);
    };
    $('.scan').hide = function() {
        stop();
    };

}())
