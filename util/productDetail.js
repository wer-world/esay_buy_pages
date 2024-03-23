import {getProductListPages, delProduct} from "../api/product.js";
import { getProCategoryNameByType} from "../api/category.js";
import {getBrandList} from "../api/brand.js";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {
        proList: [],
        product: {},
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
        categoryList: [],
        brandList:[],
        categoryName: '',
        brandName:'',
        loading: true
    },
    methods: {
        async getProList(currentPageCount) {
            this.loading = true
            const {
                code,
                data
            } = await getProductListPages(currentPageCount, this.pageSize, this.brandName, this.product.name,this.categoryName)
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
        viewPro(id) {
            window.location = "/esay_buy_pages/admin/products/ViewProduct.html?id=" + id
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
        async getCategoryList(){
            const {data} = await getProCategoryNameByType();
            this.categoryList=data
        },
        async getBrandList(){
            const {data} = await getBrandList();
            this.brandList=data
        },

    },
    mounted: async function () {
        await this.getProList(1);
        await this.getCategoryList();
        await this.getBrandList();
    },
})