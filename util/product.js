import {downloadProductImg, getProductById, getProductsByHigHestId, getSimilarProducts} from "/api/product.js"
import {addCollection} from "/api/collection.js"
import {getCategoryList} from "/api/category.js";
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";

new Vue({
    el: '#all',
    data: {
        id: '',
        product: '',
        similarProducts: [],
        typeChoose: 1,
        colorChoose: 1,
        collectMsg: '',
        count: 1,
        zuheCount: 1,
        zuheTempPrice: 0,
        zuhePrice: 0,
        //侧边栏分类
        categoryList1: [],
        hoverIndex: -1,
        //购物车相关
        loginName: null,
        buyCarList: [],
        globalCondition: null,
    },
    mounted: async function () {
        this.loginName = readCookie('loginName')
        await this.getBuyCarList()
        await this.initCategoryList();
        await this.initProduct();
        await this.initsimilarProducts();
        await this.handleDownloadImg();
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
        calZuhePrice() {
            this.zuhePrice = this.zuheTempPrice * this.zuheCount
        },
        handlerChange(e, p) {
            if (e.target.checked) {
                this.zuheTempPrice += p.price
            } else {
                this.zuheTempPrice -= p.price
            }

        },
        async initProduct() {
            const url = new URLSearchParams(window.location.search)
            const id = url.get('id');
            this.id = id;
            const {data} = await getProductById(id);
            this.product = data;
        },
        async initsimilarProducts() {
            const {data} = await getSimilarProducts(this.product.categoryLevelId);
            console.log(data)
            this.similarProducts = data;
        },
        async collect() {
            const {message} = await addCollection(this.id)
            this.collectMsg = message;
        },
        checkCount() {
            const reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(this.count)) {
                this.count = 1;
            } else if (this.count > 200) {
                this.count = 200;
            }
        },
        checkZuheCount() {
            const reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(this.zuheCount)) {
                this.zuheCount = 1;
            } else if (this.zuheCount > 200) {
                this.zuheCount = 200;
            }
        },
        view(id) {
            window.location.href = "/esay_buy_pages/product/Product.html?id=" + id;
        },
        async handleDownloadImg() {
            const data = await downloadProductImg(this.product.picPath)
            const blob = new Blob([data], {type: "image/jepg,image/png"});
            let url = window.URL.createObjectURL(blob);
            let imgss = document.getElementsByClassName('productImg'+this.product.picId);
            for (let i=0;i<imgss.length;i++){
                imgss[i].setAttribute('src', url);
            }

            for (const key in this.similarProducts){
                if (key==6){
                    return
                }
                const data = await downloadProductImg(this.similarProducts[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let imgs = document.getElementsByClassName('productImg'+this.similarProducts[key].picId);
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
        //侧边栏分类
        async initCategoryList() {
            const {code, data} = await getCategoryList(0);
            if (code === '200'){
                this.categoryList1 = data;
            }
        },
        async getProductList() {
            for (let i = 0; i < this.categoryList1.length; i++) {
                let id = this.categoryList1[i].id;
                const {data} = await getProductsByHigHestId(id);
                this.productList.push(data);
            }
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