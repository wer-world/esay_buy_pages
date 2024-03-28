import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {downloadProductImg, getProductListPages, globalSearchProduct} from "/api/product.js";
import {getBrandAllList} from "/api/brand.js";
import {getCategoryList} from "/api/category.js";
import {addCollection} from "/api/collection.js";
import {loginOut} from "/api/login.js";

new Vue({
    el: '#category',
    data() {
        return {
            loginName: null,
            type: null,
            buyCarList: [],
            brandList: [],
            productList: [],
            categoryList1: [],
            hoverIndex: -1,
            currentPage: 1,
            pageSize: 20,
            brandName: null,
            productName: null,
            categoryName: null,
            minPrice: null,
            maxPrice: null,
            isSales: null,
            isNewProduct: null,
            isPrice: null,
            globalCondition: null,
            brandIndex: 0,
            priceIndex: 0,
            totalCount: 0,
            sortIndex: 0
        }
    },
    methods: {
        async handleDelBuyCarProduct(id) {
            if (confirm('您确定要把该商品移除购物车吗!')) {
                const {code} = await delBuyCarProductById(id)
                if (code === '200') {
                    this.message('移除成功!', 'success')
                    this.getBuyCarList()
                } else {
                    this.message('删除购物车信息失败', 'error')
                }
            }
        },
        async initCategoryList() {
            const {code, data} = await getCategoryList(0);
            if (code === '200') {
                this.categoryList1 = data;
            }
        },
        async getBuyCarList() {
            const {code, data} = await getBuyCarListByUserId()
            if (code === '200') {
                this.buyCarList = data
                await this.handleDownloadImg()
            } else {
                this.buyCarList = []
            }
        },
        async getBrandAllList() {
            const {code, data} = await getBrandAllList()
            if (code === '200') {
                this.brandList = data
            }
        },
        async handleDownloadImg() {
            for (const key in this.buyCarList) {
                const data = await downloadProductImg(this.buyCarList[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let productImg = document.getElementById('productImg' + key)
                if (productImg != null) {
                    productImg.setAttribute('src', url);
                }
            }
        },
        async handleProductDownloadImg() {
            for (const key in this.productList) {
                const data = await downloadProductImg(this.productList[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let productImg = document.getElementById('productList' + key)
                if (productImg != null) {
                    productImg.setAttribute('src', url);
                }
            }
        },
        async handleGetProductListPages() {
            const {
                code,
                data
            } = await getProductListPages(this.currentPage, this.pageSize, this.brandName, this.productName, this.categoryName, this.minPrice, this.maxPrice, this.isSales, this.isNewProduct, this.isPrice)
            if (code === '200') {
                this.productList = data.productList
                this.totalCount = data.page.totalCount
                this.handleProductDownloadImg()
            }
        },
        async handleGlobalSearchProduct() {
            if (this.loginName == null) {
                window.location.href = '/esay_buy_pages/login/Login.html'
            }
            this.handleClearSearchCondition()
            const {code, data} = await globalSearchProduct(this.currentPage, this.pageSize, this.globalCondition)
            if (code === '200') {
                this.productList = data.productList
                this.totalCount = data.page.totalCount
                this.handleProductDownloadImg()
            }
        },
        async handleAddCollection(productId) {
            const {code, message} = await addCollection(productId)
            if (code === '200') {
                this.message('收藏成功！', 'success')
            } else {
                this.message(message, 'error')
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
        handleSortProduct(sortIndex) {
            switch (sortIndex) {
                case 1: {
                    if (this.isSales != null) {
                        this.isSales = !this.isSales
                    } else {
                        this.isSales = true
                    }
                    this.isNewProduct = null
                    this.isPrice = null
                    this.sortIndex = 1
                    break;
                }
                case 2: {
                    if (this.isPrice != null) {
                        this.isPrice = !this.isPrice
                    } else {
                        this.isPrice = true
                    }
                    this.isSales = null
                    this.isNewProduct = null
                    this.sortIndex = 2
                    break;
                }
                case 3: {
                    if (this.isNewProduct != null) {
                        this.isNewProduct = !this.isNewProduct
                    } else {
                        this.isNewProduct = true
                    }
                    this.isSales = null
                    this.isPrice = null
                    this.sortIndex = 3
                    break;
                }
                default: {
                    this.isSales = null
                    this.isNewProduct = null
                    this.isPrice = null
                    this.sortIndex = 0
                    break;
                }
            }
            this.handleGetProductListPages()
        },
        handleSearchBrand(brandName, brandIndex) {
            this.brandName = brandName
            this.brandIndex = brandIndex
            this.handleGetProductListPages()
        },
        async initRequestParams() {
            const urlParams = new URLSearchParams(window.location.search)
            this.categoryName = urlParams.get("categoryName");
            this.globalCondition = urlParams.get("globalCondition");
            if (this.globalCondition != null) {
                await this.handleGlobalSearchProduct()
            } else {
                await this.handleGetProductListPages()
            }
        },
        handleSearchPrice(minPrice, maxPrice, priceIndex) {
            this.minPrice = minPrice
            this.maxPrice = maxPrice
            this.priceIndex = priceIndex
            this.handleGetProductListPages()
        },
        handleClearSearchCondition() {
            this.brandName = null
            this.productName = null
            this.categoryName = null
            this.minPrice = null
            this.maxPrice = null
            this.brandIndex = 0
            this.priceIndex = 0
        },
        handleSearchCategory(category) {
            this.handleClearSearchCondition()
            this.categoryName = category
            this.handleGetProductListPages()
        },
        handlerToBuyCar() {
            window.location.href = '/esay_buy_pages/buycar/BuyCar.html'
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleGetProductListPages()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.handleGetProductListPages()
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
        }
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
    mounted: async function () {
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
        await this.initCategoryList();
        await this.getBuyCarList()
        await this.getBrandAllList()
        this.initRequestParams()
    }
})
