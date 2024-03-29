import {getNewsById} from "/api/news.js";
import {checkPermission} from "/api/user.js";
import {loginOut} from "/api/login.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id = params.get("id");
new Vue({
    el: "#admin",
    data: {
        loginName: '',
        news: {},
    },
    methods: {
        async getNewsById() {
            const {code, data, message} = await getNewsById(id);
            if (code === '300') {
                this.$alert(message, '登录提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        window.location.href = '/esay_buy_pages/login/Login.html'
                    }
                })
            }
            this.news = data
        },
        returnNewsList() {
            window.location = "/esay_buy_pages/admin/news/NewsDetail.html"
        },
        returnIndex() {
            window.location = "/esay_buy_pages/Index.html"
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
    mounted: async function () {
        this.loginName = readCookie('loginName');
        this.type = readCookie('type')
        await this.getNewsById();
    },
})
