<script setup lang="ts">
// 接收传递的数据类型 可能是 男 ｜ 女  或者是 就诊过 没有就诊过 ...
defineProps<{
  options: {
    label: string // 文字
    value: number | string // 值
  }[]
  modelValue?: string | number // 默认选中
}>()
const emit = defineEmits<{
  // 点击a标签,修改默认选中
  (e: 'update:modelValue', value: number | string): void
}>()
</script>
<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      :class="{ active: modelValue === item.value }"
      href="javascript:;"
      v-for="item in options"
      :key="item.value"
      @click="emit('update:modelValue', item.value)"
      >{{ item.label }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
