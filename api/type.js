import request from "/util/request.js";

export function getTypeList(){
    return request.get('/type/getTypeList');
}