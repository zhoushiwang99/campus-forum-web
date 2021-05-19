<template>
  <div style="position: relative">
    <IndexNavMenu></IndexNavMenu>
    <div>
      <div
        style="width: 200px;height: 600px;position: absolute;margin-top: 20px;margin-left: 200px;display: inline-block">
        <el-menu
          style="width: 200px;height: 600px"
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1" @click="toMyPage">
            <i class="el-icon-s-home"></i>
            <span slot="title">我的主页</span>
          </el-menu-item>
          <el-menu-item index="2" @click="personCenter">
            <i class="el-icon-s-custom"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
          <el-menu-item index="3" @click="basicSet">
            <i class="el-icon-setting"></i>
            <span slot="title">基本设置</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div v-if="two" style="display: inline-block;width: 900px;height: 250px;margin-left: 420px;margin-top: 18px">
        <el-tabs value="first">
          <el-tab-pane label="我发布的信息" name="first">
            <ul>
              <li v-for="item in article">
                <el-row>
                  <el-col :span="6">
                    <el-link style="margin-top: 12px;color: #F56C6C"
                             :href="'http://localhost:8888/article?articleId=' + item.article.id" target="_blank">
                      {{ item.article.title }}
                    </el-link>
                  </el-col>
                  <el-col :span="10" style="color: #999;font-size: 12px">
                    <p style="margin-top: 12px;">{{ item.createTime }}</p>
                  </el-col>
                  <el-col :span="2" style="color: #999;font-size: 12px">
                    <p style="margin-top: 12px;">{{ item.article.commentCount }}评论</p>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="three" style="display: inline-block;width: 900px;height: 250px;margin-left: 420px;margin-top: 18px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的资料" name="first">
            <el-form label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="user.account" style="width: 200px;color: black" readonly></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="user.name" style="width: 200px;color: black" readonly></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio v-model="sex" label="男">男</el-radio>
                <el-radio v-model="sex" label="女">女</el-radio>
              </el-form-item>
              <el-form-item label="个性签名">
                <el-input type="textarea" v-model="signature"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="userSet" :loading="setButtonStatus">确认修改</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="设置头像" name="second">
            <!--            <div style="position: relative;margin-left: 100px;">-->
            <!--              <el-upload-->
            <!--                drag="true"-->
            <!--                action="http://localhost:8889/uploadAvatar"-->
            <!--                :headers=""-->
            <!--                auto-upload="true"-->
            <!--                multiple="false">-->
            <!--                <i class="el-icon-upload"></i>-->
            <!--                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
            <!--                <div class="el-upload__tip" slot="tip" style="padding-left: 100px">只能上传jpg/jpeg/png文件</div>-->
            <!--              </el-upload>-->
            <!--            </div>-->
            <div style="position: relative;margin-left: 100px;">
              <el-upload
                action="string"
                :drag="true"
                :auto-upload="true"
                :multiple="false" :http-request="uploadAvatar" :show-file-list="false" accept=".jpg,.jpeg,.png">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip" style="padding-left: 100px">只能上传jpg/jpeg/png文件</div>
              </el-upload>
            </div>

            <div style="position: relative;margin-left: 180px;">
              <el-avatar :size="170" :src="user.avatar"></el-avatar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';

export default {
  name: "UserSet",
  inject: ['reload'],
  components: {IndexNavMenu},
  data() {
    return {
      two: true,
      three: false,
      user: '',
      article: '',
      activeName: 'first',
      sex: '男',
      signature: '',
      setButtonStatus: false,
      token: ''
    }
  },
  methods: {
    getUserById() {
      let that = this;
      axios.get('http://localhost:8889/getUserById', {
        params: {
          userId: that.user.id
        }
      }).then(function (response) {
        console.log(response)
        // that.user = response.data.data.user;
        that.article = response.data.data.article;
        that.regTime = response.data.data.regTime;
      })
    },
    toMyPage() {
      this.$router.push({
        path: '/user',
        query: {
          userId: this.user.id
        }
      })
    },
    personCenter() {
      console.log("two");
      this.two = true;
      this.three = false;
    },
    basicSet() {
      console.log("three");
      this.two = false;
      this.three = true;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    userSet() {
      this.setButtonStatus = true;
      let that = this;
      let token = sessionStorage.getItem("token");
      axios.post('http://localhost:8889/alertUserInfo', qs.stringify({
          gender: that.sex,
          signature: that.signature
        }
        ), {
          headers: {
            token: token
          }
        }
      ).then(function (response) {
        console.log(response.data);
        if (response.data.code == '200') {
          that.$message({
            message: '修改成功',
            type: 'success'
          });
          sessionStorage.setItem("user", JSON.stringify(response.data.data));
          that.user = response.data.data;
          that.sex = that.user.gender;
          that.signature = that.user.signature;
          that.setButtonStatus = false;
        } else {
          alert(alert(response.data.msg));
        }
      })
    },
    cancel() {
      this.reload();
    },
    uploadAvatar(param) {
      let that = this;
      let formData = new FormData();
      formData.append('avatar', param.file);
      axios.post('http://localhost:8889/uploadAvatar', formData, {
        headers: {
          token: that.token
        }
      }).then(function (response) {
        console.log(response);
        if(response.data.code == 200){
          sessionStorage.setItem("user",JSON.stringify(response.data.data))
          that.user = response.data.data
          that.$message({
            message: '修改成功',
            type: 'success'
          });
          that.reload();
        }else {
          that.$message({
            message: response.data.msg,
            type: 'error'
          });
        }

      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted() {
    let userJson = JSON.parse(sessionStorage.getItem("user"));
    let token = sessionStorage.getItem("token");
    console.log(userJson);
    console.log(userJson.id);
    this.sex = userJson.gender;
    this.token = token;
    // if (userJson.gender == '男') {
    //   this.sex = '男';
    // } else {
    //   this.sex = '女'
    // }
    this.signature = userJson.signature;
    this.user = userJson;
    this.getUserById();
  }
}
</script>

<style>

</style>
