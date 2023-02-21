import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入ui组件,就不需要引入了(也会导入components文件中的组件)
    Components({
      dts: false,
      resolvers: [VantResolver({ importStyle: false })]
    }),
    // 将icons文件下的svg打包成一个文件
    createSvgIconsPlugin({
      // 指定图标文件夹,绝对路径
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    // 路径可以使用@
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
