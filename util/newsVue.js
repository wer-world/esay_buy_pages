import {getNewsList} from "../api/news.js";

Vue.config.productionTip = false

new Vue({
    el: "#inews",
    data: {
        newsList: []

    },
    methods: {
         async getNewsList() {
             const {code,data} = await getNewsList(1,5);
             if (code === '200') {
                 this.newsList = data.getNewsList
             }
        }
    },
    mounted() {
        this.getNewsList();
    },
})