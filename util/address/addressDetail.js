import {deleteAddressById, getAddressCountByUserId, getAddressListByUserId} from "/api/address.js";
import {loginOut} from "/api/login.js";
import {downloadProductImg} from "/api/product.js";
import {getBuyCarListByUserId} from "/api/buycar.js";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {
        addressList:[],
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
        loading:true,
        //购物车相关
        loginName: null,
        type:null,
        buyCarList: [],
        globalCondition: null,
    },
    //购物车相关
    computed: {
        totalCost: function () {
            let totalCost = 0
            for (let key in this.buyCarList) {
                totalCost += this.buyCarList[key].productNum * this.buyCarList[key].productPrice
            }
            return totalCost
        }
    },
    //↑购物车相关
    methods: {
        async getAddressList(currentPageCount){
            this.loading=true
            const {code,data} = await getAddressListByUserId(currentPageCount,this.pageSize);
            if (code==='200'){
                this.addressList = data;
                this.currentPageCount = currentPageCount
            }
            this.loading=false
        },
        addAddress(){
            window.location = "/esay_buy_pages/member/Member_AddAddress.html"
        },
        modifyAddress(id){
            window.location = "/esay_buy_pages/member/Member_ModifyAddress.html?id=" + id
        },
        async delAddress(id){
            if (!confirm("是否确认删除？")){
                return;
            }
            const {code} = await deleteAddressById(id);
            if (code==="200"){
                alert("删除成功");
                await this.getAddressList(this.currentPageCount);
                await this.getAddressAccount()
            }
        },
        async getAddressAccount(){
            const {code,data} = await getAddressCountByUserId();
            if (code==='200'){
                this.totalCount = data
            }
        },
        async handleDownloadImg() {
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
    },
    mounted: async function(){
        await this.getAddressList(1);
        await this.getAddressAccount()
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
        await this.getBuyCarList()
        await this.handleDownloadImg();

    }
})
