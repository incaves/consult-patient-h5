<script setup lang="ts">
import { addPatient, getPatientList, editPatient, delPatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { showConfirmDialog, type FormInstance, showToast, showSuccessToast } from 'vant'
import { nameRules, idCardRules } from '@/utils/rules'
import { ref, onMounted, computed } from 'vue'
const list = ref<Patient[]>([]) // 存储的数据是Patient形式的数组
// 因为每次添加后要更新,重新声明一个方法
const getList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  getList()
})
// 侧边栏
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
const show = ref<boolean>(false)
// 打开遮罩层
const showPopup = (item?: Patient) => {
  // 打开弹窗
  show.value = true
  // 编辑和保存的逻辑的函数是相同的(都要打开对话框)
  // item存在才是编辑 不存在是添加
  if (item) {
    // 填充表单(数据回显)
    const { id, gender, name, idCard, defaultFlag } = item
    // 赋值给表单绑定的对象(多存储了id,用于判断是那个操作,有id就是编辑)
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    // 首先清空表单
    patient.value = { ...initPatient }
  }
}
// 表单的数据绑定
const initPatient: Patient = {
  name: '', // 姓名
  idCard: '', // 身份证号
  gender: 1, // 性别
  defaultFlag: 0 // 谁是默认选中
}
const patient = ref<Patient>({ ...initPatient })
// 默认就诊人选中defaultFlag = 1 否则就是0
// 发送给后台也要时 0 ｜ 1 现在成布尔值了
const defaultFlag = computed({
  // 获取值 如果默认值是1 就是true 否则就是false
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  // 修改值 true = 1 否则是 0
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})
// 提交表单
const form = ref<FormInstance>()
const submit = async () => {
  await form.value?.validate()
  // 身份证倒数第二位，单数是男，双数是女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证号中的不一致\n您确认提交吗?'
    })
  }
  // 通过校验,进行添加患者 & 编辑患者(id存在)
  patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
  // 关闭对话框
  show.value = false
  // 更新列表
  getList()
  // 提示
  showToast(patient.value.id ? '编辑成功' : '添加成功')
}
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`
    })
    // 根据点击编辑按钮时获取的id进行删除操作
    await delPatient(patient.value.id)
    show.value = false
    getList() // 更新列表
    showSuccessToast('删除成功')
  }
}
</script>

<template>
  <div class="patient-page">
    <CpNavBar title="家庭档案" />
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" @click="showPopup(item)" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <!-- 大于6就不展示 -->
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model:show="show" position="right">
      <CpNavBar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
      ></CpNavBar>
      <van-form autocomplete="off" ref="form">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" :rules="nameRules" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" :rules="idCardRules" />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" :icon-size="18" round />
          </template>
        </van-field>
      </van-form>
      <!-- 删除按钮(只有编辑操作时,才会显示) -->
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
// 删除
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
</style>
