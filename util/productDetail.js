Vue.config.productionTip = false
new Vue({
    el: '#app',
    data:{
        proList: [],
        product:{},
        currentPageCount:1,
        pageSize:5,
        totalCount:0

    },
    methods: {
        getProList(currentPageCount){
            axios({
                method:"get",
                url:"/nginx/product/getProductListPages",
                params:{
                    currentPage:currentPageCount,
                    pageSize:this.pageSize,
                    brandName:this.product.brandName,
                    name:this.product.name,

                }
            }).then((result) => {
                if (result.data.code=='200') {
                    this.proList = result.data.data.productList
                    this.totalCount = result.data.data.page.totalCount
                    this.currentPageCount = result.data.data.page.currentPage
                }

            }).catch((err) => {

            });
        },
        addPro(){
            window.location="/esay_buy_pages/admin/products/AddPro.html"
        },
        viewPro(id){
            window.location="/esay_buy_pages/admin/products/ViewPro.html?id=" + id
        },
        modifyPro(id){
            window.location="/esay_buy_pages/admin/products/ModifyPro.html?id=" + id
        },
        delPro(id){
            if (!confirm("是否确认删除")) {
                return;
            }
            axios({
                method:'get',
                url:"/nginx/product/delProduct",
                params:{
                    id:id
                }
            }).then((result) => {
                if (result.data.code=='200') {
                    alert("删除成功");
                    this.getProList(this.currentPageCount)
                }

            }).catch((err) => {

            });
        }

    },
    mounted() {
        this.getProList(1);
    },
})