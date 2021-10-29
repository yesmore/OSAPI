<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import http from "../../../utils/request";
import {ToolMsg} from "../../../utils/ToolMsg";
import DatePicker from '../../../components/common/DatePicker.vue'
import {mongoDateFormat} from "../../../utils/common";
const router = useRouter()

let data = reactive({
  form: {
    title: '',
    status: '1',
    description: '',
    sort: 0
  }
})
let dataTypeStatus = ref(true)
let dialogFormVisible = ref(false)
let dialogFormVisible1 = ref(false)
const dataTypeList = ref([])
const loading = ref(true)
const VITE_APP_BASE_API = import.meta.env.VITE_APP_BASE_API

// 获取数据类型
const fetchDataType = async () => {
  let res = await http.get('/admin/dataType')
  if(res.data.status === 200) {
    /*res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
    })*/
    dataTypeList.value = res.data.info
    loading.value = false
    // console.log(dataTypeList.value)
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    loading.value = false
  },5000)
}
fetchDataType()

// 新增
const newDataType = async () =>  {
  delete data.form['_id']
  let { title } = data.form
  if (title !== '') {
    let res = await http.post('/admin/dataType/create', data.form)
    if(res.data.status === 200) {
      dataTypeList.value.push(res.data.info)
      fetchDataType()
      dialogFormVisible.value = false
      ToolMsg('创建成功', 'success')
    } else if(res.data.status === 403) {
      ToolMsg('数据类型已存在', 'warning')
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  } else {
    ToolMsg('参数不正确', 'warning')
  }
}

// 删除
const handleDelete = async (index, row) => {
  let { _id } = row
  let res = await http.post('/admin/dataType/delete', { _id })
  if (res.data.status === 200) {
    dataTypeList.value = []
    fetchDataType()
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
    res = await http.post('/admin/dataType/edit', data.form)
  } else {
    res = await http.post('/admin/dataType/edit', row)
  }
  if (res.data.status === 200) {
    ToolMsg('修改成功', 'success')
    dialogFormVisible1.value = false
    // fetchDataType()
  } else if (res.data.status === 403) {
    ToolMsg('未修改内容', 'warning')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}

// 数据类型属性管理
const openAttribute = (row) => {
  let {_id, title} = row
  router.push({ name:'controlDataTypeAttribute', query: { _id,title }})
}
</script>

<template>
  <div v-if="router.currentRoute.value.path==='/control/dataType'">
    <div  class='animate__animated animate__fadeIn animate__faster'>
      <div class="m-10" style="display: flex;align-items: center">
        <DatePicker></DatePicker>
        <el-button @click="dialogFormVisible = true" size="mini" plain type="success">
          <i class="iconfont icon-quanzhanyunying"></i>
          新增数据类型
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
        :data="dataTypeList"
        empty-text="未登陆"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        :header-cell-style="{background: 'rgba(0, 0, 0, 0.02)'}"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.01)"
        border
      >
        <el-table-column type="selection" align="center" prop="" label="选择" width="60"></el-table-column>
        <el-table-column prop="title" label="数据类型" width="120"/>
        <el-table-column label="类型属性"  align="center" width="120">
          <template #default="scope">
            <el-popover trigger="hover" placement="right">
              <template #reference>
                <div class="name-wrapper">
                  共
                  <el-tag :type="scope.row.dataTypeAttribute?.length>0?'info':'warning'" size="medium">
                    {{ scope.row.dataTypeAttribute?scope.row.dataTypeAttribute?.length:0 }}
                  </el-tag>
                  项
                </div>
              </template>
              <div class="d-flex" style="max-height:300px;overflow-y:auto;flex-direction: column">
              <span
                v-for="(item, index) in scope.row.dataTypeAttribute"
                :key=item
                class="fs-xs"
              >
                {{ index+1 }}、{{ item.title }}
              </span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="类型描述"/>
        <el-table-column prop="sort" sortable align="center" label="热度" width="80"></el-table-column>
        <el-table-column label="启用" width="60" align="center">
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
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              class="px-5"
              size="mini"
              type="primary"
              plain
              @click="openAttribute(scope.row)"
            >属性管理</el-button>
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
              title="确认删除数据类型？"
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
    <el-dialog v-model="dialogFormVisible" title="新增数据类型">
      <el-form :model="data.form">
        <el-form-item label="数据类型" required label-width="200">
          <el-input v-model="data.form.title" placeholder="请输入数据类型名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型描述" label-width="200">
          <el-input v-model="data.form.description" type="textarea" placeholder="请输入跳转地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型热度" label-width="200">
          <el-input v-model="data.form.sort" placeholder="默认为0" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="newDataType"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog v-model="dialogFormVisible1" title="编辑数据类型">
      <el-form :model="data.form">
        <el-form-item label="数据类型" required label-width="200">
          <el-input v-model="data.form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型描述" label-width="200">
          <el-input v-model="data.form.description" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型热度" label-width="200">
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
  </div>

  <router-view v-else></router-view>
</template>
