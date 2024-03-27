import {getAddressById,modifyAddressById} from "../../api/address.js";
import {loginOut} from "../../api/login.js";
var param = new URLSearchParams(window.location.search);
var id = param.get("id")
new Vue({
    el: "#app",
    data: {
        tableData: [],
        totalPrice: 0,
        form: {
            region1: '',
            region2: '',
            region3: '',
            xxarrive: '',
            consignee:'',
            tel:'',
            provinceList: [
                //获取全部的省份ll
                // getProvince()
            ],
            cityList: [],
            countyList: []
        },
        address:{
            id:'',
            province: '',
            city: '',
            county: '',
            address:'',
            consignee:'',
            tel:'',
            remark:'',
            isDefault:''
        },
        CITY: [],
        XIAN: [],
        // shouHuoArrive:this.$store.state.sendOrderCenter.arriveInf，/*收货地址*/
        mapApiKey: 'map',
        //收货人信息
        shouhuoArrive: {},
        rules:{
            region1: [
                {required: true, message: '请选择省份', trigger: 'change'}
            ],
            region2: [
                {required: true, message: '请选择城市', trigger: 'change'}
            ],
            region3: [
                {required: true, message: '请选择区县', trigger: 'change'}
            ],
            xxarrive: [
                {required: true, message: '请填写详细地址', trigger: 'change'}
            ],
            consignee: [
                {required: true, message: '请填写收货人', trigger: 'blur'}
            ],
            tel:[
                { required: true, message: '请填写手机号', trigger: 'blur' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
            ]
        },
        type:null,
        loginName:null
    },
    methods: {
        async getAreaByGaoDe() {
            axios({
                method: "get",
                url: "https://restapi.amap.com/v3/config/district?parameters", // apii请求地址
                params: {  // 携带的参数
                    key: "887899796d16156eaa31cfcdec1677bd", // 在高德开放平台申请的个人key密钥
                    keyWords: "中国",
                    subdistrict: 3    // 要获取的行政区划的级别：省、市、县三级
                }
            }).then((res) => {
                this.form.provinceList = res.data.districts[0].districts  /* 省*/
                /* 进行遍历赋值*/
                /* 市区和县区*/
                let newProvince = this.form.provinceList
                for (let i = 0; i < newProvince.length; i++) {              /* 省级*/
                    for (let j = 0; j < newProvince[i].districts.length; j++) {       /* 市级*/
                        let city = newProvince[i].districts[j].name
                        this.CITY.push({ id: j + 1, name: city, code: i + 1 })
                        for (let k = 0; k < newProvince[i].districts[j].districts.length; k++) {/* 县级*/
                            let xian = newProvince[i].districts[j].districts[k].name
                            this.XIAN.push({ id: k + 1, name: xian, code: j + 1, cityCountyName: city })
                        }
                    }
                }
                for (let m = 0; m < newProvince.length; m++) {
                    newProvince[m] = { ...newProvince[m], ...{ code: m + 1 } }
                }
                this.form.provinceList = newProvince
            })

        },
        provinceChange(that) {
            // 根据选中省，匹配市
            let cityCode = 0
            let newCityArry = []
            this.form.provinceList.forEach((item, index) => {
                if (item.name == that) {
                    cityCode = item.code
                }
            })
            // console.log(cityCode)
            if (cityCode) {
                this.form.cityList = []
                this.CITY.forEach((item, index) => {
                    if (item.code == cityCode) {
                        this.form.cityList.push(item)
                    }
                })  /* 市匹配成功*/
            }
        },

        cityChange(that) {
            let countyCode = 0
            let cityname = ''
            let newCountyArry = []
            this.form.cityList.forEach((item, index) => {
                if (item.name == that) {
                    countyCode = item.id
                    cityname = item.name
                }
            })
            if (countyCode) {
                this.form.countyList = []
                this.XIAN.forEach((item, index) => {
                    if (item.code == countyCode && item.cityCountyName == cityname) {
                        this.form.countyList.push(item)
                    }
                })
            }
        },
        quxiao(){
            window.location = "/esay_buy_pages/member/Member_Address.html"
        },
        onSubmit(){
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    console.log("校验通过");
                    this.address.province = this.form.region1;
                    this.address.city = this.form.region2;
                    this.address.county = this.form.region3;
                    this.address.consignee = this.form.consignee;
                    this.address.tel = this.form.tel;
                    this.address.detailed = this.form.xxarrive;
                    this.address.address=this.form.region1 + this.form.region2 + this.form.region3 + this.form.xxarrive
                    this.address.id = id;
                    const {code} = await modifyAddressById(this.address);
                    if (code === "200"){
                        alert("修改成功");
                        window.location="/esay_buy_pages/member/Member_Address.html"
                    }

                }else{
                    console.log("校验不通过")
                }
            })
        },
        async resetForm(){
            this.form=[];
            await this.getAreaByGaoDe();
        },
        async getAddressById(){
            const {code,data} = await getAddressById(id);
            if (code ==='200'){
                this.address= data
                this.form.region1 = data.province;
                this.form.region2 = data.city;
                this.form.region3 = data.county;
                this.form.xxarrive = data.detailed;
                this.form.consignee = data.consignee;
                this.form.tel = data.tel;
            }
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
        },
        async handleLoginOut() {
            const {code} = await loginOut()
            if (code === '200') {
                this.loginName = null
                this.message('用户注销成功', 'success')
            } else {
                this.message('用户注销失败', 'error')
            }
        },

    },
    mounted: async function () {
        await this.getAreaByGaoDe();
        await this.getAddressById();
        this.loginName = readCookie('loginName')
        this.type = readCookie('type')
    }


})