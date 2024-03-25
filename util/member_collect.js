import {getCollections,deleteCollection} from "/api/collection.js"
import {downloadProductImg} from "/api/product.js"


new Vue({
    el:'#root',
    data:{
        collections:[],
    },
    mounted:async function(){
        await this.initCollections();
        await this.handleDownloadImg();
    },
    methods:{
        async initCollections(){
            const {data} = await getCollections(20);
            this.collections = data;
        },
        view(id) {
            window.location.href = "/esay_buy_pages/product/Product.html?id=" + id;
        },
        async deleteCollection(id){
            if (!confirm("确认删除吗？")){
                return
            }
            const {data} =await deleteCollection(id);
            alert(data)
            await this.initCollections();
        },
        async handleDownloadImg(){
            for (const key in this.collections){
                const data = await downloadProductImg(this.collections[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let imgs = document.getElementsByClassName('productImg'+this.collections[key].picPath);
                for (let i=0;i<imgs.length;i++){
                    imgs[i].setAttribute('src', url);
                }
            }
        }
    }
})