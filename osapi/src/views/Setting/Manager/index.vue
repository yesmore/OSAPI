<script setup lang="ts">
  import { ref, reactive, onMounted, watch } from 'vue'
  import http from '../../../utils/request'
  import { ToolMsg } from "../../../utils/ToolMsg";
  import { mongoDateFormat } from '../../../utils/common'
  import SearchInput from '../../../components/common/SearchInput.vue'
  import DatePicker from '../../../components/common/DatePicker.vue'

  let data = reactive({
    roleData: [],
    form: {
      username: '',
      password: '',
      role_id: '',
      updatedAt: '',
      status: '1',
      is_super: '0'
    },
  })
  let dialogFormVisible = ref(false)
  let dialogFormVisible1 = ref(false)
  const state1 = ref('')
  const state2 = ref('')
  const restaurants = ref([])
  const roleData = ref({})
  const searchRole = ref([])
  const adminData = ref([])
  const hasAdminData = ref(false)
  const newRoleId = ref('')
  const loading = ref(true)

  const fetchRoles = async () => {
    let res = await http.get('/admin/role')
    if (res.data) {
      res.data.map(item => {
        item.updatedAt = mongoDateFormat(item.updatedAt)
      })
      searchRole.value = res.data
    } else {
      ToolMsg('出错了', 'warning')
    }
    setTimeout(() => {
      loading.value = false
    },5000)
  }
  fetchRoles()

  // 获取用户
  const fetchAdmin = async () => {
    let res = await http.get('/admin/manager')
    if (res.data) {
      res.data.map(item => {
        item.updatedAt = mongoDateFormat(item.updatedAt)
      })
      adminData.value = res.data
      hasAdminData.value = true
      loading.value = false
    } else {
      ToolMsg('出错了', 'warning')
    }
  }
  fetchAdmin()

  // 新增用户
  const newRole = async () =>  {
    dialogFormVisible.value = false
    let { username, password, status, is_super } = data.form
    if (username !== '' && password !=='' && newRoleId.value !== '') {
      let role_id = newRoleId.value
      let res = await http.post('/admin/manager/create', { username, password, role_id,is_super, status })
      if(res.data.status === 200) {
        adminData.value.push(res.data.info)
        fetchAdmin()
        ToolMsg('创建成功', 'success')
      } else if(res.data.status === 403) {
        data.form.username = ''
        ToolMsg('用户已存在', 'warning')
      } else if (res.data.status === 404) {
        ToolMsg('无权限', 'warning')
      } else {
        ToolMsg('出错了', 'warning')
      }
    } else {
      ToolMsg('参数不正确', 'warning')
    }
  }

  // 编辑用户
  const openEdit = (index, row) => {
    dialogFormVisible1.value = true
    // let { _id, oldTitle, oldDescription } = row
    data.form = row
  }
  const submitEdit = async () => {
    if (dialogFormVisible1.value === true) {
      // let { username, _id } = data.form
      let res = await http.post('/admin/manager/edit', data.form)
      if (res.data.status === 200 ) {
        ToolMsg('已保存', 'success')
        fetchAdmin()
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
    /*let res
    if (dialogFormVisible1.value) {
      res = await http.post('/admin/manager/edit', data.form)
    } else {
      res = await http.post('/admin/manager/edit', row)
    }
    if (res.data.status === 200) {
      ToolMsg('修改成功', 'success')
      // fetchDataType()
    } else if (res.data.status === 403) {
      ToolMsg('未修改内容', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }*/
  }

  // 删除用户
  const handleDelete = async (index, row) => {
    let { _id } = row
    let res = await http.post('/admin/manager/delete', { _id })
    if (res.data.status === 200) {
      adminData.value = []
      fetchAdmin()
      ToolMsg('删除成功', 'success')
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  }

  // 新增用户 - 选中角色
  const handleSelectRole = (params: string) => {
    newRoleId.value = params
    // console.log(params)
  }

  const handleSelectionChange = (val) => {
    console.log(val)
  }

  // 给父组件调用
  const sendManager = () => {
    fetchAdmin()
  }
  defineExpose({
    sendManager,
    child: 'ss'
  })
</script>

<template>
  <div  class='animate__animated animate__fadeIn animate__faster'>
    <div class="m-10" style="display: flex;align-items: center">
      <DatePicker></DatePicker>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="success">
        <i class="iconfont icon-quanzhanyunying"></i>
        新增管理员
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
      :data="adminData"
      empty-text="未登陆"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :header-cell-style="{background: 'rgba(0, 0, 0, 0.02)'}"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.01)"
      border
    >
      <el-table-column type="selection" align="center" prop="" label="选择" width="60"></el-table-column>
      <el-table-column prop="updatedAt" label="上次登陆" sortable width="180"></el-table-column>
      <el-table-column prop="username" label="管理员"  />
      <el-table-column prop="role[0].title" label="权限" />
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
      <el-table-column label="操作" width="200">
        <template #header>
          <SearchInput v-if="hasAdminData" :size="'mini'" :showData="adminData"></SearchInput>
        </template>
        <template #default="scope">
          <el-button
            class="px-5"
            icon="el-icon-edit"
            size="mini"
            @click="openEdit(scope.$index, scope.row)"
          ></el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            :trigger-on-focus="false"
            title="确认删除用户？"
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
  <el-dialog v-model="dialogFormVisible" title="新增用户">
    <el-form :model="data.form">
      <el-form-item label="用户名称" label-width="200">
        <el-input v-model="data.form.username" placeholder="请输入用户名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" label-width="200">
        <el-input v-model="data.form.password" placeholder="请输入密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择权限" label-width="200">
        <SearchInput
          v-if="hasAdminData"
          :showData="searchRole"
          @on-select="handleSelectRole"
        ></SearchInput>
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
  <el-dialog v-model="dialogFormVisible1" title="编辑用户">
    <el-form :model="data.form">
      <el-form-item label="用户名称" label-width="200">
        <el-input v-model="data.form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户权限" label-width="200">
        <el-input disabled v-model="data.form.role[0].title" autocomplete="off"></el-input>
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
