import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面
    { path: '/login', component: () => import('@/views/Login/index.vue') }
  ]
})

export default router
