import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
Vue.use(VueRouter)

const routes = [
 {path:'/login',component:Login},
 {path:'/',redirect: '/login'},
 {path:'/home',component:Home}
]

const router = new VueRouter({
  routes
})

//对路由导航进行验证
router.beforeEach((to, from, next) => {
 //to代表将要访问的路径
 //from从哪个路径跳转而来
 //next放行
 if(to.path === '/login')
  return next()
  //获取token值
  const tokStr = window.sessionStorage.getItem('token')
   if(!tokStr){
     return next('/login')
   }
   //当浏览器里保存的有token时，直接放行
   next()
  
})
export default router
