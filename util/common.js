function getUrlParam(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let params = window.location.search.substring(1).match(reg);
    if (params != null) {
        return decodeURI(params[2]);
    } else {
        return null;
    }
}

function readCookie(cookieName) {
    let allCookies = document.cookie;
    let cookieArray = allCookies.split(';')
    for (let i = 0; i < cookieArray.length; i++) {
        let name = cookieArray[i].split('=')[0].trim()
        if (name === cookieName) {
            return cookieArray[i].split('=')[1]
        }
    }
}
