import request from "../util/request";

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
