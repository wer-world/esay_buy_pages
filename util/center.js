import {downloadProductImg, getProductsByHigHestId, getProductListPages} from "/api/product.js";
import {getCategoryList} from "/api/category.js";
import {getNewsList} from "/api/news.js";
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId, modBuyCarProductNumById} from "/api/buycar.js";
import {createMobilePaymentOrder} from "/api/order.js";
import {alipayCreate} from "/api/alipay.js";
import {loginOut} from "../api/login.js";

let time

export const centerVue = new Vue({
    el: '#center',
    data: {
        page: {
            currentPage: 1,
            pageSize: 5
        },
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
        mobile: '',
        amount: '99.5',
        //购物车相关
        loginName: null,
        type: null,
        buyCarList: [],
        globalCondition: null,
    },
    mounted: async function () {
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
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
            if (code === '200') {
                this.categoryList1 = data;
            }
        },
        async getProductList() {
            for (let i = 0; i < this.categoryList1.length; i++) {
                let id = this.categoryList1[i].id;
                const {data} = await getProductsByHigHestId(id);
                this.productList.push(data);
            }
            console.log(this.productList)
        },
        async handleDownloadImg() {
            if (this.productList.length > 0) {
                for (const key in this.productList) {
                    const childProductList = this.productList[key];
                    for (const key1 in childProductList) {
                        const data = await downloadProductImg(childProductList[key1].picPath)
                        const blob = new Blob([data], {type: "image/jepg,image/png"});
                        let url = window.URL.createObjectURL(blob);
                        let img = document.getElementById('productImg' + key + key1)
                        img.setAttribute('src', url);
                    }
                }
            }
            if (this.products.length > 0) {
                for (const key in this.products) {
                    const data = await downloadProductImg(this.products[key].picPath)
                    const blob = new Blob([data], {type: "image/jepg,image/png"});
                    let url = window.URL.createObjectURL(blob);
                    let img = document.getElementById('proImg' + key)
                    img.setAttribute('src', url);
                }
            }
            if (this.buyCarList.length > 0) {
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
            }

        },
        async getNewsList() {
            const {code, data} = await getNewsList(this.page, '');
            if (code === '200') {
                this.newsList = data.getNewsList
            }
        },
        async getHotPro() {
            const {code, data} = await getProductListPages(1, 4, null, null);
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
                    this.message('移除成功!', 'success')
                    await this.getBuyCarList()
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
        handleModBuyCarProductNumById() {
            const $this = this
            if (time) {
                clearTimeout(time)
            }
            time = setTimeout(async function () {
                const {code, data} = await createMobilePaymentOrder($this.mobile, $this.amount)
                if (code === '200') {
                    const formData = await alipayCreate(data.id, data.serialNumber)
                    const div = document.createElement('div');
                    div.innerHTML = formData;
                    document.body.appendChild(div);
                    document.getElementsByName('punchout_form')[0].submit()
                } else {
                    $this.message('充值失败,请检查登录状态!', 'error')
                }
            }, 1000)
        },
        async handleCreateMobilePaymentOrder() {
            if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
                this.message('手机号输入不正确', 'warning')
            }
            this.handleModBuyCarProductNumById()
        },
        handleAmountChange(value) {
            value = value.substring(0, value.length - 1)
            this.amount = value - 0.5
        },
        handlerToBuyCar() {
            window.location.href = '/esay_buy_pages/buycar/BuyCar.html'
        },
        toCategoryList() {
            if (this.loginName == null) {
                window.location.href = '/esay_buy_pages/login/Login.html'
            } else {
                window.location.href = '/esay_buy_pages/category/CategoryList.html?globalCondition=' + this.globalCondition
            }
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
