Vue.config.productionTip = false

    new Vue({
        el:"#root",
        data:{
            user:{
                loginName:'',
                password:''
            },
            userMsg:{
                loginNameMsg:'',
                passwordMsg:''
            },
            flag:{
                loginNameFlag:false,
                
            }
        },
        methods: {
            userLogin(){
                var userNameRegix = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,8}$/
                if (this.user.loginName.trim().length == 0) {
                this.userMsg.loginNameMsg="请输入登录名"
                return;
                }
                if (!userNameRegix.test(this.user.loginName)) {
                this.userMsg.loginNameMsg="请输入3-8位登录名"
                return;
                }
                if (!this.flag.loginNameFlag) {
                    this.checkLoginName()
                    return;
                }
                if (this.user.password.trim().length == 0) {
                this.userMsg.passwordMsg="请输入密码"
                return;
                }
                var passwordMsgRegix = /^[A-Za-z0-9]{6,18}$/
                if (!passwordMsgRegix.test(this.user.password)) {
                this.userMsg.passwordMsg="请输入6-18位密码"
                return;
                }
                axios({
                    method:'post',
                    url:"/nginx/user/checkLogin",
                    data:{
                        loginName:this.user.loginName,
                        password:this.user.password
                    }
                    }).then((result) => {
                    if (result.data.code==200) {
                        alert(result.data.message)
                        window.location="../Index.html"
                    }
                    }).catch((err) => {

                });
            },
            checkLoginName(){
                
                axios({
                method:'post',
                url:"/nginx/user/checkLogin",
                data:{
                    loginName:this.user.loginName
                }
                }).then((result) => {
                if (result.data.code=='200') {
                    this.userMsg.loginNameMsg="√"
                    
                    this.flag.loginNameFlag = true
                }else{
                    this.userMsg.loginNameMsg=result.data.message
                    this.flag.loginNameFlag = false
                }
                }).catch((err) => {

                });
            },
            forgetPsw(){
                window.location="/esay_buy_pages/login/ForgetPsw.html"
            }
        },
    })