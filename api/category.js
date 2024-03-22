import request from "../util/request.js";

export function getProCategoryNameByType() {
    return request.get('/category/getProCategoryNameByType')
}