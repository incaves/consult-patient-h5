import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息(表示这个用户信息对象是User类型的数据)
    const user = ref<User>()
    // 修改用户信息
    const setUser = (u: User) => {
      user.value = u
    }
    // 删除用户信息
    const delUser = () => {
      user.value = undefined
    }
    return {
      user,
      setUser,
      delUser
    }
  },
  {
    persist: true // 开启数据持久化
  }
)
