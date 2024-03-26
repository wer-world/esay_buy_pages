import {delBuyCarProductById, getBuyCarListByUserId} from "/api/buycar.js";
import {downloadProductImg} from "/api/product.js";
import {getOrder} from "/api/order.js";
import {alipayCreate} from "/api/alipay.js";

let time

new Vue({
    el: '#buyCar',
    data() {
        return {
            buyCarList: {
                id: 1,
                productId: 1,
                productName: '',
                description: '',
                productPrice: 1.0,
                picPath: '',
                quantity: 1,
                createTime: ''
            },
            order: {
                id: '',
                serialNumber: '',
                cost: 888,
            }
        }
    },
    methods: {
        async handleDelBuyCarProduct(id) {
            if (confirm('您确定要把该商品移除购物车吗!')) {
                const {code} = await delBuyCarProductById(id)
                if (code === '200') {
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
            } else {
                this.buyCarList = []
            }
        },
        async handleDownloadImg(id) {
            for (const key in this.buyCarList) {
                const data = await downloadProductImg(this.buyCarList[key].picPath)
                const blob = new Blob([data], {type: "image/jepg,image/png"});
                let url = window.URL.createObjectURL(blob);
                let productImg = document.getElementById('productImg' + key)
                let buyCarImg = document.getElementById('buyCarImg' + key)
                if (productImg != null) {
                    productImg.setAttribute('src', url);
                }
                if (buyCarImg != null) {
                    buyCarImg.setAttribute('src', url);
                }
            }
        },
        async handlerGetOrder() {
            const {code, data} = await getOrder(this.order.id, this.order.serialNumber)
            if (code === '200') {
                this.order = data
            }
        },
        handlerAlipayCreate() {
            let $this = this
            if (time) {
                clearTimeout(time)
            }
            time = setTimeout(async function () {
                const data = await alipayCreate($this.order.id, $this.order.serialNumber)
                /* 此处form就是后台返回接收到的数据 */
                const div = document.createElement('div');
                div.innerHTML = data;
                document.body.appendChild(div);
                document.getElementsByName('punchout_form')[0].submit()
            }, 1000)
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
        this.order.id = getUrlParam('orderId')
        await this.getBuyCarList()
        await this.handlerGetOrder()
    }
})
