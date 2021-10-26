<script setup lang="ts">
  import { ref, reactive, watchEffect,watch, onMounted, onUnmounted } from 'vue'
  // import http from '@/utils/request'

  const props = defineProps({
    msg: {
      type: String,
      default: () => '默认值'
    }
  })

  // const resq = async () => {
  //   let res = await http.get('http://v2.aoau.top/')
  //   console.log(res)
  // }
  // resq()

  // 正确定义变量
  const count = ref(0)
  const user = reactive({
    name: '张三'
  })
  const arr = reactive([1, 2, 3])

  // 综合定义方案
  const originData = reactive({
    count: 0,
    user: {
      name: '张三'
    },
    arr: [1,2,3]
  })
  const add = () => {
    originData.count++
    count.value++
    originData.user.name = '而活泼'
  }

  // 子传父
  const emit = defineEmits(['on-change','on-click'])
  const handleClick = () => {
    emit('on-change', '点击调用子组件方法')
  }
  const handleClick2 = () => {
    emit('on-click', '点击')
  }

  const childNode = () => {
    console.log('子组件暴露的方法')
  }
  // 暴露子组件
  defineExpose({
    child: '我是子组件',
    childNode
  })

  // 生命周期
  // setup 围绕 created、beforeCreated 运行，不需要显式定义
  onMounted(() => {
    console.log('onMounted')
  })

  // watch与watchEffect
  // watchEffect(() => console.log(originData.count))
  // 监听单个变量
  // watch(count, (n, o) => console.log(n, o))
  // 监听多个变量
  watch([count, originData.user], (n, o) => console.log(n, o))
  // 页面加载完成就执行监听
  // watch(
  //   [
  //     count,
  //     originData.user
  //   ],
  //   (n, o) => {
  //     console.log(n, o)
  //   },
  //   {
  //     deep: true, // 深度监听
  //     immediate: true
  //   }
  // )
</script>

<template>
  <h1>test</h1>
  <p>{{ props.msg }}</p>
  <button @click="handleClick">点击调用子组件方法</button>
  <button @click="handleClick2">点击</button>
  <hr>
  <p>{{ originData.count }} | {{ originData.user.name }}</p>
  <button @click="add">点击加一</button>
  <p>
    <span v-for='item in originData.arr' :key="item">{{item}}</span>
  </p>
</template>

<style scoped>
</style>
