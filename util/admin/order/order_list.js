import {getOrderList} from "/api/order.js";

new Vue({
    el: '#admin',
    data() {
        return {
            orderList: '',
        }
    },
    methods: {
        handleClick(row) {
            getOrderList()
        }
    },
    mounted: async function () {
        const {code, data, message} = await getOrderList()
        this.orderList = data;
    }
})
