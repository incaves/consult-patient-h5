<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder, getConsultOrderPayUrl } from '@/services/consult'
import type { ConsultOrderPreData } from '@/types/consult'
import { useConsultStore } from '@/stores'
import { getPatientDetail } from '@/services/user'
import type { Patient } from '@/types/user'
import { showToast, showConfirmDialog, showLoadingToast } from 'vant'
import { ref, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
// 获取订单相关信息
const payInfo = ref<ConsultOrderPreData>() // 存储请求回来的数据
const store = useConsultStore()
const loadPayInfo = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  // 存储优惠卷
  store.setCoupon(res.data.couponId)
}
// 获取患者信息
const patient = ref<Patient>() // 存储请求回来的数据
const loadPatient = async () => {
  if (store.consult.patientId) {
    const res = await getPatientDetail(store.consult.patientId)
    patient.value = res.data
  }
}
// 生成订单
const agree = ref(false) // 协议
const show = ref<boolean>(false) // 抽屉的展示
const orderId = ref<string>() // 订单id
const loading = ref<boolean>(false) // loading..
const paymentMethod = ref<0 | 1>() // 0 = 支付宝 1 = 微信
// 点击支付按钮
const openSheet = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  show.value = true
  loading.value = true
  // 生成订单(所有请求的数据-步骤都在store中)
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  loading.value = false
  store.clear() // 清空信息
}
// 抽屉的关闭按钮
const router = useRouter()
const onClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      // 确认
      return false // 什么也不做
    })
    .catch(() => {
      // 取消
      orderId.value = '' // id清空,如果不清空 会被拦截跳转的
      router.push('/user/consult')
      return true
    })
}
// 生成订单跳转支付页面
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  if (!orderId.value) return
  showLoadingToast('跳转支付')
  // 获取支付地址
  const res = await getConsultOrderPayUrl({
    orderId: orderId.value, // 订单id
    paymentMethod: paymentMethod.value, // 类型
    payCallback: 'http://localhost:5173/room' // 支付后会跳转到该页面
  })
  // 进行跳转
  window.location.href = res.data.payUrl
}
// 离开此页面时(点击浏览器后退)
onBeforeRouteLeave(() => {
  // 如果订单存在,进行阻止
  if (orderId.value) return false
})
onMounted(() => {
  // 刷新页面的时候,需要判断下问诊记录是否还存在
  if (!store.consult.type || !store.consult.illnessType || !store.consult.depId || !store.consult.patientId) {
    return showConfirmDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      showCancelButton: false
    }).then(() => {
      router.push('/')
    })
  }
  loadPayInfo()
  loadPatient()
})
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <!-- 订单信息 -->
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 患者信息 -->
    <van-cell-group>
      <van-cell title="患者信息" :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 按钮 -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      :loading="loading"
      @click="openSheet"
    />
    <!-- 支付方式 -->
    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :closeable="false"
      :before-close="onClose"
      :close-on-popstate="false"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
          <div class="btn">
            <van-button type="primary" round block @click="pay">立即支付</van-button>
          </div>
        </van-cell-group>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
