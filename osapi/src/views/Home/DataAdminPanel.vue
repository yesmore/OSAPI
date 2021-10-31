<template>
  <div :style="{ width: '100%', height: '250px' }">
    <div
      v-if="accessList.length!==0"
      ref="myChartAdmin"
      id="myChartAdmin"
      :style="{ width: '100%', height: '250px' }"
    >
    </div>
    <el-skeleton v-else animated>
      <template #template>
        <el-skeleton-item variant="image" style="" />
        <el-skeleton-item variant="p" style="height:240px" />
      </template>
    </el-skeleton>
  </div>

</template>

<script>
  import {getCurrentInstance, onMounted, ref} from 'vue';
  import * as echarts from 'echarts'
  import http from "../../utils/request";
  import {mongoDateFormat} from "../../utils/common";
  import {ToolMsg} from "../../utils/ToolMsg";

  export default {
    setup() {
      const accessList = ref([])
      const chartData = ref([])
      const dataCateList = ref([])
      const myChartObj = ref()

      // 获取模块
      const fetchAccesses = async () => {
        let res = await http.get('/admin/access')
        if (res.data.info) {
          res.data.info.map(item => {
            item.updatedAt = mongoDateFormat(item.updatedAt)
          })
          accessList.value = res.data.info.slice(0, 3)
          accessList.value.map(item => {
            let data = {
              name: item.module_name,
              value: item.items.length,
              unit: '哈哈'
            }
            chartData.value.push(data)
          })
        } else if (res.data.status === 404) {
          ToolMsg('无权限', 'warning')
        } else {
          ToolMsg('出错了', 'warning')
        }
      }
      fetchAccesses()

      // 初始化图表
      const echartsInit = () => {
        const dom = document.getElementById('myChartAdmin');
        const myChart = echarts.init(dom); // 初始化echarts实例

        let dashedPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAAOBAMAAAB6G1V9AAAAD1BMVEX////Kysrk5OTj4+TJycoJ0iFPAAAAG0lEQVQ4y2MYBaNgGAMTQQVFOiABhlEwCugOAMqzCykGOeENAAAAAElFTkSuQmCC';
        let color = ['#FF8700', '#ffc300', '#00e473', '#009DFF'];

        let arrName = [];
        let arrValue = [];
        let sum = 0;
        let pieSeries = [], lineYAxis = [];

        // 数据处理
        chartData.value.forEach((v, i) => {
          arrName.push(v.name);
          arrValue.push(v.value);
          sum = sum + v.value;
        })

        // 图表option整理
        chartData.value.forEach((v, i) => {
          pieSeries.push({
            name: '学历',
            type: 'pie',
            clockWise: false,
            hoverAnimation: true,
            radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
            center: ["30%", "50%"],
            label: {
              show: false
            },
            data: [{
              value: v.value,
              name: v.name
            }, {
              value: sum - v.value,
              name: '',
              itemStyle: {
                color: "rgba(0,0,0,0)"
              }
            }]
          });
          pieSeries.push({
            name: '',
            type: 'pie',
            silent: true,
            z: 1,
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [65 - i * 15 + '%',57 - i * 15 + '%'],
            center: ["30%", "50%"],
            label: {
              show: false
            },
            data: [{
              value: 7.5,
              itemStyle: {
                color: "#E3F0FF"
              }
            }, {
              value: 2.5,
              name: '',
              itemStyle: {
                color: "rgba(0,0,0,0)"
              }
            }]
          });
          v.percent = (v.value / sum * 100).toFixed(1) + "%";
          lineYAxis.push({
            value: i,
            textStyle: {
              rich: {
                circle: {
                  color: color[i],
                  padding: [0, 5]
                }
              }
            }
          });
        })

        let option = {
          title: {
            text: '权限模块总览',
            textStyle: {
              fontSize: 12,
              fontWeight: 400
            },
            left: 'center',
            top: '5%'
          },
          backgroundColor: 'rgba(237,248,255,0.24)',
          color: color,
          grid: {
            top: '15%',
            bottom: '54%',
            left: "30%",
            containLabel: false
          },
          yAxis: [{
            type: 'category',
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: function(params) {
                let item = chartData.value[params];
                // console.log(item)
                return '{line|}{circle|●}{name|'+ item.name +'}{bd||}{value|'+item.value+'}{unit|个操作权限}'
              },
              interval: 0,
              inside: true,
              textStyle: {
                color: "#333",
                fontSize: 14,
                rich: {
                  line: {
                    width: 60, // 虚线长度
                    height: 10,
                    backgroundColor: {image: dashedPic}
                  },
                  name: {
                    color: '#666',
                    fontSize: 14,
                  },
                  bd: {
                    color: '#ccc',
                    padding: [0, 5],
                    fontSize: 14,
                  },
                  percent:{
                    color: '#333',
                    fontSize: 14,
                  },
                  value: {
                    color: '#333',
                    fontSize: 12,
                    fontWeight: 500,
                    padding: [0, 0, 0, 0]
                  },
                  unit: {
                    fontSize: 12
                  }
                }
              },
              show: true
            },
            data: lineYAxis
          }],
          xAxis: [{
            show: true
          }],
          series: pieSeries
        };
        // 设置实例参数
        myChart.setOption(option);
        return myChart
      }

      onMounted(() => {
        setTimeout(() => {
          // console.log('chartData表数据：',chartData.value)
          if(chartData.value.length > 0) {
            myChartObj.value = echartsInit()
          }
        },300)
        // if(dataCateList.value.length > 0) {
        // }
        window.addEventListener("resize", () => { myChartObj.value.resize();});

      });
      return {
        accessList
      };
    }
  };
</script>

<style scoped lang="less">

</style>
