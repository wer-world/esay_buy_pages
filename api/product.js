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