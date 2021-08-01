<template>
  <div class="containerArea" v-if="isShow">
    <div v-for="(d, index) in tableArray" :key="index">
      <h3 class="conceptTitle">{{d.title}}</h3>
      <DataTable :dataObj="d"></DataTable>
    </div>
  </div>
</template>

<script>
  import DataTable from "@/autoTagCommon/dataTable";
  export default {
    components: {
      DataTable
    },
    beforeMount() {

    },
    data() {
      return {
        isShow: true,
        tableArray: [{
          header: [{
            prop: "name",
            label: "名称",
            width: "180px"
          }, {
            prop: "key1",
            label: "属性1",
            width: "180px"
          }, {
            prop: "key2",
            label: "属性2",
            width: "180px"
          }, {
            prop: "key3",
            label: "属性3",
            width: "180px"
          }],
          data: []
        }],
        //表格参数
        dataInfo: {

          data: [],

        },
      };
    },
    watch: {
      "dataObj": function () {
        // this.updateDataInfo();
        alert(1)
      }
    },
    mounted() {
      var tData = this.dataObj || this.dataInfo;
      this.updateData(tData);
    },
    methods: {
      //更新表格区域信息
      updateData(newObj) {
        this.isShow = false;
        this.$nextTick(function () {
          this._updateData(newObj);
          this.isShow = true;
        });
      },
      //更新表格数据
      _updateData(newObj) {
        for (var k in newObj) {
          this.$set(this.dataInfo, k, newObj[k]);
        }
        this.updateDataInfo();
      },
      updateDataInfo() {
        this.tableArray = [];
        var d = this.dataInfo.data;
        for (var i = 0; i < d.length; i++) {
          var item = this.transTableData(d[i]);
          this.tableArray.push(item)
        }
      },
      transTableData(data) {
        var item = {
          title: `${data.text}(${data.labelType})`,
          header: [],
          data: []
        };
        var arr = data.arguments;
        var dItem = {};
        for (var i = 0; i < arr.length; i++) {
          var tData = arr[i];
          var hItem = {
            prop: "key" + i,
            label: tData.role
          };
          item.header.push(hItem);
          dItem["key" + i] = tData.argument;
        }
        item.data.push(dItem);
        return item;
      }
    },
    created() {},
    props: {
      dataObj: Object,
    },
  };

</script>

<style scoped>
  .containerArea {
    width: 100%;
    height: 100%;
  }

  .conceptTitle {
    padding: 10px;
  }

  .containerArea /deep/ .el-pagination {
    padding-left: 0px;
    padding-right: 0px;
  }

  .containerArea /deep/ .el-pagination__sizes {
    margin-right: 0px;
  }

  .containerArea /deep/ .el-pagination .el-select .el-input {
    margin-right: 0px;
  }

</style>
