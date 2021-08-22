<template>
    <!-- <div  style="width:50%"> -->
    <div class="page_size">
        <login-header></login-header>

        <el-backtop :bottom="50">
            <div
                style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
            >UP</div>
        </el-backtop>

        <el-form
            id="loginForm"
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            class="form_size"
        >
            <el-form-item prop="username">
                <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    prefix-icon="el-icon-user"
                >></el-input>
            </el-form-item>
            <el-form-item prop="password" >
                <el-input
                    type="password"
                    v-model="loginForm.password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-date"
                ></el-input>
            </el-form-item>
            <el-form-item prop="seccode" class="inputbar" >
                <el-input
                    class="log-input"
                    v-model="loginForm.seccode"
                    placeholder="验证码"
                    prefix-icon="el-icon-goods"
                    @keydown.enter.native="login('loginForm')"
                ></el-input>
                <span class="checkCode" @click="createCode">{{ checkCode}}</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login('loginForm')" icon="el-icon-check">立即登陆</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
<form>
      <input type="file" @change="getFile($event)">
      <button class="button button-primary button-pill button-small" @click="submit($event)">提交</button>
    </form>

        <login-footer></login-footer>
    </div>
</template>

<script>
import LoginHeader from "@/components/common/Header.vue";
import LoginFooter from "@/components/common/Footer.vue";
import loginApi from "../../api/admin";
import axios from 'axios'
export default {
    name: "AppLogin",
    // blogHeader、blogFooter组件给申明到components里面然后在template里面使用
    components: { LoginHeader, LoginFooter },
    data() {
        return {
            loginInfoVo: { username: "", password: "" },
            respRes: [],
            validate: false,
            loginForm: {
                username: "",
                password: "",
                seccode: "",
                // date1: "",
                // date2: "",
                // delivery: false,
                // type: [],
                // resource: "",
                // desc: "",
            },
            checkCode: "",
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                ],
                seccode: [
                    { required: true, message: "请输验证码", trigger: "blur" },
                ],
            },
        };
    },
    mounted() {
        this.createCode();
    },
    methods: {
        getFile: function (event) {
        this.file = event.target.files[0];
        console.log(this.file);
      },
      submit: function (event) {
        //阻止元素发生默认的行为
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("responseType","blob");
        axios({ // 用axios发送post请求
          method: 'post',
          url: 'http://localhost:8888/upload', // 请求地址
          data: formData, // 参数
          responseType: 'blob' // 表明返回服务器返回的数据类型
        })
        // axios.post('http://localhost:8888/upload', formData)
          .then(function (response) {
            console.log(response.status);
            if(response.status == 200 && response.data){
                console.log(response);
                console.log(response.headers['content-type']);
                if(response.headers['content-type'] == 'application/json' ){
                    let reader = new FileReader(); // 创建读取文件对象
                    reader.addEventListener("loadend", function () { // 
                    let res = JSON.parse(reader.result); // 返回的数据
                        console.log(res,'返回结果数据') // { name: "小明" }
                        alert(res['message'])
                    });
                    reader.readAsText(response.data, 'utf-8'); // 设置读取的数据以及返回的数据类型为utf-8    
                }else{
                    // alert(response.data);
                    console.log(response);
                    alert("处理失败，请查看结果excel")
                    var blob = new Blob([response.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                    //创建下载地址以及a标签,并且模拟a标签的点击事件进行下载文件。
                    var url = window.URL.createObjectURL(blob);
                    var aLink = document.createElement("a");
                    aLink.style.display = "none";
                    aLink.download = '标记颜色.xlsx';
                    aLink.href = url;
                    document.body.appendChild(aLink)
                    aLink.click()
                }    
            }     
          })
          .catch(function (error) {
            alert(error+'error');
            console.log(error);
            // window.location.reload();
          });
      },

        login() {
            this.$refs.loginForm.validate((result) => {
                if (!result) {
                    this.validate = false;
                } else {
                    this.validate = true;
                }
            });

            if (!this.validate || this.loginForm.seccode != this.checkCode) {
                this.respRes = "表单填写有误!请检测表单";
                this.openF();
                this.createCode();
                return false;
            }
            loginApi
                .toLogin(this.loginForm)
                .then((resp) => {
                    this.respRes = resp.data.message;
                    if (resp.data.code === 200) {
                        this.openS();
                        this.$router.replace({ path: "/index" });
                    } else {
                        this.openF();
                    }
                })
                .catch((fResp) => {
                    this.respRes = fResp.message;
                    this.openF();
                });
            this.createCode();
        },
        onSubmit() {
            console.log("submit!");
        },
        openS() {
            const h = this.$createElement;

            this.$notify({
                title: "登陆成功",
                message: h("i", { style: "color: teal" }, this.respRes),
            });
        },

        openF() {
            this.$notify({
                title: "登陆失败",
                message: this.respRes,
                duration: 0,
            });
        },
        createCode() {
            let code = "";
            const codeLength = 4; //验证码的长度
            const random = new Array(
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z"
            ); //随机数
            for (let i = 0; i < codeLength; i++) {
                //循环操作
                let index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
                code += random[index]; //根据索引取得随机数加到code上
            }
            this.checkCode = code; //把code值赋给验证码
        },
    },
};
</script>
<style>
.page_size {
    width: 50%;
    margin: 0 auto;
}
.form_size {
    width: 30%;
    margin: 0 auto;
    font-size: 16px;
}
.form_size .el-input__inner {
    border-radius: 15px;
    margin: 0 auto;
    /* background-color: rgba(75, 61, 61, 0.192);
    color: #0946f0; */
}

.checkCode {
    position: absolute;
    margin-left: -50px;
    color: rgb(57, 221, 213);
}
</style>
