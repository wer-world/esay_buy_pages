import {getProductsByHigHestId,getProductListPages} from "/api/product.js";
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
    },
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
        view(id) {
            window.location.href = "/esay_buy_pages/product/Product.html?id=" + id;
        },
        download(picPath) {
            download(picPath);
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
                for (const key in this.products) {
                    this.products[key].picPath = '/nginx/product/downLoad?picPath=' + this.products[key].picPath;
                }
            }
        }
    }
})
