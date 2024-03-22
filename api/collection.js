import request from "../util/request.js";

export function addCollection(productId){
    return request.post('/collection/addCollection',{
        productId:productId
    })
}