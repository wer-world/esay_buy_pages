import {getUserListPage, checkType, deleteUser,getTypeList} from "/api/user.js"

new Vue({
    el: '#root',
    data: {
        userList: [],
        typeList: [],
        type: '',
        userName: '',
        pageSize: 5,
        totalCount: 0
    },
    mounted:async function(){
        await this.getUserList(1);
        await this.getTypeList();
    },
    methods: {
        async getUserList(currentPage) {
            const {data} = await getUserListPage(this.type, this.userName, currentPage, this.pageSize);
            this.userList = data.userList;
            this.totalCount = data.totalCount;
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
                    await this.getUserList(1);
                    await this.getTypeList();
                }
            }
        },
        async getTypeList() {
            const {data} = await getTypeList();
            this.typeList = data;
        }
    }
})