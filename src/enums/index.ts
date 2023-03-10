// 问诊类型
export enum ConsultType {
  /** 找医生 */
  Doctor = 1,
  /** 快速问诊 */
  Fast = 2,
  /** 开药问诊 */
  Medication = 3
}
// 问诊时间，以1自增可以省略
export enum ConsultTime {
  /** 一周内 */
  Week = 1,
  /** 一月内 */
  Month = 2,
  /** 半年内 */
  HalfYear = 3,
  /** 半年以上 */
  More = 4
}

// 问诊室 ----

// 消息类型
export enum MsgType {
  // 文字聊天
  MsgText = 1,
  // 消息聊天(图片)
  MsgImage = 4,
  // 患者信息
  CardPat = 21,
  // 处方信息
  CardPre = 22,
  // 未评价信息
  CardEvaForm = 23,
  // 已评价信息
  CardEva = 24,
  // 通用通知
  Notify = 31,
  // 温馨提示
  NotifyTip = 32,
  // 取消
  NotifyCancel = 33
}

// 处方状态
export enum PrescriptionStatus {
  // 未付款
  NotPayment = 1,
  // 已付款
  Payment = 2,
  // 已失效
  Invalid = 3
}
