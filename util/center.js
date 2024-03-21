new Vue({
    el:'#center',
    data:{
        categoryList1:[],
        hoverIndex:-1,
        productList:[]
    },
    mounted(){
        this.initCategoryList();
        setTimeout(()=>{
            this.getProductList();
        },100)

    },
    methods:{
        initCategoryList(){
            axios({
                method:'post',
                url:'/nginx/category/getCategoryList',
                data:{
                    'parentId':0
                }
            }).then((res)=>{
                this.categoryList1 = res.data
            })
        },
         getProductList(){
            for (let i = 0; i < this.categoryList1.length; i++) {
                let id = this.categoryList1[i].id;
                axios({
                    method:'post',
                    url:'/nginx/product/getProductsByHigHestId',
                    data:{
                        'id':id
                    }
                }).then((res)=>{
                    res.data.data.picPath = '/nginx/product/downLoad?picPath=' + res.data.data.picPath;
                    this.productList.push(res.data.data);
                })
            }

        },
        view(id){
            window.location.href="/esay_buy_pages/product/Product.html?id="+id;
        }
    }
})