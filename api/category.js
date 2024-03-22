import request from "/util/request.js";

export function getCategoryList(value) {
    return request.post('/category/getCategoryList', {
        parentId: value
    })
}

export function getProCategoryNameByType() {
    return request.get('/category/getProCategoryNameByType')
}
