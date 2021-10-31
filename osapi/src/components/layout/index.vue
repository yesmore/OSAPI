<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import {useRouter, onBeforeRouteLeave, onBeforeRouteUpdate} from 'vue-router'
import { useStore } from "../../store";
import { setterLsState, getterLsState } from '../../utils/localStorage'
import Header from './Header.vue'
import Aside from './Aside.vue'
import Footer from './Footer.vue'
import Breadcrumb from '../common/Breadcrumb.vue'
import http from "../../utils/request";
import {ToolMsg} from "../../utils/ToolMsg";

const store = useStore()
const router = useRouter()

// console.log(getterLsState())

const isLogin = () => {
  http.get('/admin/login/isLogin').then(res => {
    if (res.data.status === 200) {
      store.commit('SET_LoginState', true)
      return true
    } else if(res.data.status === 401) {
      // data.username = '游客'
      ToolMsg('未登陆-Header', 'warning')
      store.commit('SET_LoginState', false)
      setterLsState(store)
      return false
    } else if(res.data.status === 403 ) {
      // data.username = getterLsState().username+'-无权限'
      ToolMsg('无权限-Header', 'warning')
      router.push('/home')
      return false
    }
  })
}

onBeforeRouteUpdate((to, from) => {
  document.title = router.currentRoute.value.meta.title
    ? to.meta.title+'  |  OSAPI'
    : 'OSAPI'
})
document.title = router.currentRoute.value.meta.title
  ? router.currentRoute.value.meta.title+'  |  OSAPI'
  : 'OSAPI'

// 本地保存状态
window.addEventListener("beforeunload",()=>{
  setterLsState(store)
})

</script>

<template>
  <el-container id="layout">
    <el-header id='header'>
      <!-- 公共组件 -->
      <Header/>
    </el-header>

    <el-container>
      <!-- 侧边导航 -->
      <Aside/>

      <el-container>

        <el-main id='main'>
          <!-- 面包导航 -->
          <Breadcrumb/>
          <!-- 页面组件 -->
          <router-view />
        </el-main>
      </el-container>

    </el-container>
  </el-container>
  <el-footer id='footer'>
    <!-- 公共组件 -->
    <Footer/>
  </el-footer>
</template>

<style scoped lang="less">
body {
  margin: 0;
  padding: 0;
}
.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 200px;
}

.el-main {
  padding: 10px;
  min-height: 100vh;
}
</style>
