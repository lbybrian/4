<template>
	<div style="padding: 10px;" v-if="layShow">
		<el-card shadow="always" style="margin-top: 20px;">
			<el-row>
				<el-col :span="20">
					<div class="topArea">
						<SearchCondition :conditions="conditions" @onChange="dealChangeEvent" />
					</div>
				</el-col>
				<el-col :span="4">
					<!--class="filterArea"-->
					<div style="padding: 5px 0;">
						<el-button size="small" type="primary" title="添加模板" @click="addModuleItem">添加模板</el-button>
						<el-button title="批量删除" slot="reference" size="small" type="danger" @click="deleteItem()">批量删除</el-button>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<DataTableItem @pageChange="dealPageChange" @sizeChange="dealSizeChange" @selectChange="dealSelectChange" @tableClick="dealTableClick" @buttonClick="dealButtonClick" :tableInfo="tableInfo" />
				</el-col>
			</el-row>
		</el-card>

		<el-dialog :title="currentRecord.dialogTitle" :visible.sync="currentRecord.dialogVisible" width="450px">
			<div class="newModuleArea" style="text-align: left; margin-bottom: 10px;">
				<FormItemArray ref="myFormCondition" :formData="moduleConfig"></FormItemArray>
			</div>
			<div>
				<span v-if="currentRecord.dialogTitle==='新建模板'" style="color: red; margin-right: 5px;">*</span>
				<el-upload action="test" style="display: inline-block;" :on-change="handleSelectFileChange" :file-list="moduleData.value" :limit="moduleData.limit || 1" accept=".docx, .doc" @on-exceed="dealExceed(item)" :auto-upload="false">
					<el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
				</el-upload>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="currentRecord.dialogVisible = false">取 消</el-button>
				<el-button type="primary" size="mini" @click="submitModuleItem();">完 成</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import DataItemList from "../assistReorganizeCommon/DataItemList";
import DataTableItem from "../assistReorganizeCommon/DataTableItem";
import SearchCondition from "../assistReorganizeCommon/SearchCondition";
import FormItemArray from "../assistReorganizeCommon/FormItemArray";
import DocumentEditor from "../assistReorganizeCommon/DocumentEditor";

export default {
	components: {
		DataItemList,
		DataTableItem,
		SearchCondition,
		DocumentEditor,
		FormItemArray
	},
	created () {
		var _self = this
		// setTimeout(function(){
		//     _self.layShow = true
		//   },10)
	},
	mounted () {
		this.updateTableData({});
		this.util.updateOptionItems(this.moduleConfig.group);
	},
	methods: {
		handleSelectFileChange (a, b, c) {
			this.moduleData.file = a;
		},
		dealExceed () {
			this.moduleData.value.length = this.moduleData.limit || 1;
		},
		addModuleItem () {
			//Todo: 打开新增模板对话框
			this.currentRecord.dialogTitle = "新建模板"
			this.currentRecord.id = "";
			this.currentRecord.dialogVisible = true;
			this.currentRecord.content = "";
			this.moduleConfig.model.name = "";
			this.moduleConfig.model.mblx = "";
			this.moduleData.file = null;
			this.moduleData.value = [];
		},
		deleteItem (param) {
			var _self = this;
			dealConfirm(function () {
				_self.deleteMultiItem(param);
			});
		},
		submitModuleItem () {
			var _self = this;
			var form = this.$refs.myFormCondition.getFormItem();
			form.validate((valid) => {
				if (valid) {
					if (this.moduleData.file) {
						_self._submitModuleItem();
						this.currentRecord.dialogVisible = false;
					}
					else {
						_self.$message({
							message: "需选择一个模板文件。",
							type: "warning"
						});
					}

				} else {
					// return false;
				}
			});
		},
		_submitModuleItem () {
			//Todo: 提交模板数据
			var id = this.currentRecord.id;
			var name = this.moduleConfig.model.name;
			var type = this.moduleConfig.model.mblx;
			type = dictMap.map.mblx[type];
			var formData = new FormData();
			if (this.moduleData.file) {
				formData.append("file", this.moduleData.file.raw);
			}

			var param = {
				_id: id,
				name: name,
				mblx: type
			};
			formData.append("saveOrUpdate", JSON.stringify(param));
			var url = "/rest/v1/cm/mbgl_info/upload";
			var _self = this;
			this.$axios({
				url: url,
				method: 'post',
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' }
			}).then(response => {
				if (response.data && response.data.status === 0) {
					_self.updateTableData();
					_self.$message({
						message: "成功！",
						type: "success"
					});
				}
				else {
					_self.$message({
						message: "失败: " + response.data.msg,
						type: "warning"
					});
				}

			}).catch(error => {

			})
		},
		dealChangeEvent (d) {
			var param = this.conditions[0];
			var key = param.key;
			var t = {};
			t[key] = param.value.map(function (item) {
				return dictMap.map.mblx[item];
			})
			if (t[key].length === 0) {
				this.updateTableData();
			}
			else {
				this.updateTableData({
					in_search: JSON.stringify(t)
				});
			}
		},
		deleteMultiItem (param) {
			var ids = this.tableInfo.value;
			if (!param && ids.length === 0) {
				this.$message({
					message: "需要先选中几条记录",
					type: "warning"
				});
				return false;
			}
			else if (param) {
				ids = [param.id]
			}
			else { }

			var _self = this;
			this.adapter.deleteMultiMould(
				{
					query: JSON.stringify({ _id: { $in: ids } })
				},
				function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "操作成功",
							type: "success"
						});
						_self.updateTableData();
					}
				}
			);
		},
		downloadMultiItem () {
			if (this.tableInfo.value.length === 0) {
				this.$message({
					message: "需要先选中几条记录",
					type: "warning"
				});
				return false;
			}
			var ids = JSON.stringify(this.tableInfo.value);
			var _self = this;
			this.adapter.downloadMultiMould(
				{
					id_paths: ids
				},
				function (res) {
					const fileName = "模板压缩包.zip";
					const content = res.data;
					_self.util.downloadItem(fileName, content);
				}
			);
		},
		editItem (param) {
			//Todo: 打开编辑模板对话框
			this.currentRecord.dialogTitle = "编辑模板"
			this.currentRecord.dialogVisible = true;
			this.currentRecord.id = param.id;
			this.moduleConfig.model.name = param.name;
			this.moduleConfig.model.mblx = param.type;
			this.moduleData.file = null;
			this.moduleData.value = [];
		},
		dealTableClick (name, param) {
			// console.log(param);
			if (name === "name") {
				this.viewItem(param);
			}
		},
		viewItem (param) {
			var href = `/#/viewDocument?from=mbgl`;
			if (param.id) {
				href += "&id=" + param.id;
			}
			window.open(href, 'SGMIWin')
		},
		downloadItem (param) {
			this.adapter.downloadMould(
				{
					id_path: param.id
				},
				function (res) {
					const fileName = param.title + ".docx";
					const content = res.data;
					_self.util.downloadItem(fileName, content);
				}
			);
		},
		dealButtonClick (name, param) {
			if (name && typeof (this[name]) === "function") {
				this[name](param);
			}
		},
		dealSizeChange (val) {
			var dsl = this.dsl || {};
			dsl.pageNo = 1;
			dsl.pageSize = val;
			this.updateTableData(dsl);
		},
		updateTableData (dsl) {
			var _self = this;
			dsl = dsl || this.dsl || {}
			this.adapter.mouldDataTable(dsl, function (d) {
				var tData = d.data;
				var tMap = dictMap.data.mblx;
				var t = tData.data.map(item => {
					var type = tMap[item.mblx];
					return {
						id: item._id,
						name: item.name,
						time: item.create_time,
						author: item.create_by,
						file_path: item.file_path,
						type: type
					};
				});
				_self.tableInfo.data = t;
				_self.tableInfo.page = tData.pager;
			});
			this.dsl = dsl;
		},
		dealPageChange (val) {
			var dsl = this.dsl || {};
			dsl.pageNo = val;
			this.updateTableData(dsl);
		},
		dealSelectChange (val) {
			var ids = JSON.stringify(this.tableInfo.value);
			this.downloadUrl = this.adapter.config.downloadMultiRecord.url;
			this.downloadUrl += "?id_paths=" + ids;
			var token = localStorage.getItem("token");
			if (token) {
				this.downloadUrl += "&token=" + token;
			}
		}
	},
	data: function () {
		return {
			deletePopover: {
				visible: false
			},
			state: true,
			moduleConfig: {
				group: [
					{
						name: "模板名称",
						value: "",
						type: "text",
						prop: "name",
						items: [{
							placeholder: "请输入模板名称"
						}]
					}, {
						name: "模板类型",
						value: 1,
						type: "radio",
						key: "mblx",
						prop: "mblx",
						items: []
					}],
				model: {
					name: "--",
					mblx: "0"
				},
				rules: {
					name: [{
						required: true, message: '请输入模板名称', trigger: 'blur'
					}, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
					mblx: [{
						required: true, message: '请选择模板类型', trigger: 'blur'
					}]
				},
			},
			moduleData: {
				file: "",
				action: "",
				value: []
			},
			currentRecord: {
				dialogTitle: "",
				data: {},
				content: "",
				name: "",
				dialogVisible: false
			},
			conditions: [
				{
					name: "模板类型",
					value: [],
					key: "mblx",
					type: "checkbox",
					dataMap: {},
					items: [""]
				}
			],
			downloadUrl: "",
			tableInfo: {
				checkAll: false,
				isIndeterminate: false,
				value: [],
				page: {
					total: 0
				},
         pageLayout: 'prev, pager, next, sizes,jumper',
				header: [
					{
						label: "*",
						type: "checkbox",
						width: 1
					},
					{
						prop: "name",
						label: "序号",
						type: "index",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "name",
						label: "模板名称",
						style: "text-align: left; font-weight: 700; cursor: pointer;",
						width: 8
					},
					{
						prop: "type",
						label: "模板类型",
						style: "text-align: left; font-weight: 700; text-align: center;",
						width: 4
					},
					{
						prop: "time",
						label: "创建时间",
						width: 3
					},
					{
						prop: "author",
						label: "创建人",
						width: 2
					},
					{
						label: "操作",
						width: 2,
						buttons: [
							{
								type: "icon",
								class: "el-icon-edit-outline",
								name: "编辑",
								eventName: "editItem",
								text: ""
							},
							{
								type: "icon",
								class: "el-icon-delete",
								name: "删除",
								eventName: "deleteItem",
								text: ""
							},
							{
								type: "icon",
								class: "el-icon-view",
								name: "查看",
								eventName: "viewItem",
								text: ""
							}
						]
					}
				],
				data: [

				]
			},
			layShow: true
		};
	}
};
</script>

<style scoped>
.topArea {
	width: 100%;
	position: relative;
	float: left;
	width: 100%;
	margin-bottom: 20px;
}
.el-form-item__content {
	text-align: left !important;
}

.newModuleArea /deep/ .el-form-item {
	padding-bottom: 15px;
}

.topArea /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
	color: #606266;
}
.searchItem {
	width: 200px;
	float: right;
}

.tableItem {
	margin-top: 40px;
}
</style>
