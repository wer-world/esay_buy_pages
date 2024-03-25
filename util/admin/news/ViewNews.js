import {getNewsById} from "../../../api/news.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id=params.get("id");
new Vue({
    el:"#app",
    data:{
        news:{}
    },
    methods: {

        async getNewsById(){
            const {data} = await getNewsById(id);
            this.news=data
        },
        returnNewsList(){
            window.location="/esay_buy_pages/admin/news/NewsDetail.html"
        
        }
    },
    mounted() {
        this.getNewsById();
    },
})