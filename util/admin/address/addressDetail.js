import {getAddressListByUserId} from "../../../api/address.js";

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
        async getAddressList(){
            this.loading=true
            const {code,data} = await getAddressListByUserId();
            if (code==='200'){
                this.addressList = data;
            }
            this.loading=false
        },
        viewAddress(id){

        },
        modifyAddress(id){

        },
        delAddress(id){

        },
    },
    mounted: async function(){
        await this.getAddressList();
    }
})