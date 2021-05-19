<template>
  <div style="position: relative" class="wraper">
    <IndexNavMenu></IndexNavMenu>
    <!--    {{keyword}}-->
    <div style="display: inline-block;position: relative; margin-left: 500px;margin-top: 20px">
      <span style="align-items: center">
      <el-input style="width: 500px" v-model="keyword" type="textarea" autosize></el-input>
      <el-button style="padding: 0;height: 28px;width: 60px" type="primary" icon="el-icon-search"
                 @click="searchArticle" :loading="status">搜索</el-button>
      </span>
    </div>
    <div style="margin-left: 200px;width: 800px">
      <ul>
        <li v-for="item in article" :key="item.article.id" style="position: relative;margin-top: 10px;">
          <a :href="'http://localhost:8888/user?userId=' + item.user.id" class="">
            <el-avatar :size="50" :alt="item.user.name"
                       :src="item.user.avatar"></el-avatar>
          </a>
          <h2 style="display: inline-block;position: absolute;margin-top: 10px">
            <el-tag type="success">{{ item.category }}</el-tag>
            <el-link style="font-size: 13px" @click="goArticle(item.article.id)">{{
                item.article.title
              }}
            </el-link>
          </h2>
          <div class="list-info" style="position: relative;margin-top: 10px">
            <el-row style="font-size: 13px">
              <el-col :span="2">
                <a href="http://www.baidu.com" style="text-decoration: none;color:#999">{{ item.user.name }}</a>
              </el-col>
              <el-col :span="6" style="text-decoration: none;color:#999">
                {{ item.createTime }}
              </el-col>
              <el-col :offset="15" :span="1">
                <i class="el-icon-chat-dot-square"></i>{{ item.article.commentCount }}
                <!--                <span style="color: #E6A23C;font-size: 14px">{{ item.article.commentCount }}</span>评论-->
              </el-col>
            </el-row>
          </div>
          <div v-html="item.article.content" style="max-height: 400px;overflow: scroll">
          </div>
        </li>
      </ul>
    </div>
    <div class="dibu">
      <el-pagination
        background
        layout="prev, pager, next" :hide-on-single-page="false"
        :total="total" :page-size="5" @current-change="pageChange" style="margin-top: 40px;margin-left: 200px">
        <!--@prev-click="prev" @next-click="next"-->
      </el-pagination>
    </div>
    <template>
      <el-backtop target=".wraper">UP</el-backtop>
    </template>

  </div>

</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';

export default {
  name: "SearchArticle",
  components: {IndexNavMenu},
  data() {
    return {
      keyword: '',
      total: 10,
      article: '',
      status:false
    }
  },
  methods: {
    searchArticle() {
      console.log("keyword" + this.keyword);
      let that = this;
      let keyword = that.keyword;
      if(keyword == '') {
        that.$message.error("搜索词不能为空");
        return;
      }
      that.status = true;
      axios.get('http://localhost:8889/searchArticle', {
        params: {
          keyword: keyword,
          pageNo: 0,
          pageSize: 5
        }
      }).then(function (response) {
        console.log(response.data);
        that.total = response.data.data.total;
        that.article = response.data.data.article;
        that.status = false;
        if(that.total ==0) {
          that.$message.error("没有找到包含该关键词的帖子");
        }
      }).catch(function (error) {
        console.log(error);
        that.$message.error(error);
        that.status=false;
      })
    },
    pageChange(currentPage) {
      let that = this;
      this.updateArticle(currentPage - 1, 5);
    },
    updateArticle(pageNo, pageSize) {
      let that = this;
      let keyword = that.keyword;
      axios.get('http://localhost:8889/searchArticle', {
        params: {
          keyword: keyword,
          pageNo: pageNo,
          pageSize: pageSize
        }
      }).then(function (response) {
        console.log(response.data);
        that.total = response.data.data.total;
        that.article = response.data.data.article;
      }).catch(function (error) {
        console.log(error);
      })
    },
    goArticle(articleId) {
      this.$router.push({
        path: '/article',
        query: {
          articleId: articleId
        }
      })
    }
  },
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.updateArticle(0, 5);
  }
}
</script>

<style>
ul, li {
  list-style-type: none;
}

.wraper {
  height: 100vh;
  overflow-x: hidden;
}

</style>
