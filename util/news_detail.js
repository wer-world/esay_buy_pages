Vue.config.productionTip = false
new Vue({
    el: '#app',
    data:{
        newsList: [],
        currentPageCount:1,
        pageSize:4,
        totalCount:0

    },
    methods: {
        getNewsList(currentPageCount){
            axios({
                method:"get",
                url:"/nginx/news/getNewsList",
                params:{
                    currentPage:currentPageCount,
                    pageSize:this.pageSize
                }
            }).then((result) => {
                if (result.data.code=='200') {
                    this.newsList = result.data.data.getNewsList
                    this.totalCount = result.data.data.page.totalCount
                    this.currentPageCount = result.data.data.page.currentPage
                }
                
            }).catch((err) => {
                
            });
        },
        addNews(){
            window.location="/esay_buy_pages/admin/AddNews.html"
        },
        newsDetail(id){
            window.location="/esay_buy_pages/admin/ViewNews.html?id=" + id
        },
        modifyNews(id){
            window.location="/esay_buy_pages/admin/ModifyNews.html?id=" + id
        },
        delNews(id){
            if (!confirm("是否确认删除")) {
                return;
            }
            axios({
                method:'get',
                url:"/nginx/news/delNewsById",
                params:{
                    id:id
                }
            }).then((result) => {
                if (result.data.code=='200') {
                    alert("删除成功");
                    this.getNewsList(this.currentPageCount)
                }
                
            }).catch((err) => {
                
            });
        }
        
    },
    mounted() {
        this.getNewsList(1);
    },
})