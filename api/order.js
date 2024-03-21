import request from "/util/request.js";

export function getOrderList() {
    return request.get('/order/getOrderList')
}

export function getOrder(orderId) {
    return request.post('/order/addOrder', {
        orderId: orderId
    })
}
