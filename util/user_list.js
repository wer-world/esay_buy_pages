new Vue({
    el: '#root',
    data: {
        userList: [],
        typeList: [],
        type:'',
        userName: '',
        pageSize: 5,
        totalCount: 0
    },
    mounted() {
        this.getUserList(1);
        this.getTypeList();
    },
    methods: {
        getUserList(value) {
            axios({
                method: 'post',
                url: '/nginx/user/getUserListPage',
                data: {
                    'type': this.type,
                    'userName': this.userName,
                    'currentPage': value,
                    'pageSize': this.pageSize
                }
            }).then((res => {
                console.log(res.data.data.userList)
                this.userList = res.data.data.userList;
                this.totalCount = res.data.data.totalCount;
            }))
        },
        currentChange(value) {
            this.getUserList(value);
        },
        getSex(sex) {
            if (sex == 1) {
                return '男'
            } else if (sex == 0) {
                return '女'
            } else {
                return '未知'
            }
        },
        viewUser(id) {
            axios({
                method: 'post',
                url: '/nginx/user/checkType',
                data: {
                    'id': id
                }
            }).then((res) => {
                if (res.data.code != "200") {
                    alert("没有权限查看!")
                    return false;
                }
            })
            window.location.href = "/esay_buy_pages/admin/user/ViewUser.html?id=" + id
        },
        updateUser(id) {
            axios({
                method: 'post',
                url: '/nginx/user/checkType',
                data: {
                    'id': id
                }
            }).then((res) => {
                if (res.data.code != "200") {
                    alert("没有权限修改!")
                    return false;
                }
            })
            window.location.href = "/esay_buy_pages/admin/user/UpdateUser.html?id=" + id
        },
        deleteUser(id) {
            axios({
                method: 'post',
                url: '/nginx/user/checkType',
                data: {
                    'id': id
                }
            }).then((res) => {
                if (res.data.code != "200") {
                    alert("没有权限删除!")
                    return false;
                }
            })
            if (confirm("确定要删除吗")){
                axios({
                    method: 'post',
                    url: '/nginx/user/deleteUser',
                    data: {
                        'id': id
                    }
                }).then((res) => {
                    if (res.data.code == "200") {
                        alert("删除成功!")
                        return false;
                    }
                })
            }
        },
        getTypeList() {
            axios({
                method: 'post',
                url: '/nginx/type/getTypeList',
            }).then((res => {
                this.typeList = res.data.data;
            }))
        }
    }
})