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
        getHotPro() {
            axios({
                method: 'post',
                url: "/nginx/product/getProductListPages",
                data: {
                    currentPage: 1,
                    pageSize: 4,
                    mixPrice: null,
                    maxPrice: null,
                    name: '',
                    brandName: '',
                    categoryName: '',
                    isSale: true,
                    isPrice: null,
                    isNewProducts: null
                }
            }).then((result) => {
                if (result.data.code == '200') {
                    this.products = result.data.data.productList
                    for (const key in this.products) {
                        this.products[key].picPath = '/nginx/product/downLoad?picPath=' + this.products[key].picPath;
                    }
                }
            }).catch((err) => {

            });
        }
    },
    mounted() {
        this.getHotPro()
    },
})