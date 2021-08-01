<template>
	<div style=" margin-top: 0px; height: 100%; position: relative;">
		<el-row style="margin-top: 0px; height: 100%;" :gutter="40">
			<el-col :span="5" :offset="0" class="tree_part">
				<div style="padding:20px">
					<el-radio-group v-model="labelInfoConfigType" size="medium" style="margin-bottom: 10px; text-align: center;" @change="labelInfoChange">
						<el-radio-button label="entity">实体标签</el-radio-button>
						<el-radio-button label="event">事件标签</el-radio-button>
					</el-radio-group>
					<el-input placeholder="请输入搜索内容" v-model="searchInput" size="medium" @keyup.enter.native="handleSerchEvent">
						<el-button size="small" type="primary" slot="append" @click="handleSerchEvent" icon="el-icon-search">
						</el-button>
					</el-input>
					<LabelZtree :dataObj="treeLabelData" style="margin-top:20px" @removeNode="removeNode" @appendNode="appendNode" @editNode="editNode" @nodeClick='nodeClick'></LabelZtree>
				</div>
			</el-col>
			<el-col :span="19" style="height: 100%; ">
				<div class="documentList">
					<el-card shadow="always" style="margin-top: 20px;">
						<div class="dataFilterArea">
							<el-row :gutter="20">
								<el-col :span="6" :offset="8">
									<el-input size="small" placeholder="请输关键词检索" v-model="dataFilter.keyword" class="keywordInput">
										<el-button size="small" type="primary" slot="append" @click="listSerchEvent">
											搜索
										</el-button>
									</el-input>
								</el-col>
								<el-col :span="8" :offset="2" style="text-align:right">
									<el-button size="small" type="primary" @click="resetDataFilter()">重置</el-button>
									<el-button size="small" icon="el-icon-edit" @click="taggingEvaluate('reliable')">可靠性标注与评价</el-button>
									<el-button size="small" icon="el-icon-edit" @click="taggingEvaluate('important')">重要性标注与评价</el-button>
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;cursor: pointer;">
							<DataTable ref="docListItem" :dataObj="docListTable" @row-click="toDetail" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import DataTable from "@/assistCommon/dataTable";
import LabelZtree from "@/common/tree"
import Utils from "../assets/js/util"
export default {
	name: 'dataPretreatment',
	components: {
		DataTable,
		LabelZtree
	},
	beforeMount () {

	},
	mounted () {
this.updateLabelData()
	},
	data () {
		return {
			searchInput: '',
			curNodeId: '',
			//文档查询筛选参数配置项
			dataFilter: {
				keyword: "",
			},
			//文档表格配置参数项
			docListTable: {
				withSelection: true,
				heightCurrentRow: true,
				header: [{
					prop: "qbnr",
					label: "情报内容",
					minWidth: "240",
					align: "left",
					showOverflowTooltip: true,
				}, {
					prop: "bt",
					label: "标题",
					minWidth: "120",
					align: "center",
				}, {
					prop: "bq",
					label: "标签",
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
						}, {
							label: '对立面',
							value: '3',
							type: 'warning'
						}, {
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
					prop: "time",
					label: "时间",
					minWidth: "100",
					align: "center",
				},
				{
					prop: "gar",
					label: "归案人",
					minWidth: "100",
					align: "center",
				}],
				data: [
					{
						bq: '4',
						qbnr: '在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						bt: '在华盛顿举行的中美研究',
						time: '2021/03/31',
						gar: '张三'
					},
					{
						bq: '5',
						qbnr: '在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						bt: '在华盛顿举行的中美研究',
						time: '2021/03/31',
						gar: '张三'
					},
					{
						bq: '6',
						qbnr: '在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						bt: '在华盛顿举行的中美研究',
						time: '2021/03/31',
						gar: '张三'
					},
					{
						bq: '4',
						qbnr: '内容内容4',
						bt: '在华盛顿举行的中美研究',
						time: '2021/03/31',
						gar: '张三'
					},
					{
						bq: '5',
						qbnr: '内容内容5',
						bt: '在华盛顿举行的中美研究',
						time: '2021/03/31',
						gar: '张三'
					},
					{
						bq: '6',
						qbnr: '内容内容6',
						bt: '在华盛顿举行的中美研究',
						time: '2021/03/31',
						gar: '张三'
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
			treeLabelData: {
				tree: [{
					id: 1,
					label: '一级 1',
					count: 10,
					open: false,
					children: [
						{
							id: 4,
							label: '二级 1-1',
							count: 10,
							open: false,
							children: [
								{
									id: 9,
									label: '三级 1-1-1',
									count: 3,
									open: false,
									children: [
										{
											id: 23,
											label: '四级 1-1-1-3',
											count: 3,
											open: false,
										},
									],
								},
								{
									id: 10,
									label: '三级 1-1-2',
									count: 7,
									open: false,
								},
							],
						},
						{
							id: 11,
							label: '二级 1-1',
							count: 10,
							open: false,
							children: [
								{
									id: 12,
									label: '三级 1-1-1',
									count: 3,
									open: false,
									children: [
										{
											id: 56,
											label: '四级 1-1-1-3',
											count: 3,
											open: false,
										},
									],
								},
								{
									id: 78,
									label: '三级 1-1-2',
									count: 7,
									open: false,
								},
							],
						},
					],
				},
				{
					id: 2,
					label: '一级 2',
					count: 10,
					open: false,
					children: [
						{
							id: 5,
							label: '二级 2-1',
							count: 8,
							open: false,
						},
						{
							id: 6,
							label: '二级 2-2',
							count: 2,
							open: false,
						},
					],
				},
				{
					id: 3,
					label: '一级 3',
					open: false,
				},],
				expandClickNode: true,
				editable: false,
				treeIndent: 2,
			},
      labelInfoConfigType: 'entity',
			eventLabelTree: [],
			entityLabelTree: []
		};
	},
	methods: {
    // 获取tree结构（按需更换对应的tree请求）
    updateLabelData () {
			var _self = this;
      this.adapter.getLabelZtree({label_id:'',q:''}, function (d) {
        let treeData = d.data.data
				_self.treeLabelData.tree= Utils.treeAddOpen(treeData)
        _self.entityLabelTree= Utils.treeAddOpen(treeData)
				_self.eventLabelTree = Utils.treeAddOpen(treeData)
        // console.log(_self.entityLabelTree)
			});
		},
		// 更新文档列表
		updateDocList () {
			var _self = this;
			// _self.adapter.getDocumentData({}, function (d) {
			//   _self.docListTable.data = d.data;
			// })
			let iMarkSearchInfo = {
				pageNo: _self.docListTable.page.currentPage,
				pageSize: _self.docListTable.page.pageSize,
				q: _self.dataFilter.keyword,
				order: _self.order
			}
			_self.adapter.docList(iMarkSearchInfo, function (d) {
				if (d.data.meta.success) {
					if (d.data.data.data.length > 0) {
						d.data.data.data.forEach((item, index) => {
							item.tj_status = !!item.tj_status && item.tj_status === 1 ? '已提交' : '未提交';
						});
					}

					_self.docListTable.data = d.data.data.data;
					_self.docListTable.data.forEach((item, index) => {
						index % 2 == 1 ? (item.bq = '正面', item.class = 'negative') : item.bq = '负面'
					});
					console.log(_self.docListTable.data)
					_self.docListTable.page.total = d.data.data.pager.total;
				} else {
					_self.$message({
						message: d.data.meta.message,
						type: 'error'
					});
				}
			})
		},

		// 树查询
		handleSerchEvent () {
			let _self = this;
			let url = ""
			let serchInput = ""
			let labelid = ""
			// if (this.activeName === "entity") {
			// 	url = 'getLabelZtree';
			// 	serchInput = this.searchInput;
			// 	labelid = this.curNodeId
			// } else {
			// 	url = 'relationSearch';
			// 	serchInput = this.treeRelationLabelData.qTxt;
			// 	labelid = this.curNodeId
			// }
			// this.adapter[url]({
			// 	label_id: labelid || "",
			// 	q: serchInput
			// }, function (res) {
			// 	console.log(res.data.data)
			// 	let defaultKeys = res.data.data;
			// 	if (serchInput != "") {
			// 		if (_self.activeName === "entity") {
			// 			_self.treeLabelData.qTxt = serchInput;
			// 			_self.treeLabelData.data = res.data.data;
			// 			_self.treeLabelData.defaultExpandedKeys = [];
			// 			_self.getDefaultExpandedKeys(defaultKeys, "treeLabelData")
			// 		} else {
			// 			_self.treeRelationLabelData.qTxt = serchInput;
			// 			_self.treeRelationLabelData.data = res.data.data;
			// 			_self.treeRelationLabelData.defaultExpandedKeys = [];
			// 			_self.getDefaultExpandedKeys(defaultKeys, "treeRelationLabelData")
			// 		}
			// 		$(".autoHeight").css({ "height": "500px", "overflow-y": "auto" });
			// 	} else {
			// 		if (_self.activeName === "entity") {
			// 			_self.treeLabelData.defaultExpandedKeys = [];
			// 			_self.treeLabelData.data = res.data.data;
			// 		} else {
			// 			_self.treeRelationLabelData.defaultExpandedKeys = [];
			// 			_self.treeRelationLabelData.data = res.data.data;
			// 		}
			// 	}
			// })
		},

		// 默认展开keys--参数 item数据 type那颗树(递归方法)
		getDefaultExpandedKeys (item, type) {
			item.forEach((d, idx) => {
				this[type].defaultExpandedKeys.push(d.id);
				if (d.children) {
					this.getDefaultExpandedKeys(d.children, type);
				}
			})
		},

		nodeClick (data, node, self) {
			console.log(data, node, self, '节点被点击时的回调')
			this.operationType = ''
		},

		//新增节点
		appendNode (node, data) {
			console.log(node, data, 7788, '新增')
			this.operationType = 'newlyCard'
		},

		//编辑节点
		editNode (node, data) {
			console.log(node, data, '编辑')
			this.operationType = 'editCard'
			console.log(this.operationType)
		},
		// 删除节点
		removeNode (node, data) {
			this.operationType = ''
			console.log(node, data, '删除')
			if (data.children && data.children.length > 0) {
				this.$message.error('有子节点，请先删除子节点')
			} else {
				this.$confirm('确定删除该节点吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						// node.remove()
					})
					.catch(() => { })
				return false
			}
		},

		//列表查询
		listSerchEvent () {
			this.docListTable.page.currentPage = 1;
			// this.$message("处理检索事件");
			console.log(this.dataFilter)
			this.updateDocList();
		},

		//重置input
		resetDataFilter () {
			this.dataFilter = {
				keyword: "",
			}
		},

		// 表格分页相关方法
		dealSelectionChange (val) {
			console.log(val)
		},

		dealCellClick (row, column, cell, event) {
			console.log(row, column, cell)
		},

		dealButtonClick (name, d) {
			if (name && typeof (this[name]) === "function") {
				this[name](d);
			}
		},

		//页码切换
		dealPageChange (current, size) {
			this.docListTable.page.currentPage = current;
			console.log(current)
			// this.docListTable.page.pageSize = size;
			this.updateDocList();
		},

		dealSizeChange (current, size) {
			this.docListTable.page.currentPage = 1;
			this.docListTable.page.pageSize = size;
			this.updateDocList();
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

		//跳转详情页面
		toDetail (row, event, column) {
			console.log('111', row)
			if (row) {
				this.$router.push({
					path: '/assessmentDetail'
				})
			}
		},

		// 标注与评价  reliable  可靠性   important  重要性
		taggingEvaluate (type) {
			if (type == "reliable") {
				console.log("可靠性")
			} else {
				console.log("重要性")
			}

		},
		//初始化加减图标
		labelInfoChange (val) {
			switch (val) {
				case 'event':
					this.treeLabelData.tree = Utils.treeAddOpen(this.eventLabelTree);
					break;
				case 'entity':
					this.treeLabelData.tree = Utils.treeAddOpen(this.entityLabelTree);
					break;
			}
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
.tree_part {
	min-height: calc(100vh - 100px);
	background-color: #fff;
	/* padding: 20px 20px !important; */
}
</style>
