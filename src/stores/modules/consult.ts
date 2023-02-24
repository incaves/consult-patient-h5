import type { ConsultType } from '@/enums'
import type { PartialConsult, ConsultIllness } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useConsultStore = defineStore(
  'consult', // 仓库标识
  () => {
    // 问诊记录状态(也就是点击极速问诊的每一步操作进行记录)
    const consult = ref<PartialConsult>({})
    // 1.记录问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 2.记录极速问诊类型(三甲 ｜ 普通)
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 3.记录科室
    const setDep = (id: string) => (consult.value.depId = id)
    // 4.记录病情描述(什么时间,是否就诊过,图片)
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 5.记录当前患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 6.记录优惠券
    const setCoupon = (id?: string) => (consult.value.couponId = id)
    // 7.清空记录
    const clear = () => (consult.value = {})
    //
    return {
      consult,
      setType,
      setIllnessType,
      setDep,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  {
    persist: true // 开启数据持久化
  }
)
