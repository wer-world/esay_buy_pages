import request from "../util/request.js";

export function getAddressListByUserId(currentPage,pageSize){
    return request.get('/address/getAddressListByUserId',{
        params:{
            currentPage:currentPage,
            pageSize:pageSize
        }
    })
}

export function addAddress(address){
    return request.post('/address/addAddress',{
        address:address
    })
}

export function deleteAddressById(id){
    return request.get('/address/deleteAddressById',{
        params:{
            id:id
        }
    })
}

export function modifyAddressById(address){
    return request.post('/address/modifyAddressById',{
        address:address
    })
}

export function getAddressById(id){
    return request.get('/address/getAddressById',{
        params:{
            id:id
        }
    })
}
export function getAddressCountByUserId(){
    return request.get('/address/getAddressCountByUserId')
}