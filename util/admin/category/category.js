import {checkPermission} from "/api/user.js";
import {getCategoryList,getParentCategory,addCategory,getCategory,updateCategory,deleteCategory} from "/api/category.js";
import {loginOut} from "/api/login.js";

new Vue({
    el:'#admin',
    data:{
        categoryList1: [],
        defaultProps:{
            children:'childCategoryList',
            label:'name'
        },
        dialogAddCategoryForm:false,
        dialogUpdateCategoryForm:false,
        dialogDeleteCategoryForm:false,
        currentCategory:'',
        parentCategory:'',
        newCategoryName:'',
        loginName:null,
    },
    mounted: async function () {
        this.loginName = readCookie('loginName')
        const {code, message} = await checkPermission()
        if (code === '300') {
            this.$alert(message, '登录提示', {
                confirmButtonText: '确定',
                callback: action => {
                    window.location.href = '/esay_buy_pages/login/Login.html'
                }
            })
        }
        await this.initCategoryList();
    },
    methods:{
        async initCategoryList() {
            const {data} = await getCategoryList(0);
            this.categoryList1 = data;
        },
        getCategoryType(type){
            switch (type){
                case 1:
                    return "一级分类";
                case 2:
                    return "二级分类";
                case 3:
                    return "三级分类";
            }
        },
        async setParentCategory(parentId){
            const {data} = await getParentCategory(parentId);
            this.parentCategory = data;
        },
        async saveAdd(){
            if (this.newCategoryName.length<1||this.newCategoryName>10){
                alert("类别名应在1-10个字符之间!");
                return;
            }
            if (this.parentCategory==null){
                const data = await addCategory(this.newCategoryName,0,1);
                alert(data.message)
                if (data.code=="200"){
                    this.dialogAddCategoryForm=false;
                    await this.initCategoryList();
                }
            }else {
                const data = await addCategory(this.newCategoryName,this.parentCategory.id,this.parentCategory.type+1);
                alert(data.message)
                if (data.code=="200"){
                    this.dialogAddCategoryForm=false;
                    await this.initCategoryList();
                }
            }
        },
        async setCurrentCategory(id){
            const {data} = await getCategory(id);
            this.currentCategory = data;
        },
        async saveUpdate(){
            if (this.currentCategory.name.length<1||this.currentCategory.name>10){
                alert("类别名应在1-10个字符之间!");
                return;
            }
            const data = await updateCategory(this.currentCategory.id,this.currentCategory.name);
            alert(data.message);
            if (data.code=="200"){
                this.dialogUpdateCategoryForm=false;
                await this.initCategoryList();
            }
        },
        async saveDelete(){
            const data = await deleteCategory(this.currentCategory.id);
            alert(data.message);
            if (data.code=="200"){
                this.dialogDeleteCategoryForm=false;
                await this.initCategoryList();
            }
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
