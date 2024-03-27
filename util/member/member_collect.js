import {getCollections,deleteCollection} from "/api/collection.js"
import {downloadProductImg} from "/api/product.js"
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {loginOut} from "/api/login.js";
import {checkPermission} from "/api/user.js";

new Vue({
    el:'#root',
    data:{
        collections:[],
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
    mounted:async function(){
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
        if (this.loginName == null) {
            this.$alert('请登录后操作!', '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        await this.getBuyCarList()
        await this.initCollections();
        await this.handleDownloadImg();
    },
    methods:{
        async initCollections(){
            const {data} = await getCollections(20);
            this.collections = data;
        },
        view(id) {
            window.location.href = "/esay_buy_pages/product/Product.html?id=" + id;
        },
        async deleteCollection(id){
            if (!confirm("确认删除吗？")){
                return
            }
            const {data} =await deleteCollection(id);
            alert(data)
            await this.initCollections();
        },
        async handleDownloadImg(){
            for (const key in this.collections){
                const data = await downloadProductImg(this.collections[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let imgs = document.getElementsByClassName('productImg'+this.collections[key].picPath);
                for (let i=0;i<imgs.length;i++){
                    imgs[i].setAttribute('src', url);
                }
            }
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
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            } else {
                this.message('用户注销失败', 'error')
            }
        },
    }
})
