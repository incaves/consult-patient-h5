import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
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
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    },
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' }
    }
  ]
})
// 导航前置守卫
router.beforeEach((to) => {
  // 开启进度条
  NProgress.start()
  const whiteList = ['/login'] // 白名单(没有权限的路由)
  const store = useUserStore()
  // 没有token,并且访问的页面不在白名单中,跳转到登录页
  // to.path当前页面的路径
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
  // 什么也不写,也是放行
})
export default router
// 导航后置守卫
router.afterEach((to) => {
  // 页面切换时,更改当前页面的标题
  document.title = `149优医问诊-${to.meta.title || ''}`
  NProgress.done()
})
//关闭转圈效果
NProgress.configure({
  showSpinner: false
})
