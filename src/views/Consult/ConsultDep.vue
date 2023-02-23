<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { TopDep } from '@/types/consult'
import { onMounted, ref, computed } from 'vue'
const active = ref(0) // 高亮效果
const allDep = ref<TopDep[]>([]) // 所有的科室
onMounted(async () => {
  const res = await getAllDep() // 请求
  allDep.value = res.data
})
// 二级科室依赖于一级科室(和当前激活的一级科室索引得到)
const subDep = computed(() => {
  // 根据当前高亮的索引获取数组中对应的索引的child
  return allDep.value[active.value]?.child
})
// 记录当前科室的id
const store = useConsultStore()
const record = (id: string) => {
  store.setDep(id)
}
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 侧边栏 -->
      <van-sidebar v-model="active">
        <van-sidebar-item :title="top.name" v-for="top in allDep" :key="top.id" />
      </van-sidebar>
      <!-- 二级科室 -->
      <div class="sub-dep">
        <router-link @click="record(sub.id)" to="/consult/illness" v-for="sub in subDep" :key="sub.id">
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
