Vue.config.productionTip = false

new Vue({
    el:'#root',
    data:{
        user:{
            email:'',
            loginName:'',
        },
        second:0,
        emailCode:'',
        userMsg:{
            emailMsg:'',
            emailCodeMsg:'',
            loginNameMsg:'',
        },
        flag:{
          loginNameFlag:false,
          identityCodeFlag:false,
          emailCodeFlag:false
        }
    },
    methods: {
        returnLogin(){
            window.location="/esay_buy_pages/login/Login.html"
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
              if (this.user.email.trim() != result.data.data.email.trim() && this.user.email.trim().length != 0) {
                this.userMsg.emailMsg="请输入正确的邮箱"
              }
              this.flag.loginNameFlag = true
            }else{
              this.userMsg.loginNameMsg=result.data.message
              this.flag.loginNameFlag = false
            }
          }).catch((err) => {
  
          });
        },
        sendEmail(){
          
          if (this.user.email.trim().length == 0) {
            this.userMsg.emailMsg="请输入邮箱"
            return;
          }
          var emailRegix = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!emailRegix.test(this.user.email)) {
            this.userMsg.emailMsg="请输入正确的邮箱"
            return;
          }
            axios({
              method:"get",
              url:"/nginx/user/sendEmailCode",
              params:{
                email:this.user.email
              }
            }).then((result) => {
              this.second=60 
              setInterval(() => {
                if (this.second>0) {
                  this.second--
                }
              }, 1000);
              if (result.data.code=='200') {
                
                this.userMsg.emailCodeMsg="请前往邮箱查看验证码"
              }
            }).catch((err) => {
              
            });
          },
          checkEmailCode(){
            axios({
                method:'get',
                url:"/nginx/user/checkEmailCode",
                params:{
                  code:this.emailCode
                }
              }).then((result) => {
                if (result.data.code=='201') {
                  this.userMsg.emailCodeMsg=result.data.message
                  this.flag.emailCodeFlag = false
                }else{
                  this.flag.emailCodeFlag = true
                }
              }).catch((err) => {
    
            });
          },
          
          sureFindPsw(){
            userMsg={
                emailMsg:'',
                emailCodeMsg:'',
                loginNameMsg:'',
            }
            var userNameRegix = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,8}$/
            if (this.user.loginName.trim().length == 0) {
              this.userMsg.loginNameMsg="请输入登录名"
              return;
            }
            if (!userNameRegix.test(this.user.loginName)) {
              this.userMsg.loginNameMsg="请输入3-8位登录名"
              return;
            }
            this.checkLoginName()
            if (!this.flag.loginNameFlag) {
                return;
            }
            if (this.user.email.trim().length == 0) {
                this.userMsg.emailMsg="请输入邮箱"
                return;
            }
            var emailRegix = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!emailRegix.test(this.user.email)) {
                this.userMsg.emailMsg="请输入正确的邮箱"
                return;
            }
            this.userMsg.emailMsg = ''
            this.checkEmailCode()
            if (!this.flag.emailCodeFlag) {
              
              return;
            }
            window.location="/esay_buy_pages/login/modifyPsw.html"
          }
    },
})