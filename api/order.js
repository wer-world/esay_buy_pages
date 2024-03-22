import request from "/util/request.js";

export function getOrderList(currentPage, pageSize, serialNumber, loginName) {
    return request.post('/order/getOrderList', {
        currentPage: currentPage,
        pageSize: pageSize,
        serialNumber: serialNumber,
        loginName: loginName
    })
}

export function getOrder(orderId) {
    return request.post('/order/getOrder', {
        orderId: orderId
    })
}
