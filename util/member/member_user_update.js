import {getUserById, updateUser,getCurrentUser} from "/api/user.js"
import {downloadProductImg} from "/api/product.js";
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
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
        //购物车相关
        loginName: null,
        type:null,
        buyCarList: [],
        globalCondition: null,
    },
    computed: {
        totalCost: function () {
            let totalCost = 0
            for (let key in this.buyCarList) {
                totalCost += this.buyCarList[key].productNum * this.buyCarList[key].productPrice
            }
            return totalCost
        }
    },
    mounted:async function(){
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
        await this.initUser();
        await this.initCurrentUser();
        await this.getBuyCarList()
        await this.handleDownloadImg();
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
        },
        async handleDownloadImg(){
            //购物车相关
            for (const key in this.buyCarList) {
                const data = await downloadProductImg(this.buyCarList[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let productImg = document.getElementById('productImg' + key)
                if (productImg != null) {
                    productImg.setAttribute('src', url);
                }
            }
            //↑购物车相关
        },
        //购物车相关
        async handleDelBuyCarProduct(id) {
            if (confirm('您确定要把该商品移除购物车吗!')) {
                const {code} = await delBuyCarProductById(id)
                if (code === '200') {
                    this.message('移除成功!', 'error')
                    this.getBuyCarList()
                } else {
                    this.message('删除购物车信息失败', 'error')
                }
            }
        },
        async getBuyCarList() {
            const {code, data} = await getBuyCarListByUserId()
            if (code === '200') {
                this.buyCarList = data
                await this.handleDownloadImg()
            }
        },
        async handleAddBuyCar(productId) {
            const {code, message} = await addBuyCar(productId)
            if (code === '200') {
                await this.getBuyCarList()
                this.message('加入购物车成功！', 'success')
            } else {
                this.message(message, 'error')
            }
        },
        handlerToBuyCar() {
            window.location.href = '/esay_buy_pages/buycar/BuyCar.html'
        },
        toCategoryList(){
            window.location.href='/esay_buy_pages/category/CategoryList.html?globalCondition='+this.globalCondition
        }
    }
})