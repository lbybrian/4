<template>
  <div class="analysis"
       style="height: 100%">
    <el-row style="margin-bottom: 10%">
      <el-col :span="22"
              :offset="1">
        <SearchCondition :conditions="conditions1"
                         @onChange="onChangeItem"
                         style="margin-bottom: 10px;" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"
              :offset="3">
        <div class="grid-content bg-purple">
          <div class="echart"
               v-if="!noData1"
               id="noneEchart1"
               v-loading="loading"
               element-loading-text="请求数据中，请稍候"
               element-loading-background="rgba(0, 0, 0, 0.5)"
               element-loading-spinner="el-icon-loading"
               style="width:100%;min-height: 380px;"></div>
          <div class="echart center"
               v-if="noData1">暂无数据</div>
        </div>
      </el-col>
      <el-col :span="8"
              :offset="2">
        <div class="grid-content bg-purple">
          <div class="echart"
               v-if="!noData2"
               id="noneEchart2"
               v-loading="loading"
               element-loading-text="请求数据中，请稍候"
               element-loading-background="rgba(0, 0, 0, 0.5)"
               element-loading-spinner="el-icon-loading"
               style="width:100%;min-height: 380px;"></div>
          <div class="echart center"
               v-if="noData2">暂无数据</div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import * as echartsWordCloud from 'echarts-wordcloud'
import { getWordCloudColor, getPieColor } from "../assets/js/echartsColor"
import { formatDate } from '../assets/js/time'
import SearchCondition from "../assistReorganizeCommon/SearchCondition";
import SearchItem from "../assistReorganizeCommon/SearchItem";
import DataTableItem from "../assistReorganizeCommon/DataTableItem";

const API = '/api'
const URL = ''
export default {
  name: "CBJLrightForm",
  components: {
    SearchCondition
  },
  data () {
    return {
      loading: true,
      types: [],
      directions: [],
      languages: [],
      // 时间
      startTime: '',
      endTime: '',
      // 没数据样式
      noData1: false,
      noData2: false,
      conditions1: [
        {
          name: "发布时间",
          value: "2",
          type: "dateRange",
          items: [
            {
              name: "本周",
              type: "radio",
              value: "0"
            },
            {
              name: "本月",
              type: "radio",
              value: "1"
            },
            {
              name: "今日",
              type: "radio",
              value: "2"
            },
            ""
          ]
        }
      ],
      timeType: ""
    }
  },
  created () {
    // 解决右侧统计页面滚动条问题
    $('#elDrawer').children('div').children('div').css('overflow-y', 'scroll')
    // 设置默认时间
    this.startTime = "";
    this.endTime = "";
    // 渲染各个图表

  },
  mounted () {
    this.getEcharts();
  },
  methods: {
    getEcharts1 () {
      this.ajaxGET(API + '/workzbrwshTjWork', {
        startTime: this.startTime,
        endTime: this.endTime,
        timeType: this.timeType,
        types: JSON.stringify({ "update_time": "date" })
      }).then(r => {
        if (r.data.length === 0) {
          this.noData1 = true
          return
        } else {
          this.noData1 = false
          let domNone2 = document.getElementById('noneEchart1');
          let myChart2 = echarts.init(domNone2);
          let arr = [];
          let oX1 = [];
          let data1 = r.data[0].data;//已创建
          let data2 = r.data[1].data;//已提交
          let legends = [];
          r.data.forEach(item => {
            legends.push(item.name)
          })
          r.x.forEach(item => {
            if (item != null) {
              oX1.push(item)
            }
          })
          let optionData2 = {
            color: ["#79c471", "#c23531"],
            legend: {
              show: true,
              data: legends,
              right: 0,
              top: "12%"
            },
            title: {
              text: "整编任务审核统计：",
              color: "#262829",
              fontSize: "14",
              left: "left",
              top: 0
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              top: "25%",
              left: 0,
              right: 0,
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: oX1,
                axisTick: {
                  show: false,
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisTick: {
                  show: false,
                }
              }
            ],
            series: [
              {
                name: legends[0],
                type: 'bar',
                barGap: "-100%",
                barWidth: '14',
                data: data1
              },
              {
                name: legends[1],
                type: 'bar',
                stack: "审核",
                barWidth: '14',
                data: data2
              }
            ]
          }
          myChart2.setOption(optionData2)
        }
      })

    },
    getEcharts2 () {
      this.ajaxGET(API + '/workzbrwgzlTjWork', {
        startTime: this.startTime,
        endTime: this.endTime,
        timeType: this.timeType

      }).then(r => {
        if (r.data.length === 0) {
          this.noData2 = true
          return
        } else {
          this.noData2 = false
          let domNone2 = document.getElementById('noneEchart2')
          let myChart2 = echarts.init(domNone2)
          let arr = []
          let oX1 = r.x
          let data1 = r.data[0].data//已创建
          let data2 = r.data[1].data//已提交
          let legendsTwo = [];
          r.data.forEach(item => {
            legendsTwo.push(item.name)
          })
          let optionData2 = {
            color: ["#79c471", "#c23531"],
            legend: {
              show: true,
              data: legendsTwo,
              right: 0,
              top: "12%"
            },
            title: {
              text: "整编人员工作量统计：",
              color: "#262829",
              fontSize: "14",
              left: "left",
              top: 0
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              top: "25%",
              left: 0,
              right: 0,

              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: oX1,
                axisTick: {
                  show: false,
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisTick: {
                  show: false,
                }
              }
            ],
            series: [
              {
                name: legendsTwo[0],
                type: 'bar',
                barGap: "-100%",
                barWidth: '14',
                data: data1
              },
              {
                name: legendsTwo[1],
                type: 'bar',
                stack: "审核",
                barWidth: '14',
                data: data2
              }
            ]
          }
          myChart2.setOption(optionData2)
        }
      })

    },
    // 获取所有图表数据
    getEcharts () {
      // 整编任务审核统计
      this.getEcharts1()
      // 整编人员工作量统计
      this.getEcharts2()
      this.loading = false
    },
    onChangeItem (item) {
      this.startTime = ""
      this.endTime = ""

      if (item[0].value == '0') {
        this.timeType = 0
      } else if (item[0].value == '1') {
        this.timeType = 1
      } else if (item[0].value == '2') {
        this.timeType = 2
      } else {
        this.timeType = ""
        if (item[0].value == null) {
          item[0].value = ""
          this.timeType = 2
        }
        if (item[0].value.length == 0) {
          this.startTime = ""
          this.endTime = ""
        } else {
          this.startTime = item[0].value[0]
          this.endTime = item[0].value[1]
          this.timeType = ""
        }
      }
      this.getEcharts()

    },
  }

}
</script>

<style scoped>
.analysis {
  width: 100%;
}
.center {
  text-align: center;
}
.title {
  font-size: 18px;
  margin: 20px 10px;
  padding: 10px;
  background: #eeeeee;
}
.echart {
  width: 100%;
  height: 300px;
}
.borderLine {
  line-height: 300px;
  background: #ffffff;
}
#map {
  border: 0px;
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  font-size: 13px;
  position: relative;
}
#map .map-title {
  position: absolute;
  right: 5px;
  top: 0;
  z-index: 5;
  font-size: 20px;
}
.ol-popup {
  display: none;
  position: absolute;
  background-color: white;
  -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  width: 200px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.popup-title {
  font-weight: bold;
  border-bottom: 1px solid #cccccc;
  padding: 5px 8px;
}
.popup-content {
  padding: 5px 8px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 6px;
  right: 6px;
}
.ol-popup-closer:after {
  content: "✖";
}
.imgIcon {
  cursor: pointer;
}
</style>
