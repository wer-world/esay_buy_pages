import request from "../util/request.js";

export function addFile(formDate){
    return request.post('/file/addFile', formDate)
}