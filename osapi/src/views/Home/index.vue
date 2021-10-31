<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import http from "../../utils/request";
import DataPanel from "./DataPanel.vue";
import FocusPanel from "./FocusPanel.vue";
import DataAdminPanel from "./DataAdminPanel.vue";
import News from "./News.vue";

const props = defineProps({
  msg: String,
  title: {
    type: String,
    default: () => { return 'test' }
  },
})

let data = reactive({

})

</script>

<template>
  <el-row class="m-15">
    <el-col :offset="0" :span="14">
      <el-card
        shadow="always"
        :body-style="{padding: 0, border: 'none'}"
      >
        <DataPanel></DataPanel>
      </el-card>
    </el-col>

    <el-col :offset="1" :span="9">
      <el-card
        shadow="always"
        :body-style="{padding: 0}"
      >
        <DataAdminPanel></DataAdminPanel>
      </el-card>
    </el-col>
  </el-row>

  <el-row class="m-15">
    <el-col :span="8">
      <el-card
        shadow="always"
        :body-style="{padding: 0,height: '250px'}"
      >
        <News></News>
      </el-card>
    </el-col>

    <el-col :offset="1" :span="15" class="">
      <el-card
        shadow="always"
        :body-style="{padding: 0,height: '250px'}"
      >
        <FocusPanel></FocusPanel>
      </el-card>
    </el-col>
  </el-row>

</template>

<style scoped lang="less">

</style>
