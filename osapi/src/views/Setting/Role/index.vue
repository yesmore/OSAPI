<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import http from '../../../utils/request'
import {ToolMsg} from "../../../utils/ToolMsg";
import { mongoDateFormat } from '../../../utils/common'
import SearchInput from '../../../components/common/SearchInput.vue'
import Checkbox from '../../../components/common/Checkbox.vue'
import DatePicker from '../../../components/common/DatePicker.vue'

let data = reactive({
  roleData: [],
  form: {
    title: '',
    description: ''
  },
})
let dialogFormVisible = ref(false)
let dialogFormVisible1 = ref(false)
let dialogFormVisible2 = ref(false)
const state2 = ref('')
const restaurants = ref([])
const roleData = ref([])
const hasRoleData = ref(false)
const authOfRole_id = ref('')
const access_node = ref([])
const access_node_buff = ref([])
const accessList = ref([])
const hasAccess = ref(false)
const loading = ref(true)

// 获取角色
const fetchRoles = () => {
  http.get('/admin/role').then(res => {
    if (res.data) {
      res.data.map((item, index) => {
        item.updatedAt = mongoDateFormat(item.updatedAt)
        fetchRoleAccess(item._id, index)
      })
      roleData.value = res.data
      hasRoleData.value = true
      fetchAccess()
    } else {
      ToolMsg('出错了', 'warning')
    }
  })
}
fetchRoles()

// 获取权限模块
const fetchAccess = async () => {
  let res = await http.get('/admin/access')
  if (res.data.status === 200) {
    accessList.value = res.data.info
    hasAccess.value = true
    let map = await http.get('/admin/access/default')
    // 狗头保命 /doge
    for(let i=0; i<roleData.value.length; i++){
      for (let j=0; j<roleData.value[i].accesses.length; j++) {
        for (let m=0; m<map.data.info.length; m++) {
          if(map.data.info?.[m]._id === roleData.value[i].accesses[j] ) {
            roleData.value[i].buffer[j] = map.data.info?.[m].action_name
          }
        }
      }
    }
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
fetchAccess()

// 获取角色权限
const fetchRoleAccess = async (role_id, index) => {
  let res = await http.post('/admin/role/beforeAuth', {role_id})
  roleData.value[index]['accesses'] = res.data.info.role_access
  roleData.value[index]['buffer'] = []
}

// 新增角色
const newRole = async () =>  {
  dialogFormVisible.value = false
  let { title,description } = data.form
  if (title !== '') {
    let res = await http.post('/admin/role/create', { title, description })
    if(res.data.status === 200) {
      roleData.value.push(res.data.info)
      ToolMsg('创建成功', 'success')
    } else if(res.data.status === 403) {
      data.form.title = ''
      ToolMsg('角色已存在', 'warning')
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  } else {
    ToolMsg('请输入角色名称', 'warning')
  }
  data.form.description = ''
}

// 编辑角色
const openEdit = (index, row) => {
  dialogFormVisible1.value = true
  // let { _id, oldTitle, oldDescription } = row
  data.form = row
}
const submitEdit = async () => {
  if (dialogFormVisible1.value === true) {
    let { title, description, _id } = data.form
    let res = await http.post('/admin/role/edit', data.form)
    if (res.data.status === 200 ) {
      ToolMsg('已保存', 'success')
      data.form = { title: '', description: '' }
      // roleData.value = []
      fetchRoles()
      dialogFormVisible1.value = false
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else if (res.data.status === 403) {
      ToolMsg('未修改内容', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  }
}

// 删除角色
const handleDelete = async (index, row) => {
  let { _id } = row
  let res = await http.post('/admin/role/delete', { _id })
  if (res.data.status === 200) {
    roleData.value = []
    fetchRoles()
    ToolMsg('删除成功', 'success')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}

// 角色授权
const openAuth = (index, row) => {
  dialogFormVisible2.value = true
  data.form = row
  authOfRole_id.value = row._id
  // console.log(accessList.value)
}
// 接收子组件check
const handleChoose = (params) => {
  access_node_buff.value = params
}
const submitAuth = async () => {
  access_node_buff.value.map(item => {
    if (item.length === 1) {
      access_node.value.push(item[0])
    } else {
      access_node.value.push(item[1])
    }
  })
  if(access_node.value !== []) {
    let res = await http.post('/admin/role/doAuth', {
      role_id: authOfRole_id.value,
      access_node: access_node.value
    })
    if (res.data.status === 200) {
      ToolMsg('已保存', 'success')
      fetchRoles()
      dialogFormVisible2.value = false
      authOfRole_id.value = ''
      access_node.value = []
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    }
  } else {
    ToolMsg('请选择权限', 'warning')
  }
}
</script>

<template>
  <div class='animate__animated animate__fadeIn animate__faster'>
    <div class="m-10" style="display: flex;align-items: center">
      <DatePicker></DatePicker>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="success">
        <i class="iconfont icon-quanzhanyunying"></i>
        新增角色
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
      :data="roleData"
      empty-text="未登陆"
      :default-sort="{ prop: 'date', order: 'descending' }"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.01)"
      :header-cell-style="{background: 'rgba(0, 0, 0, 0.02)'}"
      border
    >
      <el-table-column type="selection" align="center" prop="" label="选择" width="60"></el-table-column>
      <el-table-column prop="updatedAt" label="更新日期" sortable width="180"></el-table-column>
      <el-table-column prop="title" label="角色名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="buffer" align="center" label="权限" width="120">
        <template #default="scope">
          <el-popover trigger="hover" placement="right">
            <template #reference>
              <div class="name-wrapper">
                共
                <el-tag :type=" scope.row.buffer?scope.row.buffer.length>0?'info':'warning':''" size="medium">
                  {{ scope.row.buffer?scope.row.buffer.length:0 }}
                </el-tag>
                项
              </div>
            </template>
            <div class="d-flex" style="max-height:300px;overflow-y:auto;flex-direction: column">
              <span
                v-for="(item, index) in scope.row.buffer?scope.row.buffer:[]"
                :key=item
                class="fs-xs"
              >
                {{ index+1 }}、{{ item }}
              </span>
            </div>

          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #header>
          <SearchInput v-if="hasRoleData" :size="'mini'" :showData="roleData"></SearchInput>
        </template>
        <template #default="scope">
          <el-button
            class=""
            size="mini"
            @click="openAuth(scope.$index, scope.row)"
          >授权</el-button>
          <el-button
            class="px-5"
            icon="el-icon-edit"
            size="mini"
            @click="openEdit(scope.$index, scope.row)"
          ></el-button>
          <!-- 删除角色 -->
          <el-popconfirm
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
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 新增 -->
  <el-dialog v-model="dialogFormVisible" title="新增角色">
    <el-form :model="data.form">
      <el-form-item label="角色名称" required label-width="200">
        <el-input v-model="data.form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" required label-width="200">
        <el-input v-model="data.form.description" type="textarea" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="newRole"
        >提交</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 编辑 -->
  <el-dialog v-model="dialogFormVisible1" title="编辑角色">
    <el-form :model="data.form">
      <el-form-item label="角色名称" label-width="200">
        <el-input v-model="data.form.title" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" label-width="200">
        <el-input v-model="data.form.description" type="textarea" autocomplete="off"></el-input>
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
  <!-- 授权 -->
  <el-dialog v-model="dialogFormVisible2" title="角色授权">
    <el-form :model="data.form">
      <el-form-item label="角色名称" label-width="200">
        <el-input v-model="data.form.title" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="权限选择" label-width="200">
        <Checkbox
          v-if="hasAccess"
          :accessList="accessList"
          @on-choose="handleChoose"
        ></Checkbox>
        <br>
        <span class="text-danger">注意：修改将重置上次操作！</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="submitAuth"
        >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">

</style>
