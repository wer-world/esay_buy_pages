new Vue({
    el:'#leftNav',
    data:{
        categoryList1:[],
        hoverIndex:-1
    },
    mounted(){
        this.initCategoryList();
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
        }
    }
})