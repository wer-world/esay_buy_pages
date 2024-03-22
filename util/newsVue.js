Vue.config.productionTip = false

new Vue({
    el: "#inews",
    data: {
        newsList: []

    },
    methods: {
        getNewsList() {
            axios({
                method: "get",
                url: "/nginx/news/getNewsList",
                params: {
                    currentPage: 1,
                    pageSize: 5
                }
            }).then((result) => {

                if (result.data.code == '200') {
                    this.newsList = result.data.data.getNewsList
                }
                console('asdasdas' + this.newsList)
            }).catch((err) => {

            });
        }
    },
    mounted() {
        this.getNewsList();
    },
})