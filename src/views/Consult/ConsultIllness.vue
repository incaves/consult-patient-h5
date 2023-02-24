<script setup lang="ts">
import type { ConsultIllness, Image } from '@/types/consult'
import { ref, computed, onMounted } from 'vue'
import { ConsultTime } from '@/enums'
import { uploadImage } from '@/services/consult'
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types'
import { showToast, showConfirmDialog } from 'vant'
import { useConsultStore } from '@/stores'
import { useRouter } from 'vue-router'
// 患者的表单数据
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: [] // 图片数组
})
// 多选框
// options的数据(进行整理,需要传递给子组件进行循环渲染)
const timeOptions = [
  { label: '一周内', value: ConsultTime.Week },
  { label: '一月内', value: ConsultTime.Month },
  { label: '半年内', value: ConsultTime.HalfYear },
  { label: '大于半年', value: ConsultTime.More }
]
const flagOptions = [
  { label: '就诊过', value: 0 },
  { label: '没就诊过', value: 1 }
]
// 保存图片文件的数组
const fileList = ref<Image[]>([])
// 上传图片后做的事情(UploaderAfterRead = vant定义的类型)
// 只处理一次上传一张图
const onAfterRead: UploaderAfterRead = async (item) => {
  // 类型守卫
  if (Array.isArray(item)) return // 如果是图片数组不处理
  if (!item.file) return // 不存在
  // 开始上传(开启loading)
  item.status = 'uploading'
  item.message = '上传中...'
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done' // 关闭状态
      item.message = undefined // 清空文字
      item.url = res.data.url // 展示图片
      form.value.pictures?.push(res.data) // 提交到form中,用于上传到后台
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
// 删除图片
const onDeleteImg = (item: UploaderFileListItem) => {
  // vant会自动有删除的操作(视图会删除)
  // 但存储在form中的数据不会被删除
  // 点击的图片的item和存储的item的url相等时进行删除操作
  form.value.pictures = form.value.pictures?.filter((pic) => pic.url !== item.url)
}
// 下一步按钮的操作
// 按钮的样式
// 只有三者都为true的情况下才会显示disabled样式
const disabled = computed(
  () => !form.value.illnessDesc || form.value.illnessTime === undefined || form.value.consultFlag === undefined
)
// 按钮的操作
const store = useConsultStore()
const router = useRouter()
const next = () => {
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.illnessTime === undefined) return showToast('请选择症状持续时间')
  if (form.value.consultFlag === undefined) return showToast('请选择是否已经就诊')
  store.setIllness(form.value) // 保存步骤
  // 跳转档案管理,需要根据isChange实现选择功能
  router.push('/user/patient?isChange=1')
}
// 数据回显
onMounted(() => {
  // 选择了数据才会进行提示(这里判断的是时间的,他存在其余两个肯定也存在)
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      closeOnPopstate: false // 回退也需要弹窗
    }).then(() => {
      // 点击了确认
      // 取出来数据
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      // 进行赋值
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      // 图片回显
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 填写的内容 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag" />
      </div>
      <div class="illness-img">
        <van-uploader
          upload-icon="photo-o"
          upload-text="上传图片"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          v-model="fileList"
          :after-read="onAfterRead"
          @delete="onDeleteImg"
        ></van-uploader>
        <p class="tip" v-if="!fileList.length">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
      <!-- 删除按钮 -->
      <van-button :class="{ disabled }" @click="next" type="primary" block round>下一步</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
