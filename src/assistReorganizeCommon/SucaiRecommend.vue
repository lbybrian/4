<template>
  <div>
    <div class="recommendcon">
      <el-row >
        <el-col :span="24">
          <!--相同来源-->
          <el-card class="box-card pad10">
            <div slot="header" class="clearfix ">
              <span class="font16">相同来源信息</span>
              <span class="currentSource">当前来源：<span style="color: #409EFF;">{{data_source.name || "无来源"}}</span></span>
              <el-button v-if="!!data_source.name" @click="moreList('source')" style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <div v-for="(item, index) in data_source.data" @click="itemClick(item)" :key="index" class="text item">
              <span class="listNum">{{index + 1}}</span>{{item.title}}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!--相同分类-->
          <el-card class="box-card pad10">
            <div slot="header" class="clearfix ">
              <span class="font16">相同分类信息</span>
              <span class="currentSource">当前分类：<span style="color: #409EFF;">{{classifyStr || '未分类'}}</span></span>
              <el-button v-if="!!classifyStr" @click="moreList('type')" style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <div v-for="(item, index) in classify.data" @click="itemClick(item)" :key="index" class="text item">
              <span class="listNum">{{index + 1}}</span>{{item.title}}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!--相似文章-->
          <el-card class="box-card pad10">
            <div slot="header" class="clearfix ">
              <span class="font16">相似文章</span>
              <el-button v-if="xswzStr>5" @click="moreList('xswz')" style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <div v-for="(item, index) in xswz" @click="itemClick(item)" :key="index" class="text item">
              <span class="listNum">{{index + 1}}</span>{{item.title}}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--更多列表弹框-->
    <el-dialog  :visible.sync="moreListVisible" width="70%" class="moredialog">
      <DataTableItem
        style="position: relative; float: left; width: 100%;"
        @pageChange="dealPageChange"
        @tableClick="dealTableClick"
        :tableInfo="this.tableInfo"
      />
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="moreListVisible=false">关 闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  const API = '/api'
  const URL = '/index_sczb/sc_info/'
  const ANALYSIS = 'getRight/'
  import DataTableItem from "./DataTableItem"
  export default {
    components:{
      DataTableItem
    },
    data(){
      return{
        isshow :false,
        data_source:[],
        classify:[],
        direction:[],
        classifyStr:'',
        directionStr:'',
        // 更多弹窗
        moreListVisible:false,
        moreListType: '',
        params:{},
        tableInfo: {
          checkAll: false,
          isIndeterminate: false,
          value: [],
          pageLayout: "total, prev, pager, next, jumper",
          page: {
            total: 100
          },
          header: [
            {
              prop: "title",
              label: "序号",
              type: "index",
              width: 1,
              style: "text-align: center;"
            },
            {
              prop:  "title",
              label: "标题",
              style: "text-align: left; font-weight: 700; font-size: 16px; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;",
              width: 10
            },
            {
              prop: "publish_time",
              label: "时间",
              width: 4,
              style: "text-align: center;"
            },
            {
              prop: "data_source",
              label: "来源",
              width: 4,
              style: "text-align: center;"
            },
            {
              prop: "author",
              label: "作者",
              width: 3,
              style: "text-align: center;"
            },
            // {
            //   prop: "words",
            //   label: "字数",
            //   width: 3,
            //   style: "text-align: center;"
            // },
          ],
          data: []
        },
        // 相似文章
        xswz: [],
        xswzStr: 5,
        typeNow:''
      }
    },
    props:{
      options: Object
    },
    mounted(){
      var id = this.options.id;
      this.getList(id)
    },
    updated() {

    },
    methods:{
      // 五条列表方法
      getList(id){
        this.ajaxGET(API + URL + ANALYSIS + id).then(r => {
            this.currentsource = r;
            // 分类
            this.classify = r.classify
            this.classifyStr = r.classify.name
            // 来源
            this.data_source = r.data_source
            // 方向
            this.direction = r.direction
            this.directionStr = r.direction.name
            //请求相似文章
            this.getxswzList(id)
        }).catch(e => {
          console.log( '请求相关分析失败：' + e)
          /*this.$message({
            message: '请求相关分析失败：' + e,
            type: 'warning'
          })*/
        })
      },
      //相似文章信息获取 xswz
      getxswzList(id){
        var _self = this;
        let params = {
          pageNo: 1,
          pageSize: 6
        }
        this.ajaxGET('/sczb-URL-prefix/sc/xsd/'+id, params).then(d => {
          _self.xswzStr = d.length
          _self.xswz = []
          d.forEach((item,index) => {
            if(index<5){
              _self.xswz.push({
                title: item.title,
                id:item.id
              })
            }
          });
        }).catch(e=>{
          this.$message({
            message: "请求相似文章失败：：" + e,
            type: 'warning'
          })
        });
      },
      // 相关推荐五条数据列表点击
      itemClick(item) {
        var param ={
          id :item.id
        }
        this.$emit("articleClick","viewMaterialItem",item)
      },
      // 更多弹窗列表
      moreList(str,pager) {
        this.typeNow = str
        this.moreListVisible = true;
        this.params = {
          pageNo: pager,
          pageSize: 10,
        }
        this.params.order = JSON.stringify({create_time: "desc"})
        this.params.exact_search = JSON.stringify({is_lx: "1"})
        if (str === 'source') { // 来源
          this.params.exact_search = JSON.stringify({data_source: this.data_source.name})
        } else if (str === 'direction') { // 方向
          this.params.exact_search = JSON.stringify({direction: this.directionStr})
        } else if (str === 'type') { // 分类
          this.params.exact_search = JSON.stringify({classify: this.classifyStr})
        }
        var _self = this
        this.adapter.dxscList(this.params, function(d) {
          var tData = d.data;
          var t = tData.data.map(item => {
            return item;
            /*return {
              id: item.id,
              title: item.title,
              publish_time: item.publish_time,
              data_source: item.data_source,
              author: item.author,
              words: item.words,
            };*/
          });
          _self.tableInfo.data = t;
          _self.tableInfo.page = tData.pager;
        });

      },
      // 更多弹窗列表点击
      dealTableClick(name, param) {
        if (name === "title") {
          this.$emit("articleClick","viewMaterialItem",param)
          this.moreListVisible = false;
          // if(!param.content) {
          //   path = "/fwbscdetail"
          // }
          // let {href} = this.$router.resolve({
          //   path: path,
          //   query: {
          //     id: param.id,
          //   }
          // });
          // window.open(href,'_blank')
        }
      },
      dealPageChange(val) {
        this.moreList(this.typeNow,val);
      },
      // 点击更多列表里某条数据显示详情，关闭弹框
      // moreListShow(item) {
      //   let {href} =  this.$router.resolve({
      //     path: '/dxscdetail',
      //     query: {
      //       id: item.id
      //     }
      //   })
      //   window.open(href,'_blank')
      //   // 获取素材 Id
      //   this.detailId = item.id
      //   this.currentId.push(this.detailId)
      //   // 左侧详情 + 右侧相关分析
      //   this.getDetail(this.detailId)
      //   this.moreListVisible = false
      // },
    },
  }
</script>

<style scoped>
  .pad10{
    padding: 10px;
  }
  .pad10 /deep/ .el-card__header{
    padding:10px 20px!important;
    border-bottom: 1px solid #eee;
  }
  .text{
    cursor: pointer;
    padding:4px 0
  }
  .text:hover{
    color:#409EFF
  }
  .listNum{
    padding: 0 20px 0 0;
  }
  .moredialog /deep/ .el-dialog__body{
    padding: 15px 20px;
  }
</style>
