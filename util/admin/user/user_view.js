import {getUserById} from "/api/user.js"

new Vue({
    el:'#root',
    data:{
        user:{},
    },
    mounted(){
        this.initUser();
    },
    methods:{
        async initUser(){
           let urlParams =  new URLSearchParams(window.location.search)
           let id = urlParams.get("id")
           const {data} = await getUserById(id);
           this.user = data;
        }
    }
})