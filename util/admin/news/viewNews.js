import {getNewsById} from "/api/news.js";
import {loginOut} from "/api/login.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id=params.get("id");
new Vue({
    el:"#admin",
    data:{
        news:{},
    },
    methods: {

        async getNewsById(){
            const {data} = await getNewsById(id);
            this.news=data
        },
        returnNewsList(){
            window.location="/esay_buy_pages/admin/news/NewsDetail.html"
        
        },
        returnIndex(){
            window.location="/esay_buy_pages/Index.html"
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
        this.getNewsById();
    },
})