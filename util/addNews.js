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
        onSubmit() {
            this.titleMsg='',
            this.contentMsg='',
            this.checkTitle();
            if (!this.flag) {
                return
            }
            if (this.news.content.trim().length==0) {
                this.contentMsg="请输入内容";
            }
            axios({
                method:'post',
                url:"/nginx/news/addNews",
                data:{
                    title:this.news.title,
                    content:this.news.content
                }
            }).then((result) => {
                if (result.data.code=='200') {
                    alert("添加成功");
                    window.location="/esay_buy_pages/admin/NewsDetail.html"
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
            window.location="/esay_buy_pages/admin/NewsDetail.html"
        
        }
    },
    
})