import type { KnowledgePage, KnowledgeParams, PageParams, DoctorPage, FollowType, TopDep } from '@/types/consult'
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
