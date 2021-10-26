<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCollapse = ref(true)
let currentRoute = ref('1')
console.log(router.currentRoute.value.path)
switch(router.currentRoute.value.path) {
  case '/home':
    currentRoute.value = '1'
    break

  case '/control':
    currentRoute.value = '2'
    break
  case '/control/focus':
    currentRoute.value = '2-1'
    break
  case '/control/homeapi':
    currentRoute.value = '2-2'
    break
  case '/control/data':
    currentRoute.value = '2-3'
    break
  case '/control/dataCate':
    currentRoute.value = '2-4'
    break
  case '/control/dataType':
    currentRoute.value = '2-5'
    break
  case '/control/update':
    currentRoute.value = '2-4'
    break
  case '/control/osapi':
    currentRoute.value = '2-5'
    break
  case '/control/otherapi':
    currentRoute.value = '2-6'
    break

  case '/setting':
    currentRoute.value = '4'
    break
  case '/setting/manager':
    currentRoute.value = '4-2'
    break
  case '/setting/role':
    currentRoute.value = '4-3'
    break
  case '/setting/access':
    currentRoute.value = '4-4'
    break
  default:
    currentRoute.value = '1'
    break
}

const handleSelect = (key:any, keyPath:any) => {
  currentRoute.value = key
}
</script>

<template>
  <el-menu
    :default-active="currentRoute"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    background-color="#262F3E"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
    :style='{width: !isCollapse ? "200px" : ""}'
  >
    <el-menu-item @click="router.push('/home')" index="1">
      <i class="iconfont icon-activityhuodong ml-5 mr-10"></i>
      <template #title>视图</template>
    </el-menu-item>
    <!-- 控制台 -->
    <el-sub-menu index="2">
      <template #title>
        <div  @click="router.push('/control')">
          <i class="el-icon-menu"></i>
          <span>控制台</span>
        </div>
      </template>
      <el-menu-item-group>
        <template #title><span>首页管理</span></template>
        <el-menu-item @click="router.push('/control/focus')" index="2-1">首页轮播图</el-menu-item>
        <el-menu-item @click="router.push('/control/homeapi')" index="2-2">首页接口</el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group>
        <template #title><span>动态管理</span></template>
        <el-menu-item @click="router.push('/control/data')" index="2-3">数据管理</el-menu-item>
        <el-menu-item @click="router.push('/control/dataCate')" index="2-4">数据分类管理</el-menu-item>
        <el-menu-item @click="router.push('/control/dataType')" index="2-5">数据类型管理</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <!-- 社区 -->
    <el-menu-item index="3">
      <i class="el-icon-document"></i>
      <template #title>社区</template>
    </el-menu-item>
    <!-- 权限管理 -->
    <el-sub-menu index="4">
      <template #title>
        <div @click="router.push('/setting')">
          <i class="el-icon-setting"></i>
          <span>设置</span>
        </div>
      </template>
      <el-menu-item-group title="个人中心">
        <el-menu-item index="4-1">修改密码</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <template #title><span>权限管理</span></template>
        <el-menu-item @click="router.push('/setting/manager')" index="4-2">管理员管理</el-menu-item>
        <el-menu-item @click="router.push('/setting/role')" index="4-3">角色管理</el-menu-item>
        <el-menu-item @click="router.push('/setting/access')" index="4-4">授权中心</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>

    <el-menu-item @click='isCollapse=!isCollapse'>
      <i v-if="isCollapse" class="el-icon-open"></i>
      <i v-else class="el-icon-close"></i>
      <template #title>{{ !isCollapse ? "隐藏" : '展开'}}</template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="less">

</style>
