import request from "/util/request.js";

export function getOrderList(currentPage, pageSize, serialNumber, loginName) {
    return request.post('/order/getOrderList', {
        currentPage: currentPage,
        pageSize: pageSize,
        serialNumber: serialNumber,
        loginName: loginName
    })
}

export function getOrder(id) {
    return request.get('/order/getOrder', {
        params: {
            id: id
        }
    })
}

export function getOrderDetailListPage(currentPage, pageSize, orderId, productName) {
    return request.post('/orderDetail/getOrderDetailListPage', {
        currentPage: currentPage,
        pageSize: pageSize,
        orderId: orderId,
        productName: productName
    })
}
