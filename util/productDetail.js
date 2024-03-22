import {getProductListPages, delProduct} from "../api/product.js";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {

        proList: [],
        product: {},
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
        options: [{
            value: '选项1',
            label: '黄金糕'
        }, {
            value: '选项2',
            label: '双皮奶'
        }, {
            value: '选项3',
            label: '蚵仔煎'
        }, {
            value: '选项4',
            label: '龙须面'
        }, {
            value: '选项5',
            label: '北京烤鸭'
        }],
        value: ''

    },
    methods: {
        async getProList(currentPageCount) {
            const {
                code,
                data
            } = await getProductListPages(currentPageCount, this.pageSize, this.product.brandName, this.product.name)
            if (code === '200') {
                this.proList = data.productList
                this.totalCount = data.page.totalCount
                this.currentPageCount = data.page.currentPage
            }
        },
        addPro() {
            window.location = "/esay_buy_pages/admin/products/AddPro.html"
        },
        viewPro(id) {
            window.location = "/esay_buy_pages/admin/products/ViewPro.html?id=" + id
        },
        modifyPro(id) {
            window.location = "/esay_buy_pages/admin/products/ModifyPro.html?id=" + id
        },
        async delPro(id) {
            if (!confirm("是否确认删除")) {
                return;
            }
            const {code} = await delProduct(id)
            if (code === '200') {
                alert("删除成功");
                this.getProList(this.currentPageCount)
            }
        }

    },
    mounted() {
        this.getProList(1);
    },
})