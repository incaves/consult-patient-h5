import type { FollowType } from '@/types/consult'
import { followOrUnfollow } from '@/services/consult'
import { ref } from 'vue'
// 关注医生
// 默认的类型是关注医生
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref<boolean>(false) // 点击关注时的loading状态
  // 每次传递的类型是不同的
  // 文章中点击关注医生他的类型是 Knowledge
  // 推荐中点击关注医生他的类型是 Doctor
  // 不需要类型了,只限制下传递的数据(虽然使用的地方传递的item的类型不同,但不会影响)
  // 点击关注医生发送给后台
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      // 请求数据
      await followOrUnfollow(item.id, type)
      // 点击关注时的文字更新(是0更改成1,是1更改成0)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}
