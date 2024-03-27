import {getUserById, updateUser,getCurrentUser} from "/api/user.js"
import {getTypeList} from "/api/type.js"
new Vue({
    el:'#root',
    data:{
        user:{},
        userMsg:{
            loginNameMsg:'',
            userNameMsg:'',
            identityCodeMsg:'',
            emailMsg:'',
            mobileMsg:''
        },
        flag:{
            loginNameFlag:false,
            identityCodeFlag:false,
            emailCodeFlag:false
        },
        currentUser:{},
        typeList:[]
    },
    mounted:async function(){
        await this.initUser();
        await this.initCurrentUser();
        await this.getTypeList();
    },
    methods:{
        async initUser(){
           let urlParams =  new URLSearchParams(window.location.search)
           let id = urlParams.get("userId")
            const {data} = await getUserById(id);
            this.user = data;
        },
        async initCurrentUser(){
            const {data} = await getCurrentUser();
            this.currentUser = data;
            console.log(data)
        },
        async getTypeList() {
            const {data} = await getTypeList();
            this.typeList = data;
        },
        async save(){
            this.userMsg={
                loginNameMsg:'',
                userNameMsg:'',
                identityCodeMsg:'',
                emailMsg:'',
                mobileMsg:''
            }
            var userNameRegix = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,8}$/
            if (this.user.loginName.trim().length == 0) {
                console.log(this.userMsg.loginNameMsg)
                this.userMsg.loginNameMsg="请输入登录名"
                console.log(this.userMsg.loginNameMsg)
                return;
            }
            if (!userNameRegix.test(this.user.loginName)) {
                this.userMsg.loginNameMsg="请输入3-8位登录名"
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
            if (this.user.identityCode.trim().length == 0) {
                this.userMsg.identityCodeMsg="请输入身份证号"
                return;
            }
            var identityCodeRegix = /^[0-9]{18}$/
            if (!identityCodeRegix.test(this.user.identityCode)) {
                this.userMsg.identityCodeMsg="请输入正确的18身份证号"
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
            const {code} = await updateUser(this.user);
            if (code=="200"){
                alert("修改成功");
                window.location.href="/esay_buy_pages/member/Member.html";
            }
        }
    }
})