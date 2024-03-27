import {getOrderList,cancelOrder} from "/api/order.js"
import {alipayCreate} from "/api/alipay.js"
import {downloadProductImg} from "/api/product.js"
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {loginOut} from "../../api/login.js";

new Vue({
    el:"#root",
    data:{
        orderList:[],
        pageSize:5,
        serialNumber:'',
        totalCount:'',
        //购物车相关
        loginName: null,
        type:null,
        buyCarList: [],
        globalCondition: null,
    },
    //购物车相关
    computed: {
        totalCost: function () {
            let totalCost = 0
            for (let key in this.buyCarList) {
                totalCost += this.buyCarList[key].productNum * this.buyCarList[key].productPrice
            }
            return totalCost
        }
    },
    //↑购物车相关
    mounted:async function(){
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
        await this.getBuyCarList()
        await this.getOrderList();
        await this.handleDownloadImg();
    },
    methods:{
        async getOrderList(currentPage=1){
            const {data} = await getOrderList(currentPage,this.pageSize,this.serialNumber,null);
            console.log(data)
            this.orderList = data.orderList;
            this.totalCount = data.totalCount;
        },
        async cancelOrder(id){
            if (!confirm("确认取消订单吗？")){
                return
            }
            const {message} = await cancelOrder(id);
            alert(message)
            await this.getOrderList(1);
        },
        async payOrder(id,serialNumber){
            const data = await alipayCreate(id,serialNumber);
            console.log(data)
            /* 此处form就是后台返回接收到的数据 */
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.appendChild(div);
            document.getElementsByName('punchout_form')[0].submit()
        },
        async handleDownloadImg() {
            //购物车相关
            for (const key in this.buyCarList) {
                const data = await downloadProductImg(this.buyCarList[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let productImg = document.getElementById('productImg' + key)
                if (productImg != null) {
                    productImg.setAttribute('src', url);
                }
            }
            //↑购物车相关
        },
        //购物车相关
        async handleDelBuyCarProduct(id) {
            if (confirm('您确定要把该商品移除购物车吗!')) {
                const {code} = await delBuyCarProductById(id)
                if (code === '200') {
                    this.message('移除成功!', 'error')
                    this.getBuyCarList()
                } else {
                    this.message('删除购物车信息失败', 'error')
                }
            }
        },
        async getBuyCarList() {
            const {code, data} = await getBuyCarListByUserId()
            if (code === '200') {
                this.buyCarList = data
                await this.handleDownloadImg()
            }
        },
        async handleAddBuyCar(productId) {
            const {code, message} = await addBuyCar(productId)
            if (code === '200') {
                await this.getBuyCarList()
                this.message('加入购物车成功！', 'success')
            } else {
                this.message(message, 'error')
            }
        },
        handlerToBuyCar() {
            window.location.href = '/esay_buy_pages/buycar/BuyCar.html'
        },
        toCategoryList(){
            window.location.href='/esay_buy_pages/category/CategoryList.html?globalCondition='+this.globalCondition
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

    }
})