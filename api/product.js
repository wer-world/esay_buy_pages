import request from "/util/request.js";

export function getProductListPages(currentPageCount,pageSize,brandName,name,categoryName) {
    return request.post('/product/getProductListPages',{
        currentPage:currentPageCount,
        pageSize:pageSize,
        brandName:brandName,
        name:name,
        categoryName:categoryName
    })
}

export function delProduct(id) {
    return request.get('/product/delProduct', {
        params: {
            id: id
        }
    })
}

export function downloadProductImg(picPath) {
    return request.post('/product/downLoad', {
        picPath: picPath
    }, {
        responseType:'blob'
    })
}

export function getProductsByHigHestId(id){
    return request.post('/product/getProductsByHigHestId',{
        id:id
    })
}

export function getProductById(id){
    return request.post('/product/getProductById',{
        id:id
    })
}

export function getSimilarProducts(categoryLevelId){
    return request.post('/product/getSimilarProducts',{
        categoryLevelId:categoryLevelId
    })
}

export function addProduct(formDate){
    return request.post('/product/addProduct', formDate)
}
