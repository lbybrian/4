<template>
	<div class="mainArea" v-if="layShow">
		<div class="rightArea">
			<div class="contentArea" style="background-color: #fdfdfd; float: left; position:relative;">
				<el-card shadow="always">
					<SearchCondition :conditions="conditions" @onChange="dealChangeEvent" style="padding-right: 130px;" />
					<div style="position: relative; float: left; margin-top: 10px; width: 100%; background-color: #fff;">
						<div style="position: relative; margin-bottom: 15px; float: left; width: 100%;" class="filterArea">
							<SearchGroup style="display: inline-block; width: 700px;" :options="searchOptions" @resetSearch="dealResetSearch" @submitSearch="dealSubmitSearch"></SearchGroup>
						</div>
						<DataTableItem style="position: relative; float: left; width: 100%;" :tableInfo="tableInfo" @sortTypeChange="dealSortChange" @tableClick="dealTableClick" @pageChange="dealPageChange" @sizeChange="dealSizeChange" />
					</div>
				</el-card>
			</div>
		</div>
		<div class="leftArea" style="box-shadow: 1px 0px 0px #f2f2f2;">
			<div class="contentArea" style="padding: 10px; overflow: auto;">
				<FolderList :folderInfo="folderInfo" @customClick="dealFolderClick" />
				<MultiButtons class="multiButtons" @buttonClick="dealButtonClick" :options="buttonsOption" type="icon" />
			</div>
		</div>
		<!--移动素材到文件夹弹窗-->
		<el-dialog title="移到文件夹" :visible.sync="centerDialogVisible" width="400px" center>
			<div class="folderItemArea" v-if="folderInfo.data && folderInfo.data[0] && folderInfo.data[0].children">
				<div class="folderSelectItem" v-for="(item,index) in folderInfo.data[0].children" :key="index">
					<el-radio style="width: 100%; margin-bottom: 10px;" v-model="folderSelected" :label="item._id" border>{{item.label}}</el-radio>
				</div>
			</div>
			<div class="diafoot">
				<span slot="footer" class="dialog-footer">
					<el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
					<el-button size="mini" type="primary" @click="centerDialogVisible = false; submitMoving()">确 定</el-button>
				</span>
			</div>

		</el-dialog>
		<!--新建任务弹窗-->
		<el-dialog title="新建任务" :visible.sync="dialogVisible1" width="400px" append-to-body>
			<el-row>
				<el-form :model="daibianform" ref="form" label-position="right">
					<el-form-item label="任务主题" label-width="80px" prop="label">
						<el-input v-model="daibianform.lable" auto-complete="off" autofocus placeholder="请填写任务主题"></el-input>
					</el-form-item>
					<el-form-item label="需求描述" label-width="80px" prop="xqms" style="display:none">
						<el-input type="textarea" :rows="2" v-model="daibianform.xqms" auto-complete="off" autofocus placeholder="请填写需求描述"></el-input>
					</el-form-item>
					<el-form-item label="报告类型" label-width="80px" style="display:none" prop="label">
						<el-select v-model="bglxvalue" placeholder="请选择报告类型">
							<el-option v-for="item in bglxoptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="密级" label-width="80px" prop="label" style="display:none">
						<el-select v-model="mjvalue" placeholder="请选择密级类型">
							<el-option v-for="item in mjoptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>

			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="cancel1">取 消</el-button>
				<el-button size="mini" type="primary" @click="createdaibianTask">确 定</el-button>
			</span>
		</el-dialog>

		<!--添加素材到任务弹窗-->
		<el-dialog title="添加素材" :visible.sync="dialogVisible2" width="60%" append-to-body>
			<add-sucai @addsucai="addsucai"></add-sucai>
			<span slot="footer" class="dialog-footer">
				<el-button sizi="mini" @click="cancel2">取 消</el-button>
				<el-button sizi="mini" type="primary" @click="addsucaisubmit">确 定</el-button>
			</span>
		</el-dialog>

		<!--加入待译弹窗-->
		<el-dialog title="加入待译" :visible.sync="dialogVisible3" width="60%" append-to-body>
			<el-row>
				<el-col>
					<el-form :model="fanyiform" ref="form" label-position="right">
						<el-form-item label="任务主题" label-width="80px" prop="label">
							<el-input v-model="fanyiform.lable" auto-complete="off" autofocus placeholder="请填写任务主题"></el-input>
						</el-form-item>
						<el-form-item label="完成时间" label-width="80px" prop="time">
							<el-date-picker v-model="fanyiform.time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="需求描述" label-width="80px" prop="xqms">
							<el-input type="textarea" :rows="2" v-model="fanyiform.xqms" auto-complete="off" autofocus placeholder="请填写需求描述"></el-input>
						</el-form-item>
						<el-form-item label="语种选择" label-width="80px" prop="yzxz">
							<el-select v-model="fanyiform.lanaguagesvalue" placeholder="请选择">
								<el-option v-for="item in languagesoptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="4">
					<el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
				</el-col>
				<el-col :span="20">
					<DataTableItem style="position: relative; float: left; width: 100%;" @pageChange="dealPageChange1" @sizeChange="dealSizeChange1" :tableInfo="tableInfo1" />
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button sizi="mini" @click="cancel3">取 消</el-button>
				<el-button type="primary" @click="sqfysubmit">确 定</el-button>
			</span>
		</el-dialog>
		<ConfirmDialog :options="deleteConfirm" @confirm="submitDeleteItems"></ConfirmDialog>
	</div>

</template>
<script>
import addSucai from "./addSucai";
import FolderList from "../assistReorganizeCommon/FolderList";
import SearchCondition from "../assistReorganizeCommon/SearchCondition";
import SearchGroup from "../assistReorganizeCommon/SearchGroup";
import DataTableItem from "../assistReorganizeCommon/DataTableItem";
import MultiButtons from "../assistReorganizeCommon/MultiButtons";
import ConfirmDialog from "../assistReorganizeCommon/ConfirmDialog";
const API = '/rest/v1'
export default {

	components: {
		FolderList,
		SearchCondition,
		SearchGroup,
		DataTableItem,
		MultiButtons,
		addSucai,
		ConfirmDialog
	},
	props: {},
	beforeMount () {
		var _self = this;
		this.updateCatalog(function (tData) {
			var dsl = {};
			dsl.ungrouped_type = "p_stuff";
			//2020805 工作台筛选渲染数据冲突
			// _self.updateTableData(dsl);
		});
	},
	mounted () {
		// this.updateTree();
	},
	created () {
		let bglx = dictMap.data.bglx;
		this.bglxoptions = [];
		for (var k in bglx) {
			var item = {
				label: bglx[k],
				value: k
			}
			this.bglxoptions.push(item);
		}
		let mj = dictMap.data.mj;
		this.mjoptions = [];
		for (var k in mj) {
			var item = {
				label: mj[k],
				value: k
			}
			this.mjoptions.push(item)
		}
		var _self = this
		setTimeout(function () {
			_self.layShow = true
		}, 10)
	},
	methods: {
		//添加素材事件响应函数
		addsucai (val) {
			this.sucaival = val
		},
		//重置检索按钮时间响应函数
		dealResetSearch (info, mode) {
			var dsl = this.dsl || {};
			delete dsl.q;
			delete dsl.with_or_not_search;
			delete dsl.query_type;
			dsl.pageNo = 1;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		//点击提交检索按钮响应函数
		dealSubmitSearch (info, mode) {
			var dsl = this.dsl || {};
			var param = {};
			if (mode === "simple") {
				if (info.value != '') {
					dsl.q = info.value;
					dsl.query_type = "simple";
					delete dsl.with_or_not_search;
				} else {
					delete dsl.q;
					delete dsl.with_or_not_search;
					delete dsl.query_type;
				}
			}
			else if (mode === "complex") {
				if (info.value) {
					dsl.q = info.value;
				} else {
					delete dsl.q;
				}
				if (info.input.length != 0) {
					dsl.query_type = "high";
					dsl.with_or_not_search = JSON.stringify(info.input);
				} else {
					delete dsl.with_or_not_search;
					delete dsl.query_type;
				}
			}

			dsl.pageNo = 1;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		handleSelect (item) {
			this.simpleList = false
			this.activeTab = ''
			this.params.q = this.searchInput.trim()
			this.activeTab = '1'
			this.params.exact_search = JSON.stringify({
				is_lx: this.activeTab
			})
			this.params.pageNo = 1
			this.simpleList = true
		},
		// 添加素材提交
		addsucaisubmit () {
			var sucaires = this.sucaival;
			var save_data = JSON.stringify({
				"sc_ids": this.tableInfo.value,
				"id": sucaires[0].id,
			})
			this.ajaxPOST(API + '/report/addSc', {
				save_data: save_data
			}).then(_ => {
				this.$message({
					message: '添加素材到任务成功！',
					type: 'success'
				})
			}).catch(e => {
				this.$message({
					message: '添加任务失败！' + e,
					type: 'warning'
				})
			})
			this.dialogVisible2 = false
		},

		cancel2 () {
			this.dialogVisible2 = false;
		},
		// 创建待编任务提交
		createdaibianTask () {
			var d = JSON.stringify(this.tableInfo.value);
			var _self = this;
			var save_data = JSON.stringify({
				"sc_ids": this.tableInfo.value,
				"title": this.daibianform.lable,
				"content": this.daibianform.xqms,
				"bglx": this.bglxvalue,
				"mj": this.mjvalue,
			})

			this.ajaxPOST(API + '/report/saveOrUpdate', {
				save_data: save_data
			}).then(_ => {
				this.$message({
					message: '创建整编任务成功！',
					type: 'success'
				})
				//  创建任务成功后清空所填项
				_self.daibianform.lable = ''
				_self.daibianform.xqms = ''
				_self.bglxvalue = ''
				_self.mjvalue = ''
			}).catch(e => {
				this.$message({
					message: '创建整编任务失败！缺少任务主题。',
					type: 'warning'
				})
			})
			this.dialogVisible1 = false
		},
		cancel1 () {
			this.dialogVisible1 = false;
		},
		dealSortChange (param) {
			var dsl = this.dsl || {};
      delete dsl.order
			var tParam = {};
			tParam[param.key] = param.value;
			if (param.value) {
				dsl.order = JSON.stringify(tParam);
			}
			dsl.pageNo = 1;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
			var key = param.key;
			for (var i = 0; i < this.tableInfo.header.length; i++) {
				var item = this.tableInfo.header[i];
				if (item.prop !== key && item.sortType) {
					item.sortType = "";
				}
			}
		},
		dealPageChange (val) {
			var dsl = this.dsl || {};
			dsl.pageNo = val;
			dsl.pageSize = this.pageSize;
			sessionStorage.setItem('currentpage', val)
			this.updateTableData(dsl);
		},
		dealSizeChange (val) {
			var dsl = this.dsl || {};
			this.dsl.pageNo = 1;
			this.pageSize = val;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		submitSearchInput () {
			var dsl = this.dsl;
			dsl.words_search = JSON.stringify({
				select: this.filterValue,
				gjc: this.keyInput.trim()
			})
			this.updateTableData(dsl);
		},
		// 搜索重置
		reset (dsl) {
			// this.filterValue = [];
			this.keyInput = "";
			this.updateTableData(dsl);
		},
		checkConditions (dsl, tDSL) {
			var ret = false;
			if (!tDSL) {
				return true;
			}
			for (var k in dsl) {
				if (dsl[k] === "{}" || (dsl[k] && Object.keys(dsl[k]).length === 0)) {
					delete dsl[k];
				}
			}
			for (var k in tDSL) {
				if (
					dsl[k] === "{}" ||
					(tDSL[k] && Object.keys(tDSL[k]).length === 0)
				) {
					delete tDSL[k];
				}
			}

			for (var k in dsl) {
				var v = dsl[k];
				if (typeof v === "object") {
					ret = !(JSON.stringify(v) === JSON.stringify(tDSL[k]));
				} else {
					ret = !(v === tDSL[k]);
				}
				if (ret) {
					break;
				}
			}
			return ret;
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
		dealChangeEvent (d, type, item) {
			var dsl = this.util.getConditionParam(d);
			dsl.search_type_id = this.currentGroupId;
			var temp = this.util.checkConditions(dsl, this.dsl);;
			var createTime = sessionStorage.getItem("create_times");
			var map_children = {
				"start": this.getDate(),
				"end": this.getDate(),
				"format": "date"
			}
			if (createTime) {
				var createArr = createTime.split(",");
				if (createArr[1] == 1) {
					dsl.rang_search = JSON.stringify({ "create_time": map_children });
				}
				// sessionStorage.removeItem("create_times");
			} else {
				if (dsl.rang_search && dsl.rang_search !== "{}") {
					var tt = JSON.parse(dsl.rang_search);
					if (tt.publish_time) {
						tt.publish_time.start = tt.publish_time.start.split("T")[0];
						tt.publish_time.end = tt.publish_time.end.split("T")[0];
						tt.publish_time.format = 'date';
						dsl.rang_search = JSON.stringify(tt);
					}
				}
			}
			// else {
			//   var tt = {
			//     publish_time: {
			//       start: this.util.latestDate(),
			//       end:  this.util.latestDate(),
			//       format: "date"
			//     }
			//   }
			//   dsl.rang_search = JSON.stringify(tt);
			// }
			if (temp || item.type === "dateRange" || (type === 'switch') || (type === "input")) {
				dsl.pageNo = 1;
				dsl.pageSize = this.pageSize;
				this.updateTableData(dsl);
				if (createTime) {
					sessionStorage.removeItem("create_times");
					delete dsl.rang_search;
				}
				// delete dsl.rang_search;
				this.dsl = dsl;
			}
		},
		updateCatalog (callback) {
			var _self = this;
			this.adapter.catalogData({}, function (d) {
				var tData = d.data.data;
				_self.folderInfo.data = tData;

				if (typeof (callback) === "function") {
					callback(tData);
				}
			});
		},
		updateTableData (dsl, groupId) {
			dsl = dsl || {};
			groupId = groupId || dsl.search_type_id || this.defaultGoupId;
			this.currentGroupId = groupId;
			localStorage.setItem("currentGroupId", this.currentGroupId);
			dsl.pageNo = dsl.pageNo || 1;
			dsl.pageSize = this.pageSize;
      if (!dsl.order) {
        dsl.order = JSON.stringify({
        sc_db_user_create_time:'desc',
      })
      }

			if (groupId) {
				dsl.search_type_id = groupId;
			}

			var _self = this;
			this.adapter.queryMaterialTable(dsl, function (d) {
				var tData = d.data;
				var t = tData.data.map(item => {
					item.from = item.data_source;
					return item;
				});
				_self.tableInfo.data = t;
				_self.tableInfo.page = tData.pager;
			});
			this.dsl = dsl;
		},
		isExist (name) {
			var ret = false;
			var items = this.folderInfo.data[0].children;
			for (var i = 0; i < items.length; i++) {
				if (items[i].label === name) {
					ret = true;
					break;
				}
			}
			return ret;
		},
		dealFolderClick (name, param, value) {
			if (name === "editFolderItem" || name === "addFolderItem") {
				delete param.type;
				if (this.isExist(param.label)) {
					this.$message({
						message: "文件夹名称不可同名。",
						type: "warning"
					})
					return false;
				}
				var d = {
					row: JSON.stringify(param)
				};
				var _self = this;
				this.adapter.addFolderItem(d, function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "操作成功",
							type: "success"
						});
					}
					var tData = d.data.data;
					_self.updateCatalog();
				});
			}
			else if (name === "deleteFolderItem") {
				var _self = this;
				this.adapter.deleteFolderItem({
					_path: param.id
				}, function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "操作成功",
							type: "success"
						});
					}
					var tData = d.data.data;
					_self.updateCatalog();
				});
			}
			else if (name === "switchFolderItem") {
				var id = param.id || "";
				var dsl = {};
				if (!id) {
					dsl.ungrouped_type = param.parent_id === "sys_group_001" ? "p_stuff" : "c_stuff"
				}
				else {
					dsl.search_type_id = id;
				}
				this.resetConditions();
				this.updateTableData(dsl, id);
				this.dsl = dsl;
			}
			else {

			}
		},
		resetConditions () {
			for (var i = 0; i < this.conditions.length; i++) {
				var item = this.conditions[i];
				if (item.type === "checkbox") {
					item.value = [...item.items];
					item.checkAll = true;
				}
				else {
					item.value = "";
				}
			}
		},
		dealButtonClick (name, param) {
			if (this.tableInfo.value.length === 0) {
				this.$message({
					message: "需要先选中几条记录",
					type: "warning"
				});
				return false;
			}
			var _self = this;
			if (name === "删除") {
				dealConfirm(function () {
					_self.submitDeleteItems();
				})

			} else if (name === "新建任务") {
				this.dialogVisible1 = true
			} else if (name === "申请翻译") {
				this.dialogVisible3 = true
			} else if (name === "添加素材到任务") {
				this.dialogVisible2 = true
			}
			// else if (name === "添加素材") {
			//    this.dialogVisible2 = true
			//  }
			else if (name === "移动素材到文件夹") {
				this.centerDialogVisible = true;
			}
			else { }
		},
		//提交删除请求
		submitDeleteItems () {
			let sc_ids = []
			this.tableInfo.value.forEach(data => {
				let map = {};
				map.sc_id = data
				map.group_id = this.currentGroupId;
				sc_ids.push(map)
			});
			var _self = this;
			this.adapter.deleteMultiMaterial(
				{
					sc_ids: JSON.stringify(sc_ids)
				},
				function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "操作成功",
							type: "success"
						});
					}
					var dsl = _self.dsl;
					_self.updateTableData(dsl);
				}
			);
		},
		submitMoving () {
			var _self = this;
			let sc_ids = [];
			this.tableInfo.value.forEach(item => {
				let mp = {};
				mp.sc_id = item
				mp.gp_ids = [this.currentGroupId]
				sc_ids.push(mp)
			})
			this.adapter.addForEditing(
				{
					sc_ids: JSON.stringify(sc_ids),
					fields: JSON.stringify(["sc_id", "group_id"]),
					group_ids: JSON.stringify([this.folderSelected])
				},
				function (d) {
					if (d.data.status == 0) {
						_self.$message({
							message: "操作成功",
							type: "success"
						});
					}
					_self.updateTableData();
					_self.tableInfo.value = [];
				}
			);
		},

		// 模糊匹配搜索
		// 简单搜索
		querySearchAsync (queryString, cb) {
			if (queryString.trim() === '') {
				return
			}
			let params = {
				q: queryString,
				size: 10,
			}
			this.ajaxGET(API + '/cm/search_log/search/dic_search', params).then(r => {
				if (r.length > 0) {
					cb(r)
				} else {
					cb([])
				}
			}).catch(e => {
				this.$message({
					message: '请求下拉数据失败：' + e,
					type: 'warning'
				})
			})
		},
		// 点击表格中某条数据到详情
		dealTableClick (name, param) {
			if (name === "title" || name === "abstract") {
				var path = "/dxscdetail";
				if (param.is_lx == "3") {
					path = "/fwbscdetail"
				}
				let { href } = this.$router.resolve({
					path: path,
					query: {
						id: param.id,
						from: "dbsc"
					}
				});
				window.open(href, '_blank')
			}
		},

		// 申请翻译弹窗里的方法
		// 初始化请求树组件数据
		updateTree (callback) {
			var _self = this;
			this.adapter.getDeptTree({}, function (d) {
				var tData = d.data.data;
				_self.treeData = tData;
				_self.treeData = tData.map(function (item) {
					item.label = item.name;
					if (item.children) {
						item.children = item.children.map(function (d) {
							d.label = d.name;
							return d;
						})
					}
					return item;
				});
				if (typeof (callback) === "function") {
					callback(tData);
				}
			});
		},
		// 树组件点击
		handleNodeClick (param) {
			var id = param._id;
			if (!param.children) {
				this.currentDept = id;
				this.getTableList(id);
			}
		},

		// 弹窗表格表格请求数据
		getTableList (id) {
			var _self = this;
			this.adapter.getDeptUsers({
				dept_id: id,
				// role_name:'翻译员'
				query_type: 'fy'
			}, function (d) {
				var tData = d.data.data;
				var newData = d.data;
				_self.tableInfo1.data = tData.map(function (item) {
					item.roleItems = item.roles;
					item.id = item.username;
					var roles = item.roles;
					_self.currentUserRoles = roles;
					if (roles && roles.length > 0) {
						var str = roles[0].name;
						for (let i = 1; i < roles.length; i++) {
							str += "," + roles[i].name;
						}
						item.roles = str;
					}
					else {
						item.roles = "";
					}
					return item;
				});
				_self.tableInfo1.page = newData.pager;
			})
		},
		dealPageChange1 (val) {
			var dsl = this.dsl;
			dsl.pageNo = val;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		dealSizeChange1 (val) {
			var dsl = this.dsl || {};
			this.dsl.pageNo = 1;
			this.pageSize = val;
			dsl.pageSize = this.pageSize;
			this.updateTableData(dsl);
		},
		// 取消关闭弹窗
		cancel3 () {
			this.dialogVisible3 = false
		},

		// 提交申请翻译弹窗数据
		sqfysubmit () {
			if (this.tableInfo.selectData.username == '') {
				this.$message({
					message: '请选择翻译员！',
					type: 'warning'
				})
				return
			}
			var save_data = JSON.stringify({
				"user_id": this.tableInfo.selectData[0].username,
				"sc_ids": this.tableInfo.value,
				"theme": this.fanyiform.lable,
				"end_time": this.fanyiform.time,
				"desc": this.fanyiform.xqms,
				"language": this.fanyiform.lanaguagesvalue,

			})
			var _slef = this
			this.ajaxPOST(API + '/original/sc/translate_task', {
				save_data: save_data
			}).then(_ => {
				this.$message({
					message: '创建翻译任务成功！',
					type: 'success'
				})
				_slef.updateTableData();
				//  创建翻译任务成功后清除所填信息
				_slef.fanyiform.lable = ''
				_slef.fanyiform.time = ''
				_slef.fanyiform.xqms = ''
				_slef.fanyiform.lanaguagesvalue = ''
				_slef.tableData = []
			}).catch(e => {
				this.$message({
					message: '创建翻译任务失败！' + e,
					type: 'warning'
				})
			})
			this.dialogVisible3 = false;
		}
	},
	computed: {
		sortText () {
			var i = this.sortType.current % 2;
			var d = this.sortType.data[i];
			return d.text;
		}
	},
	data () {
		var options = [{
			label: "标题",
			value: "title"
		}, {
			label: "摘要",
			value: "abstract"
		}];
		return {
			// 密级类型
			searchOptions: [{
				label: "仅标题",
				value: "title"
			}, {
				label: "标题或首段",
				value: "title,author"
			}, {
				label: "标题或摘要",
				value: "title,abstract"
			}, {
				label: "标题或正文",
				value: "title,content"
			}, {
				label: "来源或作者",
				value: "data_source,author"
			}],
			//移到文件夹选中项
			folderSelected: "",
			mjoptions: [
				{
					value: '',
					lable: ''
				}
			],
			mjvalue: '',
			// 报告类型
			bglxoptions: [
				{
					value: '',
					lable: ''
				}
			],
			// 控制简单关键字禁用
			simpleButton: false,
			// 搜索
			searchType: {
				value: '',
				select: '',
			},
			//删除对话框参数
			deleteConfirm: {
				visible: false,
				width: "400px",
				center: false,
				title: "提示",
				content: "确认删除这些参数吗？"
			},
			keyInput: '',
			bglxvalue: "",
			sucaival: [],
			dialogVisible1: false,
			dialogVisible2: false,
			dialogVisible3: false,
			defaultGoupId: "",
			dsl: {},
			zhutiInfo: {},
			defaultProps: [],
			centerDialogVisible: false,
			folderNameInput: "",
			buttonsOption: [
				{
					name: "新建任务",
					callback: function () { }
				},
				{
					name: "添加素材到任务",
					callback: function () { }
				},
				{
					name: "删除",
					callback: function () { }
				},
				{
					name: "移动素材到文件夹",
					callback: function () { }
				}
			],
			daibianform: {
				lable: '',
				time: '',
				xqms: '',
				lanaguagesvalue: ''
			},
			conditions: [
				{
					dict: "sc_lx",
					key: "is_lx",
					name: "类型",
					checkAll: true,
					value: "",
					type: "checkbox",
					items: ["动向素材", "成品报文", "非文本素材"]
				},
				{
					name: "分类",
					dict: "sc_fl",
					key: "classify",
					status: true,
					value: [],
					type: "checkbox",
					checkAll: true,
					items: ["政策", "制度", "活动"]
				},
				{
					name: "方向",
					dict: "sc_fx",
					key: "direction",
					value: [],
					type: "checkbox",
					checkAll: false,
					items: []
				},
				{
					name: "语种",
					dict: "sys_yz",
					key: "language",
					value: [],
					type: "checkbox",
					checkAll: false,
					items: []
				},
				{
					name: "采用状态",
					key: "db_sc_zt",
					dict: "db_sc_zt",
					value: [],
					type: "checkbox",
					checkAll: false,
					items: []
				},
				{
					name: "翻译状态",
					dict: "sc_dyzt",
					key: "sc_dyzt",
					value: [],
					type: "checkbox",
					checkAll: false,
					items: ["未翻译", "翻译中", "翻译完成"]
				},
				{
					key: "publish_time",
					name: "发布时间",
					value: "*",
					type: "dateRange",
					pickerOptions: {
						disabledDate (time) {
							return time.getTime() > Date.now();
						},
						shortcuts: [
							{
								text: "最近一周",
								onClick (picker) {
									const end = new Date();
									const date = new Date();
									date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
									picker.$emit("pick", [date, end]);
								}
							},
							{
								text: "最近一个月",
								onClick (picker) {
									const end = new Date();
									const date = new Date();
									date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
									picker.$emit("pick", [date, end]);
								}
							},
							{
								text: "最近三个月",
								onClick (picker) {
									const end = new Date();
									const date = new Date();
									date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
									picker.$emit("pick", [date, end]);
								}
							}
						]
					},
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
			folderInfo: {
				input: "",
				data: []
			},
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
						label: "",
						type: "checkbox",
						width: 1
					},
					{
						prop: "title",
						label: "序号",
						type: "index",
						width: 1,
						style: "text-align: center;"
					},
					{
						prop: ["title", "abstract"],
						label: "标题",
						flag: "is_read",
						style: {
							title: "text-align: left; font-weight: 700; font-size: 16px; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;",
							abstract: "text-align: left; cursor: pointer; font-size: 12px; overflow: hidden; white-space:nowrap; text-overflow:ellipsis; "
						},
						width: 8
					},
					{
						prop: "status",
						label: "处理状态",
						type: "indicator",
						items: ["db_sc_zt", "sc_dyzt"],
						map: {
							db_sc_zt: {
								1: {
									label: dictMap.data.db_sc_zt[1],
									type: "primary"
								}
							},
							sc_dyzt: {
								1: {
									label: dictMap.data.sc_dyzt[1],
									type: "success"
								},
								2: {
									label: dictMap.data.sc_dyzt[2],
									type: "success"
								}
							}
						},
						width: 2,
						style: "text-align: center;"
					},
					{
						prop: "publish_time",
						label: "发布时间",
						width: 3,
						sort: "yes",
						sortType: "desc",
						style: "text-align: center; cursor: pointer;"
					},
					{
						prop: "from",
						label: "信息来源",
						width: 2,
						style: "text-align: center;"
					},
					{
						prop: "author",
						label: "作者",
						width: 2,
						style: "text-align: center;"
					},
					{
						prop: "sc_db_user_create_by",
						label: "清分人员",
						width: 2,
						style: "text-align: center;"
					},
					{
						prop: "sc_db_user_create_time",
						width: 3,
						label: "清分时间",
						sort: "yes",
						sortType: "desc",
						style: "text-align: center; cursor: pointer;"
					}
				],
				data: [

				]
			},
			groupData: [],
			// 筛选条件
			filterValue: [],
			filterOptions: [
				{
					label: '标题',
					value: 'title'
				},
				{
					label: '摘要',
					value: 'abstract'
				},
				{
					label: '正文',
					value: 'content'
				},
				{
					label: '来源',
					value: 'data_source'
				},
				{
					label: '作者',
					value: 'author'
				},
			],
			loading: false,


			// 弹窗表单数据
			fanyiform: {
				lable: '',
				time: '',
				xqms: '',
				lanaguagesvalue: '',
			},
			// 表格语言
			languagesoptions: [
				{
					value: 'zh',
					label: '中文'
				}, {
					value: 'en',
					label: '英语'
				}, {
					value: 'jp',
					label: '日语'
				}, {
					value: 'kor',
					label: '韩语'
				}, {
					value: 'fra',
					label: '法语'
				}, {
					value: 'ru',
					label: '俄语'
				}],

			// 树组件数据
			treeData: [],
			// 弹窗表格
			// tableData: [],
			// 申请翻译弹窗相关数据参数
			tableInfo1: {
				checkAll: false,
				isIndeterminate: false,
				value: [],
				selectData: [],
        pageLayout: 'prev, pager, next, sizes,jumper',
				page: {
					total: ''
				},
				header: [
					{
						label: "选择",
						type: "radio",
						width: 1
					},
					{
						prop: "title",
						label: "序号",
						type: "index",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "username",
						label: "名称",
						style:
							"text-align: left; font-weight: 700; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;",
						width: 6
					},
					{
						prop: "roles",
						label: "当前角色",
						width: 4,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "languages",
						label: "语言方向",
						width: 6,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "taskNum",
						label: "任务数量",
						width: 2,
						style: "color: #999; text-align: center;"
					},

				],
				data: []
			},
			// 弹窗表格用户角色
			useroles: '',
			pageSize: 10,
			layShow: true
		};
	}
};
</script>

<style scoped>
* {
	box-sizing: border-box;
}
.mainArea {
	width: 100%;
	height: auto;
	float: left;
	position: relative;
	box-sizing: border-box;
}
.contentArea /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
	color: #606266;
}
.usertable /deep/ .el-checkbox__inner {
	border-radius: 50% !important;
}

.folderSelectItem {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.rightArea {
	width: 100%;
	position: relative;
	padding-left: 240px;
	height: auto;
	float: left;
}

.leftArea {
	width: 230px;
	float: left;
	height: auto;
	position: absolute;
	z-index: 2;
}

.contentArea {
	width: 100%;
	height: 100%;
}

.multiButtons {
	position: fixed;
	top: 120px;
	right: 70px;
	z-index: 999;
}

.mainArea /deep/ .el-tree > div[tabindex='-1'] {
	display: none;
}
.mainArea /deep/ .grid-content[flag='is_read-1'] p:first-child {
	color: #657180;
	font-weight: normal !important;
}

.mainArea /deep/ .grid-content[flag='is_read-0'] p:first-child {
	color: #464c5b;
	font-weight: 900 !important;
}

.diafoot {
	text-align: right;
}

.mainArea /deep/ .sqfy {
	display: none;
}

.mainArea /deep/ .grid-content[flag='is_read-1'] p:first-child {
	color: #657180;
}

.mainArea /deep/ .grid-content[flag='is_read-0'] p:first-child {
	color: #064c5b;
}

.mainArea /deep/ .formLine[dict='db_sc_zt'],
.mainArea /deep/ .formLine[dict='sc_dyzt'] {
	float: left;
	/* display: inline-block; */
	width: 50% !important;
	position: relative;
}
</style>
