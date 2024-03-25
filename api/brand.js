import request from "/util/request.js";

export function getBrandAllList() {
    return request.get('/brand/getBrandAllList')
}
