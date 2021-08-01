<template>
  <div style="height: 100%; position: relative;">
    <div class="documentArea" style="height: 100%; width: 100%;">
      <div style="height: calc( 100% - 90px ); width: 100%;">
        <el-row :gutter="20" style="height: 100%;">
          <!-- <el-col :span="12" :offset="6"> -->
            <el-col :span="24" style="height: auto;">
            <el-tabs v-model="activeName" @tab-click="tabChange" stretch style="height: 100%;">
              <el-tab-pane label="标签数据" name="labelData" style="height: 100%;">
                <div v-for="d in labelDatas" :key="d.id">
                  <p style="height: 38px;font-weight: 900;font-size: 14px;padding: 8px 0;background: #F2F6FC;">{{d.label}}</p>
                  <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item v-for="ds in d.children" :key="ds.id" :title="ds.label" :name="ds.label">
                      <p v-if="ds.markData.length === 0" style="height: 28px;line-height: 28px;margin: 6px 0;">暂无数据</p>
                      <el-tag v-for="dss in ds.markData" :key="dss.TEXT" size="medium" style="margin: 0 10px 10px 0;background-color: #fff;cursor: pointer;"
                        :style="{borderColor: dss.COLOR,color: dss.COLOR}" :title="dss.LABEL_NAME">{{dss.TEXT}}（{{dss.NUM}}）</el-tag>
                      <!-- <div v-for="dss in ds.concatData" :key="dss.LABEL_NAME">
                        <p style="height: 28px;line-height: 28px;margin-bottom: 6px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;" :title="dss.LABEL_NAME">{{dss.LABEL_NAME}}</p>
                        <el-tag v-for="dsss in dss.data" :key="dsss.name" size="medium" style="margin: 0 10px 10px 0;background-color: #fff;"
                        :style="{borderColor: dss.COLOR,color: dss.COLOR}">{{dsss.TEXT}}（{{dsss.NUM}}）</el-tag>
                      </div> -->
                    </el-collapse-item>
                  </el-collapse>
                </div>
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
                <p v-if="relationDatas.length === 0">暂无数据</p>
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
        activeName: 'labelData',//tab选择项
        activeNames: ['1'],//折叠面板选择项
        labelDatas:[],
        relationDatas:[],
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
      handleChange(val) {
        // console.log(val);
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
            console.log(mes)
            _this.labelDatas = [];
            // mes.forEach(item => {
            //   if(item.children.length > 0){
            //     for(var i = 0;i<item.children.length-1;i++){
            //       let items = item.children[i]
            //       if(items.markData.length > 0){
            //         items.concatData = [];
            //         items.markData.forEach(itemsdata => {
            //           let flag = true;
            //           let lengs = -1;
            //           items.concatData.forEach((concatDataItem,index) => {
            //             if(concatDataItem.LABEL_NAME === itemsdata.LABEL_NAME){
            //               flag = false;
            //               lengs = index;
            //             }
            //           });
            //           if(flag){
            //             items.concatData.push({"LABEL_NAME":itemsdata.LABEL_NAME,"COLOR":itemsdata.COLOR,data:[itemsdata]});
            //           }else{
            //             items.concatData[lengs].data.push(itemsdata);
            //           }
            //         });
            //       }
            //     }
            //   }
            //  });
            _this.labelDatas = mes;
          }else{
            _this.$message({
              message: d.data.meta.message,
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
  .documentArea /deep/ .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .documentArea /deep/ .el-collapse-item__header{
    font-size: 14px;
    /* font-weight: 900; */
  }
  .documentArea /deep/ .el-collapse-item__header.is-active{
    margin-bottom: 10px;
  }
</style>
