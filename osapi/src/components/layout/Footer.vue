<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div class="footer-bar animate__animated animate__fadeIn animate__faster">
    <a target="_blank" href="https://github.com/yesmore/OSAPI">
      <i class="hover-grey text-white-1 iconfont icon-github1 ics-xl"></i>
    </a>
    <div class="mt-10">OSAPI-管理平台 | Copyright © <strong>yesmore</strong>  | 2021</div>
  </div>
</template>

<style scoped lang="less">
  .footer-bar {
    padding-top: 50px;
    /*padding: 20px;*/
    color: #fff;
    background-color: #262F3E;
    text-align: center;
    height: 80px;
  }
</style>
