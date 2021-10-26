<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

let data = reactive({
  currentRoute: ''
})
const settingChildren = ref()
const handleReady = () => {

}

</script>

<template>
  <el-row v-if="router.currentRoute.value.fullPath==='/setting'" class="m-20" justify="space-around">
    <el-col :span="7">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header d-flex justify-between align-center">
            <span>管理员</span>
            <el-button  @click="router.push('/setting/manager')" class="button" type="text">
              详情
            </el-button>
          </div>
        </template>
        <div class="d-flex" style="flex-direction: column">
          <span>
            管理员总人数：
            <el-tag type="primary">3</el-tag>
          </span>
          <span>
            超级管理员：3
          </span>
          <span>
            管理员：3
          </span>
          <span>
            会员：3
          </span>
          <span>
            其他：3
          </span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="7">
      <el-card shadow="hover"> Hover </el-card>
    </el-col>
    <el-col :span="7">
      <el-card shadow="hover"> Hover </el-card>
    </el-col>
  </el-row>

  <router-view/>
</template>

<style scoped lang="less">

</style>
