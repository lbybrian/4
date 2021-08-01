<template>
	<!--分页-->
		<div class="page center">
			<!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="2" :page-sizes="[10, 20, 50, 100]" :page-size="10" :total="500" layout="total, sizes, prev, pager, next, jumper" background> -->
        <el-pagination :style="style || 'margin-top: 10px;text-align:right'"
          :page-size="page.pageSize || 20" :page-sizes="page.sizes || [10, 20, 50, 100]"
          :pager-count="5" :current-page="page.currentPage" :page-count="page.count || 1"
          :layout="page.layout || 'prev, pager, next, sizes'" :total="page.total || 0"
          :background="page.background" @size-change="dealSizeChange" @current-change="dealPageChange">
        </el-pagination>
			<!-- </el-pagination> -->
		</div>
</template>

<script>
		export default {
		name: "",
		components: {},
		props:{

		},
		data() {
			return {
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
			}
		},
		watch: {
			//  	csd: {
			//      handler(newValue, oldValue) {
			//        this.qw('csd')
			//      },
			//      deep: true,
			//      immediate: true
			//    },
		},
		created() {},
		mounted() {},
		methods: {
			// // 每页几条
	  //     handleSizeChange(val) {
	  //       this.pageSize = val
	  //       this.currentPage = 1
	  //     },

	  //     // 当前第几页
	  //     handleCurrentChange(val) {
	  //       this.currentPage = val
	  //     },
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

<style>
</style>
