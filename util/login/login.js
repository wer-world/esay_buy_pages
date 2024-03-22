import {checkLoginName, login} from "../../api/login.js";

Vue.config.productionTip = false

new Vue({
    el: "#root",
    data: {
        user: {
            loginName: '',
            password: ''
        },
        userMsg: {
            loginNameMsg: '',
            passwordMsg: ''
        },
        flag: {
            loginNameFlag: false,

        }
    },
    methods: {
        async userLogin() {
            var userNameRegix = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,8}$/
            if (this.user.loginName.trim().length === 0) {
                this.userMsg.loginNameMsg = "请输入登录名"
                return;
            }
            if (!userNameRegix.test(this.user.loginName)) {
                this.userMsg.loginNameMsg = "请输入3-8位登录名"
                return;
            }
            await this.checkLoginName()
            if (!this.flag.loginNameFlag) {
                return;
            }
            if (this.user.password.trim().length === 0) {
                this.userMsg.passwordMsg = "请输入密码"
                return;
            }
            var passwordMsgRegix = /^[A-Za-z0-9]{6,18}$/
            if (!passwordMsgRegix.test(this.user.password)) {
                this.userMsg.passwordMsg = "请输入6-18位密码"
                return;
            }
            const {code, message} = await login(this.user)
            if (code === '200') {
                alert(message)
                window.location = "../Index.html"
            }
        },
        async checkLoginName() {
            const {code, message} = await checkLoginName(this.user.loginName)
            if (code === '200') {
                this.userMsg.loginNameMsg = message
                this.flag.loginNameFlag = true
            } else {
                this.userMsg.loginNameMsg = message
                this.flag.loginNameFlag = false
            }
        },
        forgetPsw() {
            window.location = "/esay_buy_pages/login/ForgetPsw.html"
        }
    },
})
