import {delNewsById, getNewsList} from "/api/news.js";
import {checkPermission} from "/api/user.js";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {
        newsList: [],
        page: {
            currentPageCount: 1,
            pageSize: 4,
        },
        totalCount: 0,
        loading: true,
        title: '',

    },
    methods: {
        async getNewsList(currentPageCount) {
            this.loading = true
            const {code, data} = await getNewsList(this.page, this.title);
            if (code === '200') {
                this.newsList = data.getNewsList
                this.totalCount = data.page.totalCount
                this.page.currentPageCount = data.page.currentPage
            }
            this.loading = false
        },
        addNews() {
            window.location = "/esay_buy_pages/admin/news/AddNews.html"
        },
        newsDetail(id) {
            window.location = "/esay_buy_pages/admin/news/ViewNews.html?id=" + id
        },
        modifyNews(id) {
            window.location = "/esay_buy_pages/admin/news/ModifyNews.html?id=" + id
        },
        async delNews(id) {
            if (!confirm("是否确认删除")) {
                return;
            }
            const {code} = await delNewsById(id);
            if (code === '200') {
                alert("删除成功");
                this.getNewsList(this.page.currentPageCount)
            }
        },
        returnAdmin() {
            window.location = "/esay_buy_pages/admin/Admin.html"
        }
    },
    mounted: async function () {
         const {code, message} = await checkPermission()
        if (code === '300') {
            this.$alert(message, '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        await this.getNewsList(1);
    },
})
