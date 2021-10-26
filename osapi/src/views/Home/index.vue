<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import http from "../../utils/request";

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
  页面内容
</template>

<style scoped lang="less">

</style>
