<template>
  <div style="position: relative">
    <IndexNavMenu></IndexNavMenu>
    <h1>{{ article.title }}</h1>

  </div>
</template>

<script>
import IndexNavMenu from "../components/IndexNavMenu";
import axios from "axios";
import qs from 'qs';

export default {
  name: "Article",
  components: {IndexNavMenu},
  data() {
    return {
      articleId: '',
      category: '',
      article: '',
      author: ''
    };
  },
  methods: {
    getArticleById() {
      let that = this;
      let articleId = this.articleId;
      console.log("参数" + articleId)

      axios.get("http://localhost:8889/getArticleById", {
        params:{
          articleId: articleId
        }
      }).then(function (response) {
        console.log("返回成功")
        console.log(response.data)
        that.category = response.data.data.category;
        that.article = response.data.data.article;
        that.author = response.data.data.author;
      })
    }
  },
  mounted() {
    this.articleId = this.$route.query.articleId;
    this.getArticleById();
  }
}
</script>

<style scoped>

</style>
