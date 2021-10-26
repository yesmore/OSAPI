<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import {onMounted, ref} from "vue";

// let hasLogin = ref()
// hasLogin = store.getters.getLoginState

// onBeforeRouteLeave((to, from)=>{
//   ToolMsg('登陆','warning')
//   if (hasLogin.value) {
//     ToolMsg('登陆','warning')
//   } else {
//     console.log(to.path)
//     ToolMsg('未登陆','warning')
//     return
//   }
// })
//
// const ToolMsg = (message:any, type:any, duration=1500) => {
//   ElMessage({
//     message,
//     type,
//     duration
//   })
// }
</script>
