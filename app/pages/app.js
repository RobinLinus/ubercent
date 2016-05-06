(function() {
    window.app = {};

    app.showLoading = function(isLoading) {
        $('#loading').hidden = isLoading === false ? true : false;
    }

}());
