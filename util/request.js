import axios from "/js/axios.js";

const instance = axios.create({
    baseURL: '/nginx/'
})

let isRandom = true
instance.interceptors.request.use(async (config) => {
    if (isRandom) {
        isRandom = false
        config.headers.random = await instance.get('/replay/getRandom')
        config.headers.token = document.cookie
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
