import request from "/util/request.js";

export function getBuyCarListByUserId() {
    return request.get('/buyCar/getBuyCarListByUserId')
}

export function delBuyCarProductById(id) {
    return request.get('/buyCar/delBuyCarProductById', {
        params: {
            id: id
        }
    })
}
