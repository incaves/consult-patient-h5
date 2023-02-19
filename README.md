# consult-patient-h5

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
### 项目文件(其他文件)
```typescript
.vscode - vscode推荐插件
node_modules - 项目依赖包
pubilc - 打包后放入的文件
.eslintrc.cjs - EsLint配置文件
.gitignore - git忽略文件
.prettierrc.json - Prettier配置文件
env.d.ts - Typescript类型支持文件
index.html - 唯一HTML文件
package.json - 依赖包(版本)
pnpm-lock.yaml - pnpm(包管理工具)
postcss.config.js - 移动端适配
README.md - 项目说明文件
tsconfig.config.json - Typescript依赖包管理文件
tsconfig.json - Typescript依赖包管理文件
vite.config.js - wepack配置文件
```
### 项目文件(src文件)
```typescript
assets - 静态资源(也可能包括css代码)
components - 全局通用组件(重复的组件)
composable - 组合式功能通用函数
icons - svg图标
router - 路由
    index.ts - 路由配置
services - 接口相关(API)
store - Pinia(状态管理)
		modules - 所有模块(不需要注册模化,只是文件分配合适才创建的)
    		user.ts - 用户相关模块
    index.ts - Pinia配置注册(统一导出,导入路径时少一层路径)
styles - 全局样式
    main.scss - 项目共用样式
types - Typescript类型
		user.d.ts - 用户相关的类型声明
utils - 工具函数
    request.ts - 请求工具(二次封装axios)
views - 路由页面
App.vue - 根组件
main.ts - 入口文件
```
### 路由相关
```type
使用createRouter来创建路由
createWebHistory 没有 #号的
createWebHashHistory 存在 #号的
两者都需要引入
createWebHistory(import.meta.env.BASE_URL) 
这个值来自 vite.config.ts 的 base 属性的值
需要配置,默认是 /
路由的基准路径
假如是 '/abc' 
整个项目的所有路径前都有 '/abc'
```
### 项目使用的依赖
```typescript
scss - css预处理语言
pinia - 状态管理
pinia-plugin-persistedstate - Pinia持久化存储((默认是localStorage))
vant - ui组件库
postcss-px-to-viewport - px转vw(移动端适配)
axios - 请求工具
```

### axios封装请求函数

> 没有类型时的请求函数

```typescript
const request = (url: string, method: string, submitData: object) => {
  return instance.request({
    url,
    method, 
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData 
  })
}
```

> 存在类型
>
> 泛型

```typescript
// 没有类型时,不合适的点
method的类型时stirng,传递什么普通字符串都可以
// 使用axios,自带的类型 Method
axios规定了只能写一些请求方式:get post delete put...
// 配置
method的默认是get请求
submitData不是所有都是提交数据,所以是可选的 "?"
// 返回的数据类型
type Data<T> = { // 接收传递的类型
  code: number
  message: string
  data: T // 使用传递的数据类型
}
// 更改之后的代码
// 这个T是函数接收的类型
const request = <T>(url: string,method: Method = 'get',submitData?: object) => {
                 // 第一个T 是接收数据的类型
                 // 第二个T 也是接收数据的类型,同时替换axios默认的数据类型
  return instance.request<T, Data<T>>({
    url, // 地址
    method, // 请求方式
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData // 数据
  })
}
```

```typescript
假如现在是文章请求
<id:number,title:stinrg> 文章请求需要的的类型
request<id:number,title:stinrg>{'/actilce','get'}.then((res)=>{
})
```

```
R = AxiosResponse<T> 是axios默认的数据类型,但是现在不需要它的默认类型
Date<T> 就是后台响应的数据类型
直接Pormise返回
```

![image-20230219230416390](/Users/fullversion/Library/Application Support/typora-user-images/image-20230219230416390.png)





