<template>
	<div class="reportEditorArea" style="height: 100%; position: relative;">
		<el-button @click="switchFullscreen" style="position: absolute; left: 150px; top: 3px;" type="primary" size="mini">{{fullScreenButtonText}}</el-button>
		<el-page-header @back="goBack" title="返回整编任务" size="mini" style="padding: 5px;">
		</el-page-header>
		<div style="width: 100%; height: calc( 100% - 34px );">
			<div style="width: 250px; height: 100%; display: inline-block;float:left">
				<el-card class="box-card" shadow="never" style="height: 100%;">
					<div slot="header" class="clearfix">
						<p class="titleArea">素材列表</p>
					</div>
					<div class="text item">
						<div class="opMaterialArea">
							<el-button size="mini" @click="openRuleDialog" type="text" icon="el-icon-setting"></el-button>
							<el-button size="mini" @click="produceAbstract" type="primary">生成摘要</el-button>
							<el-button size="mini" @click="extractKeywords" type="primary">要素抽取</el-button>
						</div>
						<MaterialListOp style="padding-left: 10px;" :materialList="materialList" @dealMaterialEvent="dealMaterial" />
					</div>
				</el-card>
			</div>

			<div class="wid" v-if="currentLayout === 0">
				<el-card class="box-card" shadow="never" style="height: calc( 100% - 5px );">
					<div slot="header" class="clearfix center" id="parentDiv">
						<p style="float: left; position: relative;" class="titleArea">
							<span style="float: left;">素材预览</span>
							<el-button style="float: right;" size="mini" class="layoutSwtichBtn" type="text" @click="switchLayout(2)">收起<i class="el-icon-d-arrow-left el-icon--right"></i></el-button>
						</p>
					</div>
					<div class="searchOpArea">
						<el-input size="mini" placeholder="请输入关键词" v-model="searchOptions.input" style="width: 200px; margin-right: 10px;"></el-input>
						<el-button size="mini" @click="searchMaterial" type="primary">检索素材</el-button>
						<el-button size="mini" @click="searchReport" type="primary">检索成品</el-button>
						<el-button style="float: right; margin-right: 10px;" size="mini" @click="returnViewMaterial" type="primary">返回</el-button>
					</div>
					<div id="dxscTimeLine">
						<time-line v-if="!!materialParam.content && !materialParam.file_type" class="center" v-show="currentLayout === 0"></time-line>
					</div>
					<div v-if="currentViewer==='ArticleViewer'" style="margin:10px 0;position:relative; float: left; width: 100%; padding-right: 10px;">
						<el-link @click="swtichRecommond" :class="isactive" style="margin:10px auto;paddig-left:10px">相关推荐信息>></el-link>
						<SucaiRecommend v-if="isRecommond" :options="materialParam" @articleClick="dealMaterial"></SucaiRecommend>
					</div>
					<div class="materialViewerArea">
						<MediaItemViewer v-if="currentViewer==='MediaItemViewer'" :options="materialParam" style="position:relative; float: left; width: 100%; padding-right: 10px;">
						</MediaItemViewer>
						<ArticleViewer ref="articleItem" v-else-if="currentViewer==='ArticleViewer'" :options="materialParam" style="position:relative; float: left; width: 100%; padding-right: 10px;"></ArticleViewer>
						<DocumentViewer v-else-if="currentViewer==='DocumentViewer'" ref="documentViewItem" :options="materialParam"></DocumentViewer>
						<div style="margin-top: 20px;" v-else>当前未预览任何一个素材，可点击左侧素材进行预览。</div>
					</div>
				</el-card>
			</div>
			<div class="wid" v-if="currentLayout === 1">
				<el-card class="box-card" shadow="never" style="height: calc( 100% - 5px );" :body-style="{height: 'calc( 100% - 35px )', position: 'relative', float: 'left', width: '100%'}">
					<div slot="header" class="clearfix">
						<p style="float: left; position: relative;" class="titleArea">
							<span style="float: left;">报文编辑</span>
							<el-button style="float: right;" size="mini" class="layoutSwtichBtn" type="text" @click="switchLayout(2)">收起<i class="el-icon-d-arrow-left el-icon--right"></i></el-button>
						</p>
					</div>
					<DocumentEditor style="height: calc( 100% - 48px );"></DocumentEditor>
				</el-card>
			</div>
			<div class="wid" ref="mainArea" v-if="currentLayout === 2">
				<!--中间功能区-->
				<div ref="leftArea" style="width: 650px; height: 100%; display: inline-block; float: left; ">
					<el-card class="box-card" shadow="never">
						<div slot="header" class="clearfix center">
							<p class="titleArea">
								<span style="float: left; display: inline-block;">素材预览</span>
								<el-button class="layoutSwtichBtn" title="展开" size="mini" type="text" @click="switchLayout(0)"><i class="el-icon-d-arrow-right el-icon--left"></i></el-button>
							</p>
						</div>
						<div class="searchOpArea">
							<el-input size="mini" placeholder="请输入关键词" v-model="searchOptions.input" style="width: 200px; margin-right: 10px;"></el-input>
							<el-button size="mini" @click="searchMaterial" type="primary">检索素材</el-button>
							<el-button size="mini" @click="searchReport" type="primary">检索成品</el-button>
							<el-button style="float: right; margin-right: 10px;" size="mini" @click="returnViewMaterial" type="primary">返回</el-button>
						</div>
						<div id="dxscTimeLine">
							<time-line v-if="!!materialParam.content && !materialParam.file_type" :scids="materialParam.id" class="center" v-show="currentLayout === 2"></time-line>
						</div>
						<div v-if="currentViewer==='ArticleViewer'" style="margin:10px 0;position:relative; float: left; width: 100%; padding-right: 10px;">
							<el-link @click="swtichRecommond" :class="isactive" style="margin:10px auto;paddig-left:10px">相关推荐信息>></el-link>
							<SucaiRecommend ref="recommendItem" v-if="isRecommond" :options="materialParam" @articleClick="dealMaterial"></SucaiRecommend>
						</div>
						<div class="materialViewerArea">
							<MediaItemViewer @abstractChange="dealAbstractChange" v-if="currentViewer==='MediaItemViewer'" :options="materialParam" style="position:relative; float: left; width: 100%; padding-right: 10px;">
							</MediaItemViewer>
							<ArticleViewer @abstractChange="dealAbstractChange" ref="articleItem" v-else-if="currentViewer==='ArticleViewer'" :options="materialParam" :abstractParam="abstractParam" style="position:relative; float: left; width: 100%; padding-right: 10px;"></ArticleViewer>
							<DocumentViewer @abstractChange="dealAbstractChange" v-else-if="currentViewer==='DocumentViewer'" ref="documentViewItem" :options="materialParam"></DocumentViewer>
							<div style="margin-top: 20px;" v-else class="testItem">当前未预览任何一个素材，可点击左侧素材进行预览。</div>
						</div>
					</el-card>
				</div>
				<!--可拖拽分割线-->
				<div @mousedown="downChangeWidth" @mouseup="upChangeWidth" @mousemove="moveChangeWidth" ref="resize" style="float: left;height: 100%;padding: 0 20px 0 19px;cursor: col-resize;">
					<div style="height: 100%;border-right: 1px solid #ddd;"></div>
				</div>
				<!--编辑器-->
				<div ref="rightArea" style="width: calc( 100% - 691px ); height: 100%; display: inline-block; float: right;">
					<el-card class="box-card" shadow="never" style="height: 100%;">
						<div slot="header" class="clearfix">
							<p style="float: left; position: relative;" class="titleArea">
								<span style="float: left; display: inline-block;">报文编辑</span>
								<el-button title="展开" size="mini" type="text" class="layoutSwtichBtn" @click="switchLayout(1)"><i class="el-icon-d-arrow-right el-icon--left"></i></el-button>
							</p>
						</div>
						<DocumentEditor style="height: calc( 100% - 48px );"></DocumentEditor>
					</el-card>
				</div>
			</div>
			<el-dialog class="tableInfoDialog" title="报文列表" :visible.sync="reportTable.visible" width="60%" height="800px" center>
				<DataTableItem @sortTypeChange="dealSortChange" @tableClick="dealTableClick" @pageChange="dealPageChange" @sizeChange="dealSizeChange" :tableInfo="reportTable">
				</DataTableItem>
			</el-dialog>
			<el-dialog class="tableInfoDialog" title="素材列表" :visible.sync="materialTable.visible" width="60%" height="800px" center>
				<DataTableItem @sortTypeChange="dealSortChange" @tableClick="dealTableClick" @pageChange="dealPageChange" @sizeChange="dealSizeChange" :tableInfo="materialTable">
				</DataTableItem>
			</el-dialog>
			<el-dialog class="configDialog" :title="ruleDialog.title" :visible.sync="ruleDialog.visible" :width="ruleDialog.width || '400px'" :height="ruleDialog.width || '300px'" center>
				<p class="configContentArea">
					<!--<el-radio-group class="radioGroup" v-model="ruleDialog.type">-->
					<el-radio class="radioItem" v-model="ruleDialog.type" label="word" style="margin-top: 10px;">
						字数
						<el-select style="width: 120px;" v-model="ruleDialog.word.value" size="mini" placeholder="请选择">
							<el-option v-for="item in ruleDialog.word.items" :key="item.value || item" :label="item.label  || item" :value="item.value || item"></el-option>
						</el-select>
					</el-radio>
					<el-radio class="radioItem" v-model="ruleDialog.type" label="sentence" style="margin: 10px 0px;">
						句数
						<el-input-number style="width: 120px;" v-model="ruleDialog.sentence.value" :min="1" :max="10" label="描述文字" size="mini"></el-input-number>
					</el-radio>
					<el-radio class="radioItem" v-model="ruleDialog.type" label="scale">
						比例
						<el-select style="width: 120px;" size="mini" v-model="ruleDialog.scale.value" placeholder="请选择">
							<el-option v-for="item in ruleDialog.scale.items" :key="item.value || item" :label="item.label || item" :value="item.value || item"></el-option>
						</el-select>
					</el-radio>
					<!--</el-radio-group>-->
				</p>
				<span slot="footer" class="dialog-footer">
					<el-button size="mini" @click="ruleDialog.visible = false">取 消</el-button>
					<el-button type="primary" size="mini" @click="ruleDialog.visible = false; submitConfigData();">提交</el-button>
				</span>

			</el-dialog>
		</div>
	</div>
</template>

<script>
import SucaiRecommend from "../assistReorganizeCommon/SucaiRecommend"
import "../assets/css/reportEditorArea.css"
import TimeLine from "./TimeLine"
import MaterialListOp from "../assistReorganizeCommon/MaterialListOp";
import ArticleViewer from "../assistReorganizeCommon/ArticleViewer";
import MediaItemViewer from "../assistReorganizeCommon/MediaItemViewer";
import DocumentEditor from "../assistReorganizeCommon/DocumentEditor";
import DataTableItem from "../assistReorganizeCommon/DataTableItem";
import DocumentViewer from "../assistReorganizeCommon/DocMaterialViewer";

export default {
	components: {
		MaterialListOp,
		DocumentEditor,
		TimeLine,
		MediaItemViewer,
		ArticleViewer,
		DataTableItem,
		DocumentViewer,
		SucaiRecommend
	},
	computed: {

	},
	data: function () {
		return {
			abstractParam: {
			},
			activeName: "yw",
			isRecommond: false,
			isactive: false,
			abstractRule: {},
			currentMaterial: {
				id: "",
				title: "",
				duration: "",
				file_type: "",
				abstract: "",
				translate_abstract: "",
				translate_content: "",
				translate_title: "",
				sys_translate: "",
				author: "",
				content: "",
				create_by: "",
				create_time: "",
				data_source: "",
				update_by: "",
				update_time: "",
				direction: "",
				language: "",
				publish_time: "",
				src: "",
				source_url: "",
				file_path: ""
			},
			materialParam: {
				id: "",
				title: "",
				duration: "",
				file_type: "",
				abstract: "",
				translate_abstract: "",
				translate_content: "",
				translate_title: "",
				sys_translate: "",
				author: "",
				content: "",
				create_by: "",
				create_time: "",
				data_source: "",
				update_by: "",
				update_time: "",
				direction: "",
				language: "",
				publish_time: "",
				table_info: "",
				src: "",
				source_url: "",
				file_path: ""
			},
			fullScreenButtonText: "全屏",
			currentViewer: "",
			currentLayout: 2,
			ruleDialog: {
				visible: false,
				title: "摘要生成规则",
				width: "400px",
				height: "300px",
				array: ["word", "sentence", "scale"],
				map: ["字数", "句数", "百分比"],
				type: "word",
				word: {
					value: "100",
					items: ["100", "200", "300"]
				},
				sentence: {
					value: "5"
				},
				scale: {
					value: "10%",
					items: ["10%", "20%", "30%"]
				}
			},
			uploadParam: {
				bw_id: ""
			},
			dataFilter: {
				is_lx (v, d) {
					var t = dictMap.data.sc_lx[v];
					t = d.file_type || t;
					return t;
				},
				bglx (v, d) {
					var t = dictMap.data.bglx[v];
					return t;
				}
			},
			searchOptions: {
				input: ""
			},
			// 素材区
			materialList: {
				isIndeterminate: false,
				value: [],
				data: {
					text: [],
					image: [],
					video: [],
					audio: []
				}
			},
			reportTable: {
				checkAll: false,
				visible: false,
				isIndeterminate: false,
				value: [],
				selectData: '',
				pageLayout: "total, prev, pager, next, jumper",
				page: {
					total: '',
					pageSize: 10,
					pageNo: 1
				},
				header: [
					{
						prop: "-",
						label: "序号",
						type: "index",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "title",
						label: "报文标题",
						style:
							"text-align: left; font-weight: 700; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;;",
						width: 8
					},
					{
						prop: "bglx",
						label: "报文类型",
						width: 4,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "dept_name",
						label: "出报部门",
						width: 4,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "create_by",
						label: "出报人",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "create_time",
						label: "出报时间",
						width: 4,
						sort: "yes",
						sortType: "",
						style: "color: #999; text-align: center;"
					},
					// {
					//   prop: "words",
					//   label: "字数/大小",
					//   width: 2,
					//   style: "color: #999; text-align: center;"
					// }

				],
				data: []
			},
			materialTable: {
				visible: false,
				checkAll: false,
				isIndeterminate: false,
				value: [],
				selectData: '',
				pageLayout: "total, prev, pager, next, jumper",
				page: {
					total: '',
					pageSize: 10,
					pageNo: 1
				},
				header: [
					{
						prop: "-",
						label: "序号",
						type: "index",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "title",
						label: "素材标题",
						style:
							"text-align: left; font-weight: 700; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;;",
						width: 8
					},
					{
						prop: "is_lx",
						label: "素材类型",
						width: 4,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "data_source",
						label: "信息来源",
						width: 4,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "author",
						label: "作者",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "publish_time",
						label: "发布时间",
						sort: "yes",
						sortType: "",
						width: 4,
						style: "color: #999; text-align: center;"
					},
					// {
					//   prop: "words",
					//   label: "字数/大小",
					//   width: 2,
					//   style: "color: #999; text-align: center;"
					// }

				],
				data: []
			},
			matterialData: [],
			//拖拽分割线改变原文译文框宽度
			startX: 0,
			resizeLeft: 0,
			endX: 0,
			canDrag: false,
			rvals: "",
			rtype: ""
		};
	},
	beforeMount () {
		var arr = localStorage.getItem("currentReportData");
		arr = JSON.parse(arr);
		this.matterialData = arr;
		this.uploadParam.bw_id = WebTool.urlQuery(location.href, "id");
		this.updateTableData(this.uploadParam.bw_id);
		this.getAbstractRule();
	},
	mounted () {
		var _self = this;
		document.onfullscreenchange = function () {
			if (document.fullscreenElement) {
				_self.fullScreenButtonText = "退出全屏";
			}
			else {
				_self.fullScreenButtonText = "全屏";
			}
		}
		window.addEventListener("message", e => {
			let data = e.data;
			let command = data.command;
			if (command && command === "actionEvents") {
				let content = data.content;
				if (!content || !content.action) { return };
				switch (content.action) {
					case "editorReady":
						break;
					case "userStates":
						break;
					case "fileRename":
						break;
					case "saveVersion":
						break;
					case "versionChange":
						break;
					default:
						break;
				}
			}
		});
	},
	methods: {
		//打开摘要生成规则对话框
		openRuleDialog () {
			this.ruleDialog.visible = true;
		},
		//提交摘要生成规则
		submitConfigData () {
			var arr = this.ruleDialog.array;
			var type = arr.indexOf(this.ruleDialog.type);
			this.rtype = type;
			this.rvals = this.ruleDialog[arr[type]].value;
			var _self = this;
			this.adapter.saveAbstractRule({
				saveOrUpdate: JSON.stringify({
					type: type,
					value: this.ruleDialog[arr[type]].value,
					id: this.abstractRule._id || ""
				})
			}, function (d) {
				if (d.data && d.data.status === 0) {
					_self.$message({
						message: "保存规则成功。",
						type: "success"
					})
					_self.abstractRule.type = type;
					_self.abstractRule.value = _self.ruleDialog[arr[type]].value;
				}
			});
		},
		swtichRecommond () {
			this.isRecommond = !this.isRecommond;
			this.isactive = !this.isactive
		},
		dealAbstractChange (param) {
			this.updateTableData(this.uploadParam.bw_id);
		},
		extractKeywords () {
			var ids = this.materialList.value;
			if (ids.length === 0) {
				this.$message({
					message: "需要选中几个文本素材。",
					type: 'warning'
				})
			}
			else {
				var _self = this;
				this.adapter.extractKeywords({ ids: JSON.stringify(ids) }, function (d) {
					var tData = d.data;
					if (tData.status === 0 && tData.data.length) {
						var str = "";
						var count = 1;
						tData.data.map(item => {
							// str += item.entity.trim();
							var tArr = item.entity.map(t => {
								return t.name;
							});
							str += count + ". " + tArr.join(",") + "\n";
							count++;
						});
						_self.util.copyText(str);
						_self.$message({
							message: "要素已生成，并拷贝到剪贴板中。",
							type: 'success'
						})
					}
				})
			}
		},
		//获取生成摘要的规则
		getAbstractRule () {
			var _self = this;
			this.adapter.getAbstractRule({}, function (d) {
				if (d.data && d.data.status === 0) {
					_self.abstractRule = d.data.data[0] || {};
					_self.setAbstractRule(_self.abstractRule);
					var keyMap = {
						word: "numsents",
						scale: "percent",
						sentence: "abstract_size"
					}
					_self.abstractParam = {};
					var arr = _self.ruleDialog.array;
					var rule = _self.abstractRule;
					if (rule.type !== undefined && rule.value) {
						var type = arr[rule.type];
						var key = keyMap[type];
						_self.abstractParam[key] = _self.ruleDialog[type].value;
					}
				}
			});
		},
		setAbstractRule (rule) {
			var arr = this.ruleDialog.array;
			var type = arr[rule.type];
			this.ruleDialog[type].value = rule.value;
			this.ruleDialog.type = type;
		},
		produceAbstract () {
			var ids = this.materialList.value;
			if (ids.length === 0) {
				this.$message({
					message: "需要选中几个文本素材。",
					type: 'warning'
				})
			}
			else {
				var _self = this;
				/*var param = this.abstractParam;*/
				var param = {};
				param.ids = JSON.stringify(ids);
				if (this.rtype == "0") { //字数
					param.abstract_size = this.rvals; //字数
				} else if (this.rtype == "1") { //句数
					param.numsents = this.rvals; //句数
				} else { //比例
					param.percent = this.rvals; //比例
				}
				this.adapter.produceAbstract(param, function (d) {
					var tData = d.data;
					if (tData.status === 0 && tData.data.length) {
						var str = "";
						var count = 1;
						tData.data.map(item => {
							item.abstract = !!item.abstract ? item.abstract.trim() : '';
							str += count + ". " + item.abstract + "\t\r\n";
							count++;
						});
						_self.util.copyText(str);
						_self.$message({
							message: "摘要已生成，并拷贝到剪贴板中。",
							type: 'success'
						})
					}
				})
			}
		},
		switchLayout (n) {
			this.currentLayout = n;
		},
		searchMaterial () {
			this.searchOptions.adapter = "dxscList";
			this.searchOptions.table = "materialTable";
			this.updateTableInfo();
		},
		searchReport () {
			this.searchOptions.adapter = "cpbwDataTable";
			this.searchOptions.table = "reportTable";
			this.updateTableInfo();
		},
		updateTableInfo (pageNo, pageSize, order) {
			var param = {
				query_type: "simple",
				q: this.searchOptions.input
			};
			if (!param.q) {
				this.$message({
					message: "需输入要检索的关键词",
					type: "warning"
				});
				return false;
			}
			var name = this.searchOptions.adapter;
			var tName = this.searchOptions.table;
			param.pageNo = pageNo || this[tName].page.pageNo || 1;
			param.pageSize = pageSize || this[tName].page.limit || 10;
			if (order) {
				param.order = JSON.stringify(order);
			}
			else {
				delete param.order;
			}
			this._updateTableInfo(param, name, tName);
		},
		_updateTableInfo (param, name, tName) {
			var _self = this;
			name = name || "dxscList";
			tName = tName || "reportTable";
			this.adapter[name](param, function (d) {
				var tData = d.data;
				var t = tData.data;
				_self[tName].data = t.map(item => {
					for (var k in item) {
						if (typeof (_self.dataFilter[k]) === "function") {
							item[k] = _self.dataFilter[k](item[k], item);
						}
					}
					return item;
				});
				_self[tName].page = tData.pager;
				_self[tName].visible = true;
			});
		},
		returnViewMaterial () {
			this.updateMaterialInfo(this.currentMaterial);
		},
		updateRecommendList (id) {
			var recommendItem = this.$refs.recommendItem;
			if (recommendItem) {
				recommendItem.getList(id);
			}
		},
		dealTableClick (name, param) {
			if (name === "title") {
				var tName = this.searchOptions.table;
				if (tName === "reportTable") {
					param.file_type = param.file_type || "docx";
					param.table_info = "tscp_info";
				}
				else {
					param.table_info = "sc_info";
				}
				this[tName].visible = false;
				this.updateMaterialInfo(param);
			}
		},
		dealSortChange (param) {
			var tParam = {};
			tParam[param.key] = param.value;
			this.updateTableInfo(null, null, tParam);
		},
		dealPageChange (val) {
			this.updateTableInfo(val, null);
		},
		dealSizeChange (val) {
			this.updateTableInfo(1, val);
		},
		updateMaterialInfo (d) {
			for (var k in this.materialParam) {
				this.materialParam[k] = d[k] || "";
			}
			if (d.file_type == 'audio' || d.file_type == 'video' || d.file_type == 'html') {
				this.materialParam.src = '/' + d.file_path;
			} else {
				this.materialParam.src = this.adapter.config.fwbSucai.url + d.id + "?token=" + localStorage.getItem("token");
			}
			this.isRecommond = false;
			// this.updateRecommendList(d.id);
			this.updateViewer();
		},
		updateViewer () {
			var documentArray = ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "pdf", "html", "eml"];
			var mediaArray = ["audio", "video", "image"];
			var ret = "";
			if (documentArray.indexOf(this.materialParam.file_type) !== -1) {
				ret = "DocumentViewer";

			}
			else if (mediaArray.indexOf(this.materialParam.file_type) !== -1) {
				ret = "MediaItemViewer";
			}
			else if (this.materialParam.id) {
				ret = "ArticleViewer";
			}
			else { };
			this.currentViewer = ret;
			return ret;
		},
		// 素材区请求列表方法
		updateTableData (id) {
			var _self = this;
			_self.adapter.getzhengbianitemlist({
				_path: id,
				search_type: "tscp_info",
			}, function (d) {
				var tData = d.data;
				_self.materialList.data = tData.data.sc_data;
        console.log(_self.materialList.data,99999)
			}
			);
		},
		viewMaterialItem (param) {
			this.currentMaterial = param;
			this.updateMaterialInfo(param);

		},
		// 素材区方法
		dealMaterial (name, type, index) {
			if (typeof this[name] === "function") {
				this[name](type, index);
			}
		},
		submitDeleteItem (type, index) {
			var scid = this.materialList.data[type][index].id
			var cbjlid = this.uploadParam.bw_id;
			var _self = this;
			_self.adapter.removeSC({
				sc_id: scid,
				id: cbjlid,
			}, function (d) {
				if (d.data.status === 0) {
					_self.$message({
						message: "素材删除成功",
						type: "success"
					})
				}
				else {
					_self.$message({
						message: "素材删除失败",
						type: "success"
					})
				}

			}
			);
			if (this.materialList.data[type]) {
				this.materialList.data[type].splice(index, 1);
			}
		},
		delete (type, index) {
			var _self = this;
			dealConfirm(function () {
				_self.submitDeleteItem(type, index);
			});
		},
		goBack () {
			this.$router.push({
				path: `/zbcb`
			});
		},
		switchFullscreen () {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();
			}
			else {
				document.exitFullscreen();
			}
		},
		//拖动中间分割线改变原文译文区域宽度 mousedown mouseup mousemove
		downChangeWidth (e) {
			let resize = this.$refs.resize
			this.startX = e.clientX;
			this.resizeLeft = resize.offsetLeft
			this.canDrag = true
		},
		upChangeWidth () {
			this.canDrag = false
			this.startX = 0;
			this.endX = 0;
			this.resizeLeft = 0;
		},
		moveChangeWidth (e) {
			if (this.canDrag) {
				let resize = this.$refs.resize
				let leftArea = this.$refs.leftArea
				let rightArea = this.$refs.rightArea
				let mainArea = this.$refs.mainArea
				this.endX = e.clientX;
				let moveLen = this.resizeLeft + (this.endX - this.startX)
				//分割线--40px
				moveLen = moveLen < (mainArea.clientWidth * 0.3) ? (mainArea.clientWidth * 0.3) : moveLen
				moveLen = moveLen > (mainArea.clientWidth * 0.7) ? (mainArea.clientWidth * 0.7) : moveLen
				resize.style.left = moveLen
				leftArea.style.width = moveLen + 'px'
				rightArea.style.width = (mainArea.clientWidth - moveLen - 40) + 'px'
			}
		}
	}
};
</script>

<style scoped>
* {
	box-sizing: border-box;
}
/deep/ .tableInfoDialog .el-dialog__body {
	height: 600px;
	overflow: auto;
	margin-top: 10px;
	border-top: solid 1px #ddd;
}
.layoutSwtichBtn {
	float: left;
	margin-bottom: 0px;
	padding: 3px 10px;
}
.eTagItem {
	margin-right: 5px;
}

/deep/ .el-radio-group > label {
	margin-right: 0px;
	width: 100%;
	text-align: center;
}

.wid {
	float: left;
	width: calc(100% - 260px);
	display: inline-block;
	position: relative;
	height: 100%;
	margin-left: 10px;
}
.editAreaTop {
	float: left;
	width: 100%;
	padding-bottom: 5px;
	position: relative;
}
/deep/ .materialViewerArea {
	margin-top: 20px;
	padding-left: 10px;
}
.wid .item {
	position: relative;
	height: calc(100% - 18px);
}
.timeline {
	overflow: visible;
	float: left;
}
.titleArea {
	width: 100%;
	position: relative;
	float: left;
	background-color: #f2f2f2;
	padding: 5px 10px;
}
.editorArea {
	height: calc(100% - 20px);
}
.articleTitleArea {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.box-card {
	height: 100%;
}
.opMaterialArea,
.searchOpArea {
	position: relative;
	float: left;
	width: 100%;
	padding: 5px 10px;
	background-color: #f8f9fa;
}

.searchOpArea {
	margin-bottom: 5px;
}

.opMaterialArea {
	text-align: center;
}

/*视频显示区*/
.box-card /deep/ .el-card__body {
	height: calc(100% - 40px);
	overflow: auto;
}
.videobtn {
	position: absolute;
	top: 1180px;
	opacity: 0.5;
	z-index: 20;
}
#goback {
	left: 300px;
}
#goforwad {
	left: 400px;
}
/*文本摘要编辑时候文本框*/
.editinfo {
	text-align: right;
	font-size: 13px;
	bottom: -35px;
	position: absolute;
	right: 0px;
	color: red;
	overflow: hidden;
	background: floralwhite;
}
.editinfo:hover {
	opacity: 1;
}
.vjs-control {
	color: #fff;
}
.conarea {
	position: relative;
	float: left;
	width: 100%;
	padding-bottom: 20px;
}
.vjs-picture-in-picture-control {
	display: none;
}
/*相关推荐选中*/
.isactive .text {
	color: #409eff;
}
</style>
