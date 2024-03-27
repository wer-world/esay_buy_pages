import {getUserById} from "/api/user.js"
import {checkPermission} from "/api/user.js";
import {loginOut} from "/api/login.js";

new Vue({
    el:'#admin',
    data:{
        user:{},
        type:null,
        loginName: null,

    },
    mounted: async function () {
        this.loginName = readCookie('loginName');
        this.type = readCookie('type')
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
    methods:{
        async initUser(){
           let urlParams =  new URLSearchParams(window.location.search)
           let id = urlParams.get("id")
           const {data} = await getUserById(id);
           this.user = data;
        },
        async handleLoginOut() {
            const {code} = await loginOut()
            if (code === '200') {
                this.loginName = null
                this.message('用户注销成功', 'success')
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            } else {
                this.message('用户注销失败', 'error')
            }
        },
        message(message, option) {
            const messageDom = document.getElementsByClassName('el-message')[0]
            if (messageDom === undefined) {
                switch (option) {
                    case 'success': {
                        this.$message.success(message)
                        break;
                    }
                    case 'error': {
                        this.$message.error(message)
                        break;
                    }
                    case 'warning': {
                        this.$message.warning(message)
                        break;
                    }
                }
            }
        },
    }
})
