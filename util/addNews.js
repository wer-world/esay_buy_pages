import {addNews, getNewsByTitle} from "../api/news.js";

Vue.config.productionTip = false

new Vue({
    el: "#app",
    data: {
        news: {
            title:'',
            content:'',
        },
        titleMsg:'',
        contentMsg:'',
        flag:false
    },
    methods: {
        async onSubmit() {
            this.titleMsg=''
            this.contentMsg=''
            await this.checkTitle();
            if (!this.flag) {
                return
            }
            if (this.news.content.trim().length===0) {
                this.contentMsg="请输入内容";
            }
            const {code} = await addNews(this.news.title,this.news.content);
            if (code==='200') {
                alert("添加成功");
                window.location="/esay_buy_pages/admin/NewsDetail.html"
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
        
        }
    },
    
})