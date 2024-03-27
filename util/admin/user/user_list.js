import {getUserListPage, checkType, deleteUser, getTypeList} from "/api/user.js"
import {checkPermission} from "/api/user.js";
import {loginOut} from "/api/login.js";

new Vue({
    el: '#admin',
    data: {
        userList: [],
        typeList: [],
        type: null,
        userName: null,
        pageSize: 5,
        totalCount: 0,
        loginName: null,
    },
    mounted: async function () {
        this.loginName = readCookie('loginName');
        const {code, message} = await checkPermission()
        if (code === '300') {
            this.$alert(message, '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        await this.getTypeList();
        await this.getUserList(1);
    },
    methods: {
        async getUserList(currentPage) {
            const {code, data} = await getUserListPage(this.type, this.userName, currentPage, this.pageSize);
            if (code === '200'){
                this.userList = data.userList;
                this.totalCount = data.totalCount;
            } else {
                this.userList = [];
                this.totalCount = 0;
            }

        },
        async currentChange(currentPage) {
            await this.getUserList(currentPage);
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
        async viewUser(id) {
            const {code} = await checkType(id);
            if (code != "200") {
                alert("没有权限查看!")
                return false;
            }
            window.location.href = "/esay_buy_pages/admin/user/ViewUser.html?id=" + id
        },
        async updateUser(id) {
            const {code} = await checkType(id);
            if (code != "200") {
                alert("没有权限修改!")
                return false;
            }
            window.location.href = "/esay_buy_pages/admin/user/UpdateUser.html?id=" + id
        },
        async deleteUser(id) {
            const {code} = await checkType(id);
            if (code != "200") {
                alert("没有权限删除!")
                return false;
            }
            if (confirm("确定要删除吗")) {
                const {code} = await deleteUser(id);
                if (code == "200") {
                    alert("删除成功!")
                    location.reload();
                }
            }
        },
        async getTypeList() {
            const {data} = await getTypeList();
            this.typeList = data;
        },
        async handleLoginOut() {
            const {code} = await loginOut()
            if (code === '200') {
                this.loginName = null
                this.message('用户注销成功', 'success')
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            } else {
                this.message('用户注销失败', 'error')
            }
        },
        handleReset() {
            this.userName = ''
            this.type = null
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
        },
    }
})
