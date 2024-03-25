import {downloadProductImg, getProductsByHigHestId,getProductListPages} from "/api/product.js";
import {getCategoryList} from "/api/category.js";
import {getNewsList} from "/api/news.js";

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
    },
    mounted: async function(){
        await this.initCategoryList();
        await this.getProductList();
        await this.getNewsList();
        await this.getHotPro();
        await this.handleDownloadImg();
    },
    methods: {
        async initCategoryList() {
            const data = await getCategoryList(0);
            this.categoryList1 = data;
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
        }
    }
})