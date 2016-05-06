function makeFileInput(elem, callback) {
    if (!elem) {
        return;
    }

    var fileInput = document.querySelector('file-input-x42');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.className = 'file-input-x42';
        fileInput.style.position = 'fixed';
        fileInput.style.top = '-10000px';
        fileInput.style.left = '-10000px';
        fileInput.style.opacity = 0;
        document.body.appendChild(fileInput);
        fileInput.addEventListener('change', function(e) {
            var files = fileInput.files;
            if (!files) {
                return;
            }
            callback(files[0]);
        }, false);
    }

    elem.addEventListener('click', function(e) {
        var button = e.which || e.button;
        if (button !== 1) {
            return;
        }
        fileInput.value = null;
        fileInput.click();
    }.bind(this), false);
}

function makeFileDrop(elem, callback) {
    if (!elem) {
        return;
    }

    function noopHandler(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    function drop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var dt = evt.dataTransfer;
        var files = dt.files;
        if (files.length > 0) {
            callback(files[0]);
        } else
        if (dt.getData('URL')) {
            console.log(dt.getData('URL'))
        }
    }
    document.body.addEventListener('dragenter', noopHandler, false);
    document.body.addEventListener('dragexit', noopHandler, false);
    document.body.addEventListener('dragover', noopHandler, false);
    elem.addEventListener('drop', drop, false);


}
