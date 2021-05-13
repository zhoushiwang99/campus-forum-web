<template>

</template>

<script>
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      content: "",    // 内容
      // 富文本插件配置项
      editorOption: {
        placeholder: "请输入文本...",
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
      }
    }
  },
  methods: {
    // 文字内容
    onEditorChange({quill, html, text}) {
      console.log("editor change", quill);
      console.log("editor text", text);
      console.log("editor html", html);
      this.content = html; // 保存输入的内容
    },
    /* ----------第三步：编写上传事件，并且将内容放置于展示区域-----------*/
    // 图片上传前---格式与大小验证
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
      // 打开上传动画
      const loading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 调用上传接口将文件传递给后台 --- 这里uploadFile()是上传文件接口
      let formData = new FormData();
      formData.append("file", e.file);
      axios.post(formData)
        .then((res) => {
          // 如果上传成功，就可以获得相关路径如：http:xxxx.jpg,我这里是在res.data.url中
          if (res && res.data) {
            /*---核心操作区域---start---*/
            // 获取富文本组件实例
            let quill = this.$refs["myQuillEditor"].quill;
            // 获取光标所在位置
            let length = quill.getSelection().index;
            // 插入图片insertEmbed()三个参数，前两个固定即可
            quill.insertEmbed(length, "image", res.data.url);
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
  }
}

</script>

<style scoped>

</style>
