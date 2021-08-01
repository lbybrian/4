<template>
  <div class="analysis">
    <el-row>
      <el-col :span="22" :offset="1">
        <SearchCondition :conditions="conditions1" @onChange = "onChangeItem" style="margin-bottom: 10px;" />
<!--        <img class="imgIcon" src="../assets/image/icon7.png" alt="统计本周素材数据" @click="switchWeek"/>-->
<!--        <img class="imgIcon" src="../assets/image/icon30.png" alt="统计本月素材数据" @click="switchMonth"/>-->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="title center">素材数量统计</div>
        <div class="echart" v-show="!noData1" id="echart1" ref="chart1" v-loading="loading" element-loading-text="请求数据中，请稍候" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-spinner="el-icon-loading"></div>
        <div class="echart center borderLine" v-show="noData1">暂无数据</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="title center">素材分类统计</div>
        <div class="echart" v-if="!noData2" id="echart2" ref="chart2" v-loading="loading" element-loading-text="请求数据中，请稍候" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-spinner="el-icon-loading"></div>
        <div class="echart center" v-if="noData2">暂无数据</div>
      </el-col>
      <el-col :span="12">
        <div class="title center">素材按方向统计</div>
        <div class="echart" v-if="!noData3" id="echart3" ref="chart3" v-loading="loading" element-loading-text="请求数据中，请稍候" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-spinner="el-icon-loading"></div>
        <div class="echart center" v-if="noData3">暂无数据</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="title center">要素分析</div>
        <div class="echart" v-if="!noData4" id="echart4" ref="chart4" v-loading="loading" element-loading-text="请求数据中，请稍候" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-spinner="el-icon-loading"></div>
        <div class="echart center" v-if="noData4">暂无数据</div>
      </el-col>
      <el-col :span="12">
        <div class="title center">素材语种统计</div>
        <div class="echart" v-if="!noData5" id="echart5" ref="chart5" v-loading="loading" element-loading-text="请求数据中，请稍候" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-spinner="el-icon-loading"></div>
        <div class="echart center" v-if="noData5">暂无数据</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  // import * as echartsWordCloud from 'echarts-wordcloud'
  import { getWordCloudColor, getPieColor } from "../assets/echartsColor"
  import { formatDate } from '../assets/time'
  import SearchCondition from "../assistReorganizeCommon/SearchCondition";

  const API = '/api'
  const ES = '/sczb-URL-prefix/es'
  // const ES ='/es'
  const CM = '/common'
  const SEARCH = '/cm/dict'
  const WORD = '/cm/entity_info/group'
  const URL = '/index_sczb/sc_info/group'
  export default {
		name: "DXSCrightForm",
    components: {
      SearchCondition
    },
    data() {
		  return {
		    loading: true,
        types: [],
        directions: [],
        languages: [],
        // 时间
        startTime: '',
        endTime: '',
        timeType:"",
        // 没数据样式
        noData1: true,
        noData2: true,
        noData3: true,
        noData4: true,
        noData5: true,
        conditions1: [
          {
            name: "发布时间",
            value: "2",
            type: "dateRange",
            items: [
              {
                name: "本周",
                type: "radio",
                value:"0"
              },
              {
                name: "本月",
                type: "radio",
                value:"1"
              },
              {
                name: "今日",
                type: "radio",
                value:"2"
              },
              ""
            ]
          }
        ],
      }
    },
    created(){
      // 解决右侧统计页面滚动条问题
      $('#elDrawer').children('div').children('div').css('overflow-y','scroll')
      // 设置默认时间
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 45)
      this.startTime = formatDate(start)
      this.endTime = formatDate(end)
      // 渲染各个图表
      this.getType()
      // this.getEcharts()
    },
    mounted () {

    },
    methods: {
		  // 获取类型
      getType() {
        this.ajaxGET(API + SEARCH).then(r => {
          // 分类
          this.types = r.sc_fl
          // 方向
          this.directions = r.sc_fx
          // 语种
          this.languages = r.sys_yz
          this.getEcharts()
        }).catch(e => {
          this.$message({
            message: '获取类型失败：' + e,
            type: 'warning'
          })
        })
      },
      // 各类素材统计 折线图
		  getEcharts1() {
        this.noData1 = false
        var dom = document.getElementById('echart1')
        // var dom = this.$refs.chart1
        if(dom){
          var myChart = echarts.init(dom)
          var _this = this
            this.ajaxGET(ES + URL, {
              types: JSON.stringify({publish_time: 'date'}),
              formats: JSON.stringify({publish_time: 'day'}),
              keys: JSON.stringify(['is_lx', 'publish_time']),
              order: JSON.stringify({is_lx: 'asc', publish_time: 'asc'}),
              statistical_field: 'is_lx',
              startTime: _this.startTime,
              endTime: _this.endTime,
              timeType:_this.timeType,
            }).then(r => {
            let x = []
            let x1 = []
            let x2 = []
            let x3 = []
            let y1 = []
            let y2 = []
            let y3 = []
            if (r[1] !== undefined) {
              x1 = r[1].map(d => {
                return d.publish_time
              })
              y1 = r[1].map(d => {
                return parseInt(d.count)
              })
            }
            if (r[2] !== undefined) {
              x2 = r[2].map(d => {
                return d.publish_time
              })
              y2 = r[2].map(d => {
                return parseInt(d.count)
              })
            }
            if (r[3] !== undefined) {
              x3 = r[3].map(d => {
                return d.publish_time
              })
              y3 = r[3].map(d => {
                return parseInt(d.count)
              })
            }
            if (x1.length > 0) {
              x = x1
            }
            if (x2.length > 0) {
              x = x2
            }
            if (x3.length > 0) {
              x = x3
            }
            if (y1.length === 0) {
              y1 = x.map(_ => {
                return 0
              })
            }
            if (y2.length === 0) {
              y2 = x.map(_ => {
                return 0
              })
            }
            if (y3.length === 0) {
              y3 = x.map(_ => {
                return 0
              })
            }
            let option = {
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                top: 30,
                data: ['文本素材', '非文本素材']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {},
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '文本素材',
                  type: 'line',
                  itemStyle: {
                    normal: {
                      color: '#F2637B', //改变折线点的颜色
                      lineStyle: {
                        color: '#F2637B' //改变折线颜色
                      }
                    }
                  },
                  data: y1
                },
                {
                  name: '非文本素材',
                  type: 'line',
                  itemStyle: {
                    normal: {
                      color: '#36CBCB', //改变折线点的颜色
                      lineStyle: {
                        color: '#36CBCB' //改变折线颜色
                      }
                    }
                  },
                  data: y3
                }
              ]
            }
            myChart.setOption(option, true)
          }).catch(e => {
            this.$message({
              message: '请求统计信息失败：' + e,
              type: 'warning'
            })
          })
        }
      },

      // 分类统计 环形图
      getEcharts2() {
        this.noData2 = false
        var dom2 = document.getElementById('echart2')
        // var dom2 = this.$refs.chart2
        if(dom2){
          var myChart2 = echarts.init(dom2)
          let arr = []
          let x = []
          let color = []
          let arrr = []
          let _this = this
          this.ajaxGET(ES + URL, {
            keys: JSON.stringify(['classify']),
            order: JSON.stringify({is_lx: 'asc'}),
            groupCount: 'asc',
            startTime: _this.startTime,
            endTime: _this.endTime,
            timeType:_this.timeType,
          }).then(r => {
            arr = r.map((d, index) => {
              this.types.forEach(dd => {
                if (dd.value === d.classify) {
                  d.name = dd.name
                  x.push(d.name)
                  color.push(index)
                  return
                }
              })
              d.value = d.count
              return d
            })

            color.forEach(d => {
              arrr.push(getPieColor()[d])
            })

            let option2 = {
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                data: x
              },
              grid:{
              },
              series: [
                {
                  name: '素材分类统计',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: true,
                  // minAngle:300,
                  color: arrr,
                  label: {
                    normal: {
                      show: true,
                      position: 'top',
                      distance: 1,
                      padding: [0, -20],
                      formatter: "{b} : {c} ({d}%)"
                    }
                  },
                  avoidLabelOverlap:true,
                  labelLine: {
                    normal: {
                      show: true
                    }
                  },
                  data: arr
                }
              ]
            }
            myChart2.setOption(option2, true)
          }).catch(e => {
            this.$message({
              message: '请求统计信息失败：' + e,
              type: 'warning'
            })
          })
        }
      },

      // 方向统计 横向柱状图
      getEcharts3() {
        this.noData3 = false
        var dom3 = document.getElementById('echart3')
        // var dom3 = this.$refs.chart3
        if(dom3){
          var myChart3 = echarts.init(dom3)
          var _this  = this
          this.ajaxGET(ES + URL, {
            keys: JSON.stringify(['direction', 'publish_time']),
            order: JSON.stringify({direction: 'asc', publish_time: 'asc'}),
            types: JSON.stringify({publish_time: 'date'}),
            formats: JSON.stringify({publish_time: 'month'}),
            statistical_field: 'direction',
            add_fields: 'publish_time',
            startTime: _this.startTime,
            endTime: _this.endTime,
            timeType:_this.timeType,
            exact_search:JSON.stringify({"is_lx":"1"})
          }).then(r => {
            /*if (JSON.stringify(r) === '{}') {
              this.noData3 = true
              return
            }*/
            let direction = []
            let x = []
            let obj = []
            for (let key in r) {
              this.directions.forEach(d => {
                if (key === d.value) {
                  direction.push(d.name)
                }
              })
              x = r[key].map(d => {
                return d.publish_time
              })
              let y = r[key].map(d => {
                return parseInt(d.count)
              })
              obj.push({
                name: '',
                type: 'bar',
                data: y
              })
              obj.forEach((d, index) => {
                d.name = direction[index]
              })
            }
            let option3 = {
              tooltip: {
                trigger: 'item',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: direction
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                data: x
              },
              series: obj
            }
            myChart3.setOption(option3, true)
          }).catch(e => {
            this.$message({
              message: '请求统计信息失败：' + e,
              type: 'warning'
            })
          })
        }
      },

      // 词云统计 词云图
      getEcharts4() {
        this.noData4 = false
        var arr = []
        var dom4 = document.getElementById('echart4')
        // var dom4 = this.$refs.chart4
        if(dom4){
          var myChart4 = echarts.init(dom4)
          var _this = this
          this.ajaxGET(API + WORD, {
            keys: JSON.stringify(["name"]),
            groupCount: 'desc',
            size: 100,
            left_join: JSON.stringify({
              field:"sc_id",
              index:"index_sczb",
              type:"sc_info",
            }),
            startTime: _this.startTime,
            endTime: _this.endTime,
            timeType:_this.timeType,
          }).then(r => {
            /*if (r.length === 0) {
              this.noData4 = true
              return
            }*/
            arr = r.map(d => {
              let obj = {
                value: d.count,
                name: d.name
              }
              return obj
            })
            let option4 = {
              tooltip: {},
              series: [{
                name: '要素分析',
                type: 'wordCloud',
                size: ['100%', '100%'],
                width: '100%',
                height: '100%',
                left: 'center',
                top: 'center',
                right: null,
                bottom: null,
                rotationRange: [-90, 90],
                rotationStep: 45,
                textPadding: 10,
                drawOutOfBound: true,
                gridSize: 1,
                sizeRange: [14, 25],
                textStyle: {
                  normal: {
                    fontFamily: '微软雅黑',
                    color: function () {
                      return getWordCloudColor()[parseInt(Math.random() * 10 + '', 10)]
                    }
                  }
                },
                data: arr
              }]
            }
            myChart4.setOption(option4, true)
          }).catch(e => {
            this.$message({
              message: '请求统计信息失败：' + e,
              type: 'warning'
            })
          })
        }
      },

      // 语种统计 柱状图
      getEcharts5() {
        this.noData5 = false
        var dom5 = document.getElementById('echart5')
        // var dom5 = this.$refs.chart5
        if(dom5){
          var myChart5 = echarts.init(dom5)
          let arr = []
          let x = []
          let y = []
          var _this = this
          this.ajaxGET(ES + URL, {
            keys: JSON.stringify(['language']),
            order: JSON.stringify({direction:'asc'}),
            startTime: _this.startTime,
            endTime: _this.endTime,
            timeType:_this.timeType,
            exact_search:JSON.stringify({"is_lx":"1"})
          }).then(r => {
            /*if (r.length === 0) {
              this.noData5 = true
              return
            }*/
            arr = r.map(d => {
              this.languages.forEach(dd => {
                if (dd.value === d.language) {
                  d.name = dd.name
                  d.value = d.count
                  x.push(d.name)
                  y.push(d.value)
                  return
                }
              })
              return d
            })
            let option5 = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: x,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '素材数量',
                  type: 'bar',
                  barWidth: '60%',
                  data: y
                }
              ]
            }
            myChart5.setOption(option5, true)
          }).catch(e => {
            this.$message({
              message: '请求统计信息失败：' + e,
              type: 'warning'
            })
          })
        }
      },

      // 获取所有图表数据
		  getEcharts() {
        // 各类素材统计
        this.getEcharts1()
        // 分类统计
        this.getEcharts2()
        // 方向统计
        this.getEcharts3()
        // 词云统计
        this.getEcharts4()
        // 语种统计
        this.getEcharts5()
        // 地域统计
        this.loading = false
      },
      onChangeItem(item){
        this.startTime = ""
        this.endTime = ""
        if(item[0].value == 0){
          this.timeType = 0
        }else if(item[0].value == 1){
          this.timeType = 1
        }else if(item[0].value == 2){
          this.timeType = 2
        }else{
          if(item[0].value == null){
            item[0].value = ""
            this.timeType = 2
          }
          if(item[0].value.length == 0){
            this.startTime = ""
            this.endTime = ""
          }else{
            this.startTime = item[0].value[0]
            this.endTime = item[0].value[1]
            this.timeType = ""
          }
        }
        this.getEcharts()
      },
      // 切换本周数据
      switchWeek() {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 45)
        this.startTime = formatDate(start)
        this.endTime = formatDate(end)
        this.getEcharts()
      },
      // 切换本月数据
      switchMonth() {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
        this.startTime = formatDate(start)
        this.endTime = formatDate(end)
        this.getEcharts()
      },
    }

	}
</script>

<style scoped>
  .analysis{
    width: 100%;
  }
  .center{
    text-align: center;
  }
  .title{
    font-size: 18px;
    margin: 20px 10px;
    padding: 10px;
    background: #eeeeee;
  }
  .echart{
    width: 100%;
    height: 300px;
  }
  .borderLine{
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
  #map .map-title{
    position: absolute;
    right: 5px;
    top: 0;
    z-index: 5;
    font-size:20px;
  }
  .ol-popup {
    display: none;
    position: absolute;
    background-color: white;
    -moz-box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    width: 200px;
  }
  .ol-popup:after, .ol-popup:before {
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
  .popup-title{
    font-weight: bold;
    border-bottom:1px solid #cccccc;
    padding: 5px 8px;
  }
  .popup-content{
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
  .imgIcon{
    cursor: pointer;
  }
</style>
