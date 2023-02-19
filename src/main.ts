import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'

import 'vant/lib/index.css' // vant样式
import '@/styles/main.scss' // 公用样式

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
