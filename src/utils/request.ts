import axios, { type Method } from 'axios'
import router from '@/router'
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
    // 如果状态码是401,跳转到登录页面
    if (err.response.status === 401) {
      const store = useUserStore()
      store.delUser() // 删除个人用户信息
      // 假如现在在'/goods'页面下,发起一个获取个人商品的请求,但是此时token无效,需要跳转到登录页面
      // 登录成功后,需要跳转回'/goods'页面下
      // router.currentRoute.value.fullPath = 当前页面的路由地址
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }

    return Promise.reject(err)
  }
)
/**
 * @请求工具函数
 * @参数:url,method,submitData
 * @返回:instance调用接口的Promise对象
 */
type Data<T> = {
  code: number
  message: string
  data: T
}
const request = <T>(url: string, method: Method = 'get', submitData?: object) => {
  return instance.request<T, Data<T>>({
    url, // 地址
    method, // 请求方式
    // 区分get和其他请求(post,delete...)
    // get提交数据,选项:params | 其他请求提交数据,选项:data([] 包裹的表示一个动态属性)
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData // 数据
  })
}
export { baseURL, instance, request }
