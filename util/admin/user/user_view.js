import {getUserById} from "/api/user.js"
import {checkPermission} from "/api/user.js";

new Vue({
    el: '#root',
    data: {
        user: {},
    },
    mounted: async function () {
         const {code, message} = await checkPermission()
        if (code === '300') {
            this.$alert(message, '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        this.initUser();
    },
    methods: {
        async initUser() {
            let urlParams = new URLSearchParams(window.location.search)
            let id = urlParams.get("id")
            const {data} = await getUserById(id);
            this.user = data;
        }
    }
})
