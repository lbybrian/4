<template>
  <div class="allBox">
    <el-row>
      <el-col :span="6" class="box-card-img">
        <el-card v-for="(card, index) in cardList" :key="index" class="box-card"  v-dragging="{ item: card, list: cardList, group: card.id }" :style="showSign?'border: 2px solid red;':''">
          <!-- <el-image class="card-img" :src="card.imgUrl" @drop="MoveImg(card.id)" @dragover="ShowBorderSign()"> -->
          <!-- <el-image class="card-img" :src="card.imgUrl" @mouseup="MoveImg(card.id)">-->
          <el-image class="card-img" :src="card.imgUrl"></el-image>
        </el-card>
            <el-button style="margin-left: 38%;" @click="Awpm()">查看更多</el-button>
      </el-col>
      <el-col :span="12">
        <div class="box-btn">
          <el-button class="btn" type="success" size="small">暂存</el-button>
          <el-button class="btn" type="warning" size="small">预览</el-button>
          <el-button class="btn" type="primary" size="small">保存</el-button>
        </div>
        <div class="chart-box">
          <el-row style="min-height: 50px;">
            <div class="chart-head">
              <el-button class="chart-head-btn chart-head-btn1" type="default" size="" @click="resetChart()">
                <svg t="1617950108001" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="4799" width="20" height="20">
                  <path
                    d="M933.8 540.1c-15.3-2.1-29.4 8.7-31.5 24-28.8 214.5-226 365.2-440.6 336.4s-365.2-226-336.4-440.6c28.8-214.6 226-365.2 440.6-336.4 113.2 15.2 208 77.7 268.5 164.5H681.8c-15.5 0-28 12.5-28 28s12.5 28 28 28h195.8c30.9 0 56.2-25.2 56.2-56.2V92c0-15.5-12.5-28-28-28s-28 12.5-28 28l-0.1 160.5C808.4 155.1 701.3 85.2 573.4 68 328.2 35.1 102.8 207.3 69.9 452.5 37 697.7 209.1 923.1 454.3 956S925 816.7 957.9 571.5c2-15.3-8.7-29.4-24.1-31.4z"
                    p-id="4800"></path>
                </svg>
              </el-button>
              <el-button class="chart-head-btn chart-head-btn2" type="default" size="" @click="closeChart()">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill="#333333"
                    d="M560.9 512l389-389c13.4-13.4 13.4-35.4 0-48.9-13.4-13.4-35.4-13.4-48.9 0l-389 389-389-389c-13.4-13.4-35.4-13.4-48.9 0-13.4 13.4-13.4 35.4 0 48.9l389 389-389 389c-13.4 13.4-13.4 35.4 0 48.9 13.4 13.4 35.4 13.4 48.9 0l389-389 389 389c13.4 13.4 35.4 13.4 48.9 0 13.4-13.4 13.4-35.4 0-48.9l-389-389z" />
                </svg>
              </el-button>
              <!-- <span>{{dataChart.title?dataChart.title:'示例图'}}</span> -->
              <span v-if="!isShow">
                <h3>示例图</h3>
              </span>
            </div>
          </el-row>
          <el-row>
            <div class="charts">
              <el-image class="chart-img" v-if="!isShow" :src="require('@/assets/image/visualImgs/sampleImg.png')">
              </el-image>
              <bar-chart v-if="isShow&&dataChart.itemStyle.type==='bar'" :dataObj="dataChart">
              </bar-chart>
              <line-chart v-if="isShow&&dataChart.itemStyle.type==='line'" :dataObj="dataChart">
              </line-chart>
              <pie-chart v-if="isShow&&dataChart.itemStyle.type==='pie'" :dataObj="dataChart">
              </pie-chart>
              <radar-chart v-if="isShow&&dataChart.itemStyle.type==='radar'" :dataObj="dataChart">
              </radar-chart>
              <scatter-chart v-if="isShow&&dataChart.itemStyle.type==='scatter'" :dataObj="dataChart">
              </scatter-chart>
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="right">
          <!-- <img src="@/assets/image/visualImgs/right.png" style="width: 500px;float: left;margin-left: 60px;" /> -->
          <el-form>
            <div class="grid-content bg-purple">
              <el-form-item>
                <el-button type="default" size="small" @click="resetForm('ruleForm')">属性</el-button>
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">数据</el-button>
              </el-form-item>
            </div>

            <el-table :data="tableData" height="500">
              <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="数据名称" width="120" align="center">
                <template slot-scope="scope">
                  <div class="tableTitle ellipsis">
                    <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                      {{scope.row.name}}
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="ename" label="英文名" width="180" align="center">
                <template slot-scope="scope">
                  <div class="tableTitle ellipsis">
                    <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                      {{scope.row.ename}}
                    </p>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div class="grid-content bg-purple">
              <el-form-item>
                <el-button type="default" size="small" @click="resetForm('ruleForm')">取消</el-button>
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">确认</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import barChart from '@/baseCharts/barChart'; //柱状图、堆积柱状图、多系列柱状图
  import lineChart from '@/baseCharts/lineChart'; //线形图、堆积线性图
  import pieChart from '@/baseCharts/pieChart';
  import radarChart from '@/baseCharts/radarChart';
  import scatterChart from '@/baseCharts/scatterChart';
  import {formatDate} from '@/assets/time.js'
  export default {
    name: "",
    data() {
      return {
        isShow: false,
        showSign: false,
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        tableData: [{
            name: '1wdwd',
            ename: 'oadadsdnofdns'
          },
          {
            name: '2dwdsd',
            ename: 'osaffsdnofdns'
          },
          {
            name: '3dsfsff',
            ename: 'osdntegrofdns'
          },
          {
            name: '4fsge',
            ename: 'osdnygmgkumknofdns'
          },
          {
            name: '1wdwd',
            ename: 'oadadsdnofdns'
          },
          {
            name: '2dwdsd',
            ename: 'osaffsdnofdns'
          },
          {
            name: '3dsfsff',
            ename: 'osdntegrofdns'
          },
          {
            name: '4fsge',
            ename: 'osdnygmgkumknofdns'
          },
        ],
        cardList: [{
            id: 11,
            title: "雷达图",
            imgUrl: require("@/assets/image/visualImgs/img1.png"),
          },
          {
            id: 22,
            title: "饼图",
            imgUrl: require('@/assets/image/visualImgs/img2.png')
          },
          {
            id: 33,
            title: "柱状图",
            imgUrl: require('../assets/image/visualImgs/img3.png')
          },
          {
            id: 44,
            title: "堆积图",
            imgUrl: require('../assets/image/visualImgs/img4.png')
          },
          {
            id: 55,
            title: "折线图",
            imgUrl: require('../assets/image/visualImgs/img5.png')
          },
          {
            id: 66,
            title: "散点图",
            imgUrl: require('../assets/image/visualImgs/img6.png')
          },
          {
            id: 77,
            title: "柱形图",
            imgUrl: require('../assets/image/visualImgs/img7.png')
          },
          {
            id: 88,
            title: "柱子图",
            imgUrl: require('../assets/image/visualImgs/img8.png')
          },
          {
            id: 89,
            title: "横向柱状图",
            imgUrl: require('../assets/image/visualImgs/img3.png')
          },
          {
            id: 90,
            title: "趋势柱状图",
            imgUrl: require('../assets/image/visualImgs/img7.png')
          },
          {
            id: 91,
            title: "组合柱状图",
            imgUrl: require('../assets/image/visualImgs/img8.png')
          }
        ],
        dataChart: {}
      }
    },
    components: {
      barChart,
      lineChart,
      pieChart,
      radarChart,
      scatterChart
    },
    beforeCreate() {},
    created() {},
    mounted() {
      // this.$nextTick(function() {
      //   this.resetChart(this.isShow);
      // });
      // const str = "中华人民共和国";
      // console.log(str.split("").reverse().join(""))
      this.$dragging.$on('dragend', (res) => {
        this.MoveImg(res.group)
        console.log(res.group);
      })
    },
    methods: {
      Awpm(){
        //弹出一个新窗口
        var domain = 'http://10.170.130.240:30228';
        var myPopup = window.open(domain
                    + '/dashboard/liubiny/1001/1920,1080/dark','myWindow');

        //周期性的发送消息
        setInterval(function(){
        	var message = 'Hello!  The time is: ' + formatDate(new Date().getTime());
        	console.log('blog.local:  sending message:  ' + message);
                //send the message and target URI
        	myPopup.postMessage(message,domain);
        },5000);

        //监听消息反馈
        window.addEventListener('message',function(event) {
        	if(event.origin !== 'http://10.170.130.240:30228') return;
        	console.log('received response:  ',event.data);
        },false);
      },
      // dragendCard(id) {
      //   this.$dragging.$on('dragend', (res) => {
      //     console.log(res);
      //     this.MoveImg(id)
      //   })
      // },

      MoveImg(id) {
        this.isShow = false;
        this.dataChart = {
          color: ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0', '#13c2c2'],
          data: [{
              name: "AK47",
              value: 3000,
            },
            {
              name: "Mp5冲锋枪",
              value: 2500,
            },
            {
              name: "榴弹",
              value: 1000,
            },
            {
              name: "AWP狙击枪",
              value: 8000,
            },
            {
              name: "加农炮",
              value: 28000,
            },
            {
              name: "马克沁机枪",
              value: 12000,
            },
            {
              name: "加特林",
              value: [2000, 1260, 350],
            },
          ],
        }
        if (id === '11') {
          this.dataChart = {
            itemStyle: {
              type: "radar",
            },
            color: ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0', '#13c2c2'],
            title: "雷达图",
            legendStyle: {
              left: 10,
              top: "middle",
              orient: "vertical",
              icon: "diamond",
            },
            radarStyle: {
              indicator: [{
                  name: "装甲厚度",
                  max: 100
                },
                {
                  name: "舰载机携带数",
                  max: 100
                },
                {
                  name: "续航",
                  max: 100
                },
                {
                  name: "吨位",
                  max: 100
                },
                {
                  name: "航速",
                  max: 100
                },
              ],
            },
            data: [{
                name: "米尼兹级",
                style: {
                  areaStyle: {
                    color: "#1890ff",
                    opacity: .5
                  },
                  lineStyle: {
                    color: "#1890ff",
                  },
                },
                value: [55, 80, 68, 87, 90],
              },
              {
                name: "001型",
                style: {
                  areaStyle: {
                    color: "#2fc25b",
                    opacity: .5
                  },
                  lineStyle: {
                    color: "#2fc25b",
                  },
                },
                value: [25, 84, 96, 80, 70],
              },
              {
                name: "库兹列左夫",
                value: [75, 34, 46, 90, 80],
                style: {
                  areaStyle: {
                    color: "#facc14",
                    opacity: .5
                  },
                  lineStyle: {
                    color: "#facc14",
                  },
                },
              },
            ],
          }
          this.$nextTick(() => {
            this.isShow = true
          })
        } else if (id === '22') {
          this.dataChart.title = '饼图'
          this.dataChart.itemStyle = {
            type: "pie",
            radius: ["0%", "75%"],
            roseType: 'radius',
          }
          this.$nextTick(() => {
            this.isShow = true
          })
        } else if (id === '33') {
          this.barChartXY()
        } else if (id === '44') {
          this.dataChart.title = '堆积图'
          this.dataChart.name = ["手榴弹战损", "MG5冲锋枪战损", "坦克战损"];
          this.dataChart.itemStyle = {
            type: "line",
            smooth: true,
            lineStyle: {
              width: 0.5,
            },
            areaStyle: {
              color: "rgba(0, 38, 255, .5)",
              opacity: 0.2,
            },
          }
          // this.dataChart.grid= {
          //         left: '3%',
          //         right: '4%',
          //         bottom: '3%',
          //         containLabel: true
          //     },
          this.dataChart.data = [{
              name: "周一",
              value: [3000, 2000, 500],
            },
            {
              name: "周二",
              value: [2000, 1500, 400],
            },
            {
              name: "周三",
              value: [3400, 2220, 1000],
            },
            {
              name: "周四",
              value: [3300, 2130, 500],
            },
            {
              name: "周五",
              value: [4500, 2500, 1000],
            },
            {
              name: "周六",
              value: [3500, 1100, 500],
            },
            {
              name: "周日",
              value: [2000, 1260, 350],
            },
            // {
            //   name: "加特林",
            //   value: [2000, 1260, 350],
            // },
          ]
          this.$nextTick(() => {
            this.isShow = true
          })
        } else if (id === '55') {
          this.dataChart.title = '折线图'
          this.dataChart.itemStyle = {
            type: "line",
          }
          this.dataChart.mode = "vertical"
          this.$nextTick(() => {
            this.isShow = true
          })
        } else if (id === '66') {
          this.dataChart.titleStyle = {
            text: '散点图'
          };
          this.dataChart.itemStyle = {
            type: "scatter",
          };
          this.$nextTick(() => {
            this.isShow = true
          })
        } else if (id === '77') {
          this.dataChart.name = ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'];
          this.dataChart.data = [{
              name: '周一',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              value: [320, 302, 301, 334, 390, 330, 320]
            },
            {
              name: '周二',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              value: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '周三',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              value: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '周四',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              value: [150, 212, 201, 154, 190, 330, 410]
            },
            {
              name: '周五',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              value: [820, 832, 901, 934, 1290, 1330, 1320]
            }
          ];
          this.barChartXY()
          this.dataChart.title = '堆叠柱状图';
          this.$nextTick(() => {
            this.isShow = true
          })
        } else if (id === '88') {
          this.dataChart.name = ["销量", "库存"];
          this.dataChart.data = [{
              name: "AK47",
              value: [1300, 2000],
            },
            {
              name: "Mp5冲锋枪",
              value: [3400, 2100],
            },
            {
              name: "榴弹",
              value: [1000, 2000],
            },
            {
              name: "AWP狙击枪",
              value: [5000, 5000],
            },
            {
              name: "加农炮",
              value: [13000, 2000],
            },
            {
              name: "马克沁机枪",
              value: [3000, 2000],
            },
          ];
          this.barChartXY()
          this.dataChart.title = '多类型柱状图';
          this.$nextTick(() => {
            this.isShow = true
          })
        }else if(id==='89'){
            // this.dataChart.name = ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'];
            this.dataChart.mode="horizontal";
            this.dataChart.label= {
                show: true,
                position: 'right'
            };
            // this.dataChart.barWidth=40;
            this.dataChart.data = [{
              name: "AK47",
              value:  [{
                  value: 3000,
                  itemStyle: {
                      color: '#facc14'
                  }
              }],
              barWidth:30
            },
            {
              name: "Mp5冲锋枪",
              value:  [{
                  value: 18000,
                  itemStyle: {
                      color: '#223273'
                  }
              }],
            },
            {
              name: "榴弹",
              value:  [{
                  value: 2000,
                  itemStyle: {
                      color: '#a90000'
                  }
              }],
            },
            {
              name: "AWP狙击枪",
              value:  [{
                  value: 9000,
                  itemStyle: {
                      color: '#1890ff'
                  }
              }],
            },
            {
              name: "加农炮",
             value:  [{
                 value: 16000,
                 itemStyle: {
                     color: '#2fc25b'
                 }
             }],
            },
            {
              name: "马克沁机枪",
              // value: 12000,
              value:  [{
                  value: 12000,
                  itemStyle: {
                      color: '#8543e0'
                  }
              }],
            },
            // {
            //   name: "加特林",
            //   // value:20000,
            //   value: [20000,  {
            //       value: 4300,
            //       itemStyle: {
            //           color: '#a90000'
            //       }
            //   }, 35550],
            //   barWidth:30
            // },
          ];
            this.dataChart.title = '横向堆叠柱状图';
            this.dataChart.itemStyle = {
              type: "bar",
            }
            this.dataChart.xAxisStyle = {
              splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#EBEEF5',
                    type: 'dashed',
                  }
                }
            }
            this.dataChart.yAxisStyle = {
                splitLine: {
                  show: false,
                }
              },
            this.$nextTick(() => {
              this.isShow = true
            })

        }
      },
      closeChart() {
        this.isShow = false;
      },
      resetChart(bol) {
        this.isShow = true;
      },
      barChartXY() {//纵向柱状图
        this.dataChart.title = '柱状图';
        this.dataChart.mode = "vertical";
        this.dataChart.itemStyle = {
          type: "bar",
        }
        this.dataChart.xAxisStyle = {
          splitLine: {
            show: false
          }
        }
        this.dataChart.yAxisStyle = {
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EBEEF5',
                type: 'dashed',
              }
            }
          },
          this.$nextTick(() => {
            this.isShow = true
          })
      },
      // ShowBorderSign() {
      //   let ev = event || window.event;
      //   ev.preventDefault();
      //   console.log(ev, 533)
      // }
      addImg(){

      }
    }

  }
</script>
<style>

</style>
<style scoped="scoped">
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width: 10px;
    background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: lightgray;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #999999;
}
/*定义最上方和最下方的按钮*/
::-webkit-scrollbar-button{
    /* background-color: #000;
     border:1px solid yellow; */
}

  .allBox {
    padding: 20px 0;
    box-sizing: border-box;
  }

  .left {
    min-height: 500px;
    /* float: left; */
  }
.box-card-img{
  max-height: 900px;
  overflow: auto;
  /* overflow-y:hidden; */

}
  .box-card {
    width: 44%;
    float: left;
    margin-right: 5%;
    margin-bottom: 5%;
    /* border: 2px solid red; */
  }

  .card-img {
    height: 160px;
  }

  .chart-img {
    width: 80%;
    height: 80%;
    z-index: 91;
    margin-top: 10px;
  }

  .right {
    position: absolute;
    right: 20px;
    padding: 20px;
    box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);
  }

  .chart-box {
    width: 100%;
    min-height: 500px;
    /* background-color: blueviolet; */
    /* float: right; */
    padding: 20px;
    margin: 30px;
    box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);
    /* position: absolute; */
  }

  .chart-head {
    padding: 10px;
    /* margin-bottom: 30px; */
    /* position: relative; */
    /* float: left; */
  }

  .chart-head .el-button {
    /*
    position: absolute;
    z-index: 99;
  */
  }

  /* .chart-head-btn{

} */
  .chart-head-btn1 {
    margin-left: 75%;
  }

  .chart-head-btn2 {
    /* right: 20px; */
  }

  .charts {
    height: 100%;
    min-height: 500px;
  }

  .box-btn {
    /* float: right; */
    /* margin-right: 30px; */
    margin-left: 70%;
  }

  .box-btn .btn {
    padding: 10px 25px;
  }
</style>
