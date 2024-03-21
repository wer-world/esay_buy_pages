Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id=params.get("id");
new Vue({
    el:"#app",
    data:{
        news:{}
    },
    methods: {
        getNewsById(){
            axios({
                method:'get',
                url:"/nginx/news/getNewsById",
                params:{
                    id:id
                }
            }).then((result) => {
                this.news=result.data.data
            }).catch((err) => {
                
            });
        },
        returnNewsList(){
            window.location="/esay_buy_pages/admin/news/NewsDetail.html"
        
        }
    },
    mounted() {
        this.getNewsById();
    },
})