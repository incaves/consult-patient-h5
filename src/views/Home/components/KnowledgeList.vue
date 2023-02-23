<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type { KnowledgeParams, KnowledgeType, KnowledgeList } from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
// 需要父组件传入type才知道请求什么类型的文章
const props = defineProps<{
  type: KnowledgeType
}>()
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
// 发送给后台的参数
const params = ref<KnowledgeParams>({
  type: props.type, // 请求那个tab下的数据
  current: 1, // 第几页
  pageSize: 5 // 每页几条
})
const onLoad = async () => {
  // 请求数据
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows) // 保存请求的数据
  loading.value = false
  // 判断是否加载完成
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true // 加载完成
  } else {
    params.value.current++ // 请求下一页
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>
<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
