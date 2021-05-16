<template>
  <div style="position: relative">
    <IndexNavMenu></IndexNavMenu>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick"
             style="position: absolute;width: 800px;margin-top: 20px;margin-left: 180px;">
      <el-tab-pane label="帖子" style="padding: 15px" name="first" >
        <el-tabs>
          <el-tab-pane label="帖子列表">

            <ul>
              <li v-for="item in article" :key="item.article.id" style="position: relative;margin-top: 10px;">
                <a href="http://www.baidu.com" class="">
                  <el-avatar :size="50" :alt="item.user.name"
                             :src="item.user.avatar"></el-avatar>
                </a>
                <h2 style="display: inline-block;position: absolute;margin-top: 10px">
                  <el-tag type="success">{{ item.category }}</el-tag>
                  <!--                  <el-link :href="'http://localhost:8888/article/' + item.article.id " @click="this.$router.push({name:'',params:{id:item.article.id}})" target="_blank">{{
                                        item.article.title
                                      }}
                                    </el-link>-->
                  <el-link @click="goArticle(item.article.id)">{{
                      item.article.title
                    }}
                  </el-link>
                </h2>
                <div class="list-info" style="position: relative;margin-top: 10px">
                  <el-row>
                    <el-col :span="1">
                      <a href="http://www.baidu.com" style="text-decoration: none;color:#999">{{ item.user.name }}</a>
                    </el-col>
                    <el-col :offset="1" :span="6">
                      {{ item.createTime }}
                    </el-col>
                    <el-col :offset="13" :span="1">
                      <i class="el-icon-chat-dot-square"></i>{{ item.article.commentCount }}
                    </el-col>
                  </el-row>


                </div>
              </li>
            </ul>


            <div>
              <el-pagination
                background
                layout="prev, pager, next" :hide-on-single-page="false"
                :total="total" :page-size="5" @current-change="pageChange"><!--@prev-click="prev" @next-click="next"-->
              </el-pagination>
            </div>


          </el-tab-pane>

        </el-tabs>
        <!--        <div style="position: absolute;margin-top: -67%;margin-left: 10%">-->
        <!--        <div style="float: left;position:relative;margin-top: -544px;margin-left: 90px;">-->
        <!--        <div style="">
                  <el-form label-width="80px" style="position: relative;display: inline-block">
                    <el-form-item label="选择分类">
                      <el-select v-model="form.region" placeholder="综合" style="width: 100px;" @change="changeCategory">
                        <el-option label="综合" value=""></el-option>
                        <el-option v-for="item in articleCategory" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>-->
      </el-tab-pane>
      <el-tab-pane label="个人中心" style="padding: 15px" name="second" ></el-tab-pane>
      <el-tab-pane label="我的发布" style="padding: 15px" name="third" ></el-tab-pane>
    </el-tabs>

    <div style="display: inline-block;position: absolute; margin-left: 1000px;margin-top: 20px">
      <el-input style="width: 200px;"></el-input>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="toAddArticlePage">发表新帖</el-button>
    </div>

    <div style="position: absolute;margin-left: 290px;margin-top: 88px">
      <el-form label-width="80px" style="position: relative;display: inline-block">
        <el-form-item label="选择分类">
          <el-select v-model="form.region" placeholder="综合" style="width: 100px;" @change="changeCategory">
            <el-option label="综合" value="0"></el-option>
            <el-option v-for="item in articleCategory" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div style="position: absolute;margin-left: 900px;margin-top: 110px">
      <el-breadcrumb separator="|">
        <el-breadcrumb-item><a href="/">最新</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">最热</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

  </div>
</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';


export default {
  name: "index",
  components: {IndexNavMenu},
  data() {
    return {
      activeName: 'first',
      articleCategory: '',
      form: {
        region: '0'
      },
      sort: 0,
      total: 0,
      currentPageNo: 1,
      article: ''
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      if(tab.name == "second") {
        this.toMyPage()
      }
      if(tab.name == "third") {
        this.toMyPublish()
      }
    },
    goArticle(articleId) {
      this.$router.push({
        path: '/article',
        query: {
          articleId: articleId
        }
      })
    },
    getAllArticleCategory() {
      var that = this;
      axios.get("http://localhost:8889/getAllCategory").then(function (response) {
        console.log(response.data.data)
        that.articleCategory = response.data.data;
      }).catch(function (error) {
        console.log(error);
      })
    },
    getArticleByTime() {
      let that = this;
      axios.get("http://localhost:8889/getArticleByTime", {
        params: {
          categoryId: '',
          pageNo: '',
          pageSize: ''
        }
      }).then(function (response) {
        console.log(response.data)
        that.total = response.data.data.total;
        that.article = response.data.data.article;
        console.log(that.total)
      }).catch(function (error) {
        console.log(error);
      })
    },
    prev(currentPage) {
      console.log(currentPage)
    },
    next(currentPage) {
      console.log(currentPage)
    },
    pageChange(currentPage) {
      let that = this;
      let categoryId;
      if (this.form.region == "综合") {
        categoryId = '';
      } else {
        categoryId = this.form.region;
      }

      if (that.sort === 0) {
        console.log("按最新")
        axios.get("http://localhost:8889/getArticleByTime", {
          params: {
            categoryId: categoryId,
            pageNo: currentPage,
            pageSize: ''
          }
        }).then(function (response) {
          console.log(response.data)
          that.total = response.data.data.total;
          that.article = response.data.data.article;
          console.log(that.total)
        }).catch(function (error) {
          console.log(error);
        })
      } else {
        console.log("按热度")
      }
    },
    toMyPage() {
      let me = JSON.parse(sessionStorage.getItem("user"));
      this.$router.push({
        path: '/user',
        query: {
          userId: me.id
        }
      })
    },
    toMyPublish() {
      this.$router.push({
        path: '/userSet'
      })
    },
    toAddArticlePage() {
      this.$router.push({
        path: '/addArticle'
      })
    },
    changeCategory() {
      let categoryId;
      if (this.form.region == "综合") {
        categoryId = '';
      } else {
        categoryId = this.form.region;
      }
      let that = this;
      if (that.sort === 0) {
        console.log("按最新")
        axios.get("http://localhost:8889/getArticleByTime", {
          params: {
            categoryId: categoryId,
            pageNo: '',
            pageSize: ''
          }
        }).then(function (response) {
          console.log(response.data)
          that.total = response.data.data.total;
          that.article = response.data.data.article;
          console.log(that.total)
        }).catch(function (error) {
          console.log(error);
        })
      } else {
        console.log("按热度")
      }
    }
  },
  created() {
    this.getAllArticleCategory();
    this.getArticleByTime();
  }
}
</script>

<style>
.list-info {
  position: relative;
  font-size: 13px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
