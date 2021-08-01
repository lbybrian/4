<template>
	<div class="labelManagerBox">
		<div class="labelBox p-h">
			<el-row :span="24" :gutter="40">
				<el-col :span="6" :offset="0" class="tree_part">
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
				<el-col :span="18" :offset="0" class="fillBox">
					<el-card shadow="always" v-if="labelFormType" :body-style="{ 'padding': '20px' }" style="margin-top:20px">
						<h4 style="margin-bottom:20px">{{labelFormTitle}}</h4>
						<el-form :model="editLabelForm" ref="editLabelForm" :rules="rules" label-width="100px" class="editLabelForm" label-position="left">
							<el-form-item label="父节点：" prop="parentNode">
								<el-input type="text" v-model="editLabelForm.parentNode" autocomplete="off" placeholder="父节点"></el-input>
							</el-form-item>
							<el-form-item label="标签名称：" prop="tagName">
								<el-input type="text" v-model="editLabelForm.tagName" autocomplete="off" placeholder="标签名称"></el-input>
							</el-form-item>
							<el-form-item label="标签评价：" prop="tagEvaluate">
								<el-input type="textarea" autosize v-model.number="editLabelForm.tagEvaluate" placeholder="标签评价"></el-input>
							</el-form-item>
							<el-form-item style="text-align:center">
								<el-button>取消</el-button>
								<el-button v-if="operationType =='editCard'" type="primary" @click="editLabelSubmit">确认</el-button>
								<el-button v-else type="primary" @click="addLabelSubmit">确认</el-button>
							</el-form-item>
						</el-form>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import LabelZtree from "@/common/tree"
import DataTable from '@/autoTagCommon/dataTable'
import Utils from "../assets/js/util"
export default {
	components: {
		LabelZtree,
		DataTable,
	},
	beforeMount () {
		var _self = this;
	},
	created () {
	},
	mounted () {
		this.updateLabelData()
	},
	data () {
		return {
			searchInput: '',
			treeLabelData: {
				tree: [],
				expandClickNode: true,
				editable: true,
				treeIndent: 2,
			},
			currentType: false,

			inquireData: {
				searchInput: ""
			},
			labelid: [],
			relationDatas: [],
			curNodeId: "",
			editLabelForm: {},
			addLabelForm: {},
			rules: {
				parentNode: [
					{ required: true, message: '请输入父节点', },
				],
				tagName: [
					{ required: true, message: '请输入标签名称', }
				],
			},
			operationType: '',
			labelInfoConfigType: 'entity',
			eventLabelTree: [],
			entityLabelTree: [],
			labelFormTitle: '新增标签',
      labelFormType:false,
		}
	},
	methods: {
		updateLabelData () {
			var _self = this;
			this.adapter.getLabelZtree({label_id:'',q:''}, function (d) {

        let treeData = d.data.data
        console.log(Utils.treeAddOpen(treeData),9900)
				_self.treeLabelData.tree= Utils.treeAddOpen(treeData)
        _self.eventLabelTree= Utils.treeAddOpen(treeData)
				_self.entityLabelTree = Utils.treeAddOpen(treeData)
        // console.log(_self.entityLabelTree)
			});
		},
		// //子组件数据传递接收
		// refreshDataTable (data) {
		// 	console.log(data, "传递数据");
		// 	this.curNodeId = data.curClickNodeId;
		// 	this.dataObj.data = [];
		// 	if (typeof data.datalist != 'undefined') {
		// 		this.labelid = data.id;
		// 		let dataList = data.datalist;
		// 		let bmList = []
		// 		this.dealItem(dataList);
		// 		this.dataObj.data = data.datalist;
		// 		this.dataObj.page.pageSize = data.pager.limit;
		// 		this.dataObj.page.currentPage = data.pager.start;
		// 		this.dataObj.page.total = data.pager.total;
		// 		this.dataObj.loading = false
		// 	}
		// },
		// 树查询
		handleSerchEvent () {
			let _self = this;
			let url = ""
			let serchInput = ""
			let labelid = ""
			if (this.activeName === "entity") {
				url = 'getLabelZtree';
				serchInput = this.searchInput;
				labelid = this.curNodeId
			} else {
				url = 'relationSearch';
				serchInput = this.treeRelationLabelData.qTxt;
				labelid = this.curNodeId
			}
			this.adapter[url]({
				label_id: labelid || "",
				q: serchInput
			}, function (res) {
				console.log(res.data.data)
				let defaultKeys = res.data.data;
				if (serchInput != "") {
					if (_self.activeName === "entity") {
						_self.treeLabelData.qTxt = serchInput;
						_self.treeLabelData.data = res.data.data;
						_self.treeLabelData.defaultExpandedKeys = [];
						_self.getDefaultExpandedKeys(defaultKeys, "treeLabelData")
					} else {
						_self.treeRelationLabelData.qTxt = serchInput;
						_self.treeRelationLabelData.data = res.data.data;
						_self.treeRelationLabelData.defaultExpandedKeys = [];
						_self.getDefaultExpandedKeys(defaultKeys, "treeRelationLabelData")
					}
					$(".autoHeight").css({ "height": "500px", "overflow-y": "auto" });
				} else {
					if (_self.activeName === "entity") {
						_self.treeLabelData.defaultExpandedKeys = [];
						_self.treeLabelData.data = res.data.data;
					} else {
						_self.treeRelationLabelData.defaultExpandedKeys = [];
						_self.treeRelationLabelData.data = res.data.data;
					}
				}
			})
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

		// // 数据处理
		// dealItem (resDataInfo) {
		// 	resDataInfo.forEach((item, index) => {
		// 		item.actions = JSON.parse(JSON.stringify(this.dataObjAction));
		// 		item["BM_COPY"] = [];
		// 		if (item.BM_LIST != null) {
		// 			item.BM_LIST.forEach((i, d) => {
		// 				item["BM_COPY"].push(i.value);
		// 			})
		// 		}
		// 		if (item.BM_COPY.length > 0) {
		// 			item.BM_COPY = item.BM_COPY.join();
		// 		} else {
		// 			item.BM_COPY = ""
		// 		}
		// 		if (item.NUM == 0) {
		// 			item.actions.splice(item.actions.indexOf('checkItem'), 1);
		// 		} else {
		// 			item.actions.splice(item.actions.indexOf('editItemFetch'), 1);
		// 		}
		// 	})
		// 	return resDataInfo;
		// },

		nodeClick (data, node, self) {
			console.log(data, node, self, '节点被点击时的回调')
			this.operationType = ''
		},
		//新增节点
		appendNode (node, data) {
      this.labelFormType = true
			this.operationType = 'newlyCard'
			this.labelFormTitle = '新增节点'
			if (this.$refs['editLabelForm'] !== undefined) {
				this.$nextTick(() => {
					this.$refs['editLabelForm'].resetFields();
				})
			}
		},
		//编辑节点
		editNode (node, data) {
      this.labelFormType = true
			this.operationType = 'editCard'
			this.labelFormTitle = '编辑节点'
			if (this.$refs['editLabelForm'] !== undefined) {
				this.$nextTick(() => {
					this.$refs['editLabelForm'].resetFields();
				})
			}
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
		},
    // 编辑提交
		editLabelSubmit () {
			console.log('编辑')
      this.labelSubmit()
		},
    // 新增提交
		addLabelSubmit () {
			console.log('新增')
      this.labelSubmit()
		},

		labelSubmit () {
			this.$refs['editLabelForm'].validate((valid) => {
				if (valid) {
					alert('submit!');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
}

</script>

<style scoped>
* {
	box-sizing: border-box;
}

.labelManagerBox {
	height: 100%;
	overflow: hidden;
}
.labelBox {
	border-radius: 5px;
	/* padding: 0 20px; */
}
.el-tag {
	margin: 0 10px 10px 0;
}
.tree_part {
	min-height: calc(100vh - 100px);
	background-color: #fff;
	/* padding: 20px 20px !important; */
}
.labelTip {
	color: red;
}
.componentBox {
	margin-bottom: 20px;
}
.p-h {
	height: 100%;
}

.fillBox /deep/ .el-textarea__inner {
	min-height: 200px !important;
}
.fillBox /deep/ .el-button--primary {
	background: #4f78e0;
	color: #fff;
}
</style>
