import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar // 顶部导航栏
    CpIcon: typeof CpIcon // Icon(svg)
    CpRadioBtn: typeof CpRadioBtn // 单选按钮
  }
}
