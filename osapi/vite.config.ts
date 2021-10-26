import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import path from 'path'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    base: loadEnv(mode, process.cwd()).VITE_RES_URL,
    strictPort: true,
    resolve: { // 设置项目文件导入路径
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    server: {
      host: '127.0.0.1',
      port: loadEnv(mode, process.cwd()).VITE_APP_PORT,
      open: false,
      https: false,
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      cors: true,
      hmr: {
        overlay: false // 屏蔽服务器报错
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/less/base.less";'
        }
      }
    }
  }
})
