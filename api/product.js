import request from "/util/request.js";
export function getProductListPages(currentPageCount,pageSize,brandName,name) {
    return request.post('/product/getProductListPages',{
        currentPage:currentPageCount,
        pageSize:pageSize,
        brandName:brandName,
        name:name,
    })
}

export function delProduct(id) {
    return request.get('/product/delProduct',{
        params:{
            id:id
        }
    })
}

export function download(picPath){
    return request.post('/product/downLoad',{
        picPath:picPath
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