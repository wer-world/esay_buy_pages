import axios from '/js/axios'

const instance = axios({
    baseURL: '/nginx/EasyBuy/'
})

instance.interceptors.request.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
})

export default instance;
