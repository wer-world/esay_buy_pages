import request from "../util/request.js";

export function addCollection(productId){
    return request.post('/collection/addCollection',{
        productId:productId
    })
}
getCollections
export function getCollections(userId){
    return request.get('/collection/getCollections',{
        params:{
            userId:userId
        }
    })
}
export function deleteCollection(id){
    return request.get('/collection/deleteCollection',{
        params:{
            id:id
        }
    })
}