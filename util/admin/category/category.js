import {getCategoryList} from "/api/category.js";

new Vue({
    el:'#root',
    data:{
        categoryList1: [],
        defaultProps:{
            children:'childCategoryList',
            label:'name'
        }
    },
    mounted: async function(){
        await this.initCategoryList();
    },
    methods:{
        async initCategoryList() {
            const data = await getCategoryList(0);
            this.categoryList1 = data;
        },
        getCategoryType(type){
            switch (type){
                case 1:
                    return "一级分类";
                case 2:
                    return "二级分类";
                case 3:
                    return "三级分类";
            }
        }
    }
})