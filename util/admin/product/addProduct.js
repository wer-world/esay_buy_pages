import {getProCategoryNameByType} from "/api/category.js";
import {getBrandAllList} from "/api/brand.js";
import {addProduct} from "../../../api/product.js";

new Vue({
    el:'#app',
    data:{
        product: {
            brandId:'',
            categoryLevelId:'',
            name:'',
            price:'',
            desc: '',
            picPath:''
        },
        fileList:[],
        imageUrl: '',
        brandList:[],
        categoryList:[],
        rules: {
            price: [
                { required: true, message: '价格不能为空',trigger: 'blur'},
                { type: 'number', message: '价格必须为数字值',trigger: 'blur'}
            ],
            name: [
                {required: true, message: '请输入商品名称', trigger: 'blur'},
                {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
            ],
            brandId: [
                {required: true, message: '请选择商品品牌', trigger: 'change'}
            ],
            categoryLevelId: [
                {required: true, message: '请选择商品类别', trigger: 'change'}
            ],
            desc: [
                {required: true, message: '请填写商品描述', trigger: 'blur'}
            ],

        }
    },
    methods:{
        resetForm(){
            this.product=[];
        },
        async getCategoryList(){
            const {data} = await getProCategoryNameByType();
            this.categoryList=data
        },
        async getBrandList(){
            const {data} = await getBrandAllList();
            this.brandList=data
        },
        handleAvatarSuccess(file) {
            this.imageUrl = URL.createObjectURL(file);

        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpg';
            const isPNG = file.type === 'image/png';
            const isJPEG = file.type === 'image/jpeg';
            const isPNEG = file.type === 'image/pneg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG && !isJPEG && isPNEG) {
                this.$message.error('上传文件格式只能是 JPG PNG JPEG PNEG');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return (isJPG || isPNG || isJPEG || isPNEG) && isLt2M;

        },
          handleFileUpload(fileObject){
            console.log(fileObject)
            // 文件上傳功能實現
            this.handleAvatarSuccess(fileObject.file);
            console.log(fileObject.file)
            this.fileObj = fileObject.file;
        },
        async submitForm(){
            this.$refs["product"].validate(async (valid) => {
                if (valid) {
                    console.log("校验通过");
                    var formData = new FormData();
                    for (let i = 0; i < this.fileList.length; i++) {
                        //this.fileList[i].raw:获取图片格式
                        //这里的file必须和后端Controller中的requestparam参数一致，才能上传成功，否则会报400错误
                        formData.append("picPath", this.fileList[i].raw, this.fileList[i].name);
                    }
                    formData.append('products', this.product);
                    console.log(formData)
                    //这里重新创建了一个axios实例,是因为我在全局配置里的Content-type是appliacation/json,而这里我想要使用multipart/form-data
                    const {code,message,data} = await addProduct(formData);
                    if (code==='200'){
                        console.log(data);
                        alert(message)
                        window.location="/esay_buy_pages/admin/products/ProductDetail.html"
                    }
                }else{
                    console.log("校验不通过")
                }
            });

        }

    },
    mounted:async function(){
        await this.getCategoryList();
        await this.getBrandList();
    }
})
