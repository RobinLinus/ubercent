(function() {
    $$('img[data-src]').forEach(function(img) {
        img.src = img.getAttribute('data-src');
    });
}());
