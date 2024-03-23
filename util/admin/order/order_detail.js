import {getOrder, getOrderDetailListPage} from "/api/order.js";
import {delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {downloadProductImg} from "/api/product.js";

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
            load: true
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
        }
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
