import request from "/util/request.js";

export function getOrderDetailList(id) {
    return request.get('/orderDetail/getOrderDetailList', {
        params:{
            id: id
        }
    })
}
