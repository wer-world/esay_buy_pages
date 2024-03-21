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
        onSubmit() {
            flag=false
            this.checkTitle();
            if (!this.flag) {
                return
            }
            if (this.news.content.trim().length==0) {
                this.contentMsg="请输入内容";
            }
            axios({
                method:'post',
                url:"/nginx/news/modifyNewsById",
                data:{
                    id:id,
                    title:this.news.title,
                    content:this.news.content
                }
            }).then((result) => {
                if (result.data.code=='200') {
                    alert("修改成功");
                    window.location="/esay_buy_pages/admin/news/NewsDetail.html"
                }
            }).catch((err) => {
                
            });
        },
        checkTitle(){
            axios({
                method:'post',
                url:"/nginx/news/getNewsByTitle",
                data:{
                    title:this.news.title
                }
            }).then((result) => {
                if (result.data.code==201) {
                    this.titleMsg = result.data.message
                    this.flag = false
                }else{
                    this.flag = true
                }
            }).catch((err) => {
                
            });
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