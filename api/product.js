import request from "/util/request.js";

export function getProductListPages(currentPageCount, pageSize, brandName, productName, categoryLeve3Name, minPrice, maxPrice, isSales, isNewProduct, isPrice) {
    return request.post('/product/getProductListPages', {
        currentPage: currentPageCount,
        pageSize: pageSize,
        brandName: brandName,
        productName: productName,
        categoryName: categoryLeve3Name,
        minPrice: minPrice,
        maxPrice: maxPrice,
        isSales: isSales,
        isNewProduct: isNewProduct,
        isPrice: isPrice
    })
}

export function globalSearchProduct(currentPageCount, pageSize, globalCondition) {
    return request.post('/product/getProductListPages', {
        currentPage: currentPageCount,
        pageSize: pageSize,
        globalCondition: globalCondition
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
        responseType: 'blob'
    })
}

export function getProductsByHigHestId(id) {
    return request.post('/product/getProductsByHigHestId', {
        id: id
    })
}

export function getProductById(id) {
    return request.post('/product/getProductById', {
        id: id
    })
}

export function getSimilarProducts(categoryLevelId) {
    return request.post('/product/getSimilarProducts', {
        categoryLevelId: categoryLevelId
    })
}

export function addProduct(formDate) {
    return request.post('/product/addProduct', formDate)
}

export function modifyProductById(formDate) {
    return request.post('/product/modifyProductById', formDate)
}

