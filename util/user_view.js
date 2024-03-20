new Vue({
    el:'#root',
    data:{
        user:{},
    },
    mounted(){
        this.initUser();
    },
    methods:{
        initUser(){
           let urlParams =  new URLSearchParams(window.location.search)
           let id = urlParams.get("id")
           axios({
               method:'post',
               url:'/nginx/user/getUser',
               data:{
                   'id':id
               }
           }).then((res=>{
               this.user = res.data.data;
               console.log(this.user)
           }))
        }
    }
})