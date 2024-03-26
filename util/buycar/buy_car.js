import {delBuyCarProductById, getBuyCarListByUserId, modBuyCarProductNumById} from "/api/buycar.js";
import {downloadProductImg} from "/api/product.js";
import {addCollection} from "/api/collection.js";

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
        async handleAddCollection(productId) {
            const {code, message} = await addCollection(productId)
            if (code === '200') {
                this.message('添加收藏夹成功!', 'success')
            } else {
                this.message(message, 'error')
            }
        },
        handleModBuyCarProductNumById(id, product) {
            if (time) {
                clearTimeout(time)
            }
            time = setTimeout(function () {
                modBuyCarProductNumById(id, product)
            }, 1000)
        },
        handlerSubProductNum(index) {
            if (this.buyCarList[index].productNum - 1 < 1) {
                this.buyCarList[index].productNum = 1
                this.message('商品数量不能小于1', 'warning')
            } else {
                this.buyCarList[index].productNum--
                this.handleModBuyCarProductNumById(this.buyCarList[index].id, this.buyCarList[index].productNum)
            }
        },
        handlerAddProductNum(index) {
            if (this.buyCarList[index].productNum + 1 > 200) {
                this.buyCarList[index].productNum = 200
                this.message('商品数量不能大于200', 'warning')
            } else {
                this.buyCarList[index].productNum++
                this.handleModBuyCarProductNumById(this.buyCarList[index].id, this.buyCarList[index].productNum)
            }
        },
        handleInputProductNum(index, e) {
            if (e.value < 1) {
                e.value = 1
                this.message('商品数量不能小于1', 'warning')
            }
            if (e.value > 200) {
                e.value = 200
                this.message('商品数量不能大于200', 'warning')
            }
            if (e.value.search(/\D/g)) {
                e.value = e.value.replace(/\D/g, '')
                this.message('商品数量需为正整数', 'warning')
            }
            this.buyCarList[index].productNum = e.value
            this.handleModBuyCarProductNumById(this.buyCarList[index].id, this.buyCarList[index].productNum)
        },
        handlerConfirmSell() {
            if (this.buyCarList.length === 0) {
                this.message('当前购物车中没有商品,无法确认结算', 'error')
                return
            }
            window.location.href = '/esay_buy_pages/buycar/BuyCar_Two.html'
        },
        handlerToBuyCar() {
            window.location.href = '/esay_buy_pages/buycar/BuyCar.html'
        },
        handlerContinueBuy() {
            window.location.href = '/esay_buy_pages/index.html'
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
        await this.getBuyCarList()
    }
})
