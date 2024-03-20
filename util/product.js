new Vue({
    el:'#all',
    data:{
        id:'',
        product:'',
        similarProducts:[],
        typeChoose:1,
        colorChoose:1,
        collectMsg:'',
        count:1,
        zuheCount:1,
        zuheTempPrice:0,
        zuhePrice:0
    },
    mounted(){
        this.init();
    },
    methods:{
        calZuhePrice(){
            this.zuhePrice = this.zuheTempPrice*this.zuheCount
        },
        handlerChange(e,p){
            if (e.target.checked){
                this.zuheTempPrice+=p.price
            }else {
                this.zuheTempPrice-=p.price
            }

        },
        init(){
            const url = new URLSearchParams(window.location.search)
            const id = url.get('id');
            this.id = id;
            axios({
                method:'post',
                url:'/nginx/product/getProductById',
                data:{
                    'id':this.id
                }
            }).then((res=>{
                this.product = res.data.data;
            }))
            axios({
                method:'post',
                url:'/nginx/product/getSimilarProducts',
                data:{
                    'categoryLevelId':this.product.categoryLevelId
                }
            }).then((res=>{
                this.similarProducts = res.data.data;
            }))
        },
        collect(){
            axios({
                method:'post',
                url:'/nginx/collection/addCollection',
                data:{
                    'productId':this.id
                }
            }).then((res=>{
                this.collectMsg = res.data.message;
            }))
        },
        checkCount(){
            const reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(this.count)){
                this.count = 1;
            }else if (this.count>200){
                this.count = 200;
            }
        },
        checkZuheCount(){
            const reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(this.zuheCount)){
                this.zuheCount = 1;
            }else if (this.zuheCount>200){
                this.zuheCount = 200;
            }
        }
    }
})