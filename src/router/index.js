import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login';
import NotFound from "../views/NotFound";
import Index from '../views/index'
import AddArticle from "../views/AddArticle";
import Article from "../views/Article";
Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
    {
      path: '/article',
      component: Article,
      name: 'article'
    },
    {
      path:'/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      name: 'index'
    },
    {
      path: '/addArticle',
      component: AddArticle,
      name: 'addArticle'
    },
    {
      path: '*',
      component: NotFound,
      name: 'notFound'
    }
  ]

})
