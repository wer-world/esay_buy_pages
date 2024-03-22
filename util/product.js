import {getProductById,getSimilarProducts} from "/api/product.js"
import {addCollection} from "/api/collection.js"

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
    mounted: async function(){
        await this.initProduct();
        await this.initsimilarProducts();
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
        async initProduct(){
            const url = new URLSearchParams(window.location.search)
            const id = url.get('id');
            this.id = id;
            const {data} = getProductById(id);
            this.product = data;
        },
        async initsimilarProducts(){
            const {data} = getSimilarProducts(this.product.categoryLevelId);
            console.log(data)
            this.similarProducts = data;
        },
        collect(){
            const {code} = addCollection(this.id)
            this.collectMsg = code;
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
        },
        view(id){
            window.location.href="/esay_buy_pages/product/Product.html?id="+id;
        }
    }
})