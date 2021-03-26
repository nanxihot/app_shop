import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: () => import('../components/Home.vue'),
    redirect: '/wellcome',
    children: [{
      path: '/wellcome',
      component: () => import('../components/Wellcome.vue')
    },
    {
      path: '/users',
      component: () => import('../components/user/Users.vue')
    },
    {
      path: '/rights',
      component: () => import('../components/power/Rights.vue')
    },
    {
      path: '/roles',
      component: () => import('../components/power/Roles.vue')
    },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要跳转的路径
  // from 从那个路径跳转来
  // next() 放行 nex('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token 存在放行 不存在跳转到登录页
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
