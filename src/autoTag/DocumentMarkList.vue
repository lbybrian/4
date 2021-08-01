<template>
	<div>
		<el-row  :gutter="5">
			<el-col :span="24" >
				<div class="documentList">
					<el-card shadow="always" >
						<div class="dataFilterArea">
							<el-row :gutter="20">
								<el-col :span="3" class="timeHorizon">
									<span v-for="item in timeHorizon" :key="item.value" :class="item.pitch ? 'pitchOn' : ''" @click="pitchOnFun(item)">{{item.name}}</span>
								</el-col>
								<el-col :span="4" class="datarangeBox">
									<el-date-picker size="small" style="width: 250px;" v-model="dataFilter.time" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="dataFilter.pickerOptions" @change="datePickChange">
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
								<el-col :span="9" class="btnBox" style="text-align:right">
									<el-button size="small" type="primary" @click="handleAllotOne">
										分配标注任务
									</el-button>
                  <el-button size="small" type="primary" @click="handleAllotTwo">
										分配到现有任务
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
		<el-dialog class="allocation" title="分配" width="600px" :visible.sync="allocation.dialogFormVisible">
			<el-form :model="allocation.allocationForm" ref="allocationForm" label-width="100px">
        <el-form-item label="任务名称：" prop="taskName" :rules="[{ required: true, message: '请输入任务名称！'}]">
					<el-input size="small" placeholder="请输入任务名称" v-model="allocation.allocationForm.taskName" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="标注方向：" prop="direction" :rules="[{ required: true, message: '请选择标注方向！'}]">
					<el-checkbox-group v-model="allocation.allocationForm.direction">
						<el-checkbox v-for="item in allocation.directionBox" :label="item.id" :key="item.id">{{item.direction}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="标注人员：" prop="staff" :rules="[{ required: true, message: '请选择标注人员！'}]">
					<el-checkbox-group v-model="allocation.allocationForm.staff ">
						<el-checkbox v-for="item in allocation.staffBox" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormClose">取 消</el-button>
				<el-button type="primary" @click="allocationSubmit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import DataTable from "@/autoTagCommon/dataTable";
import Utils from "../assets/js/util"
export default {
	components: {
		DataTable
	},
	beforeMount () {

	},
	mounted () {
		//更新标注文档列表
		this.updateDocList();
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
					label: "文档名称",
					minWidth: "200",
					align: "left",
				}, {
					prop: "qgqx",
					label: "情感倾向",
					minWidth: "160",
					align: "center",
					tag: true,
					effect: 'dark',
					tagData: [
						{
							label: '正面',
							value: '1',
							type: 'success'
						}, {
							label: '反面',
							value: '2',
							type: 'danger'
						}
					]
				},
				{
					prop: "fssj",
					sortable: true,
					label: "发生时间",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "mark_size",
					label: "标注数量",
					minWidth: "80",
					align: "center",
				},
				{
					prop: "tj_status",
					sortable: true,
					label: "提交状态",
					minWidth: "80",
					align: "center",
				},
				{
					prop: "update_user",
					label: "提交人",
					minWidth: "120",
					align: "center",
				},
				{
					prop: "update_time",
					sortable: true,
					label: "提交时间",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "date",
					label: "操作",
					width: "300",
					align: "center",
					//表格中数据行中的按钮列表
					buttons: [{
						text: "协同标注",
						eventName: "checkAgain"
					}, {
						text: "|",
					}, {
						text: "智能标注",
						eventName: "checkAgain"
					}, {
						text: "|",
					},
					{
						text: "查看数据",
						eventName: "checkAgain"
					},
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
			dataBox: {
				pageSize: 10,
				size: 1,
				startTime: '',
				endTime: '',
				q: '',
        order:{},
			},
			taskAllocation: {
				id: '',
				direction: '',
				staff: '',
        taskName:'',
			},
			allocation: {
				dialogFormVisible: false,
				allocationForm: {
					direction: [],
					staff: [],
          taskName:''
				},
				directionBox: [{
					"direction": "方向A",
					"id": 1
				},
				{
					"direction": "方向B",
					"id": 2
				}],
				staffBox: [{
					"name": "admin",
					"id": 1,
					"type": "admin",
					"creatTime": "--"
				},
				{
					"name": "光头强",
					"id": 2,
					"type": "normal",
					"creatTime": "2021-3-10"
				},]
			},
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
		// 更新文档列表
		updateDocList () {
			var _self = this;
			this.docListTable.loading = true
			_self.adapter.docList(this.dataBox, function (d) {
				if (d.data.meta.success) {
					let documentData = d.data.data
					if (documentData.data.length > 0) {
						documentData.data.forEach((item, index) => {
							item.tj_status = !!item.tj_status && item.tj_status === 1 ? '已提交' : '未提交';
							item.qgqx = 1
						});
					}
					_self.docListTable.data = documentData.data
					_self.docListTable.page.total = d.data.data.pager.total;
				} else {
					_self.$message({
						message: d.data.meta.message,
						type: 'error'
					});
				}
				_self.docListTable.loading = false
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
        order:{},
			}
			this.dataFilter.time = []
			this.dataFilter.keyword = ''
			this.getDocumentList()
		},
		// 搜索方法
		handleSerchEvent () {
			this.docListTable.page.currentPage = 1;
			this.dataBox = {
				...this.dataBox,
				startTime: this.dataFilter.time[0] || '',
				endTime: this.dataFilter.time[1] || '',
				q: this.dataFilter.keyword,
			}
			console.log(this.dataBox)
			this.updateDocList();
		},
		// 表格按钮点击方法
		dealButtonClick (name, d) {
			if (name && typeof (this[name]) === "function") {
				this[name](d);
			}
		},
		// 查看数据（暂注释）
		// viewDataItem(d) {
		//   var _self = this;
		//   this.switchCurrentData(d, function (dd) {
		//     // _self.$router.push({
		//     //   path: "labelDataInfo"
		//     // });
		//     localStorage.setItem("fromUrl",'viewDataItem');
		//     window.open("/#/labelDataInfo", "_blank")
		//   });
		// },
		// 根据文档id获取数据显示文档详情
		checkAgain (d) {
			this.$router.push({
				path: '/mark',
			})
      //储存当前点击数据
			localStorage.setItem('nowList', JSON.stringify(d))
      //储存当前查询条件，方便标注页实现上下编
      localStorage.setItem('listPage', JSON.stringify(this.dataBox))
		},
		//页码切换
		dealPageChange (current, size) {
			this.docListTable.page.currentPage = current;
			this.dataBox.pageNo = current;
			this.updateDocList();
		},
		//选页跳转
		dealSizeChange (current, size) {
			this.docListTable.page.currentPage = 1;
			this.docListTable.page.pageSize = size;
			this.dataBox.pageNo = 1;
			this.dataBox.pageSize = size
			this.updateDocList();
		},
		// 列表排序
		sortChange (column) {
			if (!!column.order) {
				this.dataBox.order = {};
				this.dataBox.order[column.prop] = column.order == "ascending" ? 1 : "-1";
			} else {
				this.dataBox.order = {};
			}
			this.updateDocList();
		},
		// 日期点击
		pitchOnFun (data) {
			let _that = this
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
		// 时间选择框改变
		datePickChange (val) {
			this.timeHorizon.forEach(item => {
				item.pitch = false
			})
		},
		// 分配标注任务
		handleAllotOne () {
			if (this.docListTable.selected && this.docListTable.selected.length > 0) {
				this.taskAllocation.id = this.returnIdString(this.docListTable.selected)
				this.allocation.dialogFormVisible = true
			} else {
				this.$message({
					type: 'error',
					message: '请选择要分配的文档!',
				})
			}
		},
		//分配提交
		allocationSubmit () {
			this.$refs['allocationForm'].validate((valid) => {
				if (valid) {
					this.taskAllocation.staff = this.allocation.allocationForm.staff.join(',')
					this.taskAllocation.direction = this.allocation.allocationForm.direction.join(',')
          this.taskAllocation.taskName = this.allocation.allocationForm.taskName
					console.log(this.taskAllocation, 789)
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 分配弹窗关闭
		dialogFormClose () {
			this.allocation.dialogFormVisible = false
			this.$refs['allocationForm'].resetFields();
		},
    //分配到现有任务
    handleAllotTwo () {
			if (this.docListTable.selected && this.docListTable.selected.length > 0) {
				this.taskAllocation.id = this.returnIdString(this.docListTable.selected)
				this.allocation.dialogFormVisible = true
			} else {
				this.$message({
					type: 'error',
					message: '请选择要分配的文档!',
				})
			}
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
