<template>
  <div style="position: relative;">
    <IndexNavMenu></IndexNavMenu>

    <div>
      <el-avatar style="position: relative;margin-left: 800px;margin-top: 50px;padding: 0" :size="150"
                 :src="user.avatar"></el-avatar>
      <div style="position: absolute;margin-left: 734px;width: 300px">
        <p style="position: relative;font-size: 16px;text-align: center">{{ user.name }}</p>
        <p style="color: #E6A23C;position: relative;font-size: 16px;text-align: center;"><i
          class="el-icon-pie-chart"></i>{{ regTime }}加入</p>
        <p style="color: #409EFF;position: relative;font-size: 16px;text-align: center;">个性签名:{{ user.signature }}</p>
      </div>
    </div>
    <div style="position: absolute;margin-top: 160px;margin-left:260px;font-size: 14px;width: 800px">
      <p>{{ user.name }}&nbsp;&nbsp;&nbsp;最近发的信息:</p>
      <ul>
        <li v-for="item in article">
          <el-row>
            <el-col :span="6">
              <el-link style="margin-top: 12px;" type="primary" :href="'http://localhost:8888/article?articleId=' + item.article.id" >{{item.article.title}}</el-link>
            </el-col>
            <el-col :span="10" style="color: #999">
              <p style="margin-top: 12px;">{{item.createTime}}</p>
            </el-col>
            <el-col :span="2" style="color: #999;font-size: 12px">
              <p style="margin-top: 12px;">{{item.article.commentCount}}评论</p>
            </el-col>
          </el-row>
        </li>
      </ul>

    </div>

  </div>
</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';


export default {
  name: "User",
  components: {IndexNavMenu},
  data() {
    return {
      userId: '',
      user: '',
      article: '',
      regTime: ''
    }
  },
  methods: {
    getUserById() {
      let that = this;
      axios.get('http://localhost:8889/getUserById', {
        params: {
          userId: that.userId
        }
      }).then(function (response) {
        console.log(response)
        that.user = response.data.data.user;
        that.article = response.data.data.article;
        that.regTime = response.data.data.regTime;
      })

    }
  },
  mounted() {
    this.userId = this.$route.query.userId;
    this.getUserById();
  }
}
</script>

<style >
li {
  list-style-type: none;
}
</style>
