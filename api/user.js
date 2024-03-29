import request from "/util/request.js";


export function getUserListPage(type, userName, currentPage, pageSize) {
    return request.post('/user/getUserListPage', {
        type: type,
        userName: userName,
        currentPage: currentPage,
        pageSize: pageSize
    })
}

export function checkType(id) {
    return request.post('/user/checkType', {
        id: id
    })
}

export function deleteUser(id) {
    return request.post('/user/deleteUser', {
        id: id
    })
}

export function updateUser(user) {
    return request.post('/user/updateUser', {
        user: user
    })
}

export function getTypeList() {
    return request.post('/type/getTypeList', {})
}

export function getUserById(id) {
    return request.get('/user/getUserById', {
        params: {
            id: id
        }
    })
}

export function getCurrentUser() {
    return request.get('/user/getCurrentUser');
}

export function checkPermission() {
    return request.get('/user/checkPermission')
}

export function getUserInfoAndAddress() {
    return request.get('/user/getUserInfoAndAddress')
}
