<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import http from "../../utils/request";

let data = reactive({

})


</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="less">

</style>
