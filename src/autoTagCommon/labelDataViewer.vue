<template>
  <div class="labelDataViewArea">
    <el-tabs v-model="dataInfo.activeName" @tab-click="tabChange" stretch>
      <el-tab-pane label="标签数据" name="labelData">
        <DataTable :dataObj="labelDataTable"></DataTable>
      </el-tab-pane>
      <el-tab-pane label="标签连线" name="lineData">
        <DataTable :dataObj="lineDataTable"></DataTable>
      </el-tab-pane>
      <el-tab-pane label="实体数据" name="entityData">
        <ConceptTable :dataObj="entityList" ref="entityListTable"></ConceptTable>
      </el-tab-pane>
      <el-tab-pane label="事件数据" name="eventData">
        <ConceptTable :dataObj="eventList" ref="eventListTable"></ConceptTable>
      </el-tab-pane>
      <el-tab-pane label="关系数据" name="relationData">
        <DataTable :dataObj="relationDataTable"></DataTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TagDataTable from './tagDataTable'
import DataTable from './dataTable'
import ConceptTable from './conceptTable'
export default {
  components: {
    TagDataTable,
    DataTable,
    ConceptTable,
  },
  data() {
    return {
      labelDataTable: {
        withIndex: true,
        header: [
          {
            prop: 'id',
            label: '文本-偏移',
          },
          {
            prop: 'label',
            label: '标签',
          },
        ],
        data: [],
      },
      lineDataTable: {
        withIndex: true,
        header: [
          {
            prop: 'source',
            label: '源文本-偏移',
            width: '280',
          },
          {
            prop: 'target',
            label: '目标文本-偏移',
            width: '280',
          },
          {
            prop: 'label',
            label: '标签',
          },
        ],
        data: [],
      },
      relationDataTable: {
        withIndex: true,
        header: [
          {
            prop: 'source',
            label: '源实体名称',
            width: '280',
          },
          {
            prop: 'target',
            label: '目标实体名称',
            width: '280',
          },
          {
            prop: 'label',
            label: '关系标签',
          },
        ],
        data: [],
      },
      entityList: {
        type: 'entity',
        data: [{}],
      },
      eventList: {
        type: 'event',
        data: [{}],
      },
      relationData: {},
      dataInfo: {
        activeName: 'labelData',
        content: '',
        labelData: [],
        lineData: [],
        entityData: [],
        relationData: [],
      },
    }
  },
  mounted() {
    if (this.dataObj) {
      this.updateData(this.dataObj)
    }
  },
  watch: {
    dataObj: function () {
      // this.updateDataInfo();
      alert(1)
    },
  },
  methods: {
    updataEntityDataArray() {
      this.entityList.data = this.produceEntityItems(
        this.dataInfo.labelData,
        this.dataInfo.entityData
      )
      // console.log('实体数据',this.entityList.data)
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    updataEventDataArray() {
      this.eventList.data = this.produceEventItems(
        this.dataInfo.labelData,
        this.dataInfo.lineData
      )
      // console.log(this.eventList.data)
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    updataRelationData() {},
    produceEntityItems(labels, relation) {
      var arr = []
      var eArr = []
      for (var i = 0; i < labels.length; i++) {
        var item = labels[i]
        if (item.type === 'entity' && item.role === 'leader') {
          var eItem = item
          // console.log(item)
          item.arguments = [
            {
              role: item.name,
              argument: item.text,
              argument_start_index: item.offset,
            },
          ]
          arr.push(eItem)
        } else {
          eArr.push(item)
        }
      }

      for (var i = 0; i < arr.length; i++) {
        var eItem = arr[i]
        for (var j = 0; j < relation.length; j++) {
          if (relation[j].source === eItem.id) {
            var tItem = {
              role: relation[j].label,
              argument: '',
            }
            var target = eArr.findItem('id', relation[j].target)
            target = eArr[target]
            tItem.argument = target.text
            tItem.argument_start_index = target.offset
            eItem.arguments.push(tItem)
          }
        }
      }
      return arr
    },
    produceEventItems(labels, relation) {
      var arr = []
      var eArr = []
      for (var i = 0; i < labels.length; i++) {
        var item = labels[i]
        if (item.type === 'event') {
          var eItem = {
            ...item,
          }
          eItem.event_type = item.labelType
          eItem.trigger = item.text
          eItem.trigger_start_index = item.offset
          eItem.arguments = [
            {
              role: '触发词',
              argument: eItem.trigger,
            },
          ]
          var sentence = this.getEventSentence(eItem)
          eItem.text = sentence.text
          eItem.offset = sentence.offset
          arr.push(eItem)
        } else {
          eArr.push(item)
        }
      }

      for (var i = 0; i < arr.length; i++) {
        var eItem = arr[i]
        for (var j = 0; j < relation.length; j++) {
          if (relation[j].source === eItem.id) {
            var tItem = {
              role: relation[j].label,
              argument: '',
            }
            var target = eArr.findItem('id', relation[j].target)
            target = eArr[target]
            tItem.argument = target.text
            tItem.argument_start_index = target.offset
            eItem.arguments.push(tItem)
          }
        }
      }
      return arr
    },
    getEventSentence(t) {
      var content = this.dataInfo.content
      var start = t.trigger_start_index
      var end = start + t.trigger.length
      for (var j = 0; j < t.arguments.length; j++) {
        var arg = t.arguments[j]
        if (start > arg.argument_start_index) {
          start = arg.argument_start_index
        }
        var tEnd = arg.argument_start_index + arg.argument
        if (end < tEnd) {
          end = tEnd
        }
      }
      var tIndex = content
        .slice(0, start)
        .split('')
        .reverse()
        .join('')
        .search(/。|；|\n|\;|\!|\?/)
      start -= tIndex
      tIndex = content.slice(end).search('。')
      end += tIndex

      var tText = content.slice(start, end)
      return {
        text: tText,
        offset: start,
      }
    },
    //切换选项卡，参数为字符串，可以为labelData、labelLine、entityData、eventData和relationData
    switchDataView(activeName) {
      this.dataInfo.activeName = activeName || this.dataInfo.activeName
    },
    updateDataArray() {
      this.updataEntityDataArray()
      this.updataEventDataArray()
      this.updataRelationData()
      this.$nextTick(() => {
        this.$refs.entityListTable.$forceUpdate()
        this.$refs.eventListTable.$forceUpdate()
      })
    },
    updateData(data) {
      this.dataInfo.activeName = data.activeName || this.dataInfo.activeName
      this.dataInfo.labelData = data.labelData || []
      this.dataInfo.lineData = data.lineData || []
      this.dataInfo.relationData = data.relationData || []
      this.dataInfo.content = data.content || ''
      this.labelDataTable.data = this.dataInfo.labelData
      this.lineDataTable.data = this.dataInfo.lineData
      this.dataInfo.entityData = this.FormatterData(
        this.dataInfo.lineData,
        'entity'
      )
      this.dataInfo.relationData = this.FormatterData(
        this.dataInfo.lineData,
        ''
      )
      this.relationDataTable.data = this.dataInfo.relationData
      console.log('dataInfo:',this.dataInfo)
      this.updateListTable()
    },
    updateListTable() {
      if (this.$refs.entityListTable) {
        this.updateDataArray()
        this.$refs.entityListTable.updateData(this.entityList)
      }
      if (this.$refs.eventListTable) {
        this.updateDataArray()
        this.$refs.eventListTable.updateData(this.eventList)
      }
    },
    FormatterData(data, type) {
      let arr = []
      if (type == 'entity') {
        data.forEach((e) => {
          if (!e.roleType) {
            arr.push(e)
          }
        })
      } else {
        data.forEach((e) => {
          if (e.roleType == 'leader') {
            arr.push(e)
          }
        })
      }
      return arr
    },
    tabChange(val) {
      this.updateListTable()
    },
  },
  props: {
    dataObj: Object,
  },
}
</script>

<style scoped>
.pageFooter {
  text-align: center;
  font-size: 12px;
}
</style>
