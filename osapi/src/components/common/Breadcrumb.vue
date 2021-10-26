<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
// const currentRoute = ref()
// console.log(router.currentRoute.value)

</script>

<template>
  <div class="ml-15 mt-10 pb-5 d-flex" style="border-bottom: 1px dashed #ccc">
    <el-check-tag @click="router.go(-1)" type="info" style="height: 17px;">
      <i class="hover-grey ics-lg iconfont icon-jiantou2 px-5 "></i>
    </el-check-tag>

    <el-check-tag @click="router.go(1)" type="info" style="height: 17px;">
      <i class="hover-grey ics-md iconfont icon-jiantou px-5 "></i>
    </el-check-tag>
    <el-breadcrumb class="mr-10" separator="/" style="line-height:32px">
      <el-breadcrumb-item
        v-for="currentRoute in router.currentRoute.value.matched"
        :key="currentRoute.name"
        :to="{ path: currentRoute.path }">
        <span class="ics-sm">{{ currentRoute.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      class="p-0"
      :title="router.currentRoute.value.meta.description"
      type="info"
      style="max-width:300px;height:30px;padding:0;float:right"
    ></el-alert>
  </div>

</template>
