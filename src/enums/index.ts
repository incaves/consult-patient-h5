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
