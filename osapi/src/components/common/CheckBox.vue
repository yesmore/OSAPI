<template>
  <el-cascader
    :options="options"
    :props="{ multiple: true, checkStrictly: true }"
    clearable
    placeholder="请选择"
    @change="handleClick"
  ></el-cascader>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  accessList: {
    type: Array,
    default: []
  }
})

// console.log('接收：',props.accessList)
const options = ref([])
const chooseAccess = ref([])

const makeTree = () => {
  props.accessList.map((item, index) => {
    let option = {
      value: item._id,
      label: item.action_name,
      children: item.items.map(childItem => {
        return {
          value: childItem._id,
          label: childItem.action_name
        }
      })
    }
    options.value.push(option)
  })
}
makeTree()

const emit = defineEmits(['on-choose'])
const handleClick = (e) => {
  chooseAccess.value = e
  emit('on-choose', chooseAccess.value)
}
</script>
