import {modifyPasswordById} from "../../api/login.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id = params.get("id");
new Vue({
    el:"#root",
    data:{
        user:{
            id:id,
            rePassword:'',
            password:''
        },
        userMsg:{
            rePasswordMsg:'',
            passwordMsg:''
        },
        flag:false
    },
    methods: {

        async findPsw(){
            this.userMsg={
                rePasswordMsg:'',
                passwordMsg:''
            }
            if (this.user.password.trim().length === 0) {
                this.userMsg.passwordMsg="请输入密码"
                return;
            }
            var passwordMsgRegix = /^[A-Za-z0-9]{6,18}$/
            if (!passwordMsgRegix.test(this.user.password)) {
                this.userMsg.passwordMsg="请输入6-18位密码"
                return;
            }
            if (this.user.rePassword.trim().length === 0) {
                this.userMsg.rePasswordMsg="请输入确认密码"
                return;
            }
            if (!passwordMsgRegix.test(this.user.rePassword)) {
                this.userMsg.rePasswordMsg="请输入6-18位密码"
                return;
            }
            if (this.user.password != this.user.rePassword) {
                this.userMsg.rePasswordMsg="请与密码一致"
                return;
            }
            const {code,message} =await modifyPasswordById(this.user)
            if (code==='200') {
                alert(message)
                window.location="/esay_buy_pages/login/Login.html"
            }else{
                alert(message)
            }
        }
    },
})