import request from "/util/request.js";

export function getOrderList(currentPage, pageSize, serialNumber, loginName) {
    return request.post('/order/getOrderList', {
        currentPage: currentPage,
        pageSize: pageSize,
        serialNumber: serialNumber,
        loginName: loginName
    })
}

export function getUserOrderList(currentPage, pageSize, serialNumber, status) {
    return request.post('/order/getUserOrderList', {
        currentPage: currentPage,
        pageSize: pageSize,
        serialNumber: serialNumber,
        status: status
    })
}

export function getOrder(id, serialNumber) {
    return request.post('/order/getOrder', {
        id: id,
        serialNumber: serialNumber
    })
}

export function getAdminOrder(id) {
    return request.post('/order/getAdminOrder', {
        id: id
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

export function createOrder(buyCar) {
    return request.post('/order/createOrder', {
        buyCar: buyCar
    })
}

export function createMobilePaymentOrder(mobile, cost) {
    return request.post('/order/createMobilePaymentOrder', {
        mobile: mobile,
        cost: cost
    })
}

export function cancelOrder(id) {
    return request.get('/order/cancelOrder', {
        params: {
            id: id
        }
    })
}

export function modOrder(id, status) {
    return request.get('/order/modOrder', {
        params: {
            id: id,
            status: status
        }
    })
}
