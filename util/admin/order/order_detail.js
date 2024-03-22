import {getOrder} from "../../../api/order";

new Vue({
    el: '#admin',
    data() {
        return {
            order: {
                serialNumber: '123',
                createTime: '123',
                statusName: '已支付',
            },
            user: {
                loginName: 'admin',
                address: '123',
                email: 'hello11@bdqn.com',
                mobile: '1583233515'
            },
            orderDetailList: [],
            load: true
        }
    },
    methods: {},
    mounted: async function () {
        const orderId = getUrlParam('orderId')
        const {data, code} = await getOrder(orderId)
        if (code === '200') {
            this.order = data.orde
            this.user = data.user
            this.orderDetailList = data.orderDetailList
        } else {
            this.$message.error('订单详情获取失败!');
        }
    }
})
