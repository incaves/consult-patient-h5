<script lang="ts" setup>
import { useRouter } from 'vue-router'
// 点击左侧返回按钮
const router = useRouter()
const onClickLeft = () => {
  // 如果传递了back函数,就执行back函数的操作(父组件决定)
  if (props.back) {
    return props.back()
  }
  // 历史记录存在,返回上一页
  if (history.state?.back) {
    router.back()
  } else {
    // 历史记录不存在,返回到首页
    router.push('/')
  }
}
// 点击右侧文字按钮
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickRight = () => {
  emit('click-right') // 触发自定义事件(需要父组件进行接收,事件的处理由父组件决定)
}
// 接收传递的属性
// title = 标题 rightTest = 右侧文字 回退方式(函数) 都是可选的
const props = defineProps<{ title?: string; rightText?: string; back?: () => void }>()
</script>
<template>
  <VanNavBar left-arrow fixed :title="title" :right-text="rightText" @click-left="onClickLeft" @click-right="onClickRight" />
</template>

<style scoped lang="scss">
::v-deep() {
  .van-nav-bar {
    // 返回按钮的样式
    &__arrow {
      // = van-nav-bar_arrow
      font-size: 18px;
      color: var(--cp-text1);
    }
    // 文字的样式
    // = van-nav-bar_text
    &__text {
      font-size: 15px;
    }
  }
}
</style>
