<script setup lang="ts">
import { useRouter } from 'vue-router'
import http from "../../../utils/request";
import {mongoDateFormat} from "../../../utils/common";
import {ToolMsg} from "../../../utils/ToolMsg";
import {reactive, ref} from "vue";
import DatePicker from '../../../components/common/DatePicker.vue'

const router = useRouter()

const dataTypeId = router.currentRoute.value.query._id
const dataTypeTitle = router.currentRoute.value.query.title
let data = reactive({
  form: {
    title: '',
    status: '1',
    attr_type: '1', // 默认input
    attr_value: '',  // 对应为空
    cate_id: dataTypeId,
  }
})
let dialogFormVisible = ref(false)
let dialogFormVisible1 = ref(false)
const dataTypeAttributeList = ref([])
const loading = ref(true)

// 获取类型属性
const fetchDataType = async () => {
  let res = await http.get('/admin/dataTypeAttribute')
  if(res.data.status === 200) {
    res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
    })
    dataTypeAttributeList.value = res.data.info
    loading.value = false
    // console.log(dataTypeAttributeList.value)
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
const newDataTypeAttribute = async () =>  {
  delete data.form['_id']
  let { title, attr_type, cate_id  } = data.form
  // console.log(data.form)
  if (title !== '' && attr_type !=='' && cate_id !== '') {
    let res = await http.post('/admin/dataTypeAttribute/create', data.form)
    if(res.data.status === 200) {
      dataTypeAttributeList.value.push(res.data.info)
      fetchDataType()
      dialogFormVisible.value = false
      ToolMsg('创建成功', 'success')
    } else if(res.data.status === 403) {
      ToolMsg('类型属性已存在', 'warning')
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
  let res = await http.post('/admin/dataTypeAttribute/delete', { _id })
  if (res.data.status === 200) {
    dataTypeAttributeList.value = []
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
    res = await http.post('/admin/dataTypeAttribute/edit', data.form)
  } else {
    res = await http.post('/admin/dataTypeAttribute/edit', row)
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

</script>

<template>
  <div  class='animate__animated animate__fadeIn animate__faster'>
    <div class="m-10" style="display: flex;align-items: center">
      <DatePicker></DatePicker>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="success">
        <i class="iconfont icon-quanzhanyunying"></i>
        新增属性
      </el-button>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="danger">
        <i class="iconfont icon-shanchu3"></i>
        批量删除
      </el-button>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="warning">
        <i class="iconfont icon-wenjian"></i>
        导出
      </el-button>
      <span class="pl-10">当前数据类型：<strong>{{dataTypeTitle }}</strong></span>
    </div>

    <el-table
      :data="dataTypeAttributeList"
      empty-text="未登陆"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :header-cell-style="{background: 'rgba(0, 0, 0, 0.02)'}"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.01)"
      border
    >
      <el-table-column type="selection" align="center" prop="" label="选择" width="60"></el-table-column>
      <el-table-column prop="title" label="属性名称" width="120"/>
      <el-table-column prop="dataType[0].title" label="数据类型" width="120"/>
      <el-table-column prop="attr_type" label="录入方式"  width="100"  align="center">
        <template #default="scope">
          {{ scope.row.attr_type==='1'?'单行文本框': scope.row.attr_type==='2'?'多行文本框':'自定义'}}
        </template>
      </el-table-column>
      <el-table-column prop="attr_value" label="可选值列表">
        <template #default="scope">
          {{ scope.row.attr_type==='3' ? scope.row.attr_value :'无'}}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新日期" sortable width="180"></el-table-column>
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
      <el-table-column label="操作" width="130">
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
            title="确认删除类型属性？"
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
  <el-dialog v-model="dialogFormVisible" title="新增属性">
    <el-form :model="data.form">
      <el-form-item label="属性名称" required label-width="200">
        <el-input v-model="data.form.title" placeholder="请输入属性名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属类型" required label-width="200">
        <el-input v-model="dataTypeTitle" disabled placeholder="" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="录入方式" required label-width="200">
        <el-radio-group v-model="data.form.attr_type">
          <el-radio label="1">单行文本框</el-radio>
          <el-radio label="2">多行文本框</el-radio>
          <el-radio label="3">多选框（下方填写，一行一属性，使用回车间隔）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可选值列表" label-width="200">
        <el-input v-model="data.form.attr_value" :disabled="data.form.attr_type!=='3'" placeholder="默认无" type="textarea" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="newDataTypeAttribute"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 编辑 -->
  <el-dialog v-model="dialogFormVisible1" title="编辑属性">
    <el-form :model="data.form">
      <el-form-item label="属性名称" required label-width="200">
        <el-input v-model="data.form.title" placeholder="请输入属性名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属类型" required label-width="200">
        <el-input v-model="dataTypeTitle" disabled placeholder="" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="录入方式" required label-width="200">
        <el-radio-group v-model="data.form.attr_type">
          <el-radio label="1">单行文本框</el-radio>
          <el-radio label="2">多行文本框</el-radio>
          <el-radio label="3">多选框（下方填写，一行一属性，使用回车间隔）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可选值列表" label-width="200">
        <el-input v-model="data.form.attr_value" :disabled="data.form.attr_type!=='3'" placeholder="默认无" type="textarea" autocomplete="off"></el-input>
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
