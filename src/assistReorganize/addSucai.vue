<template>
  <div style="padding: 10px;">

    <el-row>
      <el-col :span="24">
        <div class="list">
          <el-table v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
            ref="multipleTable"
            @select="handleSelectionChange"
            @select-all = "nocheckall"
            :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="报告标题">
              <template slot-scope="scope">{{scope.row.title}}</template>
            </el-table-column>
            <el-table-column prop="value" label="出报时间">
              <template slot-scope="scope">{{scope.row.create_time}}</template>
            </el-table-column>
            <el-table-column prop="is_order" label="状态">
              <template slot-scope="scope">{{scope.row.status}}</template>
            </el-table-column>
<!--            <el-table-column prop="keys" label="审核员">-->
<!--              <template slot-scope="scope">{{scope.row.create_by}}</template>-->
<!--            </el-table-column>-->

          </el-table>
        </div>
      </el-col>
    </el-row>

    <div class="page center" v-if="total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  const API = '/rest/v1'
  const LIST = '/index_sczb/tscp_info/page/tscp'


  export default {
    components: {
    },
    name: "",
    data() {
      return {
        sucai:{},
        loading: false,
        // 数据列表
        tableData: [],
        // 分页相关
        currentPage: 1,
        pageSize: 10,
        total: 0,
        params: {},
        // 选中的复选框
        checkedArr: [],
      }
    },
    // props:{
    //   selectsucai: []
    // },
    created() {
      this.getList(1, 10, this.params)
    },
    beforeMount(){
        this.selectsucai = this.sucai
    },
    methods: {

      // 获取列表
      getList(page, pageSize, params){
        this.loading = true
        this.tableData = []

        params.pageNo = page
        params.pageSize = pageSize

        params.in_search = JSON.stringify({
          status: ["2","3"]
        })

        this.ajaxGET(API + LIST, params).then(r => {
          this.loading = false
          if(r.length > 0 && r) { // 有数据
            this.tableData = r.map(item=>{
              item.status = dictMap.data.dbrw_rwzt[item.status];
              return item;
            });
            // this.selectsucai = this.tableData
            this.total = r.pager.total
          } else { // 暂无数据
            this.tableData = []
            this.total = 0
          }
        }).catch(e => {
          this.loading = false
          this.$message({
            message: '获取列表失败：' + e,
            type: 'warning'
          })
        })
      },

      // elementuiCheckBox单选
      handleSelectionChange(selection,row) {
        // this.checkedArr = val
        // console.log(selection)
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(row,true)
        this.$emit("addsucai",selection)
        // console.log(this.selectsucai)

      },

      nocheckall(selection,row){
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(row,false)
      },
      // 每页几条
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.getList(this.currentPage, this.pageSize, this.params)
      },

      // 当前第几页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList(this.currentPage, this.pageSize, this.params)
      },



    }
  };
</script>

<style scoped>
  .page{
    padding: 10px 0;
  }
  .center{
    text-align: center;
  }
</style>
