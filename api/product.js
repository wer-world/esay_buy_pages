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
    return request.get('/product/delProduct',{
        params:{
            id:id
        }
    })
}

