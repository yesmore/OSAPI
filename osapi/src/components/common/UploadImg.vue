<script setup lang="ts">
import {ToolMsg} from "../../utils/ToolMsg";

const VITE_APP_BASE_API = import.meta.env.VITE_APP_BASE_API

const actionUrl = VITE_APP_BASE_API + '/admin/focus/upload'
const headers = {
  authorization: 'Bearer ' + localStorage.getItem('token') || '',
}
const props = defineProps({
  form: {}
})
const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 5

  if (!isJPG) {
    ToolMsg('文件格式错误', 'warning')
    return false
  }
  if (!isLt2M) {
    ToolMsg('文件大小超出限制', 'warning')
    return false
  }
  if (props.form.title === '' || props.form.link === '') {
    ToolMsg('请填写完整', 'warning')
    return false
  }
  ToolMsg('上传成功', 'success')
  emit('on-upload', false)
  return isJPG && isLt2M
}
const emit = defineEmits(['on-upload'])

</script>

<template>

  <el-upload
    class="upload-demo"
    drag
    :action="actionUrl"
    :headers="headers"
    multiple
    :data="props.form"
    :before-upload="beforeUpload"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      拖拽图片 <em>或点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        建议图片小于 5M
      </div>
    </template>
  </el-upload>
</template>

<style scoped lang="less">

</style>
