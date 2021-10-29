<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import http from "../../../utils/request";
import {mongoDateFormat} from "../../../utils/common";
import {ToolMsg} from "../../../utils/ToolMsg";
import DatePicker from '../../../components/common/DatePicker.vue'
import Checkbox from '../../../components/common/Checkbox.vue'

let data = reactive({
  form: {
    action_name: '', // 操作名称
    module_name: '', // 所属模块
    description: '',
    status: '1',
    module_id: 0,
    type: 1,
    url: '',  // 操作路径
  }
})
const treeProps = ref({
  label: `action_name`,
  children: 'items',
})
let dialogFormVisible = ref(false)
let dialogFormVisible1 = ref(false)
const accessList = ref([])
const currentModule = ref({})
const hasAccesses = ref(false)
const loading = ref(true)
// 获取模块
const fetchAccesses = async () => {
  let res = await http.get('/admin/access')
  if (res.data.info) {
    res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
    })
    accessList.value = res.data.info
    hasAccesses.value = true
    currentModule.value = accessList.value[0]
    loading.value = false
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    loading.value = false
  },5000)
}
fetchAccesses()

// 新增权限
const newRole = async () =>  {
  dialogFormVisible.value = false
  let { action_name,description, module_name, module_id, url } = data.form
  console.log(data.form)
  if (action_name !== '' && description !== '' &&module_name !== '' &&module_id !== '' && url !== '') {
    let res = await http.post('/admin/access/create', data.form)
    if(res.data.status === 200) {
      accessList.value.push(res.data.info)
      fetchAccesses()
      ToolMsg('创建成功', 'success')
    } else if(res.data.status === 403) {
      // data.form.module_name = ''
      // data.form.description = ''
      ToolMsg('权限已存在', 'warning')
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  } else {
    ToolMsg('请输入角色名称', 'warning')
  }

}

// 编辑权限
const openEdit = (index, row) => {
  dialogFormVisible1.value = true
  // let { _id, oldTitle, oldDescription } = row
  data.form = row
}
const submitEdit = async () => {
  if (dialogFormVisible1.value === true) {
    let { title, description, _id } = data.form
    let res = await http.post('/admin/access/edit', data.form)
    if (res.data.status === 200 ) {
      ToolMsg('已保存', 'success')
      // roleData.value = []
      // fetchAccesses()
      dialogFormVisible1.value = false
    } else if (res.data.status === 403) {
      ToolMsg('未修改内容', 'warning')
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  }
}
const changeStatus = async (row) => {
  // let update = row
  let res
  if (dialogFormVisible1.value) {
    res = await http.post('/admin/access/edit', data.form)
  } else {
    res = await http.post('/admin/access/edit', row)
  }
  if (res.data.status === 200) {
    ToolMsg('修改成功', 'success')
    dialogFormVisible1.value = false
  } else if (res.data.status === 403) {
    ToolMsg('未修改内容', 'warning')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}


const handleNodeClick = (data) => {
  if(data.module_id === '0') {
    currentModule.value = data
    // console.log(data)
  }
}
</script>

<template>
  <el-row class='ml-10 animate__animated animate__fadeIn animate__faster'>
    <!-- 模块列表 -->
    <el-col :span="4">
      <el-tag class="my-15" type="info">{{ currentModule.module_name }}({{ currentModule.items?currentModule.items.length:0 }})</el-tag>
      <el-tree
        :data="accessList"
        :props="treeProps"
        :default-expanded-keys="0"
        :width="100"
        accordion
        class="mb-15"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-col>

    <el-col :span="20">
      <div class="m-10" style="display: flex;align-items: center">
        <DatePicker/>
        <el-button @click="dialogFormVisible = true" size="mini" plain type="success">
          <i class="iconfont icon-quanzhanyunying"></i>
          新增权限
        </el-button>
        <el-button @click="dialogFormVisible1 = true" size="mini" plain type="danger">
          <i class="iconfont icon-shanchu3"></i>
          批量删除
        </el-button>
        <el-button @click="dialogFormVisible2 = true" size="mini" plain type="warning">
          <i class="iconfont icon-wenjian"></i>
          导出
        </el-button>
      </div>

      <el-table
        :data="currentModule.items"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.01)"
        :header-cell-style="{background: 'rgba(0, 0, 0, 0.02)'}"
        border
      >
        <el-table-column type="selection" align="center" prop="" label="选择" width="60"></el-table-column>
        <el-table-column prop="action_name" label="操作名称" width="120" />
        <el-table-column prop="module_name" label="所属模块" />
        <el-table-column prop="url" label="请求路径" width="150"/>
        <el-table-column prop="description" label="备注" />
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
        <el-table-column label="操作" width="70">
          <template #default="scope">
            <el-button
              class="px-5"
              icon="el-icon-edit"
              size="mini"
              @click="openEdit(scope.$index, scope.row)"
            ></el-button>
            <!-- 删除角色 -->
            <!--<el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :trigger-on-focus="false"
              title="确认删除角色？"
              @confirm="handleDelete(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button icon="el-icon-delete" size="mini" class="px-5" type="danger"></el-button>
              </template>
            </el-popconfirm>-->
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <!-- 新增权限 -->
  <el-dialog v-model="dialogFormVisible" title="新增权限">
    <el-form :model="data.form">
      <el-form-item label="操作名称" required label-width="200">
        <el-input v-model="data.form.action_name" placeholder="请输入数据类型名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属模块" required label-width="200">
        <el-input v-model="data.form.module_name" placeholder="请输入模块名称" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="模块选择" required label-width="200">
        <el-select
          v-model="data.form.module_id"
          placeholder="请选择权限模块"
          clearable
          filterable
        >
          <el-option
            v-for="item in accessList"
            :key="item._id"
            :label="item.action_name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限类型" required label-width="200">
        <el-select
          v-model="data.form.type"
          placeholder="请选择权限类型"
          clearable
          filterable
        >
          <el-option label="模块" :value="1"></el-option>
          <el-option label="菜单" :value="2"></el-option>
          <el-option label="操作" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模块描述" required label-width="200">
        <el-input v-model="data.form.description" type="textarea" placeholder="请输入模块描述" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="请求路径" required label-width="200">
        <el-input v-model="data.form.url" placeholder="请输入请求路径" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="newRole"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 编辑 -->
  <el-dialog v-model="dialogFormVisible1" title="编辑权限">
    <el-form :model="data.form">
      <el-form-item label="操作名称" required label-width="200">
        <el-input v-model="data.form.action_name" placeholder="请输入数据类型名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属模块" required label-width="200">
        <el-input disabled v-model="data.form.module_name" placeholder="请输入模块名称" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="模块选择" required label-width="200">
        <el-select
          v-model="data.form.module_id"
          placeholder="请选择权限模块"
          clearable
          filterable
          disabled
        >
          <el-option
            v-for="item in accessList"
            :key="item._id"
            :label="item.action_name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限类型" required label-width="200">
        <el-select
          v-model="data.form.type"
          placeholder="请选择权限类型"
          clearable
          filterable
          disabled
        >
          <el-option label="模块" :value="1"></el-option>
          <el-option label="菜单" :value="2"></el-option>
          <el-option label="操作" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模块描述" required label-width="200">
        <el-input v-model="data.form.description" type="textarea" placeholder="请输入模块描述" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="请求路径" required label-width="200">
        <el-input v-model="data.form.url" placeholder="请输入请求路径" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitEdit"
        >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
</style>
