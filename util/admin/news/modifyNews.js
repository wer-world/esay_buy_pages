import {getNewsById} from "/api/news.js";
import {loginOut} from "/api/login.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id = params.get("id");
new Vue({
    el: "#admin",
    data: {
        news: {
            title:'',
            content:'',
        },
        titleMsg:'',
        contentMsg:'',
        flag:false,
        type:null,
        loginName: null,
    },
    methods: {
        async getNewsById(){
            const {data} = await getNewsById(id);
            this.news=data
        },
        async onSubmit() {
            await this.checkTitle();
            if (!this.flag) {
                return
            }
            if (this.news.content.trim().length===0) {
                this.contentMsg="请输入内容";
            }
            const {code} = await modifyNewsById(id,this.news.title,this.news.content);
            if (code==='200') {
                alert("修改成功");
                window.location="/esay_buy_pages/admin/news/NewsDetail.html"
            }
        },
        async checkTitle(){
            const {code,message} = await getNewsByTitle(this.news.title);
            if (code==='201') {
                this.titleMsg = message
                this.flag = false
            }else{
                this.flag = true
            }
        },
        clear(){
            this.news={
                title:'',
                content:'',
            }
        },
        returnNewsList(){
            window.location="/esay_buy_pages/admin/news/NewsDetail.html"
        
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
        this.loginName = readCookie('loginName');
        this.type = readCookie('type')
    },
})