function httpPost(theUrl, callback, params, onerror) {
    http(theUrl, callback, 'POST', params, onerror);
}

function httpGet(theUrl, callback, onerror) {
    http(theUrl, callback, 'GET', null, onerror);
}

function http(theUrl, callback, method, params, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        } else {
            if (xhr.readyState == 4 && xhr.status >= 400) {
                return onerror ? onerror() : null;
            }
        }
    }
    xhr.open(method ? method : "GET", theUrl, true); // true for asynchronous
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(params ? JSON.stringify(params) : null);
}

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    var nodesList = document.querySelectorAll(selector);
    var nodeArray = Array.prototype.slice.call(nodesList, 0);
    return nodeArray;
}


String.prototype.hexEncode = function() {
    var hex, i;

    var result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("" + hex).slice(-4);
    }

    return result
}