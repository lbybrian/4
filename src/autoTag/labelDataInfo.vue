<template>
  <div style="padding-top: 10px; margin-top: 0px; height: 100%; position: relative;">
    <div class="documentArea" style="height: 100%; width: 100%;">
      <div v-if="fromUrl !== 'labelToolView'" class="taskPageTitle">
        <h3 style="padding: 15px 20px;">
          <span v-if="fromUrl === 'viewDataItem'">文档标注 / 查看数据 / {{this.current.title}}</span>
          <span v-if="fromUrl === 'examine'">源文件管理 / 审核 / {{this.current.title}}</span>
          <el-button v-if="fromUrl === 'examine'" @click="commitData" style="position: absolute;right: 100px;" type="primary" size="mini" round>提交</el-button>
        </h3>
      </div>
      <div style="height: calc( 100% - 90px ); width: 100%;">
        <el-row :gutter="20">
          <!-- <el-col :span="12" :offset="6"> -->
            <el-col :span="24">
            <el-tabs v-model="activeName" @tab-click="tabChange" stretch>
              <el-tab-pane label="标签数据" name="labelData">
                <DataTable :dataObj="labelData" @selection-change="dealSelectionChange" @sort-change="dealSortChange" @page-change="dealPageChange" @cell-click="dealCellClick" @button-click="dealButtonClick" @size-change="dealSizeChange" ref="exampleTestItem"></DataTable>
              </el-tab-pane>
              <el-tab-pane label="标签连线" name="labelLine">
                <DataTable :dataObj="labelLine" @selection-change="dealSelectionChange" @sort-change="dealSortChange" @page-change="dealPageChange" @cell-click="dealCellClick" @button-click="dealButtonClick" @size-change="dealSizeChange" ref="exampleTestItem"></DataTable>
              </el-tab-pane>
              <el-tab-pane label="实体数据" name="entityData">
                <EventItem :eventData="entityeventData"></EventItem>
              </el-tab-pane>
              <el-tab-pane label="事件数据" name="eventData">
                <EventItem :eventData="eventData"></EventItem>
              </el-tab-pane>
              <el-tab-pane label="关系数据" name="relationDate">
                <DataTable :dataObj="relationData" @selection-change="dealSelectionChange" @sort-change="dealSortChange" @page-change="dealPageChange" @cell-click="dealCellClick" @button-click="dealButtonClick" @size-change="dealSizeChange" ref="exampleTestItem"></DataTable>
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
      viewDataJson:{
        type: Object,
        default:()=>{
          return {
            name: 'labelData',
            labels:[],
            relation:[]
          }
        }
      }
    },
    watch: {
      'viewDataJson':{
        handler(now){
          this.fromUrl = localStorage.getItem("fromUrl");
          if(this.fromUrl === 'labelToolView'){
            this.activeName = now.name
            this.tabChange(this.activeName)
          }
        },
        deep:true,
        immediate:true
      },
    },
    beforeMount() {
      // this.initCurrentData();
    },
    mounted() {
      this.$nextTick(function () {
        this.fromUrl = localStorage.getItem("fromUrl");
        this.updateLabelData();
      });
    },
    data() {
      return {
        activeName: 'labelData',
        fromUrl:null,
        current: {
          title: "b0144adf-bcb7-4ad5-a9c5-aa1000c786fa.txt",
          content: "",
          relation: [],
          labels: []
        },
        labelData: {
          withSelection: false,
          withIndex: true,
          size: 'medium',
          border: true,
          heightCurrentRow: true,
          header: [
            {
              prop: 'textOffset',
              label: '文本-偏移',
              align: 'left',
            },
            {
              prop: 'labels',
              label: '标签',
              align: 'left',
              radios: 'radios',
            },
            ],
            data: [
              {
              textOffset: '杨铁虎[9]',
              labels: '姓名(基础属性类标签-人物-实体标签)',
            },
            {
              textOffset: '2021-01-20 17:03[14]',
              labels: '发布时间(时间-实体标签)',
            },
          ],
          //表格的分页配置项
          page: {
            pageSize: 10,
            currentPage: 1,
            total: 1,
            layout: 'prev, pager, next, sizes',
            background: true,
          },
        },
        labelLine: {
          withSelection: false,
          withIndex: true,
          size: 'medium',
          border: true,
          heightCurrentRow: true,
          header: [
            {
              prop: 'sourceTextOffset',
              label: '源文本-偏移',
              align: 'left',
            },
            {
              prop: 'targetTextOffset',
              label: 'MB文本-偏移',
              align: 'left',
            },
            {
              prop: 'relationshipLabel',
              label: '关系标签',
              align: 'left',
            },
          ],
          data: [
            {
              sourceTextOffset: '杨铁虎[9]',
              targetTextOffset: '2021-01-20 17:03[14]',
              relationshipLabel: '发布文章',
            },
          ]
        },
        relationData: {
          withSelection: false,
          withIndex: true,
          size: 'medium',
          border: true,
          heightCurrentRow: true,
          header: [
            {
              prop: 'sourceEntityName',
              label: '源实体名称',
              align: 'left',
            },
            {
              prop: 'targetEntityName',
              label: 'MB实体名称',
              align: 'left',
            },
            {
              prop: 'relationshipLabel',
              label: '关系标签',
              align: 'left',
            },
          ],
          data: [
            {
              sourceEntityName: '杨铁虎',
              targetEntityName: '杨明',
              relationshipLabel: '父子关系',
            },
          ]
        },
        eventData: [

      ],
        entityeventData: [

        ]
      };
    },
    methods: {
      tabChange(tab, event) {
        switch (tab.name || tab){
          case 'labelData':
            this.updateLabelData();
            break;
          case 'labelLine':
            this.updateLabelLine();
            break;
          case 'entityData':
            this.updateEntityData();
            break;
          case 'eventData':
            this.updateEventData();
            break;
          case 'relationDate':
            this.updateRelationData();
            break;
          default :
            this.updateLabelData();
            break;
        }
      },
      initCurrentData() {

      },
      updateLabelData() {
        // 审核-如果有多个标签 添加keyradios
        if(this.fromUrl !== 'examine'){
          if(this.fromUrl === 'labelToolView'){
            this.labelData.data = [];
            this.viewDataJson.labels.forEach(item=>{
              this.labelData.data.push({
                textOffset: item.id,
                labels: item.label,
              })
            })
          }
        }else{
          this.labelData.data = [
            {
              textOffset: '杨铁虎[9]',
              labels: '',
              radios: [
                {label:"id1",name:"姓名(基础属性类标签-人物-实体标签)"},
                {label:"id2",name:"别名(基础属性类标签-人物-实体标签)"}],
              value:''
            },
            {
              textOffset: '2021-01-20 17:03[14]',
              labels: '发布时间(时间-实体标签)',
              value:''
            }]
        }
      },
      updateLabelLine() {
        if(this.fromUrl === 'labelToolView'){
          this.labelLine.data = [];
          this.viewDataJson.relation.forEach(item=>{
            this.labelLine.data.push({
                  sourceTextOffset: item.source,
                  targetTextOffset: item.target,
                  relationshipLabel: item.label,
                })
          })
        }
      },
      updateEntityData() {

      },
      updateEventData() {
        if(this.fromUrl === 'labelToolView'){
          this.eventData = []
          let content = JSON.parse(localStorage.getItem("currentData")).content
          let tData = this.utilOther.getEventData(this.viewDataJson.labels, this.viewDataJson.relation, content);
          this.eventData = tData
        }
      },
      updateRelationData() {

      },
      dealSelectionChange(val) {
        console.log(val)
      },
      dealSortChange(param) {
        console.log(param)
      },
      dealPageChange(current, size) {
        console.log(current, size)
      },
      dealCellClick(row, column, cell, event) {
        console.log(row, column, cell)
      },
      dealButtonClick(eventName, row, index) {
        console.log(eventName, row, index)
      },
      //页码切换
      dealSizeChange(current, size) {
        console.log(current, size)
      },
      //提交按钮
      commitData(){
        this.$message('提交')
      }
    },
  };

</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .documentArea,
  .documentList {
    height: 100%;
    background-color: #fff;
    border-radius: 5px;
  }

</style>
