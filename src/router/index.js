import Vue from 'vue'
import Router from 'vue-router'
// import { createRouter , createWebHistory } from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import AppLogin from '@/components/manager/Login.vue'
import AppIndex from '@/components/home/Index.vue'
import UserInfo from '@/components/user/UserInfo.vue'

// var Vue = require('vue')
// const routerHistory = createWebHistory()
// const router = createRouter({
//   history: routerHistory,
Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/index',
      name: 'AppIndex',
      component: AppIndex
    },
    {
      path: '/manage',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'AppLogin',
      component: AppLogin
    },{
      path: '/user/findAll',
      name: 'UserInfo',
      component: UserInfo
    }
  ]
})
//  解决高版本Vue-Router redirected 报错 beforeRouteEnter undefined
// router.beforeEach((to, from, next) => {    
//   if (to.path=='/'||to.path=='/manage') {
//     next('/login')
//   }    
//   else {
//     next()
//   }    
// })
// export default router
