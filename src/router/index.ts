import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面
    { path: '/login', component: () => import('@/views/Login/index.vue') },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      // 二级路由
      // meta路由元信息中存储的是页面的标题
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    },
    // 一级路由
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    }
  ]
})
// 导航守卫
router.beforeEach((to) => {
  // 页面切换时,更改当前页面的标题
  document.title = `优医问诊-${to.meta.title || ''}`
  const whiteList = ['/login'] // 白名单(没有权限的路由)
  const store = useUserStore()
  // 没有token,并且访问的页面不在白名单中,跳转到登录页
  // to.path当前页面的路径
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
  // 什么也不写,也是放行
})
export default router
