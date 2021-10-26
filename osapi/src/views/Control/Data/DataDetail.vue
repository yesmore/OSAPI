<script setup lang="ts">
import { ref, reactive, watchEffect,watch, onMounted, onUnmounted } from 'vue'
// import http from '@/utils/request'
import {useRouter, onBeforeRouteUpdate, onBeforeRouteLeave} from 'vue-router'
import http from "../../../utils/request";
import {mongoDateFormat} from "../../../utils/common";
import {ToolMsg} from "../../../utils/ToolMsg";
import Editor from '../../../components/common/Editor.vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const dataDetail = ref({})
const dataDetailBuffer = ref({})
const dataList = ref([])
const dataCateList = ref([])
const dataTypeList = ref([])
const dataTypeTitle = ref()
const currentDataType = ref({
  dataTypeAttribute: []
})
const hasDetail = ref(false)
const editorRef = ref({
  syncHTML: Object,
  content: String,
})
const hasSave = ref(false)
const initType = ref(false)
let data = reactive({
  form: {
    title: '',
    data_sn: '',
    sub_title: '',
    data_desc: '',
    data_keywords: '',
    data_content: '',
    data_img: '',
    data_attrs: '',
    data_version: '',

    click_count:'100',
    data_number: '100',
    price: '',
    relation_data: '',

    is_delete: '',
    is_hot: '0',
    is_new: '1',

    cate_id: '',
    data_type_id: '',

    attr_title_list: [],
    attr_id_list: [],
    attr_value_list: [],
    dataAttrs: [],

    status: '1',
    sort: '0'
  }
})
const attr_value_list_buffer = []

// 获取数据
const fetchData = async () => {
  let res = await http.get('/admin/data')
  if(res.data.status === 200) {
    res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
    })
    dataList.value = res.data.info
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    // loading.value = false
  },5000)
}
fetchData()

// 获取数据详情
const fetchDataDetail = async () => {
  if(router.currentRoute.value.query.type === '编辑') {
    let res = await http.get('/admin/data/detail?title='+router.currentRoute.value.query.title)
    if(res.data.status === 200) {
      dataDetail.value = res.data.info
      data.form = dataDetail.value[0]
      dataDetailBuffer.value = dataDetail.value[0]
      hasDetail.value = true
      fetchDataType()
      // console.log('数据详情：',dataDetail.value[0],dataTypeTitle.value)
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
    setTimeout(() => {
      // loading.value = false
    },5000)
  }

}
fetchDataDetail()

// 获取数据分类
const fetchDataCate = async () => {
  let res = await http.get('/admin/dataCate')
  if(res.data.status === 200) {
    res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
    })
    dataCateList.value = res.data.info
    // loading.value = false
    // console.log(dataCateList.value)
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    // loading.value = false
  },5000)
}
fetchDataCate()

// 获取数据类型
const fetchDataType = async () => {
  let res = await http.get('/admin/dataType')
  if(res.data.status === 200) {
    dataTypeList.value = res.data.info
    getCurrentDataType()
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    // loading.value = false
  },5000)
}
fetchDataType()

const getCurrentDataType = () => {
  dataTypeList.value.map((item, index) => {
    if(dataDetail.value[0]?.dataType[0]._id === item._id) {
      currentDataType.value = item
      // console.log('当前类型：', currentDataType.value.dataTypeAttribute)
    }
  })
}

// 新增
const newData = async () =>  {
  delete data.form['_id']
  // console.log(data.form)
  let { title, cate_id, data_type_id, attr_value_list } = data.form
  if (title !== '' && cate_id !== '' && data_type_id !== '' && attr_value_list.length>0) {
    let res = await http.post('/admin/data/create', data.form)
    if(res.data.status === 200) {
      fetchDataDetail()
      router.back()
      // dataCateList.value.push(res.data.info)
      ToolMsg('创建成功', 'success')
    } else if(res.data.status === 403) {
      ToolMsg('数据类型已存在', 'warning')
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  } else {
    ToolMsg('请填写完整', 'warning')
  }
}

// 编辑
const editData = async () => {
  let res = await http.post('/admin/data/edit', data.form)
  if (res.data.status === 200) {
    ToolMsg('修改成功', 'success')
    // fetchDataDetail()

  } else if (res.data.status === 403) {
    ToolMsg('未修改内容', 'warning')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}

// 获取富文本编辑器内容
const getEditor = () => {
  hasSave.value = false
  editorRef.value.syncHTML()
  data.form.data_content = editorRef.value.content.html
}

const submitForm = () => {
  if(router.currentRoute.value.query.type==='编辑') {
    editData()
  } else {
    newData()
  }
  hasSave.value = true
}

const changeDataType = (type) => {
  dataTypeList.value.map(item => {
    if (item._id === type) {
      data.form.attr_id_list = []

      item.dataTypeAttribute.map(item => {
        // console.log(item._id, item.title)
        data.form.attr_id_list.push(item._id)
        data.form.attr_title_list.push(item.title)
      })
    }
  })
}

/*onBeforeRouteLeave((to,from)=>{
  ElMessageBox.confirm('是否保存修改？')
    .then(() => {
      // submitForm()
      console.log('扎心了')
    })
    .catch(() => {
      // catch error
    })

})*/
</script>

<template>
  <div class="m-10 justify-end" style="display: flex;align-items: center">
    <div style="flex: auto">
      <span class="pr-10"><strong>{{router.currentRoute.value.query.type}}数据</strong></span>
    </div>
    <div v-if="router.currentRoute.value.query.type==='编辑'">
      <el-button @click="dialogFormVisible = true" size="mini" plain type="warning">
        <i class="iconfont icon-wenjian"></i>
        导出单例
      </el-button>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="danger">
        <i class="iconfont icon-shanchu3"></i>
        清空
      </el-button>
      <el-button
        class="f-r"
        @click="submitForm"
        size="mini"
        plain
        :type="hasSave?'info':'success'">
        <i class="iconfont icon-wenjian"></i>
        保存
      </el-button>
    </div>
    <div v-else class="mr-10">
      <el-button @click="dialogFormVisible = true" size="mini" plain type="warning">
        <i class="iconfont icon-wenjian"></i>
        导出单例
      </el-button>
      <el-button @click="dialogFormVisible = true" size="mini" plain type="danger">
        <i class="iconfont icon-shanchu3"></i>
        清空
      </el-button>
      <el-button
        @click="submitForm"
        size="mini"
        plain
        :type="hasSave?'info':'success'">
        <i class="iconfont icon-wenjian"></i>
        确认
      </el-button>
    </div>
  </div>

  <el-form ref="form" :model="data.form" label-position='top'>
    <el-tabs class="m-10" type="border-card">
      <!-- 基本信息 -->
      <el-tab-pane class="animate__animated animate__fadeIn animate__faster" label="基础信息">
        <el-form-item label="数据名称" required>
          <el-input v-model="data.form.title"></el-input>
        </el-form-item>
        <el-form-item label="附属名称" required>
          <el-input v-model="data.form.sub_title"></el-input>
        </el-form-item>
        <el-form-item label="数据版本" required>
          <el-input v-model="data.form.data_version"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select
            v-model="data.form.cate_id"
            placeholder="默认新建顶级分类"
            clearable
            filterable
          >
            <el-option
              v-for="item in dataCateList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            >
              <span v-if="item.pid==='0'" class="text-danger">[根] {{item.title }}</span>
              <span v-else>[子] {{item.title }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据价格" required>
          <el-input v-model="data.form.price"></el-input>
        </el-form-item>
        <el-form-item label="数据热度" required>
          <el-input v-model="data.form.sort"></el-input>
        </el-form-item>
        <div class="d-flex">
          <el-form-item label="是否热门">
            <el-switch
              v-model="data.form.is_hot"
              active-color="#FF8080"
              inactive-color="#aaa"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item class="mx-20" label="是否最新">
            <el-switch
              v-model="data.form.is_new"
              active-color="#13ce66"
              inactive-color="#aaa"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch
              v-model="data.form.status"
              active-color="#13ce66"
              inactive-color="#aaa"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item class="ml-20" label="是否软删除">
            <el-switch
              v-model="data.form.is_delete"
              active-color="#FFBB47"
              inactive-color="#aaa"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </div>
      </el-tab-pane>
      <!-- 详情描述 -->
      <el-tab-pane class="animate__animated animate__fadeIn animate__faster" label="详情描述">
        <span></span>
        <el-button @click="getEditor" size="mini" type="success"  plain>自动保存</el-button>
        <el-button @click="getEditor" size="mini" type="danger" plain>清空内容</el-button>
        <el-button @click="getEditor" size="mini" type="info" plain>导入</el-button>
        <el-button @click="getEditor" size="mini" type="info" plain>导出</el-button>
        <span class="f-r pr-50">总字数：<span>{{ data.form.data_content?data.form.data_content.length:0 }}</span></span>
        <Editor
          v-if="hasDetail || router.currentRoute.value.query.type==='新增'"
          ref="editorRef"
          :oldContent="data.form.data_content"
          @input="getEditor"
        ></Editor>
      </el-tab-pane>
      <!-- 数据属性 -->
      <el-tab-pane class="animate__animated animate__fadeIn animate__faster" label="数据属性">
        <el-form-item label="关联数据" required>
          <el-select
            v-model="data.form.relation_data"
            placeholder="请选择关联数据"
            clearable
            filterable
          >
            <el-option
              v-for="item in dataList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            >
              {{item.title }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据图片" required>
          <el-input v-model="data.form.data_img" placeholder="图片链接"></el-input>
        </el-form-item>
        <el-form-item label="更多属性" required>
          <el-input v-model="data.form.data_attrs" placeholder="以“|“分隔"></el-input>
        </el-form-item>
      </el-tab-pane>
      <!-- 数据类型 -->
      <el-tab-pane class="animate__animated animate__fadeIn animate__faster" label="数据类型">
        <el-alert class="p-0" style="padding:0;padding-bottom:5px;margin-bottom:10px">此表单可在<span @click="router.push('/control/dataType')" class="text-blue">数据类型管理</span>自定义添加（动态生成数据类型属性）</el-alert>
        <el-form-item label="数据类型" required>
          <el-select
            v-model="data.form.data_type_id"
            placeholder="请选择数据类型"
            clearable
            filterable
            @change="changeDataType"
            :disabled="router.currentRoute.value.query.type==='编辑'"
          >
            <el-option
              v-for="item in dataTypeList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            ></el-option>
          </el-select>
          <span>（此项不可更改）</span>
        </el-form-item>

        <el-divider>动态属性</el-divider>

        <!-- 编辑 -->
        <div v-if="router.currentRoute.value.query.type==='编辑'">
          <div
            v-for="item in dataTypeList"
            :key="item._id"
          >
            <div v-if="item._id === data.form.data_type_id">
              <el-form-item
                v-for="(type, index) in item.dataTypeAttribute"
                :key="type._id"
                :label="type.title"
                required
              >
                <el-input
                  v-if="type.attr_type==='1'"
                  v-model="data.form.dataAttrs[index].attribute_value"
                ></el-input>
                <el-input
                  v-if="type.attr_type==='2'"
                  v-model="data.form.dataAttrs[index].attribute_value"
                ></el-input>
                <div v-if="type.attr_type==='3'">
                  <el-radio
                    v-model='data.form.dataAttrs[index].attribute_value'
                    v-for="attr in type.attr_value.split(/[(\r\n)\r\n]+/)"
                    :label="attr">
                    {{ attr }}
                  </el-radio>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>

        <!-- 新增 -->
        <div v-else>
          <div
            v-for="item in dataTypeList"
            :key="item._id"
          >
            <div v-if="item._id === data.form.data_type_id">
              <el-form-item
                v-for="(type, index) in item.dataTypeAttribute"
                :key="type._id"
                :label="type.title"
                required
              >
                <el-input v-if="type.attr_type==='1'" v-model="data.form.attr_value_list[index]" ></el-input>
                <el-input v-if="type.attr_type==='2'" v-model="data.form.attr_value_list[index]" ></el-input>
                <div v-if="type.attr_type==='3'">
                  <el-radio
                    v-model='data.form.attr_value_list[index]'
                    v-for="attr in type.attr_value.split(/[(\r\n)\r\n]+/)"
                    :label="attr">
                    {{ attr }}
                  </el-radio>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<style scoped>
</style>
