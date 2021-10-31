<script setup lang="ts">
  import { reactive } from 'vue'
  import http from '../../../utils/request'
  import { ToolMsg } from "../../../utils/ToolMsg";
  import {getterLsState, setterLsState} from '../../../utils/localStorage'
  import {useRouter} from 'vue-router'
  import {useStore} from "../../../store";

  const store = useStore()
  const router = useRouter()
  let data = reactive({
    form: {
      username: '',
      password: '',
      oldPassword: '',
      oldUsername: ''
    },
  })

  const user = getterLsState().username
  data.form.oldUsername = user
  data.form.username = user

  const submitEdit = async () => {
    if (data.form.username.length>0 && data.form.password.length>=6 && data.form.oldPassword.length>=6) {
      // let { username, _id } = data.form
      let res = await http.post('/admin/manager/edits', data.form)
      if (res.data.status === 200 ) {
        localStorage.setItem('token', '')
        localStorage.setItem('osIP', '')
        store.commit('SET_LoginState', false)
        store.commit('SET_NAME', '')
        setterLsState(store)
        ToolMsg('修改成功，请重新登录', 'success')
        router.push('/login')
      } else if (res.data.status === 403) {
        ToolMsg('未修改内容', 'warning')
      } else if (res.data.status === 404) {
        ToolMsg('无权限', 'warning')
      } else if (res.data.status === 406) {
        ToolMsg('旧密码错误', 'warning')
      } else {
        ToolMsg('出错了', 'warning')
      }
    } else {
      ToolMsg('格式错误', 'warning')
    }
  }

</script>

<template>
  <div class='animate__animated animate__fadeIn animate__faster'>
    <el-card shadow="hover" style="width: 50%; margin: 20px 0">
      <el-form :model="data.form">
        <el-form-item label="用户名" label-width="200">
          <el-input v-model="data.form.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="旧密码" label-width="200">
          <el-input v-model="data.form.oldPassword" show-password placeholder="请输入密码（大于6位）" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="200">
          <el-input v-model="data.form.password" show-password placeholder="请输入密码（大于6位）" autocomplete="off"></el-input>
        </el-form-item>
        <el-button @click="submitEdit"  plain type="success">
          确认
        </el-button>
      </el-form>
    </el-card>

  </div>
</template>

<style scoped lang="less">

</style>
