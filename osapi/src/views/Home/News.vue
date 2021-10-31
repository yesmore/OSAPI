<template>
  <el-tabs
    class="pr-20 py-20"
    tab-position="left"
    style="height: 210px; overflow-y: auto"
  >
    <el-tab-pane label="站长消息" class="ml-5 mt-20">
      <div v-if="newsList.length>0">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in newsList"
            v-show="activity.status=='1'"
            :key="index"
            :type="index===0?'primary':''"
            :timestamp="activity.dataAttrs[0].attribute_value+' '+activity.title"
          >
            {{ activity.dataAttrs[1].attribute_value }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-empty v-else description="无消息" :image-size="50">
      </el-empty>
    </el-tab-pane>

    <el-tab-pane label="更新通知" class="ml-5 mt-20">
      <div v-if="updateList.length>0">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in updateList"
            v-show="activity.status=='1'"
            :key="index"
            :type="index===0?'primary':''"
            :timestamp="activity.title+'：'+activity.dataAttrs[0].attribute_value"
          >
           {{ activity.dataAttrs[2].attribute_value }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-empty v-else description="无更新" :image-size="50"></el-empty>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
  import http from "../../utils/request";
  import {ToolMsg} from "../../utils/ToolMsg";
  import {ref} from "vue";

  const dataList = ref([])
  const updateList = ref([])
  const newsList = ref([])

  const fetchData = async () => {
    let res = await http.get('/admin/data')
    if(res.data.status === 200) {
      res.data.info.map((item) => {
        if (updateList.value.length<=2 && item.cate_id === '617cc01920962f3c9c705970') {
          updateList.value.unshift(item)
        } else if (newsList.value.length<=2 && item.cate_id === '617cc02220962f3c9c705971') {
          newsList.value.unshift(item)
        }
      })
    } else if (res.data.status === 404) {
      ToolMsg('无权限', 'warning')
    } else {
      ToolMsg('出错了', 'warning')
    }
  }
  fetchData()


</script>

<style scoped lang="less">

</style>
