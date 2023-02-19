import axios from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
const baseURL = 'https://consult-api.itheima.net/' // 请求基准路径
const instance = axios.create({
  baseURL,
  timeout: 10000 // 超时时间
})
// 请求拦截器(请求之前做点什么)
instance.interceptors.request.use(
  (config) => {
    const store = useUserStore() // token存储在Pinia中
    // token如果存在,携带token获取用户独有的数据(并且请求头存在)
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 响应拦截器(请求成功之后做点什么)
// code = 10000 才是成功
instance.interceptors.response.use(
  (res) => {
    if (res.data.code !== 10000) {
      showToast(res.data?.message || '业务失败') // 提示
      return Promise.reject(res.data) // 中断程序,并返回错误信息
    }
    return res.data // 返回请求的数据(axios默认包裹了一层,剥离无效数据)
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default { baseURL, instance }
