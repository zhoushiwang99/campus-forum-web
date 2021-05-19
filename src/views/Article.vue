<template>
  <div style="position: relative">
    <IndexNavMenu></IndexNavMenu>
    <div style="position: relative;margin-left: 200px;margin-top: 50px;">
      <h1 style="display: inline-block">{{ article.title }}</h1>
      <el-button style="display: inline-block;margin-left: 30px" type="danger" size="mini" :plain="true"
                 @click="delArticle" v-if="canDel()">删除此贴
      </el-button>
      <el-button style="display: inline-block;margin-left: 30px" type="danger" size="mini" :plain="true"
                 @click="updateArticle" v-if="canDel()">修改此贴
      </el-button>
      <div class="detail-about" style="position: relative;margin-top: 10px">
        <div style="width: 60px;height: 60px;display: inline-block">
          <a href="http://www.baidu.com">
            <el-avatar :size="50" :alt="author.name"
                       :src="author.avatar"></el-avatar>
          </a>
        </div>
        <div style="display: inline-block;position: absolute;margin-left: 40px;height: 100px;width: 300px">
          <el-row>
            <el-col :span="6">
              <a href="http://www.baidu.com"
                 style="text-decoration: none;color:#409EFF;height: 15px;line-height:0">{{ author.name }}</a>
            </el-col>
            <el-col :offset="1" :span="17">
              <p style="margin: 0">{{ createTime }}</p>
            </el-col>
          </el-row>
          <el-row>
            <p style="color: #F56C6C">个性签名：{{ author.signature }}</p>
          </el-row>
        </div>

      </div>
      <div v-html="article.content"></div>
    </div>
    <div style="position: relative;margin-top: 50px;">
      <el-divider content-position="center"><span style="font-size: 18px">评论</span></el-divider>
    </div>
    <!--    <div style="position: relative;margin-top: 30px;">-->
    <div class="detail-about">
      <ul>
        <!--        {{comment}}-->
        <li v-for="item in comment" :key="item.comment.id">
          <!--          {{ item }}-->
          <div style="position: relative;margin-top: 20px;margin-left: 180px;display: inline-block">
            <a href="http://www.baidu.com">
              <el-avatar :size="50" :alt="item.fromUser.name"
                         :src="item.fromUser.avatar"></el-avatar>
            </a>
          </div>
          <div style="display: inline-block;position: absolute;margin-left: 30px;margin-top: 25px">
            <el-row>
              <a href="http://www.baidu.com"
                 style="text-decoration: none;color:#409EFF;height: 15px;line-height:0">{{ item.fromUser.name }}</a>
              <el-button
                style="display: inline-block;margin-left: 30px;padding:3px;font-size: 12px;width: 30px;height: 18px"
                type="danger" size="mini" :plain="true" @click="delComment(item.comment.id)"
                v-if="canDelComment(item.fromUser.id)">删除
              </el-button>
            </el-row>
            <el-row>
              <p style="margin: 0;color: #999">{{ createTime }}</p>
            </el-row>
          </div>
          <div v-html="item.comment.content" style="position: relative;margin-left: 200px">

          </div>
        </li>
      </ul>

    </div>
    <div style="position: absolute;margin-left: 200px;margin-top: 80px;height: 400px" class="VueQuillEditor">
      <quill-editor ref="myQuillEditor"
                    :content="content"
                    :options="editorOption"
                    @change="onEditorChange($event)">

      </quill-editor>
      <!--      <el-button type="primary" @click="onSubmit" :loading="pubStatus">评论</el-button>-->
      <el-button type="primary" @click="onSubmit">发表评论</el-button>
      <!--      <el-button type="primary" @click="onDelete" v-if="Math.random() >　0.5">删除</el-button>-->
    </div>
    <div style="height: 600px">

    </div>
  </div>
</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';

import {quillEditor} from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  inject: ['reload'],
  name: "Article",
  components: {IndexNavMenu, quillEditor},
  data() {
    return {
      articleId: '',
      category: '',
      comment: '',
      pubStatus: false,
      isMe: false,
      isAdmin: false,
      article: '',
      me: '',
      admin: false,
      token: '',
      author: '',
      content: '',
      createTime: '',
      editorOption: {
        // theme: 'snow',
        placeholder: '请输入帖子内容',
        modules: {
          toolbar: {
            // 配置工具栏，此次引入了全部工具栏，也可自行配置
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{list: "ordered"}, {list: "bullet"}]
            ]
          }
        }
      }
    };
  },
  methods: {
    getArticleById() {
      let that = this;
      let articleId = this.articleId;
      console.log("参数" + articleId)

      axios.get("http://localhost:8889/getArticleById", {
        params: {
          articleId: articleId
        }
      }).then(function (response) {
        console.log("返回成功")
        console.log(response.data)
        that.category = response.data.data.category;
        that.article = response.data.data.article;
        that.author = response.data.data.user;
        that.createTime = response.data.data.createTime;
      })
    },
    canUpdate(){
      if (this.me.id == this.author.id) {
        console.log(this.me.id);
        console.log(this.author.id);
        this.isMe = true;
      } else {
        this.isMe = false;
      }
      return this.isMe;
    },
    updateArticle(){
      this.$router.push({
        path: '/updateArticle',
        query: {
          articleId: this.articleId
        }
      })
    },
    onSubmit() {
      let that = this;
      let content = that.content;
      that.pubStatus = true;
      let token = sessionStorage.getItem("token");
      if (content == null || content.length <= 0) {
        this.$message.error("正文内容不得为空");
        this.pubStatus = false;
        return;
      }
      axios.post('http://localhost:8889/addComment', qs.stringify({
        articleId: that.articleId,
        content: that.content,
        commentId: ''
      }), {
        headers: {
          token: token
        }
      }).then(function (response) {
        console.log(response.data);
        if (response.data.code === 200) {
          console.log("发表评论成功")
          that.$message({
            type: 'success',
            message: `发表评论成功`
          });
          that.pubStatus = false;
          // that.$router.go(0);
          that.reload();
        }
        else if(response.data.code === 10086) {
          that.$alert(response.data.msg, '发布失败', {
            confirmButtonText: '确定',
            callback: action => {
              that.$message({
                type: 'error',
                message: `您被禁言，无法发布`
              });
            }
          });
          that.pubStatus = false;
        }
        else {
          that.$message.error(response.data.msg);
          console.log("错误");
          that.pubStatus = false;
        }
      })
    },
    onDelete() {

    },
    delArticle() {
      this.$confirm('此操作将永久删除该帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let that = this;
        axios.get("http://localhost:8889/deleteArticleById", {
          params: {
            articleId: that.articleId
          },
          headers: {
            token: that.token
          }
        }).then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.$router.push({
              path: '/index',
            })
          } else {
            alert(response.data.msg);
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    onEditorChange({quill, html, text}) {
      this.content = html
    },
    getArticleComment(articleId) {
      let that = this;
      axios.get('http://localhost:8889/getCommentByArticleId', {
        params: {
          articleId: articleId
        }
      }).then(function (response) {
        console.log(response.data)
        that.comment = response.data.data;
        console.log(that.comment)
      }).catch(function (error) {
        console.log(error);
      })
    },
    canDel() {
      console.log("canDel")
      let adminTemp = sessionStorage.getItem("admin");
      if(adminTemp != null) {
        return true;
      }
      if (this.me.id == this.author.id) {
        console.log(this.me.id);
        console.log(this.author.id);
        this.isMe = true;
      } else {
        this.isMe = false;
      }
      return this.isMe;
      // let admin = sessionStorage.getItem("admin");
      // if (admin === null) {
      //   this.isAdmin = false;
      // } else {
      //   this.isAdmin = true;
      // }
      // console.log("isMe:" + this.isMe)
      // console.log("isAdmin:" + this.isAdmin)
      // return this.isMe || this.isAdmin;
    },
    canDelComment(fromId) {
      let admin = sessionStorage.getItem("admin");
      if (admin != null) {
        return true;
      }
      console.log("评论者id：" + fromId);
      let temp;
      if (fromId == this.me.id) {
        temp = true;
      } else {
        temp = false;
      }
      return this.isMe || this.isAdmin || temp;
    },
    delComment(commentId) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let that = this;
        axios.get("http://localhost:8889/deleteCommentByCommentId", {
          params: {
            commentId: commentId
          },
          headers: {
            token: that.token
          }
        }).then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.reload();
            // that.$router.push({
            //   path: '/index',
            // })
          } else {
            alert(response.data.msg);
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.articleId = this.$route.query.articleId;
    this.getArticleById();
    this.getArticleComment(this.articleId);

    let userJson = JSON.parse(sessionStorage.getItem("user"));
    this.me = userJson;


    let token = sessionStorage.getItem("token")
    this.token = token;


  }
}
</script>

<style>
h1 {
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;;
}

.detail-about {
  padding: 15px 15px 15px 15px;
  font-size: 13px;
  background-color: #f8f8f8;
  /*color: #999;*/
}

.ql-editor {
  height: 200px;
  width: 800px;
}

li {
  list-style-type: none;
}
</style>
