// ---用户信息类型---
export type User = {
  /** token令牌 */
  token: string
  /** 用户ID */
  id: string
  /** 用户名称 */
  account: string
  /** 手机号 */
  mobile: string
  /** 头像 */
  avatar: string
}
// 短信验证码类型,登录|注册|修改手机号|忘记密码|绑定手机号
// 传递的数据可能是这五种的其中一种需要,告诉后台
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// ---个人信息类型---
type OmitUser = Omit<User, 'token'> // 使用User类型,并排除token
// 继承OmitUser的类型
// 此时的类型时 UserInfo + User的合体(排除了token)
export type UserInfo = OmitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}
// 患者信息类型
export type Patient = {
  /** 患者ID */
  id: string
  /** 患者名称 */
  name: string
  /** 身份证号 */
  idCard: string
  /** 0不默认  1默认 */
  defaultFlag: 0 | 1
  /** 0 女  1 男 */
  gender: 0 | 1
  /** 性别文字 */
  genderValue: string
  /** 年龄 */
  age: number
}
