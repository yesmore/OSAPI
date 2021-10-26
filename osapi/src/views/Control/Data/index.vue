<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import http from "../../../utils/request";
import {ToolMsg} from "../../../utils/ToolMsg";
import DatePicker from '../../../components/common/DatePicker.vue'
import {mongoDateFormat} from "../../../utils/common";
import DataDetail from './DataDetail.vue'
import SearchInput from '../../../components/common/SearchInput.vue'

const router = useRouter()
onBeforeRouteUpdate((to, from)=>{
  if(from.path === '/control/data/detail') {
    // console.log(from.path);
    fetchData()
  }
})

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

    status: '1',
    sort: '0'
  }
})
let dataTypeStatus = ref(true)
let dialogFormVisible = ref(false)
let dialogFormVisible1 = ref(false)
const dataList = ref([])
const dataListInPage = ref([])
const dataListBuffer = ref([])
const hasDataList = ref(false)
const loading = ref(true)
const VITE_APP_BASE_API = import.meta.env.VITE_APP_BASE_API
const pageSize = ref(2)
const currentPage = ref(0)

// 获取数据
const fetchData = async () => {
  let res = await http.get('/admin/data')
  if(res.data.status === 200) {
    res.data.info.map(item => {
      item.updatedAt = mongoDateFormat(item.updatedAt)
    })
    dataList.value = res.data.info
    hasDataList.value = true
    loading.value = false
    // console.log(dataList.value)
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
  setTimeout(() => {
    loading.value = false
  },5000)
}
fetchData()

const currentData = () => {

}

// 新增
const newDataCate = async () =>  {
  delete data.form['_id']
  let { title } = data.form
  if (title !== '') {
    let res = await http.post('/admin/data/create', data.form)
    if(res.data.status === 200) {
      fetchData()
      // dataList.value.push(res.data.info)
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
  let res = await http.post('/admin/data/delete', { _id })
  if (res.data.status === 200) {
    dataList.value = []
    fetchData()
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
    res = await http.post('/admin/data/edit', data.form)
  } else {
    res = await http.post('/admin/data/edit', row)
  }
  if (res.data.status === 200) {
    // ToolMsg('修改成功', 'success')
    fetchData()
    dialogFormVisible1.value = false
  } else if (res.data.status === 403) {
    ToolMsg('未修改内容', 'warning')
  } else if (res.data.status === 404) {
    ToolMsg('无权限', 'warning')
  } else {
    ToolMsg('出错了', 'warning')
  }
}

// 搜索框选中
const handleSelect = (params) => {
  dataList.value.map(item => {
    if (item._id === params) {
      console.log(item)
      dataListBuffer.value = dataList.value
      dataList.value = []
      dataList.value[0] = item
    }
  })
}
const handleClear = (params) =>{
  dataList.value = []
  dataList.value = dataListBuffer.value
}
</script>

<template>
  <div v-if="router.currentRoute.value.path==='/control/data'">
    <div class=' animate__animated animate__fadeIn animate__faster'>
      <div class="m-10" style="display: flex;align-items: center">
        <DatePicker></DatePicker>
        <el-button @click="router.push({name:'controlDataDetail',query:{ title: '新建数据', type: '新增'}} )" size="mini" plain type="success">
          <i class="iconfont icon-quanzhanyunying"></i>
          新增数据
        </el-button>
        <el-button @click="dialogFormVisible = true" size="mini" plain type="danger">
          <i class="iconfont icon-shanchu3"></i>
          批量删除
        </el-button>
        <el-button @click="dialogFormVisible = true" size="mini" plain type="warning">
          <i class="iconfont icon-wenjian"></i>
          导出
        </el-button>
        <SearchInput
          v-if="hasDataList"
          :size="'small'"
          :placeholder="'输入数据名称搜索'"
          :showData="dataList"
          @on-select="handleSelect"
          @on-clear="handleClear"
          class="ml-10"
        ></SearchInput>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="dataList.length"
        >
        </el-pagination>
      </div>

      <el-table
        :data="dataList"
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
        <el-table-column type="selection" align="center" label="选择" width="60"></el-table-column>
        <el-table-column prop="title" label="数据名称" width="100"></el-table-column>
        <el-table-column prop="data_version" label="版本" width="100"></el-table-column>
        <el-table-column prop="cate_id.title" label="数据分类">
          <template #default="scope">
            {{ scope.row.dataCate[0].title }}
          </template>
        </el-table-column>
        <el-table-column label="数据类型">
          <template #default="scope">
            {{scope.row.dataType[0].title}}
          </template>
        </el-table-column>
        <el-table-column prop="sort" align="center" label="热度" width="60"></el-table-column>
        <el-table-column label="热门" width="60" align="center">
          <template #default="scope">
            <div class="name-wrapper">
              <el-switch
                v-model="scope.row.is_hot"
                active-color="#FF8080"
                inactive-color="#aaa"
                active-value="1"
                inactive-value="0"
                @change="changeStatus(scope.row)"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
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
        <el-table-column label="删除" width="60" align="center">
          <template #default="scope">
            <div class="name-wrapper">
              <el-switch
                v-model="scope.row.is_delete"
                active-color="#FFBB47"
                inactive-color="#aaa"
                active-value="1"
                inactive-value="0"
                @change="changeStatus(scope.row)"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template #default="scope">
            <el-button
              class="px-5"
              icon="el-icon-edit"
              size="mini"
              @click="router.push({name:'controlDataDetail',query:{ title: scope.row.title, type: '编辑'}} )"
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

      <el-pagination
        background
        class="mt-10 text-center"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="dataList.length"
      ></el-pagination>
    </div>

    <!-- 新增 -->
    <el-dialog v-model="dialogFormVisible" title="新增数据">
      <el-form :model="data.form">
        <el-form-item label="分类名称" required label-width="200">
          <el-input v-model="data.form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" required label-width="200">
          <el-select
            v-model="data.form.pid"
            placeholder="默认创建顶级分类"
            clearable
            filterable
          >
            <el-option
              v-for="item in dataList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            ></el-option>
          </el-select>
          <span>（‘0’表示顶级分类）</span>
        </el-form-item>
        <el-form-item label="分类标题" required label-width="200">
          <el-input v-model="data.form.sub_title" placeholder="SEO标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键词" required label-width="200">
          <el-input v-model="data.form.keywords" placeholder="SEO关键词" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" required label-width="200">
          <el-input v-model="data.form.description" placeholder="SEO描述" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" required label-width="200">
          <el-input v-model="data.form.link" placeholder="请输入链接地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类热度" required label-width="200">
          <el-input v-model="data.form.sort" placeholder="默认为0" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="newDataCate"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog v-model="dialogFormVisible1" title="编辑分类">
      <el-form :model="data.form">
        <el-form-item label="分类名称" required label-width="200">
          <el-input v-model="data.form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" required label-width="200">
          <el-select
            v-model="data.form.pid"
            placeholder="默认创建顶级分类"
            clearable
            filterable
            disabled
          >
            <el-option
              v-for="item in dataList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            ></el-option>
          </el-select>
          <span>（‘0’表示顶级分类）</span>
        </el-form-item>
        <el-form-item label="分类标题" required label-width="200">
          <el-input v-model="data.form.sub_title" placeholder="SEO标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键词" required label-width="200">
          <el-input v-model="data.form.keywords" placeholder="SEO关键词" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" required label-width="200">
          <el-input v-model="data.form.description" placeholder="SEO描述" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" required label-width="200">
          <el-input v-model="data.form.link" placeholder="请输入链接地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类热度" required label-width="200">
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
