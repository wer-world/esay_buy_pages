import {getProductListPages, delProduct} from "/api/product.js";
import {getProCategoryNameByType} from "/api/category.js";
import {getBrandAllList} from "/api/brand.js";
import {checkPermission} from "/api/user.js";
import {loginOut} from "/api/login.js";

Vue.config.productionTip = false
new Vue({
    el: '#admin',
    data: {
        proList: [],
        product: {},
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
        categoryList: [],
        brandList: [],
        categoryLeve3Name: '',
        brandName: '',
        loading: true,
        type: null,
        loginName: null,
    },
    methods: {
        async getProList(currentPageCount) {
            this.loading = true
            const {
                code,
                data
            } = await getProductListPages(currentPageCount, this.pageSize, this.product.brandName, this.product.name, this.product.categoryLeve3Name)
            if (code === '200') {
                this.proList = data.productList
                this.totalCount = data.page.totalCount
                this.currentPageCount = data.page.currentPage
            }
            this.loading = false
        },
        addPro() {
            window.location = "/esay_buy_pages/admin/products/AddProduct.html"
        },
        modifyPro(id) {
            window.location = "/esay_buy_pages/admin/products/ModifyProduct.html?id=" + id
        },
        async delPro(id) {
            if (!confirm("是否确认删除")) {
                return;
            }
            const {code} = await delProduct(id)
            if (code === '200') {
                alert("删除成功");
                await this.getProList(this.currentPageCount)
            }
        },
        async getCategoryList() {
            const {data} = await getProCategoryNameByType();
            this.categoryList = data
        },
        async getBrandList() {
            const {data} = await getBrandAllList();
            this.brandList = data
        },
        returnAdmin() {
            window.location = "/esay_buy_pages/admin/Admin.html"
        },
        handleReset() {
            this.product = {}
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

    },
    mounted: async function () {
        this.loginName = readCookie('loginName');
        this.type = readCookie('type')
        const {code, message} = await checkPermission()
        if (code === '300') {
            this.$alert(message, '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        await this.getProList(1);
        await this.getCategoryList();
        await this.getBrandList();
    },
})
