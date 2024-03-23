import {delProduct, getProductListPages} from "../api/product";
import {getProCategoryNameByType} from "../api/category";
import {getBrandList} from "../api/brand";

Vue.config.productionTip = false
new Vue({
    el: '#app',
    data: {
        addressList:[],
        currentPageCount: 1,
        pageSize: 5,
        totalCount: 0,
    },
    methods: {

    }
})