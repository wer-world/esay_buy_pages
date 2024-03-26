import {getNewsById} from "../../../api/news.js";

Vue.config.productionTip = false
var params = new URLSearchParams(window.location.search);
var id = params.get("id");
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
        
        }
    },
    mounted() {
        this.getNewsById();
    },
})