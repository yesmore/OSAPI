import { createApp } from 'vue'
import router from "./router"
import {store, key} from "./store"

import '@/assets/iconfont/iconfont.css'
import '@/assets/less/base.css'
import "animate.css"

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue'

createApp(App)
  .use(router)
  .use(store, key)
  .use(ElementPlus)
  .mount('#app')
