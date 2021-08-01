<template>
  <div v-if="list.length>0" class="timeline" :style="{width:boxWidth}">
    <div class="button leftButton">
      <el-button size="mini" :disabled="leftButton" circle @click="moveLeft"><i class="el-icon-back"></i></el-button>
    </div>

    <div class="middle" :style="{width:middleWidth}">
      <ul id="divUl" ref="divUl" :style="{width:divUlWidth,marginLeft:divUlMarginLeft}">
        <li v-for="(item, i) in list">
          <div class="upBox" v-if="i%2===0">
            <el-tooltip class="item" effect="light" :content="item.title" placement="top-start">
              <div>
                <p class="text" @click="turnPage(item.id)">{{item.source}}<span>{{item.title}}</span></p>
                <p style="text-align: center;">相似度{{item.xsd_p}}</p>
              </div>
            </el-tooltip>
          </div>
          <div class="upBox" style="border: none; margin-bottom: 2px" v-if="i%2!==0"></div>

          <div class="year" :style="{'color': colors[i]}">
            <p>
              <span class="Dline"></span>
              <span :style="{'background': colors[i]}" class="tap"></span>
              <span class="Dline"></span>
            </p>
            <p class="center">{{item.time}}</p>
          </div>

          <div class="downBox" v-if="i%2!==0">
            <el-tooltip class="item" effect="light" :content="item.title" placement="top-start">
              <div>
                <p class="text">{{item.source}}<span>{{item.title}}</span></p>
                <p style="text-align: center;">相似度{{item.xsd_p}}</p>
              </div>
            </el-tooltip>
          </div>
          <div class="downBox" style="border: none; margin-top: 2px" v-if="i%2===0"></div>
        </li>
      </ul>

    </div>

    <div class="button rightButton">
      <el-button size="mini" :disabled="rightButton" circle @click="moveRight"><i class="el-icon-right"></i></el-button>
    </div>
  </div>
</template>

<script>
  import { Colors } from '../assets/js/time'
  export default {
    props: {
      scids: String
    },
		name: "TimeLine",
    data() {
		  return {
        leftButton: false,
        rightButton: false,
        list: [
          // {
          //   time: '2012/12/12',
          //   source: '环球网',
          //   title: '《Palantir技术探秘》《Palantir技术探秘》《Palantir技术探秘》',
          //   percent: '95%',
          // }
        ],
        width: 0,
        colors: Colors,
        // 宽屏预览区宽度
        parentWidth: 0,
        // 窄屏预览区宽度
        parentWidth2: 0,
        //文本素材里宽度
        dxscWidth:0,
        // 时间轴中间展示区宽度
        middleWidth: 360,
        // 时间轴最外层盒子宽度
        boxWidth: 490,
        N: 3,
        divUlWidth:'0px',
        divUlMarginLeft:'0px'
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.parentWidth2 = $('#parentDiv2').width()
      this.parentWidth = $('#parentDiv').width()
      this.dxscWidth = $('#dxscTimeLine').width()
      if (this.parentWidth2) { // 窄屏
        this.N = parseInt((this.parentWidth2 - 100) /130)
        this.boxWidth = parseInt((this.parentWidth2 - 100) /130) * 130 + 100
        this.middleWidth = parseInt((this.parentWidth2 - 100) /130) * 130
      } else if (this.parentWidth) { // 宽屏
        this.N = parseInt((this.parentWidth - 100) /130)
        this.boxWidth = parseInt((this.parentWidth - 100) /130) * 130 + 100
        this.middleWidth = parseInt((this.parentWidth - 100) /130) * 130
      } else if (this.dxscWidth) { // 动向素材
        this.N = parseInt((this.dxscWidth - 100) /130)
        this.boxWidth = parseInt((this.dxscWidth - 100) /130) * 130 + 100
        this.middleWidth = parseInt((this.dxscWidth - 100) /130) * 130
      }
      this.width = this.list.length * 130
      this.divUlWidth = this.width + 'px'
      this.divUlMarginLeft = '0px'
    },
    methods: {
		  moveLeft() {
		    if(this.list.length > this.N){
          let left = parseInt($('#divUl').css('margin-left'))
          if (left <= -130 * (this.list.length - this.N)){
            left = -130 * (this.list.length - this.N)
            this.leftButton = true
            this.rightButton = false
          } else {
            left = left - 130
            this.leftButton = false
            this.rightButton = false
          }
		      this.divUlMarginLeft = left + 'px'
          // $('#divUl').css('margin-left', left + 'px')
        }else{
          this.leftButton = true
        }
      },
      moveRight() {
        if(this.list.length > this.N) {
          let left = parseInt(this.divUlMarginLeft)
          if (left === 0) {
            left = 0
            this.rightButton = true
            this.leftButton = false
          } else {
            left = left + 130
            this.leftButton = false
            this.rightButton = false
          }
          this.divUlMarginLeft = left + 'px'
        }else{
          this.rightButton = true
        }
      },
      getList(){
        var _self = this;
        var id = WebTool.urlQuery(location.href, "id")
        if(!!this.scids){
          id = this.scids
        }
        let params = {
          pageNo: 1,
          pageSize: 10
        }
        this.ajaxGET('rest/v1/sc/xsd/'+id, params).then(d => {
          _self.list = []
          d.forEach(item => {
            _self.list.push({
              time: item.publish_time,
              source: item.data_source,
              title: item.title,
              id:item.id,
              xsd_p:item.xsd_p
            })
          });
          _self.width = this.list.length * 130
          _self.divUlWidth = _self.width + 'px'
        }).catch(e=>{
          _self.list = []
          // this.$message({
          //   message: "时间线溯源：" + e,
          //   type: 'warning'
          // })
        });
      },
      turnPage(id){
        var path  = "/dxscdetail";
        let {href} = this.$router.resolve({
          path: path,
          query: {
            id: id,
            from: "dxsc"
          }
        });
        window.open(href,'_blank')
      }
    }
	}
</script>

<style scoped>
  .timeline{
    position: relative;
    width: 100%;
    height: 130px;
    overflow: hidden;
    font-size: 12px;
    /*padding-top: 20px;*/
  }
  .center{
    text-align: center;
  }
  .button{
    position: absolute;
    top:0;
    width: 50px;
    height: 28px;
    margin-top: 50px;
  }
  .leftButton {
    left: 0;
  }
  .rightButton{
    right: 0;
  }
  .middle{
    float: left;
    margin-left: 50px;
    width: calc( 100% - 100px );
    overflow: hidden;
  }
  ul{
    height: auto;
    margin-left: 0;
  }
  ul li{
    width: 130px;
    float: left;
    font-size: 12px;
    color: #60626F;
  }
  .upBox, .downBox{
    width: 120px;
    height: 34px;
    padding: 5px;
    overflow: hidden;
    text-align: left;
    border: 1px solid #eceae5;
    border-radius: 4px;
  }
  .upBox{
    margin-top: 0;
  }
  .downBox{
    /*margin-bottom: 0;*/
    margin-top: 15px;
  }
  .text{
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    font-weight: 900;
    cursor: pointer;
    text-align: center;
  }
  .text span{
    font-weight: normal;
  }
  .year{
    height: 20px;
  }
  .tap{
    display: inline-block;
    width: 10px;
    height: 10px;
    /*margin-top: 25px;*/
    border-radius: 50%;
  }
  .Dline{
    width: 55px;
    display: inline-block;
    height: 1px;
    margin-bottom: 5px;
    background: #eceae5;
  }
</style>
