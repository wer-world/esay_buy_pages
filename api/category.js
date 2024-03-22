import request from "/util/request.js";

export function getCategoryList(value) {
    return request.post('/category/getCategoryList', {
        parentId: value
    })
}

export function getParentCategory(parentId){
    return request.post('/category/getParentCategory',{
        parentId:parentId
    })
}

export function getCategory(id){
    return request.post('/category/getCategory',{
        id:id
    })
}

export function addCategory(name,parentId,type){
    return request.post('/category/addCategory',{
        name:name,
        parentId:parentId,
        type:type
    })
}

export function updateCategory(id,name){
    return request.post('/category/updateCategory',{
        id:id,
        name:name
    })
}

export function deleteCategory(id){
    return request.post('/category/deleteCategory',{
        id:id,
    })
}