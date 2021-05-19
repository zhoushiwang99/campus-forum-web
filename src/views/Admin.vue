<template>
  <div style="position: relative">
    <IndexNavMenu></IndexNavMenu>
    <div style="display: inline-block">
      <el-menu
        default-active="1">
        <el-menu-item index="1" @click="statistics">
          <i class="el-icon-office-building"></i>
          <span slot="title">统计</span>
        </el-menu-item>

        <el-menu-item index="2" @click="categoryManage">
          <i class="el-icon-s-operation"></i>
          <span slot="title">分类管理</span>
        </el-menu-item>

        <el-menu-item index="3" @click="articleManage">
          <i class="el-icon-notebook-1"></i>
          <span slot="title">文章管理</span>
        </el-menu-item>

        <el-menu-item index="4" @click="userManage">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>

        <el-menu-item index="5" @click="noticeManage">
          <i class="el-icon-setting"></i>
          <span slot="title">公告</span>
        </el-menu-item>
      </el-menu>

    </div>
    <div style="display: inline-block;position: absolute;width: 800px;margin-top: 20px" v-if="index === 1">
      <blockquote class="layui-elem-quote">
        欢迎管理员：<span class="x-red">{{ user.name }}</span>！当前时间: <span>{{ nowTime }}</span> <span
        id="weekday"></span>
      </blockquote>

      <span style="margin-left: 20px;padding: 0px 10px;width: 100px;height: 26px;font-size: 20px">数据统计</span>
      <div style="width: 1100px;height: 90px;margin-top: 20px">
        <el-row style="text-align: center;line-height: 80px;margin-left: 30px;">
          <el-col :span="4">
            <div class="layui-bg-green">
              <i style="font-size: 30px" class="layui-anim layui-anim-rotate layui-icon layui-icon-read"></i>
            </div>
          </el-col>
          <el-col :span="4" style="line-height: 80px;">
            <span>文章总数{{ systemInfo.articleCount }}</span>
            <!--            <span style="line-height: 40px;">{{ systemInfo.articleCount }}</span>-->
          </el-col>
          <el-col :span="4">
            <div class="layui-bg-blue">
              <i style="font-size: 30px" class="layui-anim layui-anim-rotate layui-icon layui-icon-user"></i>
            </div>
          </el-col>
          <el-col :span="4">
            <span>用户总数{{ systemInfo.userCount }}</span>
          </el-col>
          <el-col :span="4">
            <div class="layui-bg-black">
              <i style="font-size: 30px" class="layui-anim layui-anim-rotate layui-icon layui-icon-release"></i>
            </div>
          </el-col>
          <el-col :span="4">
            <span>评论总数{{ systemInfo.totalCount }}</span>
          </el-col>
        </el-row>
      </div>

      <blockquote class="layui-elem-quote" style="margin-top: 130px;">
        系统基本参数
      </blockquote>

      <div>
        <el-table
          :data="tableData"
          :show-header="false"
          style="width: 100%">
          <el-table-column
            prop="date"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            width="180">
          </el-table-column>
        </el-table>
      </div>

    </div>
    <div style="display: inline-block;width: 800px;position: absolute;margin-top: 20px" v-if="index === 2">
      <div style="position: absolute;margin-top: 20px;">
        <el-button style="position: absolute;margin-left: 20px" @click="cansee=true" type="primary"
                   icon="el-icon-circle-plus-outline">添加分类
        </el-button>
        <div style="position: absolute;margin-top: 40px;margin-left: 20px;width: 800px">
          <el-table
            :data="category"
            style="width: 100%"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column
              label="ID"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分类名称"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="更新时间"
              width="260">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ dateFormat(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="modifyCategory(scope.row.id,scope.row.name)">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteCategory(scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog title="添加分类" :visible.sync="cansee">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="分类名称" label-width="120px" prop="newCategoryName">
              <el-input style="width: 180px" v-model="form.newCategoryName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!--              <el-button @click="cansee = false">取 消</el-button>-->
            <el-button @click="cansee = false;this.form.newCategoryName=''">取 消</el-button>
            <!--              <el-button type="primary" @click="cansee = false">确 定</el-button>-->
            <el-button type="primary" @click="addCategory">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="修改分类" :visible.sync="tempFormCamsee">
          <!--          <el-form :model="tempForm" >-->
          <el-form :model="tempForm" :rules="tempRules" ref="tempForm">
            <el-form-item label="分类ID" label-width="120px">
              <el-input style="width: 180px" v-model="tempForm.tempId" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="分类名称" label-width="120px" prop="tempName">
              <el-input style="width: 180px" v-model="tempForm.tempName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="tempFormCamsee = false">取 消</el-button>
            <el-button type="primary" @click="updateCategory">确 定</el-button>
            <!--            <el-button type="primary" @click="tempFormCamsee = false">确 定</el-button>-->
          </div>
        </el-dialog>
      </div>
    </div>


    <div style="display: inline-block;width: 800px;position: absolute;margin-top: 20px" v-if="index === 3">
      <div style="position: absolute;margin-left: 20px">
        <el-input style="width: 200px;" v-model="keyword"></el-input>
        <el-button type="success" icon="el-icon-search" @click="searchArticle">搜索帖子</el-button>
        <el-button type="primary" icon="el-icon-search" @click="cancelSearch" v-if="search === 1">取消搜索</el-button>
      </div>
      <div style="position: absolute;margin-top: 60px;margin-left: 20px;width: 1200px">
        <el-table
          :data="article"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column
            label="ID"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.article.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="帖子标题"
            width="180">
            <template slot-scope="scope">
              <!--              <router-link target="_blank" :to="{path:'/article',query:{articleId:scope.row.article.id}}">{{ scope.row.article.title }}</router-link>-->
              <span style="margin-left: 10px" @click="goArticle(scope.row.article.id)"><el-link
                type="primary">{{ scope.row.article.title }}</el-link></span>
            </template>
          </el-table-column>
          <el-table-column
            label="作者"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px" @click="goUser(scope.row.user.id)">
<!--                {{ scope.row.user.name }}-->
                <el-link
                  type="primary">{{ scope.row.user.name }}
                </el-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="260">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ dateFormat(scope.row.article.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="scope.row.article.priority===0"
                type="primary"
                @click="top(scope.row.article.id)">置顶
              </el-button>
              <el-button
                size="mini"
                type="warning"
                v-if="scope.row.article.priority===1"
                @click="cancelTop(scope.row.article.id)">取置
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteArticle(scope.row.article.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 200px">
          <el-pagination
            background
            layout="prev, pager, next" :hide-on-single-page="false" :current-page="currentPage"
            :total="total" :page-size="5" @current-change="pageChange"><!--@prev-click="prev" @next-click="next"-->
          </el-pagination>
        </div>
      </div>
      <div style="position: absolute;margin-top: 60px;margin-left: 1280px;width: 100px">
        <el-breadcrumb separator="|">
          <!--        <el-breadcrumb-item><span @click="changeToNew">最新</span></el-breadcrumb-item>-->
          <!--        <el-breadcrumb-item><span @click="changeToHot">最热</span></el-breadcrumb-item>-->
          <el-breadcrumb-item>
            <el-button type="text" :disabled="sort===0" @click="idAsc">正序</el-button>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-button type="text" :disabled="sort===1" @click="idDesc">逆序</el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div style="display: inline-block;width: 800px;position: absolute;margin-top: 20px" v-if="index === 4">
      <div style="position: absolute;margin-left: 20px">
        <el-input style="width: 200px;" v-model="keyword"></el-input>
        <el-button type="success" icon="el-icon-search" @click="searchArticle">搜索用户</el-button>
        <el-button type="primary" icon="el-icon-search" @click="cancelSearch" v-if="search === 1">取消搜索</el-button>
      </div>
      <div style="position: absolute;margin-top: 60px;margin-left: 20px;width: 1200px">
        <el-table
          :data="users"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column
            label="ID"
            width="60">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.user.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="用户名"
            width="100">
            <template slot-scope="scope">
              <!--              <router-link target="_blank" :to="{path:'/article',query:{articleId:scope.row.article.id}}">{{ scope.row.article.title }}</router-link>-->
              <span style="margin-left: 10px" @click="goUser(scope.row.user.id)"><el-link
                type="primary">{{ scope.row.user.name }}</el-link></span>
            </template>
          </el-table-column>
          <el-table-column
            label="学校"
            width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">
<!--                {{ scope.row.user.name }}-->
                {{ scope.row.universityName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="注册时间"
            width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ dateFormat(scope.row.user.registerTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="禁言时间"
            width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px" v-if="scope.row.forbidden===1">{{ dateFormat(scope.row.forbiddenTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.forbidden===0"
                @click="cancelTop()">禁言
              </el-button>
              <el-button
                size="mini"
                type="warning"
                v-if="scope.row.forbidden===1"
                @click="deleteArticle(d)">解禁
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 30px;margin-left: 200px">
          <el-pagination
            background
            layout="prev, pager, next" :hide-on-single-page="false" :current-page="currentPage"
            :total="total" :page-size="5" @current-change="pageChange"><!--@prev-click="prev" @next-click="next"-->
          </el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';
import dayjs from 'dayjs';

export default {
  name: "Admin",
  components: {IndexNavMenu},
  data() {
    return {
      index: 1,
      currentPage: 1,
      sort: 0,
      search: 0,
      users: [],
      userKeyword: '',
      user: '',
      token: '',
      systemInfo: '',
      cansee: false,
      tempFormCamsee: false,
      form: {
        newCategoryName: ''
      },
      article: [],
      total: 0,
      keyword: '',
      rules: {
        newCategoryName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 2, max: 6, message: '分类名称长度需在2到6个字之间', trigger: 'blur'}
        ]
      },
      tempForm: {
        tempName: '',
        tempId: ''
      },
      tempRules: {
        tempName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 2, max: 6, message: '分类名称长度需在2到6个字之间', trigger: 'blur'}
        ]
      },
      nowTime: new Date(),
      category: [],
      tableData: [{
        date: '运行环境',
        name: 'JDK 1.8',
      }, {
        date: '数据库版本',
        name: 'MySQL 8.0.12',
      }, {
        date: '当前用户权限',
        name: '管理员',
      }]
    };
  },
  methods: {
    statistics() {
      this.index = 1;
      console.log("统计");
      this.getSystemInfo();
    },
    categoryManage() {
      this.index = 2;
      console.log("分类");
      this.getArticleCategory();
    },
    articleManage() {
      this.index = 3;
      this.getArticle(null, 1, 5);
      console.log("文章管理")
    },
    userManage() {
      this.index = 4;
      this.getUserList(null, 1, 5);
    },
    noticeManage() {
      this.index = 5;
    },
    searchArticle() {
      let that = this;
      let tempKeyword = that.keyword;
      if (tempKeyword == null || tempKeyword === '') {
        that.$message({
          type: 'error',
          message: "搜索词不能为空"
        });
        return;
      }
      that.search = 1;
      that.getArticle(tempKeyword, 0, 5);
    },
    cancelSearch() {
      this.keyword = '';
      this.search = 0;
      this.getArticle(null, 0, 5);
    },
    pageChange(currentPage) {
      this.currentPage = currentPage;
      this.getArticle(this.keyword, currentPage, 5);
    },
    idAsc() {
      this.sort = 0;
      this.currentPage = 1;
      this.getArticle(this.keyword, 0, 5);
    },
    idDesc() {
      this.sort = 1;
      this.currentPage = 1;
      this.getArticle(this.keyword, 0, 5);
    },
    goArticle(articleId) {
      this.$router.push({
        path: '/article',
        query: {
          articleId: articleId
        }
      })
    },
    goUser(userId) {
      this.$router.push({
        path: '/user',
        query: {
          userId: userId
        }
      })
    },
    getArticle(keyword, pageNo, pageSize) {
      let that = this;
      axios.get('http://localhost:8889/admin/getArticle', {
        params: {
          keyword: keyword,
          pageNo: pageNo,
          pageSize: pageSize,
          sort: this.sort
        },
        headers: {
          token: this.token
        }
      }).then(function (response) {
        console.log(response.data);
        that.total = response.data.data.total;
        that.article = response.data.data.article;
      })
    },
    getUserList(userkey, pageNo, pageSize) {
      let that = this;
      axios.get('http://localhost:8889/admin/getUserList', {
        params: {
          keyword: that.userKeyword,
          pageNo: pageNo,
          pageSize: pageSize,
        },
        headers: {
          token: this.token
        }
      }).then(function (response) {
        console.log(response.data);
        if (response.data.code === 200) {
          that.users = response.data.data;
        }
      })
    },
    getSystemInfo() {
      let that = this;
      axios.get('http://localhost:8889/admin/getSystemInfo')
        .then(function (response) {
          console.log(response)
          if (response.data.code === 200) {
            that.systemInfo = response.data.data;
          } else {
            that.$message({
              type: 'error',
              message: response.data.msg
            });
          }
        })
    },
    top(articleId) {
      this.$confirm('是否确认置顶该帖?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let that = this;
        axios.get("http://localhost:8889/admin/setTopArticle", {
          params: {
            articleId: articleId
          },
          headers: {
            token: that.token
          }
        }).then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.$message({
              type: 'success',
              message: '置顶成功!'
            });
            that.getArticle(that.keyword, 0, 5);
          } else {
            alert(response.data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消置顶'
        });
      });
    },
    cancelTop(articleId) {
      this.$confirm('是否确认取消置顶?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let that = this;
        axios.get("http://localhost:8889/admin/canCelTopArticle", {
          params: {
            articleId: articleId
          },
          headers: {
            token: that.token
          }
        }).then(function (response) {
          console.log(response)
          if (response.data.code === 200) {
            that.$message({
              type: 'success',
              message: '取消置顶成功!'
            });
            that.getArticle(that.keyword, 0, 5);
          } else {
            alert(response.data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    deleteArticle(articleId) {
      this.$confirm('此操作将永久删除此贴，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let that = this;
        axios.get("http://localhost:8889/admin/deleteArticle", {
          params: {
            articleId: articleId
          },
          headers: {
            token: that.token
          }
        }).then(function (response) {
          console.log(response)
          if (response.data.code === 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.getArticle(that.keyword, 0, 5);
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
    getArticleCategory() {
      let that = this;
      axios.get('http://localhost:8889/getAllCategory').then(function (response) {
        console.log(response.data)
        that.category = response.data.data;
      })
    },
    dateFormat(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    modifyCategory(categoryId, name) {
      console.log(categoryId);
      console.log(name);
      let that = this;
      that.tempForm.tempId = categoryId;
      that.tempForm.tempName = name;
      that.tempFormCamsee = true;
    },
    updateCategory() {
      let that = this;
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.axios.post('http://localhost:8889/updateCategory', qs.stringify({
            name: this.tempForm.tempName,
            categoryId: this.tempForm.tempId
          }), {
            headers: {
              token: that.token
            }
          }).then(function (response) {
            if (response.data.code == 200) {
              that.$message({
                type: 'success',
                message: '修改成功!'
              });
              that.tempFormCamsee = false;

              that.tempForm.tempName = '';
              that.tempForm.tempId = '';
              //修改成功后更新分类
              that.getArticleCategory();
            } else {
              alert(response.data.msg);
            }
          })
        }
      })
    },
    deleteCategory(id) {
      let that = this;
      this.$confirm('此操作将永久删除该分类及分类下的所有帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('http://localhost:8889/deleteCategory', {
            params: {
              categoryId: id
            }, headers: {
              token: that.token
            }
          }
        ).then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            //删除成功后更新分类
            that.getArticleCategory();
          } else {
            alert(response.data.msg);
          }
        })
      })
    },
    addCategory() {
      let that = this;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.axios.post('http://localhost:8889/addCategory', qs.stringify({
            name: this.form.newCategoryName
          }), {
            headers: {
              token: that.token
            }
          }).then(function (response) {
            if (response.data.code == 200) {
              that.$message({
                type: 'success',
                message: '添加成功!'
              });
              that.cansee = false;
              //添加成功后更新分类
              that.getArticleCategory();
            } else {
              alert(response.data.msg);
            }
          })
        }
      })
    }
  },

  mounted() {
    let userJson = JSON.parse(sessionStorage.getItem("user"));
    let token = sessionStorage.getItem("token")
    this.user = userJson;
    this.token = token;
    let that = this;
    this.timer = setInterval(() => {
      this.nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
    this.getSystemInfo();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }

}
</script>


<style>

</style>
