import {getProCategoryNameByType} from "/api/category.js";
import {getBrandAllList} from "/api/brand.js";
import {addProduct} from "/api/product.js";

new Vue({
    el: '#app',
    data: {
        product: {
            brandId: '',
            categoryLevelId: '',
            name: '',
            price: '',
            description: '',
            picPath: ''
        },
        imageUrl: '',
        brandList: [],
        categoryList: [],
        rules: {
            price: [
                {required: true, message: '价格不能为空', trigger: 'blur'},
                {type: 'number', message: '价格必须为数字值', trigger: 'blur'}
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
            ]
        }
    },
    methods: {
        resetForm() {
            this.product = [];
        },
        async getCategoryList() {
            const {data} = await getProCategoryNameByType();
            this.categoryList = data
        },
        async getBrandList() {
            const {data} = await getBrandAllList();
            this.brandList = data
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
        handleHttpRequest(req) {
            this.product.picPath = req.file
            this.imageUrl = URL.createObjectURL(req.file);
        },
        async submitForm(formName) {
            let $this = this
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let formData = new FormData(upload)
                    formData.set('brandId', $this.product.brandId)
                    formData.set('categoryLevelId', $this.product.categoryLevelId)
                    formData.set('filePath', $this.product.picPath)
                    const {code, message} = await addProduct(formData);
                    if (code === '200') {
                        alert(message)
                        window.location = "/esay_buy_pages/admin/products/ProductDetail.html"
                    }
                } else {
                    return false;
                }
            });
        }
    },
    mounted: async function () {
        await this.getCategoryList();
        await this.getBrandList();
    }
})
