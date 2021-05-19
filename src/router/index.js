import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login';
import NotFound from "../views/NotFound";
import Index from '../views/index'
import AddArticle from "../views/AddArticle";
import Article from "../views/Article";
import User from "../views/User";
import UserSet from "../views/UserSet";
import SearchArticle from "../views/SearchArticle";
import Admin from "../views/Admin";
import dayjs from 'dayjs';
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
      path: '/user',
      component: User,
      name: 'user'
    },
    {
      path: '/article',
      component: Article,
      name: 'article'
    },
    {
      path: '/searchArticle',
      component: SearchArticle,
      name: 'searchArticle'
    },
    {
      path:'/',
      redirect: '/login'
    },
    {
      path: '/index',
      component: Index,
      name: 'index'
    },
    {
      path: '/admin',
      component:Admin,
      name:'admin'
    },
    {
      path: '/addArticle',
      component: AddArticle,
      name: 'addArticle'
    },
    {
      path: '/userSet',
      component: UserSet,
      name: 'userSet'
    },
    {
      path: '*',
      component: NotFound,
      name: 'notFound'
    }
  ]

})
