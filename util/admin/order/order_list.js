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
        },
        message(message, option) {
            const messageDom = document.getElementsByClassName('el-message')[0]
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
        }
    },
    mounted: async function () {
        this.orderListLoad = true
        const {code, data, message} = await getOrderList(1, 5)
        if (code === '300') {
            this.$alert(message, '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        this.orderList = data.orderList
        this.totalCount = data.totalCount
        this.orderListLoad = false
    }
})
