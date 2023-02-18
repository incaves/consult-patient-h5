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
styles - 全局样式
    main.scss - 项目共用样式
types - Typescript类型
utils - 工具函数
views - 路由页面
App.vue - 根组件
main.ts - 入口文件
```
