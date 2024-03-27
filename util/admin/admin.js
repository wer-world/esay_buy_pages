import {loginOut} from "/api/login.js";

new Vue({
    el:'#admin',
    data:{
        loginName:null,
        type:null,
    },
    methods:{
        message(message, option) {
            const messageDom = document.getElementsByClassName('el-message')[0]
            console.log(messageDom)
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
        async handleLoginOut() {
            const {code} = await loginOut()
            if (code === '200') {
                this.loginName = null
                this.message('用户注销成功', 'success')
            } else {
                this.message('用户注销失败', 'error')
            }
        },
    },
    mounted(){
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
    }
})