function getUrlParam(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let params = window.location.search.substring(1).match(reg);
    if (params != null) {
        return decodeURI(params[2]);
    } else {
        return null;
    }
}
