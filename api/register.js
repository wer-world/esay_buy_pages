import request from "../util/request.js";

export function register(user) {
    return request.post('/user/register', {
        user: user,
    })
}

export function checkRegisterName(loginName) {
    return request.post('/user/checkRegisterName', {
        loginName:loginName
    })
}

export function identityCheck(identityCode) {
    return request.post('/user/identityCheck', {
        identityCode:identityCode
    })
}