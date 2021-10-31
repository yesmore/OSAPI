<template>
  <el-carousel :interval="4000" type="card" >
    <el-carousel-item v-for="item in foucsImgList" :key="item">
      <el-image
        :src="item.preview"
        fit="fill"
      >
        <template #placeholder>
          <div class="image-slot">
            <el-image src="https://cdn.jsdelivr.net/gh/yesmore/yesmore.github.io/img/header_img/bg.png"></el-image>
          </div>
        </template>
      </el-image>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
  import {getCurrentInstance, onMounted, ref} from 'vue';
  import * as echarts from 'echarts'
  import http from "../../utils/request";
  import {mongoDateFormat} from "../../utils/common";
  import {ToolMsg} from "../../utils/ToolMsg";

  const foucsImgList = ref([])
  const VITE_APP_BASE_API = import.meta.env.VITE_APP_BASE_API
  const VITE_APP_IMG_API = import.meta.env.VITE_APP_IMG_API

  // 获取图片
  const fetchImg = async () => {
    let res = await http.get('/admin/focus')
    if(res.data.status === 200) {
      res.data.info.map(item => {
        item.updatedAt = mongoDateFormat(item.updatedAt)
        item.preview = VITE_APP_IMG_API + "/"+ item.focus_img
      })
      foucsImgList.value = res.data.info
      // console.log(foucsImgList.value)
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  }
  fetchImg()
</script>

<style scoped lang="less">

</style>
