<template>
  <div style="position: relative;">
    <IndexNavMenu></IndexNavMenu>
    <el-tabs width="30px;" v-model="activeName" style="position: absolute;margin-left: 200px;margin-top: 50px;">
      <el-tab-pane label="发布信息" name="first">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" status-icon>
          <el-row>
            <el-col :span="4">
              <el-form-item label="选择分类" prop="category">
                <el-select v-model="form.category" placeholder="请选择" style="width: 100px;">
                  <el-option v-for="item in articleCategory" :key="item.id" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item label="输入标题" style="display: inline-block;width: 860px;" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="VueQuillEditor">
            <el-upload
              style="display: none"
              class="quill-avatar-uploader"
              action="/"
              :show-file-list="false"
              accept="image/png, image/jpeg, image/jpg"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadLicencePicNo"
            >
            </el-upload>

            <quill-editor ref="myQuillEditor"
                          :content="content"
                          :options="editorOption"
                          @change="onEditorChange($event)">

            </quill-editor>

            <!--            <el-upload class="avatar-uploader-editor" :action="serverUrl" name="img" :headers="header" :show-file-list="false"-->
            <!--                       :on-success="uploadSuccess" :on-error="uploadError"> </el-upload>-->
            <!--            <el-upload class="avatar-uploader-editor-video" :action="serverUrl" name="video" :headers="header" :show-file-list="false"-->
            <!--                       :on-success="uploadSuccessVideo" :on-error="uploadError"> </el-upload>-->
            <!--            <el-upload class="avatar-uploader-editor-voice" :action="serverUrl" name="voice" :headers="header" :show-file-list="false"-->
            <!--                       :on-success="uploadSuccessVoice" :on-error="uploadError"> </el-upload>-->

            <el-button type="primary" @click="onSubmit" :loading="pubStatus">立即发布</el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
  name: "AddArticle",
  components: {IndexNavMenu, quillEditor},
  data() {
    return {
      articleCategory: '',
      activeName: 'first',
      pubStatus: false,
      content: '',
      editorOption: {
        // theme: 'snow',
        placeholder: '请输入帖子内容',
        modules: {
          toolbar: {
            // 配置工具栏，此次引入了全部工具栏，也可自行配置
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{header: 1}, {header: 2}],
              [{list: "ordered"}, {list: "bullet"}],
              [{script: "sub"}, {script: "super"}],
              [{indent: "-1"}, {indent: "+1"}],
              [{direction: "rtl"}],
              [{size: ["small", false, "large", "huge"]}],
              [{header: [1, 2, 3, 4, 5, 6, false]}],
              [{font: []}],
              [{color: []}, {background: []}],
              [{align: []}],
              ["link", "image", "video"],
            ],
            // 2.第二步：自定义图片按钮事件
            handlers: {
              // 自定义图片上传
              image: function (value) {
                if (value) {
                  // 点击图片按触发elmentui上传的input选择图片事件.quill-avatar-uploader是上传文件组件的那个类名
                  document
                    .querySelector(".quill-avatar-uploader input")
                    .click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      form: {
        category: '',
        title: ''
      },
      rules: {
        category: [
          {required: true, message: '请选择帖子分类', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
          {min: 5, max: 15, message: '文章标题长度要求在5到15个字之间', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onSubmit() {
      // console.log("hhh ");
      // console.log(this.content)
      // console.log(this.form.title)
      // console.log(this.form.category)
      this.pubStatus = true;
      let content = this.content;
      if (content == null || content.length < 5) {
        this.$message.error("正文内容不得少于5个字");
        this.pubStatus = false;
        return;
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log("合法")
          let that = this;
          let token = sessionStorage.getItem("token")
          axios.post('http://localhost:8889/addArticle', qs.stringify({
            categoryId: that.form.category,
            title: that.form.title,
            content: that.content
          }), {
            headers: {
              token: token
            }
          }).then(function (response) {
            console.log(response.data);
            if (response.data.code !== 200) {
              that.$message.error(response.data.msg);
              console.log("错误");
              that.pubStatus = false;
            } else {
              console.log("发布成功")
              that.pubStatus = false;
              that.$router.push({path: '/index'})
            }
          })
        } else {
          console.log("不合法");
          this.pubStatus = false;
        }
      })
    },
    onEditorChange({quill, html, text}) {
      // console.log('editor change!', quill, html, text)
      this.content = html
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
    beforeAvatarUpload(file) {
      let isPass = false;
      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      ) {
        isPass = true;
      }
      const isLt = file.size / 1024 / 1024 < 5;
      if (!isPass) {
        this.$message.error("当前仅支持上传图片JPG/jpeg/png格式!");
        return false;
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
      return isPass && isLt;
    },
    // 图片-上传操作
    uploadLicencePicNo(e) {
      var that = this;
      // 打开上传动画
      const loading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 调用上传接口将文件传递给后台 --- 这里uploadFile()是上传文件接口
      let formData = new FormData();
      formData.append("image", e.file);
      axios.post('http://localhost:8889/uploadImage', formData).then((res) => {
        console.log(res);
        // 如果上传成功，就可以获得相关路径如：http:xxxx.jpg,我这里是在res.data.url中
        if (res && res.data) {
          console.log("哈哈哈哈")
          /*---核心操作区域---start---*/
          // 获取富文本组件实例
          let quill = that.$refs["myQuillEditor"].quill;
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片insertEmbed()三个参数，前两个固定即可
          console.log("路径" + res.data.data)
          quill.insertEmbed(length, "image", res.data.data);
          // 调整光标到最后
          quill.setSelection(length + 1);
          /*---核心操作区域---end---*/
        } else {
          this.$message.error("图片插入失败！");
        }
        // 关闭上传动画
        loading.close();
      })
        .catch(() => {
          // 错误，则关闭上传动画
          loading.close();
        });
    }
  },
  created() {
    this.getAllArticleCategory();
  }
}
</script>

<style>
.ql-editor {
  min-height: 500px;
}


</style>
