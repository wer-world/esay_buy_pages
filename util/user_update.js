new Vue({
    el:'#root',
    data:{
        user:{},
        currentUser:{},
        typeList:[]
    },
    mounted(){
        this.initUser();
        this.getTypeList();
        this.initCurrentUser()
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
           }))
        },
        initCurrentUser(){
            axios({
                method:'post',
                url:'/nginx/user/getCurrentUser'
            }).then((res=>{
                this.currentUser = res.data.data;
            }))
        },
        getTypeList() {
            axios({
                method: 'post',
                url: '/nginx/type/getTypeList',
            }).then((res => {
                this.typeList = res.data.data;
            }))
        },
        save(){
            axios({
                method: 'post',
                url: '/nginx/user/updateUser',
                data:{
                    'user':this.user
                }
            }).then((res => {
                if (res.data.code=="200"){
                    alert("修改成功");
                    window.location.href="../views/admin/user/UserList.html";
                }
            }))
        }
    }
})