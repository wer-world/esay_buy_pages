Vue.config.productionTip = false

  new Vue({
    el:"#root",
    data:{
      user:{
        loginName:'',
        userName:'',
        password:'',
        rePassword:'',
        identityCode:'',
        email:'',
        mobile:'',
        
      },
      userMsg:{
        loginNameMsg:'',
        userNameMsg:'',
        passwordMsg:'',
        rePasswordMsg:'',
        identityCodeMsg:'',
        emailMsg:'',
        mobileMsg:'',
        checkedMsg:'',
        emailCodeMsg:''
      },
      checkboxSel:false,
      second:0,
      emailCode:'',
      flag:{
        loginNameFlag:false,
        identityCodeFlag:false,
        emailCodeFlag:false
      }
    },
    methods: {
      registUser(){
        this.userMsg={
          loginNameMsg:'',
          userNameMsg:'',
          passwordMsg:'',
          rePasswordMsg:'',
          identityCodeMsg:'',
          emailMsg:'',
          mobileMsg:'',
          checkedMsg:'',
          emailCodeMsg:''
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
        if (!this.flag.loginNameFlag) {
            this.checkLoginName()
            return;
        }
        
        if (this.user.userName.trim().length == 0) {
          this.userMsg.userNameMsg="请输入用户名"
          return;
        }
        if (!userNameRegix.test(this.user.userName)) {
          this.userMsg.userNameMsg="请输入3-8位用户名"
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
        if (this.user.rePassword.trim().length == 0) {
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
        if (this.user.identityCode.trim().length == 0) {
          this.userMsg.identityCodeMsg="请输入身份证号"
          return;
        }
        var identityCodeRegix = /^[0-9]{18}$/
        if (!identityCodeRegix.test(this.user.identityCode)) {
          this.userMsg.identityCodeMsg="请输入正确的18身份证号"
          return;
        }
        this.identityCheck()
        if (!this.flag.identityCodeFlag) {
          
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
        
        if (this.user.mobile.trim().length == 0) {
          this.userMsg.mobileMsg="请输入电话号码"
          return;
        }
        var mobileRegix = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/
        if (!mobileRegix.test(this.user.mobile)) {
          this.userMsg.mobileMsg="请输入正确的11位电话号码"
          return;
        }
        if (!this.checkboxSel) {
          this.userMsg.checkedMsg="请勾选协议"
          return;
        }
        if (!this.flag.emailCodeFlag) {
          this.checkEmailCode()
          return;
        }
        axios({
          method:'post',
          url:"/nginx/user/register",
          data:{
            user:this.user
          }
        }).then((result) => {
          if (result.data.code==200) {
            alert("注册成功")
            window.location="/esay_buy_pages/login/Login.html"
          }
        }).catch((err) => {

        });
      },
      checkLoginName(){
        axios({
          method:'post',
          url:"/nginx/user/checkLoginName",
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
      checkClick(){
        this.checkboxSel=!this.checkboxSel
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
      identityCheck(){
        axios({
            method:'post',
            url:"/nginx/user/identityCheck",
            data:{
              identityCode:this.user.identityCode
            }
          }).then((result) => {
            if (result.data.code=='201') {
              this.userMsg.identityCodeMsg="该身份证已存在请重新输入"
              this.flag.identityCodeFlag = false;
            }else{
              this.flag.identityCodeFlag = true;
            }
          }).catch((err) => {

        });
      }
    },

  })