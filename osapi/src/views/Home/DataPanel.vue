<template>
  <div :style="{ width: '100%', height: '250px' }">
    <!--<i
      class="p-10 iconfont icon-icon-1"
      @click="refresh"
    ></i>-->
    <div
      v-if="dataCateList.length!==0"
      ref="myChartData"
      id="myChartData"
      :style="{ width: '100%', height: '250px' }"
    >
    </div>
    <el-skeleton v-else class="p-20" :rows="5" animated />
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
      const dataList = ref([])
      const dataCateList = ref([])
      const myChartObj = ref()
      const option = ref()
      const xData_dataCate = ref([])
      const yData_dataCate = ref([])
      const yData_dataCateSon = ref([])

      // 获取数据
      const fetchData = async () => {
        let res = await http.get('/admin/data')
        if(res.data.status === 200) {
          dataList.value = res.data.info
        } else if (res.data.status === 404) {
          ToolMsg('无权限', 'warning')
        } else {
          ToolMsg('出错了', 'warning')
        }
      }
      fetchData()
      // 获取数据分类
      const fetchDataType = async () => {
        let res = await http.get('/admin/dataCate')
        if(res.data.status === 200) {
          res.data.info.map((cate,index) => {
            cate.dataCount = 0 // 分类下初值
            xData_dataCate.value.push(cate.title)
            yData_dataCateSon.value.push(cate.son?cate.son.length:0)
          })
          dataList.value.map((item, i) => {
            res.data.info.map((cate,index) => {
              if(item.cate_id === cate._id) {
                cate.dataCount++
              }
            })
          })
          res.data.info.map((cate) => {
            yData_dataCate.value.push(cate.dataCount)
          })
          dataCateList.value = res.data.info
          // console.log(dataCateList.value)
        } else if (res.data.status === 404) {
          ToolMsg('无权限', 'warning')
        } else {
          ToolMsg('出错了', 'warning')
        }
      }
      fetchDataType()

      // 初始化图表
      const echartsInit = () => {
        const dom = document.getElementById('myChartData');
        const myChart = echarts.init(dom); // 初始化echarts实例

        const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
        option.value = {
          backgroundColor: 'rgba(237,248,255,0.24)',
          title: {
            text: '数据总览',
            textStyle: {
              fontSize: 12,
              fontWeight: 400
            },
            left: 'center',
            top: '5%'
          },
          legend: {
            icon: 'circle',
            top: '5%',
            right: '5%',
            itemWidth: 6,
            itemGap: 20,
            textStyle: {
              color: '#556677'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0
              },
              lineStyle: {
                width: 0
              }
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
          },
          grid: {
            top: '15%'
          },
          xAxis: [{
            type: 'category',
            // data: ['北京', '上海', '广州', '深圳', '香港', '澳门', '台湾'],
            data: xData_dataCate.value,
            axisLine: {
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            },
            axisPointer: {
              label: {
                // padding: [11, 5, 7],
                padding: [0, 0, 10, 0],
                /*
                除了padding[0]建议必须是0之外，其他三项可随意设置
                和CSSpadding相同，[上，右，下，左]
                如果需要下边线超出文字，设左右padding即可，注：左右padding最好相同
                padding[2]的10:
                10 = 文字距下边线的距离 + 下边线的宽度
                如：UI图中文字距下边线距离为7 下边线宽度为2
                则padding: [0, 0, 9, 0]
              */
                // 这里的margin和axisLabel的margin要一致!
                margin: 15,
                // 移入时的字体大小
                fontSize: 12,
                backgroundColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#fff' // 0% 处的颜色
                  }, {
                    // offset: 0.9,
                    offset: 0.86,
                    /*
                    0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）
                  */
                    color: '#fff' // 0% 处的颜色
                  }, {
                    offset: 0.86,
                    color: '#33c0cd' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#33c0cd' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            boundaryGap: false
          }],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCE2E8'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#556677'
                }
              },
              splitLine: {
                show: false
              }
            },
            {
              type: 'value',
              position: 'right',
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#556677'
                },
                formatter: '{value}'
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#DCE2E8'
                }
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '该分类数据总数',
              type: 'line',
              // data: [10, 10, 30, 12, 15, 3, 7],
              data: yData_dataCate.value,
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#9effff'
                },
                  {
                    offset: 1,
                    color: '#9E87FF'
                  }
                ]),
                shadowColor: 'rgba(158,135,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20
              },
              itemStyle: {
                normal: {
                  color: colorList[0],
                  borderColor: colorList[0]
                }
              }
            },
            {
              name: '子分类',
              type: 'line',
              data: yData_dataCateSon.value,
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                  offset: 0,
                  color: '#73DD39'
                },
                  {
                    offset: 1,
                    color: '#73DDFF'
                  }
                ]),
                shadowColor: 'rgba(115,221,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20
              },
              itemStyle: {
                normal: {
                  color: colorList[1],
                  borderColor: colorList[1]
                }
              }
            },
          ]
        };
        // 设置实例参数
        myChart.setOption(option.value);
        return myChart
      }

      // 刷新数据
      /*const refresh = () => {
        dataList.value = []
        dataCateList.value = []
        fetchData()
        fetchDataType()

        setTimeout(() => {
          // myChartObj.value.clear();
          if(dataCateList.value.length > 0) {
            myChartObj.value.setOption(option.value);
          }
        },500)
      }*/

      onMounted(() => {
        setTimeout(() => {
          if(dataCateList.value.length > 0) {
            myChartObj.value = echartsInit()
          }
        },500)
        // if(dataCateList.value.length > 0) {
        //
        // }
        window.addEventListener("resize", () => { myChartObj.value.resize();});
      });
      return {
        dataList,
        dataCateList,

      };
    }
  };
</script>

<style scoped lang="less">

</style>
