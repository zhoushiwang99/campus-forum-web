<template>
  <div>
    <quill-editor ref="myQuillEditor"
                  :content="content"
                  :options="editorOption"
                  class="ql-editor"
                  style="width: 400px;margin-left: 50px"
                  @change="onEditorChange($event)">
    </quill-editor>
    <el-button style="position:absolute;margin-top: -40px;margin-left: 450px" type="primary" @click="onSubmit" :loading="pubStatus">立即发布</el-button>
  </div>


</template>

<script>
import axios from "axios";
import qs from 'qs';

export default {
  name: "AddNotice",
  data() {
    return {
      content: '',
      createTime: '',
      pubStatus: false,
      token: '',
      editorOption: {
        // theme: 'snow',
        placeholder: '请输入帖子内容',
        modules: {
          toolbar: {
            // 配置工具栏，此次引入了全部工具栏，也可自行配置
            container: [
              ["bold", "italic", "underline", "strike"],
              [{list: "ordered"}, {list: "bullet"}],
              [{font: []}],
              [{color: []}, {background: []}],
            ]
          }
        }
      }
    }
  },
  methods: {
    getNotice(){
      let that = this;
      axios.get('http://localhost:8889/getNotice').then(function (response){
          that.content = response.data.data.content;
          that.createTime = response.data.data.createTime;
      })
    },
    onEditorChange({quill, html, text}) {
      // console.log('editor change!', quill, html, text)
      this.content = html
    },
    onSubmit() {
      let that =this;
      this.pubStatus = true;
      let content = this.content;
      if (content == null || content.length < 5) {
        this.$message.error("公告内容不得少于5个字");
        this.pubStatus = false;
        return;
      }
      axios.post('http://localhost:8889/admin/addNotice',qs.stringify({
          content: content
      }),{
        headers:{
          token:that.token
        }
      }).then(function (response){
        if(response.data.code === 200) {
          that.$message({
            type: 'success',
            message: `公告发布成功`
          });
          that.pubStatus = false;
          that.getNotice();
        }else{
          that.$message({
            type: 'error',
            message: response.data.msg
          });
          that.pubStatus = false;
        }
      })
      //
    }
  },
  mounted() {
    this.getNotice();
    let token = sessionStorage.getItem("token")
    this.token = token;
  }
}
</script>

<style>
.ql-editor {
  min-height: 300px;
}
</style>
