<template>
	<div>
		<el-row :gutter="5">
			<el-col :span="24">
				<div class="documentList">
					<el-card shadow="always">
						<div class="dataFilterArea">
							<el-row :gutter="20">
								<el-col :span="3" class="timeHorizon">
									<span v-for="item in timeHorizon" :key="item.value" :class="item.pitch ? 'pitchOn' : ''" @click="pitchOnFun(item)">{{item.name}}</span>
								</el-col>
								<el-col :span="4" class="datarangeBox">
									<el-date-picker size="small" style="width: 250px;" v-model="dataFilter.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="dataFilter.pickerOptions" @change="datePickChange">
									</el-date-picker>
								</el-col>
								<el-col :span="6">
									<el-input size="small" placeholder="请输关键词检索" v-model="dataFilter.keyword" class="keywordInput">
										<el-button size="small" type="primary" slot="append" @click="handleSerchEvent">
											搜索
										</el-button>
									</el-input>
								</el-col>
								<el-col :span="2" class="btnBox">
									<el-button size="small" type="primary" @click="handleSerchReset">
										重置
									</el-button>
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
import DataTable from "@/autoTagCommon/dataTable";
import Utils from "../assets/js/util"
// import func from 'vue-editor-bridge';
export default {
	components: {
		DataTable
	},
	beforeMount () {

	},
	mounted () {
		this.getDocumentList()
	},
	data () {
		return {
			//文档查询筛选参数配置项
			dataFilter: {
				time: [],
				keyword: "",
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick (picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick (picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick (picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
			},
			//文档表格配置参数项
			docListTable: {
				selected: [],
				withSelection: true,
				withIndex: true,
				heightCurrentRow: true,
				header: [{
					prop: "qbbt",
					label: "任务名称",
					minWidth: "200",
					align: "left",
				},
				{
					prop: "size",
					label: "任务状态",
					minWidth: "80",
					align: "center",
				},
				// {
				// 	prop: "tj_status",
				// 	sortable: true,
				// 	label: "提交状态",
				// 	minWidth: "80",
				// 	align: "center",
				// },
				// {
				// 	prop: "update_user",
				// 	label: "提交人",
				// 	minWidth: "120",
				// 	align: "center",
				// },
				{
					prop: "create_time",
					sortable: true,
					label: "创建时间",
					minWidth: "160",
					align: "center",
				},{
					prop: "create_user_id",
					sortable: true,
					label: "创建人",
					minWidth: "160",
					align: "center",
				},{
					prop: "create_time",
					sortable: true,
					label: "审批人",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "date",
					label: "操作",
					// width: "100",
					align: "center",
					//表格中数据行中的按钮列表
					buttons: [{
						text: "删除",
						eventName: "delectDoc"
					}
					],
				},

				],
				data: [

				],
				//表格的分页配置项
				page: {
					pageSize: 10,
					currentPage: 1,
					total: 0,
					layout: 'prev, pager, next, sizes,jumper',
					background: true,
				},
				style: 'margin-top: 20px;text-align:center;',
				loading: false
			},
			order: {
				// fssj: "-1",
				// tj_status: "-1",
				// update_time: "-1"
			},
			timeHorizon: [
				{
					name: '今日',
					value: 'today',
					pitch: false,
				},
				{
					name: '本周',
					value: 'thisWeek',
					pitch: false,
				}, {
					name: '本月',
					value: 'thisMonth',
					pitch: false,
				}, {
					name: '全年',
					value: 'annual',
					pitch: false,
				},
			],
			fileDialogVisible: false,
			fileList: [],
			loadingButton: false,
			upDisabled: false,
			uploadFlag: false,
			dataBox: {
				pageSize: 10,
				pageNo: 1,
				startTime: '',
				endTime: '',
				q: "",
				id: '',
			}
		};
	},
	watch: {
		"dataFilter.time" (newVal) {
			if (newVal == null) {
				this.dataFilter.time = [];
			}
		},
	},
	methods: {
		//获取文档列表
		getDocumentList () {
			let that = this
			this.docListTable.loading = true
			this.adapter.docList(this.dataBox, function (d) {
				if (d.data.meta.success) {
					let documentData = d.data.data.data
					if (documentData.length > 0) {
						documentData.forEach(item => {
							item.size = item.size ? Math.round(item.size / 1024) + 'kb' : 0
						})
					}
					that.docListTable.data = documentData
					that.docListTable.page.total = d.data.data.pager.total;
				} else {
					that.$message({
						message: d.data.meta.message,
						type: 'error'
					});
				}
				that.docListTable.loading = false
			})
		},
		//搜索重置
		handleSerchReset () {
			this.dataBox = {
				pageSize: 10,
				pageNo: 1,
				startTime: '',
				endTime: '',
				q: "",
				id: '',
			}
			this.dataFilter.time = []
			this.dataFilter.keyword = ''
			this.getDocumentList()
		},

		//批量下载
		batchDownload () {
			if (this.docListTable.selected && this.docListTable.selected.length == 0) {
				this.$message.error('请选择需要下载的数据');
				return
			}
			this.$confirm('是否下载所选文件?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.adapter.postDownload({ id: this.returnIdString(this.docListTable.selected) }, function (d) {
					console.log(d.data)
				})
				// this.$message({
				// 	type: 'success',
				// 	message: '导出成功!'
				// });
			}).catch(() => { });
		},
		//批量删除
		batchDelect () {
			console.log(this.docListTable.selected)
			if (this.docListTable.selected && this.docListTable.selected.length == 0) {
				this.$message.error('请选择需要删除的数据');
				return
			}
			this.$confirm('是否删除所选文件?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '导出成功!'
				});
			}).catch(() => { });
		},

		// 更新文档列表
		updateDocList () {
			var _self = this
			let iMarkSearchInfo = {
				pageNo: _self.docListTable.page.currentPage,
				pageSize: _self.docListTable.page.pageSize,
				startTime: _self.dataFilter.value ? _self.dataFilter.value[0] : '',
				endTime: _self.dataFilter.value ? _self.dataFilter.value[1] : '',
				q: _self.dataFilter.keyword,
				order: _self.order
			}
			_self.adapter.docList(iMarkSearchInfo, function (d) {
				if (d.data.meta.success) {
					_self.docListTable.data = d.data.data.data;
					_self.docListTable.page.total = d.data.data.pager.total;
				} else {
					_self.$message({
						message: d.data.meta.message,
						type: 'error'
					});
				}
			})
		},

		// 表格删除方法
		delectDoc () {
			this.$confirm('是否删除该文件?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '导出成功!'
				});
			}).catch(() => { });
		},
		//搜索方法
		handleSerchEvent () {
			this.docListTable.page.currentPage = 1;
			this.dataBox = {
				...this.dataBox,
				startTime: this.dataFilter.time[0] || '',
				endTime: this.dataFilter.time[1] || '',
				q: this.dataFilter.keyword,
			}
			this.getDocumentList();
		},


		// 表格按钮点击方法
		dealButtonClick (name, d) {
			if (name && typeof (this[name]) === "function") {
				this[name](d);
			}
		},
		// 表格分页相关方法
		dealSelectionChange (val) {
			console.log(val)
		},
		// 排序
		dealSortChange (param) {
			console.log(param)
		},
		// 点击列表某列返回
		dealCellClick (row, column, cell, event) {
			console.log(row, column, cell)
		},
		// dealButtonClick(eventName, row, index) {
		//   console.log(eventName, row, index)
		// },
		//页码切换
		dealPageChange (current, size) {
			this.docListTable.page.currentPage = current;
			this.dataBox.pageNo = current;
			this.getDocumentList();
		},
		//选页跳转
		dealSizeChange (current, size) {
			this.docListTable.page.pageNo = 1;
			this.docListTable.page.pageSize = size;
			this.dataBox.currentPage = 1;
			this.dataBox.pageSize = size
			this.getDocumentList();
		},
		// 列表排序
		sortChange (column) {
			if (!!column.order) {
				this.order = {};
				this.order[column.prop] = column.order == "ascending" ? 1 : "-1";
			} else {
				this.order = {};
			}
			this.getDocumentList();
		},
		// 日期范围点击回显
		pitchOnFun (data) {
			this.timeHorizon.forEach(item => {
				item.pitch = false
			})
			data.pitch = true
			switch (data.value) {
				case 'today':
					this.dataFilter.time = [Utils.getToday().startTime, Utils.getToday().endTime]
					break;
				case 'thisWeek':
					this.dataFilter.time = [Utils.getCurrWeekDays().startTime, Utils.getCurrWeekDays().endTime]
					break;
				case 'thisMonth':
					this.dataFilter.time = [Utils.getCurrMonthDays().startTime, Utils.getCurrMonthDays().endTime]
					break;
				case 'annual':
					this.dataFilter.time = [Utils.getCurrYearDays().startTime, Utils.getCurrYearDays().endTime]
					break;
			}
		},
		// 时间范围改变
		datePickChange (val) {
			this.timeHorizon.forEach(item => {
				item.pitch = false
			})
		},
		//获取list集合以逗号分隔的id,
		returnIdString (list) {
			let arr = []
			list.forEach(item => {
				arr.push(item.id)
			})
			return arr.join(',')
		}
	},
};

</script>

<style scoped>
* {
	box-sizing: border-box;
}

.datarangeBox /deep/ .el-date-editor .el-range-separator {
	width: 30px !important;
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
/* /deep/ .negative{
  background: red;
  color: #fff;
} */
.timeHorizon {
	line-height: 32px;
}
.timeHorizon span {
	padding: 0 10px;
	font-size: 14px;
	cursor: pointer;
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
.btnBox /deep/ .el-button--primary {
	background: #4f78e0;
	color: #fff;
}
</style>
