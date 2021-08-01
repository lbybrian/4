<template>
	<div style="padding-top: 10px; margin-top: 0px; height: 100%; position: relative;">
		<el-row style="margin-top: 0px; height: 100%;" :gutter="5">
			<el-col :span="24" style="height: 100%; ">
				<div class="documentList">
					<el-card shadow="always" style="margin-top: 20px;">
						<div class="dataFilterArea">
							<el-row :gutter="20">
								<el-col :span="6" :offset="8">
									<el-input size="small" placeholder="请输关键词检索" v-model="searchKeyword" class="keywordInput">
										<el-button size="small" type="primary" slot="append" @click="searchEvent">
											搜索
										</el-button>
									</el-input>
								</el-col>
								<el-col :span="6" :offset="3" style="text-align:right">
									<el-button size="small" type="primary" @click="batchDownload">批量归类</el-button>
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
							<DataTable ref="docListItem" :dataObj="docListTable" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import DataTable from "@/assistCommon/dataTable";

export default {
	name:'dataPretreatment',
	components: {
		DataTable
	},
	beforeMount () {

	},
	mounted () {

	},
	data () {
		return {
			//文档查询筛选参数配置项
			searchKeyword: "",
			//文档表格配置参数项
			docListTable: {
				withSelection: true,
				// withIndex: true,
				heightCurrentRow: true,
				header: [{
					prop: "qbnr",
					label: "情报内容",
					minWidth: "240",
					align: "left",
					showOverflowTooltip:true,
				}, {
					prop: "bq",
					label: "标签",
					minWidth: "160",
					align: "center",
					tag: true,
          effect:'dark',
					tagData: [
						{
							label: '正面',
              				value: '1',
							type: 'success'
						}, {
							label: '反面',
              				value: '2',
							type: 'danger'
						}, {
							label: '对立面',
              				value: '3',
							type: 'warning'
						},{
							label: '紧急标签',
              				value: '4',
							type: 'danger'
						}, {
							label: '严重标签',
              				value: '5',
							type: 'warning'
						}, {
							label: '一般标签',
              				value: '6',
							type: 'success'
						},
					]
				},
				{
					prop: "zdfl",
					sortable: true,
					label: "自动分类",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "date",
					label: "操作",
					width: "300",
					align: "center",
					//表格中数据行中的按钮列表
					buttons: [
						{
							text: "手动归类",
							eventName: "classIfication"
						},
					],
				},
				],
				data: [
					{
						bq:'4',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						zdfl:'人物事件分类'
					},
					{
						bq:'5',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						zdfl:'事件分析分类'
					},
					{
						bq:'6',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						zdfl:'人物事件分类'
					},
					{
						bq:'4',
						qbnr:'内容内容4',
						zdfl:'事件分析分类'
					},
					{
						bq:'5',
						qbnr:'内容内容5',
						zdfl:'人物事件分类'
					},
					{
						bq:'6',
						qbnr:'内容内容6',
						zdfl:'事件分析分类'
					},
					],
				//表格的分页配置项
				page: {
					pageSize: 10,
					currentPage: 1,
					total: 100,
					layout: 'prev, pager, next, sizes,jumper',
					background: true,
				},
				style: 'margin-top: 10px;text-align:center;'
			},
			order: {
				// fssj: "-1",
				// tj_status: "-1",
				// update_time: "-1"
			},
		};
	},
	methods: {
		// 更新文档列表
		updateDocList () {
			var _self = this;
			// _self.adapter.getDocumentData({}, function (d) {
			//   _self.docListTable.data = d.data;
			// })
			let iMarkSearchInfo = {
				pageNo: _self.docListTable.page.currentPage,
				pageSize: _self.docListTable.page.pageSize,
				q: _self.searchKeyword,
				order: _self.order
			}
			// _self.adapter.docList(iMarkSearchInfo, function (d) {
			// 	if (d.data.meta.success) {
			// 		if (d.data.data.data.length > 0) {
			// 			d.data.data.data.forEach((item, index) => {
			// 				item.tj_status = !!item.tj_status && item.tj_status === 1 ? '已提交' : '未提交';
			// 			});
			// 		}

			// 		_self.docListTable.data = d.data.data.data;
			// 		_self.docListTable.data.forEach((item, index) => {
			// 			index % 2 == 1 ? (item.bq = '正面', item.class = 'negative') : item.bq = '负面'
			// 		});
			// 		console.log(_self.docListTable.data)
			// 		_self.docListTable.page.total = d.data.data.pager.total;
			// 	} else {
			// 		_self.$message({
			// 			message: d.data.meta.message,
			// 			type: 'error'
			// 		});
			// 	}
			// })
		},

		//关键词搜索
		searchEvent () {
			this.docListTable.page.currentPage = 1;
			console.log(this.searchKeyword)
			this.updateDocList();
		},

		// 批量下载
		batchDownload(){
      console.log(this.docListTable.selected)
    },

		// 表格分页相关方法
		dealSelectionChange (val) {
			console.log(val)
		},

		dealSortChange (param) {
			console.log(param)
		},

		dealCellClick (row, column, cell, event) {
			console.log(row, column, cell)
		},

		//页码切换
		dealPageChange (current, size) {
			this.docListTable.page.currentPage = current;
			// this.docListTable.page.pageSize = size;
			console.log(current)
			this.updateDocList();
		},

		dealSizeChange (current, size) {
			this.docListTable.page.currentPage = 1;
			this.docListTable.page.pageSize = size;
			this.updateDocList();
		},

		//表格点击事件
		dealButtonClick (name, d) {
			if (name && typeof (this[name]) === "function") {
				this[name](d);
			}
		},
		
		// 列表排序
		sortChange (column) {
			if (!!column.order) {
				this.order = {};
				this.order[column.prop] = column.order == "ascending" ? 1 : "-1";
			} else {
				this.order = {};
			}
			this.updateDocList();
		},

		// 手动归类
		classIfication (d) {
      this.$confirm('是否手动归类该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '手动归类成功!'
          });
        }).catch(() => {});
		},
	},
};

</script>

<style scoped>
* {
	box-sizing: border-box;
}

button:focus {
		border: 0 none;
		outline: none;
}

.documentArea,
.documentList {
	height: 100%;
	background-color: #fff;
	border-radius: 5px;
}

.opArea .el-dropdown-link {
	cursor: pointer;
	margin-left: 10px;
}

.keywordInput /deep/ .el-input-group__append {
	background: #4f78e0;
	color: #fff;
	border: none;
	border-radius: 0;
	font-size: 14px;
}
.keywordInput /deep/ .el-input-group__append button {
	letter-spacing: 4px;
}
.pitchOn {
	color: #6186e4;
}
</style>
