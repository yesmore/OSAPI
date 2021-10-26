<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import http from "../../../utils/request";
import UploadImg from '@/components/common/UploadImg.vue'
import {ToolMsg} from "../../../utils/ToolMsg";
import DatePicker from '../../../components/common/DatePicker.vue'
import {mongoDateFormat} from "../../../utils/common";

let data = reactive({
  form: {
    title: '',
    status: 1,
    foucs_img: '',
    link: '',
    sort: 0
  }
})
let foucsStatus = ref(true)
let dialogFormVisible = ref(false)
let dialogFormVisible1 = ref(false)
const foucsImgList = ref([])
const loading = ref(true)
const VITE_APP_BASE_API = import.meta.env.VITE_APP_BASE_API

// 获取图片
const fetchImg = async () => {
  let res = await http.get('/admin/focus')
  if(res.data.status === 200) {
    res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
      item.preview = VITE_APP_BASE_API + "/"+ item.focus_img
    })
    foucsImgList.value = res.data.info
    loading.value = false
    // console.log(foucsImgList.value)
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    loading.value = false
  },5000)
}
fetchImg()

// 上传
const handleUploadImg = (params) => {
  dialogFormVisible.value = params
  foucsImgList.value = []
  fetchImg()
}

// 删除
const handleDelete = async (index, row) => {
  let { _id } = row
  let res = await http.post('/admin/focus/delete', { _id })
  if (res.data.status === 200) {
    foucsImgList.value = []
    fetchImg()
    ToolMsg('删除成功', 'success')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}

// 编辑
const openEdit = (row) => {
  dialogFormVisible1.value = true
  data.form = row
}
const changeStatus = async (row) => {
  // let update = row
  let res
  if (dialogFormVisible1.value) {
    res = await http.post('/admin/focus/edit', data.form)
  } else {
    res = await http.post('/admin/focus/edit', row)
  }
  if (res.data.status === 200) {
    ToolMsg('修改成功', 'success')
    dialogFormVisible1.value = false
    data.form.foucs_img = ''
    data.form.link = ''
    data.form.title = ''
    fetchImg()
  } else if (res.data.status === 403) {
    ToolMsg('未修改内容', 'warning')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}
</script>

<template>
  <div  class='animate__animated animate__fadeIn animate__faster'>
    <div class="m-10" style="display: flex;align-items: center">
      <DatePicker></DatePicker>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="success">
        <i class="iconfont icon-quanzhanyunying"></i>
        新增图片
      </el-button>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="danger">
        <i class="iconfont icon-shanchu3"></i>
        批量删除
      </el-button>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="warning">
        <i class="iconfont icon-wenjian"></i>
        导出
      </el-button>
    </div>

    <el-table
      :data="foucsImgList"
      empty-text="未登陆"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :header-cell-style="{background: 'rgba(0, 0, 0, 0.02)'}"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中..."
      element-loading-background="rgba(0, 0, 0, 0.01)"
      border
    >
      <el-table-column type="selection" align="center" prop="" label="选择" width="60"></el-table-column>
      <el-table-column prop="updatedAt" label="更新日期" sortable width="180"></el-table-column>
      <el-table-column prop="title" label="图片名称" width="120"/>
      <el-table-column prop="focus_img" align="center" label="图片地址" width="100" >
        <template #default="scope">
          <el-popover trigger="hover" placement="right">
            <template #reference>
              <div class="name-wrapper">
                <el-tag type="info" size="medium">
                  预览
                </el-tag>
              </div>
            </template>
            <a target="_blank" class="text-grey" :href="scope.row.preview">
              <el-image
                fit="contain"
                :src="scope.row.preview"
              >
              </el-image>
              <!--{{ scope.row.preview }}-->
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="link" label="跳转地址"></el-table-column>
      <el-table-column prop="sort" align="center" label="热度" width="60"></el-table-column>
      <el-table-column prop="status" label="启用" width="60" align="center">
        <template #default="scope">
          <div class="name-wrapper">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#aaa"
              active-value="1"
              inactive-value="0"
              @change="changeStatus(scope.row)"
            ></el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            class="px-5"
            icon="el-icon-edit"
            size="mini"
            @click="openEdit(scope.row)"
          ></el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            :trigger-on-focus="false"
            title="确认删除图片？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button icon="el-icon-delete" size="mini" class="px-5" type="danger"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增 -->
  <el-dialog v-model="dialogFormVisible" title="新增图片">
    <el-form :model="data.form">
      <el-form-item label="图片名称" required label-width="200">
        <el-input v-model="data.form.title" placeholder="请输入图片名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="跳转地址" required label-width="200">
        <el-input v-model="data.form.link" placeholder="请输入跳转地址" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图片热度" required label-width="200">
        <el-input v-model="data.form.sort" placeholder="默认为0" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择图片" required label-width="200">
        <UploadImg
          :form="data.form"
          @on-upload="handleUploadImg"
        ></UploadImg>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑 -->
  <el-dialog v-model="dialogFormVisible1" title="编辑图片">
    <el-form :model="data.form">
      <el-form-item label="图片名称" required label-width="200">
        <el-input v-model="data.form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="跳转地址" required label-width="200">
        <el-input v-model="data.form.link" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图片热度" required label-width="200">
        <el-input v-model="data.form.sort" placeholder="默认为0" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeStatus"
        >保存</el-button
        >
      </span>
    </template>
  </el-dialog>

</template>

<style scoped lang="less">

</style>
