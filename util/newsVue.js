import {getNewsList} from "../api/news.js";

Vue.config.productionTip = false

new Vue({
    el: "#inews",
    data: {
        page:{
            currentPage:1,
            pageSize:5
        },
        newsList: []

    },
    methods: {
         async getNewsList() {
             const {code,data} = await getNewsList(this.page,'');
             if (code === '200') {
                 this.newsList = data.getNewsList
             }
        }
    },
    mounted() {
        this.getNewsList();
    },
})