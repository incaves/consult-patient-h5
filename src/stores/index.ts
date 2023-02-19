import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
export * from './modules/user' // 导入user模块所有的函数
const pinia = createPinia()

pinia.use(persist) // Pinia数据持久化

export default pinia
