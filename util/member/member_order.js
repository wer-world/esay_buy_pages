import {getOrderList,cancelOrder} from "/api/order.js"
import {alipayCreate} from "/api/alipay.js"

new Vue({
    el:"#root",
    data:{
        orderList:[],
        pageSize:5,
        serialNumber:'',
        totalCount:''
    },
    mounted:async function(){
        await this.getOrderList();
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
        }
    }
})