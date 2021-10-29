/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量提示
interface ImportMetaEnv {
  VITE_MODE_NAME: string,
  VITE_APP_TITLE: string,
  VITE_APP_PORT: string,
  VITE_APP_BASE_API: string,
  VITE_APP_DEFAULT_AVATAR: string,
  VITE_APP_IMG_API: string
}
