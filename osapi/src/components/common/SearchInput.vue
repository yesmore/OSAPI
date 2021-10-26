<script setup lang="ts">
import { ref, reactive } from 'vue'

const state = ref('')
const restaurants = ref([])
const role_id = ref('')

const props = defineProps({
  showData: {
    type: Array
  },
  size: { type: String },
  placeholder: { type: String }
})
// console.log(props.showData,)
// 搜索框
const loadAll = () => {
  let data = []
  props.showData.map(item => {
    item.value = item.title || item.username
    data.push(item)
  })
  return data
}
restaurants.value = loadAll()
// console.log('当前搜索值',restaurants.value)

const querySearch = (queryString: string, cb) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
      0
    )
  }
}

// 子传父
const emit = defineEmits<{
  (event: 'on-select', role_id:string),
  (event: 'on-clear', handleClear:boolean)
}>()
// 选择角色
const handleSelect = (item) => {
  // console.log('选中：',item)
  role_id.value = item._id
  emit('on-select', role_id.value )
}
const handleClear = () => {
  emit('on-clear', true )
}

</script>

<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearch"
    class="inline-input"
    :placeholder="props.placeholder || '输入关键词搜索'"
    :size="props.size || ''"
    @select="handleSelect"
    @clear="handleClear"
    :trigger-on-focus="false"
    clearable
  ></el-autocomplete>
</template>
