<template>
  <div style="position: relative">
    <IndexNavMenu></IndexNavMenu>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick"
             style="position: absolute;width: 800px;margin-top: 20px;margin-left: 180px;">
      <el-tab-pane label="帖子" style="padding: 15px" name="first">
        <el-tabs>
          <el-tab-pane label="帖子列表">

            <ul>
              <li v-for="item in article" :key="item.article.id" style="position: relative;margin-top: 10px;">
                <a :href="'http://localhost:8888/user?userId=' + item.user.id" class="">
                  <el-avatar :size="50" :alt="item.user.name"
                             :src="item.user.avatar"></el-avatar>
                </a>
                <h2 style="display: inline-block;position: absolute;margin-top: 10px">
                  <el-tag type="success">{{ item.category }}</el-tag>
                  <el-tag type="danger" style="border: 0" v-if="item.article.priority===1">置顶</el-tag>
                  <el-link @click="goArticle(item.article.id)">{{
                      item.article.title
                    }}
                  </el-link>
                </h2>
                <div class="list-info" style="position: relative;margin-top: 10px">
                  <el-row>
                    <el-col :span="1">
                      <a :href="'http://localhost:8888/user?userId=' + item.user.id" style="text-decoration: none;color:#999">{{ item.user.name }}</a>
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
      </el-tab-pane>
      <el-tab-pane label="个人中心" style="padding: 15px" name="second"></el-tab-pane>
      <el-tab-pane label="我的发布" style="padding: 15px" name="third"></el-tab-pane>
    </el-tabs>

    <div style="display: inline-block;position: absolute; margin-left: 1000px;margin-top: 20px">
      <el-input style="width: 200px;" v-model="keyword"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchArticle">搜索</el-button>
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

    <div style="position: absolute;margin-left: 900px;margin-top: 98px">
      <el-breadcrumb separator="|">
        <!--        <el-breadcrumb-item><span @click="changeToNew">最新</span></el-breadcrumb-item>-->
        <!--        <el-breadcrumb-item><span @click="changeToHot">最热</span></el-breadcrumb-item>-->
        <el-breadcrumb-item>
          <el-button type="text" :disabled="sort==0" @click="changeToNew" title="按最新排序">最新</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-button type="text" :disabled="sort==1" @click="changeToHot" title="按热度排序">最热</el-button>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="ql-editor" style="padding: 0;width: 372px;height: 300px;position: absolute;margin-left: 1200px;margin-top: 100px" v-html="notice">

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
      keyword: '',
      notice: '',
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
      if (tab.name == "second") {
        this.toMyPage()
      }
      if (tab.name == "third") {
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
    searchArticle() {
      console.log("keyword" + this.keyword);
      let tempKeyword = this.keyword;
      this.keyword = '';
      console.log("keyword" + this.keyword);
      this.$router.push({
        path: '/searchArticle',
        query: {
          keyword: tempKeyword
        }
      })
    },
    getNotice(){
      let that = this;
      axios.get('http://localhost:8889/getNotice').then(function (response){
        that.notice = response.data.data.content;
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
        axios.get("http://localhost:8889/getArticleByHot", {
          params: {
            categoryId: categoryId,
            pageNo: currentPage - 1,
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
      }
    },
    getArticleByHot() {
      console.log("按热度")
      let that = this;
      axios.get("http://localhost:8889/getArticleByHot", {
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
    changeToNew() {
      console.log("new");
      this.sort = 0;
      this.getArticleByTime();
    },
    changeToHot() {
      console.log("hot")
      this.sort = 1;
      this.getArticleByHot();
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
        axios.get("http://localhost:8889/getArticleByHot", {
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
      }
    }
  },
  created() {
    this.getAllArticleCategory();
    this.getArticleByTime();
    this.getNotice();
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
