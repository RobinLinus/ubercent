(function() {
    function locationHashChanged() {
        var hash = location.hash.substr(1);
        if (hash && hash.indexOf('?') > -1) {
            hash = hash.split('?')[0];
        }
        if (!hash || hash === '' || hash === 'home') {
            showPage($('.page.home'));
            // $('.page.' + hash).classList.add('slide-from-right');
            $$('.page').forEach(function(page) {
                if (!page.classList.contains('home') && !page.classList.contains('slide-from-right')) {
                    hidePage(page);
                }
            });
        } else {
            showPage($('.page.' + hash));
            $('.page.home').classList.add('slide-from-left');
        }
    }


    function showPage(page) {
        page.classList.remove('slide-from-right');
        page.classList.remove('slide-from-left');
        if (page.show) {
            page.show();
        }
    }

    function hidePage(page) {
        page.classList.add('slide-from-right');
        if (page.hide) {
            page.hide();
        }
    }


    window.onhashchange = locationHashChanged;
    locationHashChanged();
})();
