import {getUserOrderList, cancelOrder, modOrder, createOrder} from "/api/order.js"
import {alipayCreate} from "/api/alipay.js"
import {downloadProductImg} from "/api/product.js"
import {addBuyCar, delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {loginOut} from "/api/login.js";
import {getOrderDetailList} from "/api/orderDetail.js"

new Vue({
    el: "#root",
    data: {
        orderList: [],
        pageSize: 5,
        serialNumber: '',
        totalCount: '',
        //未支付订单列表
        unPayOrderList:[],
        mergeMsg:'',
        //主订单
        mainOrder:'',
        //从订单
        slaveOrder:'',
        //订单详情列表
        orderDetailList:[],
        //购物车相关
        loginName: null,
        type: null,
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
    mounted: async function () {
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
        if (this.loginName == null) {
            this.$alert('请登录后操作!', '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        await this.getBuyCarList()
        await this.getOrderList();
        await this.getUnPayOrderList();
        await this.handleDownloadImg();
    },
    methods: {
        async getOrderList(currentPage = 1) {
            const {data} = await getUserOrderList(currentPage, this.pageSize, this.serialNumber);
            this.orderList = data.orderList;
            this.totalCount = data.totalCount;
        },
        async getUnPayOrderList(currentPage = 1) {
            const {data} = await getUserOrderList(1, 100, this.serialNumber,0);
            this.unPayOrderList = data.orderList;
        },
        async mergeOrder(){
            if (this.mainOrder===this.slaveOrder){
                this.mergeMsg = "主订单和从订单不能一致！";
                return
            }
            this.mergeMsg = "";
            //改两个订单的状态为已合并
            let message;
            message = await modOrder(this.mainOrder.id,5)
            if (message.code!="200"){
                return
            }
            message = await modOrder(this.slaveOrder.id,5)
            if (message.code!="200"){
                return
            }
            //获取两个订单里的商品并加入购物车
            message = await getOrderDetailList(this.mainOrder.id);
            for (const key in message.data){
                await this.handleAddBuyCar(message.data[key].productId,message.data[key].quantity);
            }
            message = await getOrderDetailList(this.slaveOrder.id);
            for (const key in message.data){
                await this.handleAddBuyCar(message.data[key].productId,message.data[key].quantity);
            }
            await this.getBuyCarList();
            await this.handlerCreateOrder();
            await this.getOrderList();
        },
        async handlerCreateOrder() {
            const $this = this
                const {code, data, message} = await createOrder(this.buyCarList)
                if (code === '200') {
                    this.mergeMsg = "合并成功!"
                } else {
                    $this.message(message, 'error')
                }
        },
        async cancelOrder(id) {
            if (!confirm("确认取消订单吗？")) {
                return
            }
            const {message} = await cancelOrder(id);
            alert(message)
            await this.getOrderList(1);
        },
        async payOrder(id, serialNumber) {
            const data = await alipayCreate(id, serialNumber);
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
        async handleAddBuyCar(productId,productNum) {
            const {code, message} = await addBuyCar(productId,productNum)
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
        toCategoryList() {
            window.location.href = '/esay_buy_pages/category/CategoryList.html?globalCondition=' + this.globalCondition
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
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            } else {
                this.message('用户注销失败', 'error')
            }
        },

    }
})
