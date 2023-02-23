import type { User, CodeType, UserInfo, Patient } from '@/types/user'
import { request } from '@/utils/request'

/**
 * @param mobile手机号
 * @param password密码
 * @return {Promise}
 */
// 密码登录
export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('login/password', 'POST', { mobile, password })
}
/**
 *
 * @param mobile手机号
 * @param type类型
 * @后台不会返回数据不需要加类型
 */
// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request('/code', 'GET', { mobile, type })
}
/**
 * @param mobile手机号
 * @param code验证码
 */
// 短信验证码登录
export const loginByMobile = (mobile: string, code: string) => {
  return request<User>('/login', 'POST', { mobile, code })
}
/**
 * @GET请求
 * @没有任何需要传递的参数
 * @唯一传递的token
 * @已在请求头中进行传递
 * @只需要限制类型
 */
// 获取用户个人信息
export const getUserInfo = () => {
  return request<UserInfo>('/patient/myUser')
}
/**
 * @最终是接收的数据是Patient形式的数组
 */
// 家庭档案(获取患者信息)
export const getPatientList = () => {
  return request<Patient[]>('/patient/mylist')
}
/**
 * @patient是传递的用户对象
 */
// 添加患者
export const addPatient = (patient: Patient) => {
  return request('/patient/add', 'POST', patient)
}
/**
 * @patient是传递的用户对象
 */
// 编辑患者
export const editPatient = (patient: Patient) => {
  return request('/patient/update', 'PUT', patient)
}
/**
 *
 * @id删除的患者id
 */
export const delPatient = (id: string) => {
  return request(`/patient/del/${id}`, 'DELETE')
}
