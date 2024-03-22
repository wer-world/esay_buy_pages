import request from "/util/request.js";

export function login(user) {
    return request.post('/user/checkLogin', {
        loginName: user.loginName,
        password: user.password
    })
}

export function checkLogin(user) {
    return request.post('/user/checkLogin', {
        loginName: user.loginName,
    })
}

export function getUserListPage(type,userName,currentPage,pageSize){
    return request.post('/user/getUserListPage',{
        type: type,
        userName: userName,
        currentPage: currentPage,
        pageSize: pageSize
    })
}

export function checkType(id){
    return request.post('/user/checkType',{
        id:id
    })
}

export function deleteUser(id){
    return request.post('/user/deleteUser',{
        id:id
    })
}

export function getTypeList(){
    return request.post('/type/getTypeList',{

    })
}
