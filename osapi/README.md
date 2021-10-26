# Vue3 + Typescript + Vite2 + Element-Plus

### 版本

```js
"axios": "^0.21.4",
"element-plus": "^1.1.0-beta.20",
"vue": "^3.2.13",
"vue-router": "^4.0.11",
"vuex": "^4.0.2"
```



### 安装 & 配置

#### vite + vue3.0 

```bash
$ mkdir project
$ cd project

# 一条命令初始化 vue3+vite2
$ npm init @vitejs/app your-vue-app-name --template vue-ts
```

#### element-plus

```bash
# 安装
$ npm install element-plus --save
```

在`main.ts`全局引入Vant

```typescript
import { createApp } from 'vue'
import router from "./router"
import {store, key} from "./store"
import '@/assets/less/lib/_classes.css'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue'

createApp(App)
  .use(router)
  .use(store, key)
  .use(ElementPlus)
  .mount('#app')
```

#### Less

安装less预处理器

```bash
$ npm i less less-loader -D
# or
$ yarn add less less-loader -D
```

在vite.config.ts中进行如下配置（全局引入）

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port:4000,//启动端口
    open: true,
    proxy: {
      // 选项写法
//       '/api': 'http://123.56.85.24:5000'//代理网址
    },
    cors:true
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/assets/less/var.less";'
      }
    }
  }
})

```

#### iconfont

这里使用的是阿里的 **iconfont**，个人感觉扩展性比较大。点击进入 [官网]()。

在官网创建一个项目，添加你需要的图标后，下载压缩文件到本地，解压到 `./assets/` 目录下，在 `main.js` 中全局引入即可在其他页面使用。

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import Vant from 'vant'
import 'vant/lib/index.css'
import './assets/iconfont/iconfont.css'

createApp(App)
  .use(router)
  .use(store)
  .use(Vant)
  .mount('#app')

```

```vue
<i class="iconfont icon-Wifi"></i>
```

#### 环境变量

在项目根目录下创建两个文件：

- .env.development
- .env.production

两个文件内容分别如下：

```json
VITE_MODE_NAME = development
VITE_APP_TITLE = xxx

VITE_APP_PORT = 4000
VITE_APP_BASE_API = https://127.0.0.1:7001
```

```json
VITE_MODE_NAME = production
VITE_APP_TITLE = xxx

VITE_APP_PORT = 4000
VITE_APP_BASE_API = https://aoau.top
```

##### 提示

在 `env.d.ts` 文件中定义**接口**：

```tsx
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  VITE_MODE_NAME: string,
  VITE_APP_TITLE: string,
  VITE_APP_PORT: number,
  VITE_APP_BASE_API: string,
}
```

##### 使用

在 `vite.config.ts` 文件中（包含其他配置）：

```ts
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
          additionalData: '@import "./src/assets/less/base.less";'
        }
      }
    }
  }
})

```

在 `.vue` 文件中使用：

```vue
<script setup lang="ts">
  const _APP_TITLE = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <h2>{{ _APP_TITLE }}</h2>
</template>
```

#### Axios

配置网络请求axios

```bash
$ npm i -s axios
```

在`src`下创建`/utils`文件夹,并在utils下创建`request.ts`

```tsx
import axios from "axios";
const _APP_BASE_API = import.meta.env.VITE_APP_BASE_API
const service = axios.create({  
    baseURL: _APP_BASE_API, 
    timeout: 5000 // request timeout
});
export default service;
```

在 `.vue` 文件中使用： 

```js
import service from '@/utils/request.ts'
const resq = async () => {  
 let res = await service.get('http://v2.aoau.top/pb?p=6')    console.log(res.data)
}
```

