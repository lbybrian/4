<template>
  <div style="height: 100%; position: relative;">
    <div class="documentArea" style="height: 100%; width: 100%;">
      <div style="height: calc( 100% - 90px ); width: 100%;">
        <el-row :gutter="20" style="height: 100%;">
          <!-- <el-col :span="12" :offset="6"> -->
            <el-col :span="24" style="height: auto;">
            <el-tabs v-model="activeName" @tab-click="tabChange" stretch style="height: 100%;">
              <el-tab-pane label="标签数据" name="labelData" style="height: 100%;">
                <div v-for="d in labelDatas" :key="d.LABEL_NAME">
                  <p style="height: 28px;line-height: 28px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;" :title="d.LABEL_NAME">{{d.LABEL_NAME}}</p>
                  <el-tag v-for="ds in d.data" :key="ds.name" size="medium" style="margin: 0 10px 10px 0;background-color: #fff;"
                  :style="{borderColor: d.COLOR,color: d.COLOR}">{{ds.TEXT}}（{{ds.NUM}}）</el-tag>
                </div>
                <p v-if="labelDatas.length === 0">暂无数据</p>
              </el-tab-pane>
              <el-tab-pane label="关系数据" name="relationData" style="height: 100%;">
                <div v-for="d in relationDatas" :key="d.labelType">
                  <p style="height: 28px;line-height: 28px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;" :title="d.labelType">{{d.labelType}}</p>
                  <span v-for="ds in d.data" :key="ds.id" style="display: inline-block;margin: 0 10px 10px 0;">
                    <el-tag size="medium" style="background-color: #fff;cursor: pointer;"
                    :title="ds.sourceLabelType"
                    :style="{borderColor: ds.sourceLabelColor,color: ds.sourceLabelColor}">{{ds.sourceEntityName}}</el-tag>
                    →
                    <el-tag size="medium" style="background-color: #fff;cursor: pointer;"
                    :title="ds.targetLabelType"
                    :style="{borderColor: ds.targetLabelColor,color: ds.targetLabelColor}">{{ds.targetEntityName}}</el-tag>
                  </span>

                </div>
                <p v-if="labelDatas.length === 0">暂无数据</p>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import DataTable from "@/autoTagCommon/dataTable"
  import EventItem from "@/autoTagCommon/labelEventItem"
  export default {
    components: {
      DataTable,
      EventItem
    },
    props: {
      markedDates:{
        type: Object,
        default:()=>{
          return {
            name: 'labelData',
            tdocId:'',
          }
        }
      }
    },
    watch: {
      // 'markedDates':{
      //   handler(now){
      //     this.activeName = now.name
      //     this.tabChange(this.activeName)
      //   },
      //   deep:true,
      //   immediate:true
      // },
    },
    mounted() {
      // this.updateLabelData();
    },
    data() {
      return {
        activeName: 'labelData',
        labelDatas:[
          // {LABEL_NAME:'标签类别',COLOR: "#67C23A",
          //   data:[
          //     {TEXT:''},
          //   ]
          // },
        ],
        relationDatas:[
          // {LABEL_NAME:'关系类别',
          //   data:[
          //     {TEXT:'',NUM: 1},{TEXT:'',NUM: 1},
          //   ]
          // },
        ],
      };
    },
    methods: {
      tabChange(tab, event) {
        switch (tab.name || tab){
          case 'labelData':
            this.updateLabelData();
            break;
          case 'relationData':
            this.updaterelationData();
            break;
          default :
            break;
        }
      },
      // 根据文档编号查询标注结果
      updateLabelData() {
        let searchDocEntityLabelInfo = {
           "tdocId": this.markedDates.tdocId,
            "text": ""
        }
        let _this = this;
        this.adapter.findDataById(searchDocEntityLabelInfo,function(d){
          if(d.data.meta.success){
            let mes = d.data.data;
            _this.labelDatas = [];
            mes.forEach(item => {
              let flag = true;
              let lengs = -1;
              _this.labelDatas.forEach((items,index) => {
                if(items.LABEL_NAME === item.LABEL_NAME){
                  flag = false;
                  lengs = index;
                }
              });
              if(flag){
                _this.labelDatas.push({"LABEL_NAME":item.LABEL_NAME,"COLOR":item.COLOR,data:[item]});
              }else{
                _this.labelDatas[lengs].data.push(item);
              }
            });
          }else{
            _this.$message({
              message: res.data.meta.message,
              type: 'error'
            });
          }
        });
      },
      // 根据文档编号查询关系数据
      updaterelationData() {
        let searchDocEntityLabelInfo = {
           "tdocId": this.markedDates.tdocId,
            "text": ""
        }
        let _this = this;
        this.adapter.getDataRelationById(searchDocEntityLabelInfo,function(d){
          if(d.data.meta.success){
            let mes = d.data.data;
            _this.relationDatas = [];
            mes.forEach(item => {
              let flag = true;
              let lengs = -1;
              _this.relationDatas.forEach((items,index) => {
                if(items.labelType === item.labelType){
                  flag = false;
                  lengs = index;
                }
              });
              if(flag){
                _this.relationDatas.push({"labelType":item.labelType,data:[item]});
              }else{
                _this.relationDatas[lengs].data.push(item);
              }
            });
          }else{
            _this.$message({
              message: res.data.meta.message,
              type: 'error'
            });
          }
        });
      },
    },
  };

</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  /deep/ .el-date-editor .el-range-separator {
    width: 30px !important;
  }
  /deep/ .el-tabs__content{
    height: 100%;
  }
  /deep/ .el-tab-pane{
    height: 100% !important;
  }
  .documentArea,
  .documentList {
    height: 100%;
    background-color: #fff;
    border-radius: 5px;
  }

</style>
