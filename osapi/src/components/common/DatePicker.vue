<template>
  <!-- 日期过滤 -->
  <div class="demo-date-picker">
    <div class="block">
      <span class="demonstration pr-10">操作时间</span>
      <el-date-picker
        v-model="value1"
        type="daterange"
        size="mini"
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date"
        style="width:200px"
        class="mr-15"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  accessList: {
    type: Array,
    default: []
  }
})

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const value1 = ref('')

const emit = defineEmits(['on-choose'])
const handleClick = (e) => {
  // chooseAccess.value = e
  // emit('on-choose', chooseAccess.value)
}
</script>
