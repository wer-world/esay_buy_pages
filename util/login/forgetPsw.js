import {checkEmailCode, checkLoginName, sendEmailCode} from "../../api/login.js";

Vue.config.productionTip = false

new Vue({
    el: '#root',
    data: {
        user: {
            id: '',
            email: '',
            loginName: '',
        },
        second: 0,
        emailCode: '',
        userMsg: {
            emailMsg: '',
            emailCodeMsg: '',
            loginNameMsg: '',
        },
        flag: {
            loginNameFlag: false,
            identityCodeFlag: false,
            emailCodeFlag: false,
            emailFlag:false
        }
    },
    methods: {
        returnLogin() {
            window.location = "/esay_buy_pages/login/Login.html"
        },
        async checkLoginName() {
            this.userMsg = {
                emailMsg: '',
                emailCodeMsg: '',
                loginNameMsg: '',
            }
            const {code, data, message} = await checkLoginName(this.user.loginName);
            if (code === '200') {
                this.userMsg.loginNameMsg = message
                if (this.user.email !== data.email && this.user.email.trim().length !== 0) {
                    this.userMsg.emailMsg = "请输入正确的邮箱"
                    this.flag.emailFlag = false
                    return
                }
                this.user.id = data.id
                this.flag.emailFlag = true
                this.flag.loginNameFlag = true
            } else {
                this.userMsg.loginNameMsg = message
                this.flag.loginNameFlag = false

            }
        },
        async sendEmail() {
            this.userMsg = {
                emailMsg: '',
                emailCodeMsg: '',
                loginNameMsg: '',
            }
            if (this.user.email.trim().length === 0) {
                this.userMsg.emailMsg = "请输入邮箱"
                return;
            }
            var emailRegix = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!emailRegix.test(this.user.email)) {
                this.userMsg.emailMsg = "请输入正确的邮箱"
                return;
            }
            await this.checkLoginName()
            if (!this.flag.emailFlag) {
                return;
            }
            const {code} = await sendEmailCode(this.user.email);
            this.second = 60
            setInterval(() => {
                if (this.second > 0) {
                    this.second--
                }
            }, 1000);
            if (code === '200') {
                this.userMsg.emailCodeMsg = "请前往邮箱查看验证码"
            }
        },
        async checkEmailCode() {
            this.userMsg = {
                emailMsg: '',
                emailCodeMsg: '',
                loginNameMsg: '',
            }
            const {code, message} = await checkEmailCode(this.emailCode);
            if (code === '201') {
                this.userMsg.emailCodeMsg = message
                this.flag.emailCodeFlag = false
            } else {
                this.flag.emailCodeFlag = true
            }
        },


        async sureFindPsw() {
            this.userMsg = {
                emailMsg: '',
                emailCodeMsg: '',
                loginNameMsg: '',
            }
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
            if (this.user.email.trim().length === 0) {
                this.userMsg.emailMsg = "请输入邮箱"
                return;
            }
            var emailRegix = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!emailRegix.test(this.user.email)) {
                this.userMsg.emailMsg = "请输入正确的邮箱"
                return;
            }
            await this.checkLoginName()
            if (!this.flag.emailFlag) {
                return;
            }
            await this.checkEmailCode()
            if (!this.flag.emailCodeFlag) {
                return;
            }
            window.location = "/esay_buy_pages/login/modifyPsw.html?id=" + this.user.id
        }
    },
})
