<template>
	<div style="padding: 10px 0; height: 100%; position: relative;" class="zbrw" v-if="layShow">
		<el-card shadow="always" style="margin-top: 20px;">
			<el-row :gutter="20">
				<el-col :span="22">
					<SearchCondition :conditions="conditions" @onChange="dealChangeEvent" style="margin-bottom: 10px;" />
				</el-col>
				<!--隐藏图表-->
				<el-col :span="2" v-if="false">
					<div>
						<img style="cursor: pointer;width: 56px;" @click="showRigthForm" src="../assets/image/account.png" width="80">
					</div>
				</el-col>
			</el-row>
			<!--图表-->
			<el-drawer title="分析统计" id="elDrawer" :visible.sync="rightForm" direction="rtl" size="100%">
				<ZBCBrightForm id="elDrawerForm"></ZBCBrightForm>
			</el-drawer>

			<div class="filterArea">
				<!--<el-button-->
				<!--title="批量删除"-->
				<!--class="el-icon-delete"-->
				<!--size="mini"-->
				<!--style="cursor: pointer; margin: 10px 20px 10px 0px; float: right;"-->
				<!--@click="deleteItem()"-->
				<!--&gt;批量删除</el-button>-->
				<SearchItem :searchType="searchType" @submitSearchInput="dealSearchEvent" @reset="clearItem" style="width: 800px; margin: 10px 0px; " />
			</div>
			<DataTableItem class="tableItemArea" @pageChange="dealPageChange" @selectChange="dealSelectChange" @sortTypeChange="dealSortChange" @sizeChange="dealSizeChange" @tableClick="dealTableClick" @buttonClick="dealButtonClick" :tableInfo="tableInfo" />
			<el-dialog title="审核意见" :visible.sync="currentRecord.dialogVisible" width="30%">
				<div style="text-align: center; margin-bottom: 30px;">
					<el-radio v-model="currentRecord.select" value="0" label="0">同意上报</el-radio>
					<el-radio v-model="currentRecord.select" value="1" label="1">驳回</el-radio>
				</div>
				<div>
					<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="currentRecord.input"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="currentRecord.dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="currentRecord.dialogVisible = false; claimCheckAdvice();">完 成</el-button>
				</span>
			</el-dialog>
			<el-dialog title="选择审核员" :visible.sync="centerDialogVisible" width="60%" center>
				<SelectRoleUser ref="selectCheckUser" roleType="sh"></SelectRoleUser>
				<div class=" diafoot">
					<span slot="footer" class="dialog-footer">
						<el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
						<el-button size="mini" type="primary" @click="centerDialogVisible = false; yesToshenhe()">确 定</el-button>
					</span>
				</div>

			</el-dialog>
			<!--审核意见查看-->
			<el-dialog class="shyj" title="查看审核意见" :visible.sync="shyjDialogVisible" width="40%">
				<div class="timebody">
					<el-timeline>
						<el-timeline-item v-for="(shyj, index) in  shyjList" :key="index" :timestamp="shyj.timestamp">
							{{shyj.content || ""}}
						</el-timeline-item>
					</el-timeline>
				</div>
			</el-dialog>

			<!--转交任务弹窗-->
			<el-dialog title="转交任务" :visible.sync="centerDialogVisible1" width="60%" center>
				<SelectRoleUser ref="selectTransferUser" roleType="zb"></SelectRoleUser>
				<div class=" diafoot">
					<span slot="footer" class="dialog-footer">
						<el-button size="mini" @click="centerDialogVisible1 = false">取 消</el-button>
						<el-button size="mini" type="primary" @click="centerDialogVisible1 = false; yesTozhuanjiao()">确 定</el-button>
					</span>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
// const API ="./api"
import SearchCondition from "../assistReorganizeCommon/SearchCondition";
import SearchItem from "../assistReorganizeCommon/SearchItem";
import DataTableItem from "../assistReorganizeCommon/DataTableItem";
import SelectRoleUser from "../assistReorganizeCommon/SelectRoleUser"
import ZBCBrightForm from './ZBCBrightForm'
export default {
	components: {
		SearchCondition,
		SearchItem,
		DataTableItem,
		SelectRoleUser,
		ZBCBrightForm
	},
	name: "",
	data () {
		return {
			// 转交任务弹窗
			vFalse: true,
			centerDialogVisible1: false,
			zhuanjiaoTaskId: '',
			// 审核意见弹窗
			shyjDialogVisible: false,
			// 审核意见弹窗列表
			shyjList: [{
				content: '',
				timestamp: ''
			}],
			state: true,
			centerDialogVisible: false,
			currentSubmitId: "",
			// 弹框选中的节点树
			selectNodes: [],
			currentSelectUser: "",
			currentRecord: {
				data: {},
				input: "",
				select: "",
				dialogVisible: false
			},
			activeName: "first",
			downloadUrl: "",
			searchType: {
				value: "",
				select: "title",
				options: [
					{
						label: "报文标题",
						value: "title"
					}
				]
			},
			conditions: [
				{
					name: "报文类型",
					value: [],
					checkAll: false,
					type: "checkbox",
					key: "bglx",
					items: ["态势通报", "态势专报", "专项快报", "其他"]
				},
				{
					name: "任务状态",
					value: [],
					type: "checkbox",
					checkAll: false,
					key: "status",
					dict: "dbrw_rwzt",
					items: []
				},
				{
					name: "密级",
					value: [],
					type: "checkbox",
					checkAll: false,
					key: "mj",
					items: []
				},
				{
					name: "创建时间",
					value: "*",
					type: "dateRange",
					key: "create_time",
					items: [
						{
							name: "全部",
							value: "*",
							isChecked: true,
							type: "radio"
						},
						""
					]
				}
			],
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
						prop: "title",
						label: "序号",
						type: "index",
						width: 1,
						style: "color: #999; text-align: center; "
					},
					{
						prop: "title",
						label: "报文标题",
						style:
							"text-align: left; font-weight: 700; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;cursor: pointer;",
						width: 7
					},
					{
						prop: "type",
						label: "报文类型",
						width: 3
					},
					{
						prop: "create_time",
						label: "任务创建时间",
						sort: "yes",
						sortType: "",
						style: "text-align: center; cursor: pointer;",
						width: 3
					},
					{
						prop: "mj",
						label: "密级",
						width: 2
					},
					{
						prop: "status",
						label: "任务状态",
						width: 2
					},
					{
						label: "审核意见",
						style: "text-align: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-break: break-all;",
						width: 2,
						buttons: [
							{
								type: "icon",
								class: "el-icon-tickets",
								eventName: "viewTips",
								name: "查看审核信息"
							}
						]
					},
					{
						prop: "check_user",
						label: "审核人",
						width: 1
					},

					{
						label: "操作",
						width: 3,
						buttons: [
							{
								type: "icon",
								class: "el-icon-edit-outline",
								name: "编辑",
								showCondition: {
									key: "status",
									value: ["进行中", "已驳回"]
								},
								eventName: "editItem",
								text: ""
							},
							{
								type: "dialog",
								class: "el-icon-view",
								name: "预览",
								eventName: "viewItem",
								text: ""
							},
							{
								type: "icon",
								class: "el-icon-delete",
								name: "删除",
								showCondition: {
									key: "status",
									value: ["进行中", "已驳回"]
								},
								eventName: "deleteItem",
								text: ""
							},
							{
								type: "dialog",
								class: "el-icon-document-checked",
								name: "提交审核",
								eventName: "submitCheckItem",
								showCondition: {
									key: "status",
									value: ["进行中", "已驳回"]
								},
								text: ""
							},
							{
								type: "dialog",
								class: "el-icon-connection",
								name: "转交任务",
								showCondition: {
									key: "status",
									value: ["进行中", "已驳回"]
								},
								eventName: "zhuanjiaoTask",
								text: ""
							}
						]
					}
				],
				data: []
			},
			// 右侧统计页面
			rightForm: false,
			pageSize: 10,
			layShow: false
		};
	},
	created () {
		var _self = this
		setTimeout(function () {
			_self.layShow = true
		}, 10)
	},
	mounted () {
		//20280805 bk home点击对应筛选项 筛选数据渲染冲突
		// this.updateTableData();
	},
	methods: {
		dealSearchEvent (param) {
			var ret = {};
			if (this.searchType.select) {
				ret[this.searchType.select] = this.searchType.value;
				this.dsl.search = JSON.stringify(ret);
				this.updateTableData(this.dsl);
				// delete this.dsl.search;
				// this.searchType.value = "";
			}
		},
		// searchitem组件筛选条件和关键词搜索重置
		clearItem () {
			this.searchType.value = '';
			this.dsl.search = "{}";
			this.updateTableData();
		},
		dealSizeChange (val) {
			var dsl = this.dsl || {};
			this.dsl.pageNo = 1;
			this.pageSize = val;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		submitCheckItem (param) {
			if (!!param.bw_obj) {
				this.centerDialogVisible = true
				this.currentDealTask = param;
			} else {
				this.$message({
					message: "请添加报文属性后再提交审核",
					type: 'warning'
				})
			}
		},
		// 确认提交审核
		yesToshenhe (param) {
			var user = this.$refs.selectCheckUser.info.select;
			if (!user) {
				this.$message({
					message: '请选择审核员！',
					type: 'warning'
				})
				return
			}
			var _self = this;
			var save_data = JSON.stringify({
				"check_user": user,
				"id": this.currentDealTask.id,
			})
			this.adapter.submitZbrwToShenhe(
				{
					saveOrUpdate: save_data
				},
				function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "提交审核成功",
							type: "success"
						});
						_self.updateTableData();
					}

				}
			);
		},
		dealTableClick (name, param) {
			if (name === "title") {
				if (param.status == '进行中' || param.status == '已驳回') {
					this.editItem(param)
				} else {
					this.viewItem(param)
				}
			}
		},
		viewItem (param) {
			localStorage.setItem("currentReportData", param);
			var href = `/#/viewDocument?from=cbjl`;
			if (param.id) {
				href += "&id=" + param.id;
			}
			window.open(href, '_blank')
		},

		// 审核意见提交
		claimCheckAdvice () {
			// console.log(this.currentRecord);
			var param = {
				status: this.currentRecord.select,
				msg: this.currentRecord.input
			};
			var _self = this;
			this.ajaxPOST("/sczb-URL-prefix/audit/tscp/" + this.currentRecord.data.id, {
				saveOrUpdate: JSON.stringify(param)
			}).then(r => {
				this.$message({
					message: '审核意见成功！',
					type: 'success'
				})
				_self.updateTableData();
			}).catch(e => {

			})
		},
		// 查看审核意见
		viewTips (param) {
			this.shyjList = [];
			if (param.msg && param.msg.length > 0) {
				for (let i = 0; i < param.msg.length; i++) {
					if (param.msg[i].status) {
						var item = {
							timestamp: param.msg[i].sh_time || ""
						}
						if (param.msg[i].status === "0") {
							var tUser = param.msg[i].sh_user;
							try {
								tUser = JSON.parse(param.msg[i].sh_user);
								tUser = tUser.join("-");
							}
							catch (e) {
								tUser = param.msg[i].sh_user;
							}
							item.content = `审核中(${tUser})`;
						}
						else {
							if (param.msg[i].status === "4") {
								item.content = `结果: 【同意并提交上级】,  审核人: ${param.msg[i].sh_user},  审核意见: ${param.msg[i].sh_msg || '无'}。 `
							} else if (param.msg[i].status === "5") {
								item.content = `结果: 【同意并上报到上级单位】,  审核人: ${param.msg[i].sh_user},  审核意见: ${param.msg[i].sh_msg || '无'}。 `
							} else {
								item.content = `结果: 【${dictMap.data.dbrw_rwzt[param.msg[i].status]}】,  审核人: ${param.msg[i].sh_user},  审核意见: ${param.msg[i].sh_msg || '无'}。 `
							}
						}
						this.shyjList.unshift(item);
					}

				}

				this.shyjDialogVisible = true
			}
			else {
				this.$message({
					message: "暂无审核意见",
					type: "success"
				})
			}
		},
		claimItem (param) {
			this.currentRecord.data = param;
			this.currentRecord.dialogVisible = true;
		},
		dealButtonClick (name, param, index) {
			if (typeof this[name] === "function") {
				this[name](param, index);
			}
		},
		//获取当前日期
		getDate () {
			var oDate = new Date();
			var oY = oDate.getFullYear();
			var oM = this.toZero(oDate.getMonth() + 1);
			var oD = this.toZero(oDate.getDate());
			var oYdate = oY + '-' + oM + '-' + oD;
			return oYdate;
		},
		//补零
		toZero (n) {
			if (n < 10) {
				return "0" + n;
			} else {
				return n;
			}
		},
		dealChangeEvent (d) {
			console.log(9888877777)
			var dsl = this.util.getConditionParam(d);
			/*var createTime = sessionStorage.getItem("create_times");
			var map_children = {
			  "start":this.getDate(),
			  "end":this.getDate(),
			  "format":"date"
			}
			if(createTime){
			  var createArr = createTime.split(",");
			  if(createArr[1] == 1){
				dsl.rang_search = JSON.stringify({"create_time":map_children});
			  }
			  sessionStorage.removeItem("create_times");
			}else{

			}*/

			if (dsl.rang_search) {
				var tt = JSON.parse(dsl.rang_search);
				if (tt.create_time) {
					tt.create_time.start = tt.create_time.start.split("T")[0];
					tt.create_time.end = tt.create_time.end.split("T")[0];
					tt.create_time.format = 'date';
					dsl.rang_search = JSON.stringify(tt);
				}
			}
			dsl.pageNo = 1;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
			/*dsl.rang_search = '{}';*/
			this.dsl = dsl;
		},
		updateTableData (query) {
			query = query || this.dsl || {};
			var _self = this;
			this.adapter.cbjlDataTable(query, function (d) {
				var tData = d.data;
				var checkState = dictMap.data.dbrw_rwzt;
				var typeMap = dictMap.data.bglx
				var t = tData.data.map(item => {
					var msgs = [];
					if (!!item.msg && typeof item.msg == 'object') {
						for (var i = 0; i < item.msg.length;) {
							msgs.push(item.msg[i]);
							i++
						}
					} else {
						msgs = '-'
					}
					item.from = item.data_source;
					item.type = typeMap[item.bglx];
					item.status = checkState[item.status];
					item.mj = dictMap.data.mj[item.mj] || item.mj;
					return item;
				});
				_self.tableInfo.data = t;
				_self.tableInfo.page = tData.pager;
			});
			this.dsl = query;
		},
		handleClick (tab, event) {
			if (tab.name === "second") {
				this.updateChartArea();
			}
		},
		downloadMultiItem () {
			var ids = JSON.stringify(this.tableInfo.value);
			var _self = this;
			this.adapter.downloadMultiProduct(
				{
					id_paths: ids
				},
				function (res) {
					// console.log(res.data.length);
					const fileName = "态势成品压缩包.zip";
					const content = res.data;
					_self.util.downloadItem(fileName, content);
				}
			);
		},
		downloadItem (param) {
			var _self = this;
			this.adapter.downloadProduct(
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
		dealSortChange (param) {
			var dsl = this.dsl || {};
			var tParam = {};
			tParam[param.key] = param.value;
			if (param.value) {
				dsl.order = JSON.stringify(tParam);
			}
			else {
				delete dsl.order;
			}
			this.updateTableData(dsl);

			var key = param.key;
			for (var i = 0; i < this.tableInfo.header.length; i++) {
				var item = this.tableInfo.header[i];
				if (item.prop !== key && item.sortType) {
					item.sortType = "";
				}
			}
		},
		deleteItem (param) {
			var _self = this;
			dealConfirm(function () {
				_self.deleteMultiItems(param);
			});
		},
		dealPageChange (val) {
			// console.log("page changed:" + val);
			var dsl = this.dsl;
			dsl.pageNo = val;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		deleteMultiItems (param) {
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
			this.adapter.deleteMultiProduct(
				{
					ids: JSON.stringify(ids)
				},
				function (d) {
					if (d.data.status == 0) {
						setTimeout(function () {
							_self.$message({
								message: "操作成功",
								type: "success"
							});
							_self.updateTableData();
						}, 1000);
					}
				}
			);
		},
		dealSelectChange (val) {
			var ids = JSON.stringify(this.tableInfo.value);
			this.downloadUrl = this.adapter.config.downloadMultiRecord.url;
			this.downloadUrl += "?id_paths=" + ids;
			var token = localStorage.getItem("token");
			if (token) {
				this.downloadUrl += "&token=" + token;
			}
		},

		// 转交任务begin
		zhuanjiaoTask (param) {
			this.centerDialogVisible1 = true;
			this.currentDealTask = param;
		},
		// 转交任务提交
		yesTozhuanjiao () {
			var user = this.$refs.selectTransferUser.info.select;
			if (!user) {
				this.$message({
					message: '请选择整编员！',
					type: 'warning'
				})
				return
			}
			var _self = this;
			var save_data = JSON.stringify({
				"create_by": user,
				"id": this.currentDealTask.id,
			})
			this.adapter.zbrwZhuanjiaoTask(
				{
					save_data: save_data
				},
				function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "转交任务成功",
							type: "success"
						});
						_self.updateTableData();
					}
				}
			);
		},

		// 转交任务end
		// 编辑整编任务某条任务跳编辑区
		editItem (param) {
			var _self = this;
			localStorage.setItem("currentReportData", JSON.stringify(param));
			// this.adapter.getBisengDocData({ _path: param.id }, function (d) {
			// 	var tData = d.data;
			// 	if (tData.status === 0 && tData.data) {
			// 		tData = tData.data;


			// 	}
			// })
			_self.$router.push({
				path: '/bjq',
				query: {
					id: param.id
				}
			})
		},
		//打开图表
		showRigthForm () {
			this.rightForm = true
		}
	}
};
</script>

<style scoped>
.chartContainer {
	float: left;
	position: relative;
	width: 50%;
	display: inline-block;
	height: 300px;
}
.zbrw /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
	color: #606266;
}
/*审核意见弹窗样式去*/
.shyj /deep/ .el-dialog__header {
	/*width: 80%;*/
	margin: 6px 27px;
	padding-left: 0;
	border-bottom: 1px solid #eee;
}
.shyj .timebody {
	margin: 0 15px;
}

/*提交审核弹窗页脚*/
.diafoot {
	text-align: right;
}
.filterArea {
	float: left;
	width: 100%;
	border-top: 1px dashed #ccc;
	border-bottom: 1px dashed #ccc;
	padding: 20px 0;
	margin-bottom: 20px;
}
</style>
