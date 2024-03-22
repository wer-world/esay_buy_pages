import {getProductListPages} from "../api/product";

Vue.config.productionTip = false

new Vue({
    el: '#botton-scroll',
    data: {
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
    methods: {
        async getHotPro() {
                // data: {
                //     currentPage: 1,
                //     pageSize: 4,
                //     mixPrice: null,
                //     maxPrice: null,
                //     name: '',
                //     brandName: '',
                //     categoryName: '',
                //     isSale: true,
                //     isPrice: null,
                //     isNewProducts: null
                // }
            const {code,data} = await getProductListPages(1,4,null,null);
            if (code === '200') {
                this.products = data.productList
                for (const key in this.products) {
                    this.products[key].picPath = '/nginx/product/downLoad?picPath=' + this.products[key].picPath;
                }
            }
        }
    },
    mounted() {
        this.getHotPro()
    },
})