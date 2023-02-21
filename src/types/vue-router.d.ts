import 'vue-router'
// 发现vue-router的meta没有类型(官网和源码中都有提示)
// 进行扩展
declare module 'vue-router' {
  // 扩展 元信息类型
  interface RouteMeta {
    title?: string // 标题
  }
}
