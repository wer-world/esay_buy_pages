import request from "../util/request.js";

export function getAddressListByUserId(){
    return request.get('/address/getAddressListByUserId')
}

export function addAddress(){
    return request.get('/address/addAddress')
}