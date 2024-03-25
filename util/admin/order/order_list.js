import {getOrderList} from "/api/order.js";

new Vue({
    el: '#admin',
    data() {
        return {
            orderList: '',
            totalCount: 0,
            serialNumber: '',
            loginName: '',
            currentPage: 1,
            pageSize: 5,
            orderListLoad: true
        }
    },
    methods: {
        handleClick(row) {
            window.location.href = '/esay_buy_pages/admin/order/OrderDetail.html?orderId=' + row
        },
        async handleFind() {
            this.orderListLoad = true
            const {code, data} = await getOrderList(this.currentPage, this.pageSize, this.serialNumber, this.loginName)
            if (code === '200') {
                this.orderList = data.orderList
                this.totalCount = data.totalCount
            } else {
                this.orderList = []
                this.totalCount = 0
            }
            this.orderListLoad = false
        },
        handleReset() {
            this.serialNumber = ''
            this.loginName = ''
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleFind()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.handleFind()
        }
    },
    mounted: async function () {
        this.orderListLoad = true
        const {data} = await getOrderList(1, 5)
        this.orderList = data.orderList
        this.totalCount = data.totalCount
        this.orderListLoad = false
    }
})
