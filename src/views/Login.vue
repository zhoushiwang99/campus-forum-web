<template>
  <div>
    <NavMenu></NavMenu>
    <div class="ele-container ele-margin">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini" status-icon>
        <el-form-item label="学校" prop="university">
          <el-select v-model="ruleForm.university" placeholder="请选择学校" style="width: 200px">
            <el-option v-for="item in university" :key="item.id" :label="item.universityName"
                       :value="item.universityName"></el-option>
            <!--                        <el-option label="长沙理工大学" value="长沙理工大学"></el-option>-->
            <!--                        <el-option label="中南大学" value="中南大学"></el-option>-->
            <!--                        <el-option label="湖南大学" value="湖南大学"></el-option>-->
          </el-select>

        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" style="width: 200px"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" style="width: 200px"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="validateCode">
          <el-input placeholder="单击图片刷新" v-model="ruleForm.validateCode" style="width: 110px;height:45px"></el-input>
        </el-form-item>
        <el-form-item>
          <img class="captcha-img pointer" :src="imgurl" width="200px" height="45px" alt="验证码"
               @click="changeCaptchaCode"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import NavMenu from "../components/NavMenu";
import axios from "axios";
import qs from 'qs';
export default {
  name: "Login",
  components: {NavMenu},
  data() {

    return {
      ruleForm: {
        username: '',
        password: '',
        validateCode: '',
        university: ''
      },
      university: '',
      imgurl: 'http://localhost:8889/getValidateCode',

      rules: {
        university: [
          {required: true, message: '请选择学校', trigger: 'change'}
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 12, max: 12, message: '用户名长度必须为12', trigger: 'blur'}
        ],
        password: [
          {required: true, message: "请输入密码"},
          {min: 8, max: 16, message: '密码长度需在8到16之间'}
        ],
        validateCode: [
          {required: true, message: '请输入验证码'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("登录")
          var that = this;
          axios.post('http://localhost:8889/login', qs.stringify({
            account: this.ruleForm.username,
            password: this.ruleForm.password,
            universityName: this.ruleForm.university,
            inputValidateCode: this.ruleForm.validateCode
          })).then(function (response) {
            // if()
            console.log(response.data);
            if(response.data.code !== 200) {
              that.$message.error(response.data.msg);
              console.log("错误")
            }
            else{
              that.$message({
                message: '登录成功',
                type: 'success'
              });
              sessionStorage.clear();
              sessionStorage.setItem("token",response.data.data.token);
              sessionStorage.setItem("user",response.data.data.user);
            }
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeCaptchaCode() {
      console.log("点击刷新验证码")
      var num = Math.ceil(Math.random() * 10);//生成一个随机数（防止缓存）
      this.imgurl = "http://localhost:8889/getValidateCode?" + num;
    },
    getUniverSity() {
      var that = this;
      axios.get("http://localhost:8889/getAllUniversity").then(function (response) {
        that.university = response.data.data;
      }).catch(function (error) {
        console.log(error);
      })
    }
  },
  created() {
    this.getUniverSity();
  }
}
</script>
<link rel="stylesheet" href="./static/css/style.css">


<style>

</style>
