<template>
  <div>
    <el-row>
      <div class="list" v-if="!signObj.fake">
        <!--<el-table  v-loading="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" ref="multipleTable" :data="tableData" tooltip-effect="dark">-->
        <el-table :data="tableData">
          <el-table-column type="selection" label="全选" width="80"></el-table-column>
          <el-table-column prop="name" label="数据源名称" width="180">
            <template slot-scope="scope">
              <div class="tableTitle ellipsis">
                <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                  {{scope.row.name}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="数据源描述" width="340">
            <template slot-scope="scope">
              <div class="tableTitle ellipsis">
                <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                  {{scope.row.category}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="数据源类型" width="240">
            <template slot-scope="scope">
              <div class="tableTitle ellipsis">
                <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                  {{scope.row.desc}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="数据库" width="240">
            <template slot-scope="scope">
              <div class="tableTitle ellipsis">
                <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                  {{scope.row.address}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="shop" label="创建时间" width="240">
            <template slot-scope="scope">
              <div>{{scope.row.shop}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="shopId" label="状态" width="180">
            <template slot-scope="scope">
              <div class="tableTitle ellipsis">
                <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
                  <el-badge is-dot v-if="scope.row.shopId==='运行中'" type="primary"></el-badge>
                  <el-badge is-dot v-if="scope.row.shopId==='已上线'" type="success"></el-badge>
                  <!-- <el-badge is-dot v-if="scope.row.shopId==='告警'" type="warning"></el-badge> -->
                  <el-badge is-dot v-if="scope.row.shopId==='异常'" type="danger"></el-badge>
                  <el-badge is-dot v-if="scope.row.shopId==='关闭'" type="info"></el-badge>
                  {{scope.row.shopId}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button class="btn" @click="checkRule(scope.row)" type="text" size="small">查看</el-button>
              <span v-if="signObj.operate">|</span>
              <el-button v-if="signObj.operate" class="btn" @click="checkRule(scope.row)" type="text" size="small">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <div class="list" v-if="signObj.fake">
        <el-table :data="tableData">
          <el-table-column type="selection" label="全选" width="80"></el-table-column>
          <el-table-column prop="nameList" label="" width="600">
            <!--<template slot-scope="scope">
							<div class="tableTitle ellipsis" >
								<p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis!important;">
									{{scope.row.nameList}}
								</p>
							</div>
						</template>-->
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group v-model="tableData.nameList" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="name in tableData.nameList" :label="city" :key="name">{{name}}</el-checkbox>
            </el-checkbox-group>
          </el-table-column>
        </el-table>
      </div>
    </el-row>

    <!--分页-->
    <div class="page center" v-if="signObj.pageSign">
      <el-pagination layout="prev, pager, next, sizes, jumper" style="margin-top: 10px;text-align:center" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="2" :page-sizes="[10, 20, 50, 100]" :page-size="10"
        :total="500" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {
      signObj: Object,
      dataForm: Object,
    },
    data() {
      return {
        loading: true,
        // 数据列表
        tableData: [{
          id: '12987122',
          name: '名称ieunoc',
          category: '正在描述中，很多信息在想',
          desc: 'MORETYPE',
          address: 'DataBase',
          shop: '2037-12-9',
          shopId: '运行中'
        }, {
          id: '12987123',
          name: '名称ieunoc',
          category: '正在描述中，很多信息在想',
          desc: 'MORETYPE',
          address: 'DataBase',
          shop: '2037-12-9',
          shopId: '关闭'
        }, {
          id: '12987125',
          name: '名称ieunoc',
          category: '正在描述中，很多信息在想',
          desc: 'MORETYPE',
          address: 'DataBase',
          shop: '2037-12-9',
          shopId: '异常'
        }, {
          id: '12987126',
          name: '名称ieunoc',
          category: '正在描述中，很多信息在想',
          desc: 'MORETYPE',
          address: 'DataBase',
          shop: '2037-12-9',
          shopId: '已上线'
        }],
        // 分页相关
          page: {
            pageSize: 10,
            total: 0,
            currentPage: 1,
            sizes: [20, 50, 100, 200],
            count: 1,
            layout: "prev, pager, next",
            total: 200,
            background: false,
          },

        // 当前查看的id
        currentId: '',
        // 详情
        checkVisible: false,
        // 详情信息
        detail: {},
      }
    },
    watch: {
      dataForm: {
        handler(newValue, oldValue) {
          this.tableData = newValue.tableData
          console.log('Table-List-Data:22', this.dataForm.tableData)

        },
        deep: true,
        // immediate: true
      },
    },
    created() {
      console.log('Table-List-Data222222222:', this.tableData)
    },
    mounted() {},
    methods: {
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
    // 每页几条
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
      },
      // 当前第几页
      handleCurrentChange(val) {
        this.currentPage = val
      },
    //响应表格分页条数变化
    dealSizeChange(val) {
      this.page.pageSize = val;
      this.page.current = 1;
      this.$emit("size-change", this.page.current || 1, val);
    },
    //响应表格当前页码变化
    dealPageChange(val) {
      this.page.current = val;
      this.$emit("page-change", val, this.page.pageSize);
    },
    }
  }
</script>

<style scoped>
  /*.headbox {
		box-sizing: border-box;
		float: left;
	}*/
  .page {
    margin: 20px;
  }

  .el-badge {
    margin: 10px 5px 0 0;
  }

  .cell span {
    /*竖线*/
    color: #409EFF;
  }

  .btn {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding: 10px;
  }
</style>
