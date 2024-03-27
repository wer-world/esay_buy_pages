import {getNewsById} from "/api/news.js";
import {checkPermission} from "/api/user.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id = params.get("id");
new Vue({
    el: "#app",
    data: {
        news: {}
    },
    methods: {

        async getNewsById() {
            const {data} = await getNewsById(id);
            this.news = data
        },
        returnNewsList() {
            window.location = "/esay_buy_pages/admin/news/NewsDetail.html"

        },
        returnIndex() {
            window.location = "/esay_buy_pages/Index.html"
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
        await this.getNewsById();
    },
})
