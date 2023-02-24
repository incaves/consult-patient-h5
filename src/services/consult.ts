import type {
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  DoctorPage,
  FollowType,
  TopDep,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult
} from '@/types/consult'
import { request } from '@/utils/request'

/**
 *
 * @params需要告诉后台是什么请求那个tab下的数据
 * @补充(存在四个tab)
 */
// 请求首页文章
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'GET', params)
}
/**
 *
 * @params查询参数
 * @DoctorPage请求回来时的数据类型
 */
// 获取关注的医生
export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('/home/page/doc', 'GET', params)
}
/**
 *
 * @param id 医生的id
 * @param type 关注的类型
 * 默认是关注医生 doc
 */
// 关注医生
export const followOrUnfollow = (id: string, type: FollowType = 'doc') => {
  return request('/like', 'POST', { id, type })
}
/**
 * @TopDep请求回来时的数据类型
 */
// 科室
export const getAllDep = () => {
  return request<TopDep[]>('/dep/all')
}
/**
 * @file文件对象
 * @需要单独处理格式
 * @Image是上传图片的类型
 */
// 上传图片
export const uploadImage = (file: File) => {
  const fd = new FormData() // 进行包装
  fd.append('file', file) // key 和 值 key需要和后台一致
  return request<Image>('/upload', 'POST', fd)
}
/**
 *
 * @params传递的参数并指定类型
 * @ConsultOrderPreData请求回来的参数
 */
// 获取生成的订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) => {
  return request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)
}
/**
 *
 * @param data 是所有记录步骤的集合
 */
// 生成订单进行支付
// 生成订单
export const createConsultOrder = (data: PartialConsult) => {
  return request<{ id: string }>('/patient/consult/order', 'POST', data)
}

/**
 *
 * @paymentMethod支付方式
 * @orderId订单id
 * @payCallback判断是什么环境
 */
// 生成支付地址
export const getConsultOrderPayUrl = (data: { paymentMethod: 0 | 1; orderId: string; payCallback: string }) =>
  request<{ payUrl: string }>('/patient/consult/pay', 'POST', data)
