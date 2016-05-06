window.resizeImage = function(file, callback, max_size) {
    // Read in file
    // Ensure it's an image

    var dataURLToBlob = function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];
            return new Blob([raw], {
                type: contentType
            });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType
        });
    }


    if (file.type.match(/image.*/)) {
        console.log('An image has been loaded');
        // Load the image
        var reader = new FileReader();
        reader.onload = function(readerEvent) {
            var image = new Image();
            image.onload = function(imageEvent) {
                // Resize the image
                var canvas = document.createElement('canvas'),
                    width = image.width,
                    height = image.height;
                max_size = max_size || 544;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                var ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/png');
                var resizedImage = dataURLToBlob(dataUrl);
                callback(dataUrl,resizedImage);
            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    }
};
