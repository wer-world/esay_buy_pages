import request from "/util/request.js";

export function alipayCreate(id, serialNumber) {
    return request.post('/alipay/createAlipay', {
        id: id,
        serialNumber: serialNumber
    })
}
