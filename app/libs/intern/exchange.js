window.Exchange = (function() {
    var rate = 460 / 100000000;

    function BTCtoUSD(btc) {
        return btc * rate;
    }

    function USDtoBTC(btc) {
        return Math.round(btc / rate);
    }

    return {
        BTCtoUSD: BTCtoUSD,
        USDtoBTC: USDtoBTC
    }
}())
