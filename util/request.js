import {axios} from "../js/axios.js";

const instance = axios.create({
    baseURL: 'http://localhost/nginx/'
})

instance.interceptors.request.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
})

export default instance;
