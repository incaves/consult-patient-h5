import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'

import 'virtual:svg-icons-register' // 自动打包svg
import 'vant/lib/index.css' // vant样式
import '@/styles/main.scss' // 公用样式

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

