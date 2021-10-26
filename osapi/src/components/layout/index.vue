<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from "../../store";
import { setterLsState, getterLsState } from '../../utils/localStorage'
import Header from './Header.vue'
import Aside from './Aside.vue'
import Footer from './Footer.vue'
import Breadcrumb from '../common/Breadcrumb.vue'

const store = useStore()
const router = useRouter()

// console.log('store状态：',store.getters.getLoginState, store.getters.getName)
// console.log('本地存储：',getterLsState())
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
