import {deleteAddressById, getAddressCountByUserId, getAddressListByUserId} from "/api/address.js";
import {loginOut} from "../../api/login.js";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {
        addressList:[],
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
        loading:true,
        loginName:null,
        type:null
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
            window.location = "/esay_buy_pages/member/Member_AddAddress.html"
        },
        modifyAddress(id){
            window.location = "/esay_buy_pages/member/Member_ModifyAddress.html?id=" + id
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
        },
        message(message, option) {
            const messageDom = document.getElementsByClassName('el-message')[0]
            console.log(messageDom)
            if (messageDom === undefined) {
                switch (option) {
                    case 'success': {
                        this.$message.success(message)
                        break;
                    }
                    case 'error': {
                        this.$message.error(message)
                        break;
                    }
                    case 'warning': {
                        this.$message.warning(message)
                        break;
                    }
                }
            }
        },
        async handleLoginOut() {
            const {code} = await loginOut()
            if (code === '200') {
                this.loginName = null
                this.message('用户注销成功', 'success')
            } else {
                this.message('用户注销失败', 'error')
            }
        },
    },
    mounted: async function(){
        await this.getAddressList(1);
        await this.getAddressAccount()
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')

    }
})