import request from "../util/request.js";

export function checkLoginName(loginName) {
    return request.post('/user/checkLoginName', {
        loginName: loginName,
    })
}

export function login(user) {
    return request.post('/user/login', {
        user: user,
    })
}

export function loginOut() {
    return request.get('/user/loginOut')
}

export function sendEmailCode(email) {
    return request.get('/user/sendEmailCode', {
        params: {
            email: email
        }
    })
}

export function checkEmailCode(emailCode) {
    return request.get('/user/checkEmailCode', {
        params: {
            code: emailCode
        }
    })
}

export function modifyPasswordById(user) {
    return request.post('/user/modifyPasswordById', {
        user: user
    })
}
