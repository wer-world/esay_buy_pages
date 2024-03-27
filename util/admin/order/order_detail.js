import {getOrder, getOrderDetailListPage} from "/api/order.js";
import {delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {downloadProductImg} from "/api/product.js";
import {loginOut} from "/api/login.js";

new Vue({
    el: '#admin',
    data() {
        return {
            order: {
                serialNumber: '123',
                loginName: '123',
                userAddress: '123',
                cost: 100,
                createTime: '123',
                statusName: '已支付',
                mobile: '1583233515'
            },
            buyCarList: {
                id: 1,
                productId: 1,
                productName: '',
                description: '',
                productPrice: 1.0,
                picPath: '',
                productNum: 1,
                createTime: ''
            },
            orderId: null,
            currentPage: 1,
            pageSize: 5,
            productName: '',
            totalCount: 0,
            orderDetailList: [],
            load: true,
            type:null,
            name:null,
        }
    },
    methods: {
        async handleFind() {
            this.load = true
            const {
                code,
                data
            } = await getOrderDetailListPage(this.currentPage, this.pageSize, this.orderId, this.productName)
            if (code === '200') {
                this.orderDetailList = data.orderDetailList
                this.totalCount = data.totalCount
                this.$message.success('订单详情列表获取成功!');
            } else {
                this.orderDetailList = []
                this.totalCount = 0
                this.$message.error('订单详情列表获取失败!');
            }
            this.load = false
        },
        handleReset() {
            this.productName = ''
        },
        handleSizeChange(val) {
            this.pageSize = val
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.handleFind()
        },
        async handleDelBuyCarProduct(id) {
            const {code} = await delBuyCarProductById(id)
            if (code === '200') {
                this.getBuyCarList()
            } else {
                this.$message.error('删除购物车信息失败')
            }
        },
        async getBuyCarList() {
            const {code, data} = await getBuyCarListByUserId()
            if (code === '200') {
                this.buyCarList = data
                await this.handleDownloadImg()
            } else {
                this.buyCarList = []
            }
        },
        async handleDownloadImg() {
            for (const key in this.buyCarList) {
                const data = await downloadProductImg(this.buyCarList[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let img = document.getElementById('productImg' + key)
                img.setAttribute('src', url);
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
    computed: {
        totalCost: function () {
            let totalCost = 0
            for (let key in this.buyCarList) {
                totalCost += this.buyCarList[key].productNum * this.buyCarList[key].productPrice
            }
            return totalCost
        }
    },
    mounted: async function () {
        this.name = readCookie('loginName')
        this.type = readCookie('type')
        await this.getBuyCarList()
        this.orderId = getUrlParam('orderId')
        const {code, data} = await getOrder(this.orderId)
        if (code === '200') {
            this.order = data
            this.handleFind()
            this.$message.success('订单详情获取成功!')
        } else {
            this.$message.error('订单详情获取失败!')
        }
    }
})
