import request from "../util/request.js";

export function getBrandList(){
    return request.get('/brand/getBrandList')
}