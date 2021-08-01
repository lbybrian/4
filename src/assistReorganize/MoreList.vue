<template>
  <div>
    <div class="list">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="标题">
          <template slot-scope="scope">
            <div class="tableTitle  ellipsis" @click="toDetail(scope.row)">{{ scope.row.title }}</div>
            <div class="tableContent">{{scope.row.abstract}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="时间" width="200">
          <template slot-scope="scope">{{scope.row.publish_time}}</template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="200">
          <template slot-scope="scope">{{scope.row.data_source}}</template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120">
          <template slot-scope="scope">{{scope.row.author}}</template>
        </el-table-column>
        <el-table-column prop="account" label="字数" width="120">
          <template slot-scope="scope">{{scope.row.words}}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page" v-if="total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  const LIST = '/api'
  const BASE = '/index_sczb/sc_info/page/cm'
  const SIMPLE = '/index_sczb/sc_info'
  const ADVANCED = '/index_sczb/sc_info/advancedSearch'
	export default {
		name: "MoreList",
    props: ['obj', 'id', 'type','sourceobj'],
    data() {
		  return {
        loading: true,
        // 数据列表
        tableData: [],
        // 分页相关
        currentPage: 1,
        pageSize: 5,
        total: 0,
      }
    },
    created() {
		  // console.log(this.obj)
      // console.log(this.sourceobj)
      this.getList(this.currentPage, this.pageSize, this.obj, this.id, this.type,this.sourceobj)
    },
    methods: {
      // 根据筛选条件查询列表
      getList(page, pageSize, params, id, type,sourceobj) {
        this.loading = true
        this.tableData = []
        params.pageNo = page
        params.pageSize = pageSize
        let url = ''
        if (type === 'element') {
          url = LIST + SIMPLE + '/page/element'
          params.sc_id = id
        } else if(type ==='source'){
          url = LIST + BASE
          params.exact_search = JSON.stringify({data_source: sourceobj.data_source.name,is_lx:1})
          params.order = this.obj.order
        }else if(type ==='direction'){
          url = LIST + BASE
          params.exact_search = JSON.stringify({data_source:sourceobj.direction.name,is_lx:1})
          params.order = this.obj.order
        }else if(type ==='type'){
          url = LIST + BASE
          params.exact_search = JSON.stringify({data_source:sourceobj.classify.name,is_lx:1})
          params.order = this.obj.order
        }
        this.ajaxGET(url, params).then(r => {
          this.loading = false
          if (r.length > 0) { // 有数据
            this.tableData = r
            this.total = r.pager.total
          } else { // 无数据
            this.tableData = []
            this.total = 0
          }
        }).catch(e => { // 请求出错
          this.loading = false
          this.$message({
            message: '请求列表失败：' + e,
            type: 'warning'
          })
        })
      },

      // 复选框
      handleSelectionChange(val) {
        this.$emit('selectArr', val)
      },

      // 每页多少条
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.getList(this.currentPage, this.pageSize, this.obj, this.id, this.type)
      },

      // 翻页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList(this.currentPage, this.pageSize, this.obj, this.id, this.type)
      },

      // 进入详情
      toDetail(row) {
        let object = {}
        if (row.is_lx === '1') {
          object.is_lx = '1'
          object.id = row.id
          this.$emit('isShow', object)
        } else if (row.is_lx === '2') {
          object.is_lx = '2'
          object.id = row.id
          this.$emit('isShow', object)
        } else if (row.is_lx === '3') {
          this.$router.push({
            path: '/fwbscdetail',
            query: {
              id: row.id
            }
          })
        }
      },
    }
	}
</script>

<style scoped>
  .page{
    text-align: center;
    padding: 15px 0 0;
  }
  .tableTitle{
    font-size: 16px;
    font-weight: bold;
    line-height: 18px;
    padding: 10px 0;
    color: #464c5b;
    cursor: pointer;
  }
  .ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
  .tableContent{
    font-size: 12px;
    line-height: 18px;
    color: #657180;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

</style>
