import {delNewsById, getNewsList} from "/api/news.js";
import {loginOut} from "/api/login.js";

Vue.config.productionTip = false
new Vue({
    el: '#admin',
    data:{
        newsList: [],
        page:{
            currentPageCount:1,
            pageSize:4,
        },
        totalCount:0,
        loading:true,
        title:'',
        type:null,
        loginName: null,

    },
    methods: {
        async getNewsList(currentPageCount){
            this.loading = true
            const {code,data} = await getNewsList(this.page,this.title);
            if (code==='200') {
                this.newsList = data.getNewsList
                this.totalCount = data.page.totalCount
                this.page.currentPageCount = data.page.currentPage
            }
            this.loading = false
        },
        addNews(){
            window.location="/esay_buy_pages/admin/news/AddNews.html"
        },
        newsDetail(id){
            window.location="/esay_buy_pages/admin/news/ViewNews.html?id=" + id
        },
        modifyNews(id){
            window.location="/esay_buy_pages/admin/news/ModifyNews.html?id=" + id
        },
        async delNews(id){
            if (!confirm("是否确认删除")) {
                return;
            }
            const {code} = await delNewsById(id);
            if (code==='200') {
                alert("删除成功");
                this.getNewsList(this.page.currentPageCount)
            }
        },
        returnAdmin(){
            window.location="/esay_buy_pages/admin/Admin.html"
        },
        async handleLoginOut() {
            const {code} = await loginOut()
            if (code === '200') {
                this.loginName = null
                this.message('用户注销成功', 'success')
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            } else {
                this.message('用户注销失败', 'error')
            }
        },
        message(message, option) {
            const messageDom = document.getElementsByClassName('el-message')[0]
            if (messageDom === undefined) {
                switch (option) {
                    case 'success': {
                        this.$message.success(message)
                        break;
                    }
                    case 'error': {
                        this.$message.error(message)
                        break;
                    }
                    case 'warning': {
                        this.$message.warning(message)
                        break;
                    }
                }
            }
        },
    },
    mounted() {
        this.getNewsList(1);
        this.loginName = readCookie('loginName');
        this.type = readCookie('type')
    },
})