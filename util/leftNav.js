import {getCategoryList} from "/api/category.js";

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
        async initCategoryList(){
            const data = await getCategoryList(0);
            this.categoryList1 = data;
        }
    }
})