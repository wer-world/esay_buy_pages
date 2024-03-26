import {deleteAddressById, getAddressCountByUserId, getAddressListByUserId} from "../../../api/address.js";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {
        addressList:[],
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
        loading:true
    },
    methods: {
        async getAddressList(currentPageCount){
            this.loading=true
            const {code,data} = await getAddressListByUserId(currentPageCount,this.pageSize);
            if (code==='200'){
                this.addressList = data;
                this.currentPageCount = currentPageCount
            }
            this.loading=false
        },
        addAddress(){
            window.location = "/esay_buy_pages/admin/address/AddAddress.html"
        },
        modifyAddress(id){
            window.location = "/esay_buy_pages/admin/address/ModifyAddress.html?id=" + id
        },
        async delAddress(id){
            if (!confirm("是否确认删除？")){
                return;
            }
            const {code} = await deleteAddressById(id);
            if (code==="200"){
                alert("删除成功");
                await this.getAddressList(this.currentPageCount);
                await this.getAddressAccount()
            }
        },
        async getAddressAccount(){
            const {code,data} = await getAddressCountByUserId();
            if (code==='200'){
                this.totalCount = data
            }
        }
    },
    mounted: async function(){
        await this.getAddressList(1);
        await this.getAddressAccount()

    }
})