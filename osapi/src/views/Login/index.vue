<script setup lang="ts">
import {onMounted, onUnmounted, reactive} from 'vue'
import http from '../../utils/request'
import {useRouter} from 'vue-router'
import {useStore} from "../../store";
import {getterLsState, setterLsState} from '../../utils/localStorage'
import { ToolMsg } from "../../utils/ToolMsg";

const router = useRouter()
const store = useStore()
// console.log(getterLsState())
let data = reactive({
  username: '',
  password: '',
  code: '',
  codeUrl: '',
  codeText: ''
})
data.username = getterLsState().username || ''

// 回车事件
const onKeyDown = (e:any) => {
  if(e.keyCode === 13) {
    QLogin()
  }
}
// 登陆前校验格式
const QLogin = () => {
  if (data.username === '') {
    ToolMsg('请输入用户名','warning')
  } else if (data.password.length < 3) {
    ToolMsg('密码长度必须大于6位','warning')
  } else  if(data.code === '') {
    ToolMsg('请输入验证码','warning')
  } else {
    doLogin()
  }
}
// 登陆逻辑
const doLogin = () => {
  const userInfo = {
    username: data.username,
    password: data.password,
    code: data.code,
    currentCode: data.codeText
  }
  http.post('/admin/login/doLogin', userInfo).then(res => {
    // console.log(res)
    if (res.data.status === 200) {
      ToolMsg('登陆成功','success')
      router.push('/home')
      store.commit('SET_LoginState', true)
      store.commit('SET_NAME', data.username)
      setterLsState(store)
    } else if (res.data.status === 201) {
      ToolMsg('验证码错误','warning')
    } else if (res.data.status === 202) {
      ToolMsg('用户名或密码错误','warning')
    } else if (res.data.status === 203) {
      ToolMsg('用户名或密码格式错误','warning')
    }
  })
}

// 获取验证码
const fetchCode = async () => {
  data.code = ''
  http.get('/admin/login/code?r='+Math.random()).then(res => {
    const { codeUrl, codeText } = res.data.info
    data.codeUrl = codeUrl
    data.codeText = codeText
  })
}
fetchCode()

// 监听回车事件
onMounted(() => {
  window.addEventListener('keydown',onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown',onKeyDown, false)
})
</script>

<template>
  <el-row style='margin-top:40px;' class="text-center" :gutter="20">
    <el-col>
      <el-image
        style='height:80px;'
        src="https://cdn.jsdelivr.net/gh/yesmore/img/img/osapi1.png"
        fit="fill"
      ></el-image>
    </el-col>
    <el-col>
      <div class="form" style="">
        <div>
          <el-input v-model="data.username" placeholder="用户名" clearable />
          <el-input class="mt-15" v-model="data.password" placeholder="请输入密码" show-password />
        </div>
        <!-- 验证码 -->
        <div style="margin-top: 15px;display: flex">
          <el-input v-model="data.code" style='width:100px' placeholder="验证码"></el-input>
          <div class="ml-10" @click="fetchCode" v-html='data.codeUrl'></div>
        </div>
        <el-button
          style="width:320px; height:45px; margin-top: 15px"
          plain
          :type="(data.password === '' || data.username==='' || data.code==='') ? 'default' : 'primary' "
          @click="QLogin">
          Sign Up
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
  .form {
    max-width:320px;
    margin:10px auto;
    /*border: 1px solid grey;*/
    padding: 30px;
    border-radius: 5px;
    box-shadow: 1px -1px 3px rgba(128, 128, 128, 0.35);
  }
  .form:hover {
    transition: 0.5s;
    box-shadow: 1px -1px 15px rgba(128, 128, 128, 0.35);
  }
</style>
