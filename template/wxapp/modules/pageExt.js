function getHref(page) {
    if (!page) return '';
    var url = "/" + page.route + "?";
    for (var k in page.options) {
        var v = page.options[k];
        url = url + k + '=' + v + "&";
    }
    return url.slice(0, -1);
}

function getPrevPage() {
    var pages = getCurrentPages();
    if (pages.length <= 1) return null;
    return pages.slice(-2)[0];
}

function getCurrentPage() {
    return getCurrentPages().slice(-1)[0];
}

function getPrevHref() {
    return getHref(getPrevPage());
}

function getCurrentHref() {
    return getHref(getCurrentPage());
}

// 计算页面相对于当前页的delta值 如用于后退时
function lastDeltaOfPages(opts) {
    var pages = getCurrentPages();
    outer:
    for (let i = pages.length - 1; i >= 0; i--) {
        let url = '/' + pages[i].route;
        if (url == opts.url) {
            for (let o in opts.options) {
                if (pages[i].options[o] != opts.options[o]) {
                    break outer;
                }
            }
            return pages.length - i - 1;
        }
    }
    return -1;
}

module.exports = {
    getHref,
    getPrevPage,
    getCurrentPage,
    getPrevHref,
    getCurrentHref,
    lastDeltaOfPages
}
