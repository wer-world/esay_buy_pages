import request from "/util/request.js";

export function addBuyCar(productId) {
    return request.post('/buyCar/addBuyCar', {
        productId: productId
    })
}

export function getBuyCarListByUserId() {
    return request.get('/buyCar/getBuyCarListByUserId')
}

export function delBuyCarProductById(id) {
    return request.delete('/buyCar/delBuyCarProductById', {
        params: {
            id: id
        }
    })
}

export function modBuyCarProductNumById(id, productNum) {
    return request.put('/buyCar/modBuyCarProductNumById', {
        id: id,
        productNum: productNum
    })
}
