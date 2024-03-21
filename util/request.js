import axios from "/js/axios.js";

const instance = axios.create({
    baseURL: '/nginx/'
})

// instance.interceptors.request.use((config) => {
//     console.log(config)
//     return config
// })

instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
})

export default instance;
