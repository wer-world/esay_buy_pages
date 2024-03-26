import {downloadProductImg,getProductsByHigHestId,getProductListPages} from "/api/product.js";
import {getCategoryList} from "/api/category.js";
import {getNewsList} from "/api/news.js";
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";

new Vue({
    el: '#center',
    data: {
        categoryList1: [],
        hoverIndex: -1,
        productList: [],
        newsList: [],
        products: [{
            brandId: '',
            brandNam: '',
            categoryLevelId: '',
            categoryName: '',
            description: '',
            id: '',
            name: '',
            newProduct: '',
            picId: '',
            picPath: '',
            price: '',
            sales: '',
            stock: ''
        }],
        //购物车相关
        loginName: null,
        buyCarList: [],

    },
    mounted: async function(){
        this.loginName = readCookie('loginName')
        await this.initCategoryList();
        await this.getProductList();
        await this.getBuyCarList()
        await this.getNewsList();
        await this.getHotPro();
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
        async handleDownloadImg() {
            for (const key in this.productList) {
                const childProductList = this.productList[key];
                for (const key1 in childProductList){
                    const data = await downloadProductImg(childProductList[key1].picPath)
                    const blob = new Blob([data], {type: "image/jepg,image/png"});
                    let url = window.URL.createObjectURL(blob);
                    let img = document.getElementById('productImg' + key + key1)
                    img.setAttribute('src', url);
                }
            }
            for (const key in this.products) {
                const data = await downloadProductImg(this.products[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let img = document.getElementById('proImg' + key)
                img.setAttribute('src', url);
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
        async getNewsList() {
            const {code,data} = await getNewsList(1,5);
            if (code === '200') {
                this.newsList = data.getNewsList
            }
        },
        async getHotPro() {
            const {code,data} = await getProductListPages(1,4,null,null);
            if (code === '200') {
                this.products = data.productList
            }
        },
        view(id) {
            window.location.href = "/esay_buy_pages/product/Product.html?id=" + id;
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
    }
})
