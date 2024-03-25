import axios from "/js/axios.js";

function readTokenCookie() {
    let allCookies = document.cookie;
    let cookieArray = allCookies.split(';')
    for (let i = 0; i < cookieArray.length; i++) {
        let name = cookieArray[i].split('=')[0].trim()
        if (name === 'token') {
            return cookieArray[i].split('=')[1]
        }
    }
}

const instance = axios.create({
    baseURL: '/nginx/'
})

let isRandom = true
instance.interceptors.request.use(async (config) => {
    if (isRandom) {
        isRandom = false
        config.headers.random = await instance.get('/replay/getRandom')
        config.headers.token = readTokenCookie()
        config.headers.urlTime = Date.now()
    }
    return config
})

instance.interceptors.response.use(function (response) {
    isRandom = true
    return response.data;
}, function (error) {
    return Promise.reject(error);
})

export default instance;
