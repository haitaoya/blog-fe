<template>
    <!-- <div  style="width:50%"> -->
    <div class="page_size">
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
        <el-button @click="resetDateFilter">清除日期过滤器</el-button>
        <el-button @click="clearFilter">清除所有过滤器</el-button>
        <el-table
            ref="filterTable"
            stripe
            :data="tableData"
            @filter-change="handleFilterChange"
            style="width: 100%"
        >
            <el-table-column
                prop="crtTm"
                label="创建日期"
                sortable
                width="200"
                column-key="crtTm"
                :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
                :filter-method="filterHandler"
            ></el-table-column>
            <el-table-column prop="userNam" label="姓名" width="180"></el-table-column>
            <el-table-column prop="telNo" label="TEL" :formatter="formatter"></el-table-column>
            <el-table-column
                prop="sex"
                label="性别"
                width="100"
                column-key="sex"
                :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.sex === '男' ? 'primary' : 'success'"
                        disable-transitions
                    >{{scope.row.sex}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <login-footer></login-footer>
    </div>
</template>
 
<script>
import LoginFooter from "@/components/common/Footer.vue";
import userApi from "../../api/admin";
// import axios from 'axios'
export default {
    name: "AppLogin",
    // blogHeader、blogFooter组件给申明到components里面然后在template里面使用
    components: { LoginFooter },
    data() {
        return {
            tableData: [],
            respRes: [],
            validate: false,
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
        this.findAllUser();
    },
    methods: {
        findAllUser() {
            userApi
                .toFindAllUser()
                .then((resp) => {
                    this.respRes = resp.data.message;
                    if (resp.data.code === 200) {
                        this.openS();
                        this.tableData=resp.data.data;
                    } else {
                        this.openF();
                    }
                })
                .catch((fResp) => {
                    this.respRes = fResp.message;
                    this.openF();
                });
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
        resetDateFilter() {
            this.$refs.filterTable.clearFilter("date");
        },
        clearFilter() {
            this.$refs.filterTable.clearFilter();
        },
        formatter(row) {
            return row.telNo;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        handleFilterChange(filters) {
            for (var key1 in filters) {
                console.log(key1); //获取key值 可用来判断过滤的列
            }
            console.log(filters);
            console.log("筛选条件变化");
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
