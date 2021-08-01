<template>
	<div class="DXSCDetail">
		<!--返回列表页-->
		<el-row :gutter="20">
			<el-col :span="24">
				<div class="grid-content bg-purple">
					<h3 class="xqym">详情页面</h3>
				</div>
			</el-col>
		</el-row>

		<!--左右布局-->
		<div ref="mainArea" style="width: calc(100% - 200px);height: 100%;padding: 0 100px;">
			<div ref="leftArea" style="width:calc(60% - 50px);height: 100%; float: left; ">
				<ArticleViewer ref="articleItem" v-if="currentViewer==='ArticleViewer'" :options="detailForm" style="position:relative; width: 100%; padding-right: 10px;"></ArticleViewer>
				<DocMaterialViewer v-else-if="currentViewer==='DocumentViewer'" ref="documentViewItem" :options="detailForm"></DocMaterialViewer>
				<div v-else style="height: 660px; width: 100%"></div>
			</div>
			<div ref="resize" @mousedown="downChangeWidth" @mouseup="upChangeWidth" @mousemove="moveChangeWidth" style="width: 100px;height: 100%;float: left;cursor: col-resize;">
				<div class="grid-content bg-purple buttons" v-if="handle_isshow">
					<handle ref="myHandleItem" :isList="false" :arrList="currentId" :types="typeTrees" :select="classifyStr"></handle>
				</div>
				<div style="height: 700px;padding: 0px 50px 0px 49px;">
					<div style="height: 100%;border-right: 1px solid #ddd;"></div>
				</div>
			</div>
			<div ref="rightArea" style="width:calc(40% - 50px);height: 100%; float: left; ">
				<div class="grid-content bg-purple">
					<el-card class="box-card pad10">
						<div slot="header" class="clearfix ">
							<span class="font16">要素关联信息</span>
							<el-button @click="openMoreList('elementRelated')" style="float: right; padding: 3px 0" type="text">更多</el-button>
							<!--<i class="el-icon-refresh" style="float: right; padding: 3px 0; color: #409EFF;"></i>-->
						</div>
						<div v-for="(item, index) in element" @click="toDetail(item)" :key="index" class="text item">
							<span class="listNum">{{index + 1}}</span>{{item.title}}
						</div>
					</el-card>
					<div class="tagDiv">
						<p>
							<span class="per">人物</span>
							<el-tag size="medium" style="margin:4px;line-height: 2;" :id="tag.id" :key="tag.id" v-for="(tag, index) in person" closable :disable-transitions="false" @close="handleClose(tag, index)">
								{{tag.name}}
							</el-tag>
							<el-button class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('person')">+添加</el-button>
						</p>
						<p style="padding:4px 0">
							<span class="org">机构</span>
							<el-tag size="medium" type="success" style="margin: 4px;" :id="tag.id" :key="tag.id" v-for="(tag, index) in org" closable :disable-transitions="false" @close="handleClose2(tag, index)">
								{{tag.name}}
							</el-tag>
							<el-button class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('org')">+添加</el-button>
						</p>
						<p style="padding:4px 0">
							<span class="org">目标</span>
							<el-tag size="medium" type="success" style="margin: 4px;" :id="tag.id" :key="tag.id" v-for="(tag, index) in weapon" closable :disable-transitions="false" @close="handleClose4(tag, index)">
								{{tag.name}}
							</el-tag>
							<el-button class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('Weapon')">+添加</el-button>
						</p>
						<!--<p style="padding:4px 0">
                <span class="org">事件</span>
                <el-tag size="medium" type="success" style="margin: 4px;" :id="tag.id" :key="tag.id" v-for="(tag, index) in field" closable :disable-transitions="false" @close="handleClose6(tag, index)">
                  {{tag.name}}
                </el-tag>
                <el-button class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('field')">+添加</el-button>
              </p>-->
						<p style="padding:4px 0">
							<span class="org">地点</span>
							<el-tag size="medium" :key="tag.id" :id="tag.id" type="success" style="margin:4px;" v-for="(tag, index) in location" closable :disable-transitions="false" @close="handleClose3(tag, index)">
								{{tag.name}}
							</el-tag>
							<el-button class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('location')">+添加</el-button>
						</p>
					</div>
					<!--相同来源-->
					<el-card class="box-card pad10">
						<div slot="header" class="clearfix ">
							<span class="font16">相同来源信息</span>
							<span class="currentSource">当前来源：<span style="color: #409EFF;">{{data_source.name || "无来源"}}</span></span>
							<el-button v-if="!!data_source.name" @click="openMoreList('otherRelated', {data_source: detailForm.data_source})" style="float: right; padding: 3px 0" type="text">更多</el-button>
							<!--<i class="el-icon-refresh" style="float: right; padding: 3px 0; color: #409EFF;"></i>-->
						</div>
						<div v-for="(item, index) in data_source.data" @click="toDetail(item)" :key="index" class="text item">
							<span class="listNum">{{index + 1}}</span>{{item.title}}
						</div>
					</el-card>
					<div class="tagDiv"></div>
					<!--相同分类-->
					<el-card class="box-card pad10">
						<div slot="header" class="clearfix">
							<span class="font16">相同分类信息</span>
							<span class="currentSource">当前分类：<span style="color: #409EFF;">{{classifyStr || '未分类'}}</span></span>
							<el-button v-if="!!classifyStr" @click="openMoreList('otherRelated', { classify: classifyStr })" style="float: right; padding: 3px 0" type="text">更多</el-button>
							<!--<i class="el-icon-refresh" style="float: right; padding: 3px 0; color: #409EFF;"></i>-->
						</div>
						<div v-for="(item, index) in classify.data" @click="toDetail(item)" :key="index" class="text item">
							<span class="listNum">{{index + 1}}</span>{{item.title}}
						</div>
					</el-card>
					<div class="tagDiv"></div>
					<!--相同方向-->
					<!--            <el-card class="box-card pad10">-->
					<!--              <div slot="header" class="clearfix ">-->
					<!--                <span class="font16">相同方向信息</span>-->
					<!--                <span class="currentSource">当前方向：<span style="color: #409EFF;">{{directionStr || "无方向"}}</span></span>-->
					<!--                <el-button v-if="!!directionStr" @click="openMoreList('otherRelated', {direction: detailForm.direction})" style="float: right; padding: 3px 0" type="text">更多</el-button>-->
					<!--                &lt;!&ndash;<i class="el-icon-refresh" style="float: right; padding: 3px 0; color: #409EFF;"></i>&ndash;&gt;-->
					<!--              </div>-->
					<!--              <div v-for="(item, index) in direction.data" @click="toDetail(item)" :key="index" class="text item">-->
					<!--                <span class="listNum">{{index + 1}}</span>{{item.title}}-->
					<!--              </div>-->
					<!--            </el-card>-->
					<!--            <div class="tagDiv"></div>-->
					<!--相似文章-->
					<el-card class="box-card pad10">
						<div slot="header" class="clearfix ">
							<span class="font16">相似文章</span>
							<el-button v-if="xswzStr>5" @click="openMoreList('xswz')" style="float: right; padding: 3px 0" type="text">更多</el-button>
						</div>
						<div v-for="(item, index) in xswz" @click="toDetail(item)" :key="index" class="text item">
							<span class="listNum">{{index + 1}}</span>{{item.title}}
						</div>
					</el-card>
					<div class="tagDiv"></div>
					<el-card class="box-card pad10">
						<div slot="header" class="clearfix ">
							<span class="font16">时间线溯源</span>
							<el-button style="float: right; padding: 3px 0" type="text"></el-button>
							<!--<i class="el-icon-refresh" style="float: right; padding: 3px 0; color: #409EFF;"></i>-->
						</div>
						<div class="text item" id="dxscTimeLine">
							<time-line class="center"></time-line>
						</div>
					</el-card>

					<div class="tagDiv"></div>
					<el-card class="box-card pad10">
						<div slot="header" class="clearfix ">
							<span class="font16">地理位置</span>
							<el-button style="float: right; padding: 3px 0" type="text"></el-button>
							<!--<i class="el-icon-refresh" style="float: right; padding: 3px 0; color: #409EFF;"></i>-->
						</div>
						<div class="text item">
							<!--<el-tag v-if="!!area.name && area.name != ''" :key="area.name" :id="area.name" type="success" style="margin:4px;" closable :disable-transitions="false" @close="handleClose5">-->
							<!--{{area.name}}-->
							<!--</el-tag>-->
							<!--<el-button v-if="!area.name || area.name == ''" class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('area')">+添加</el-button>-->
							<!--国别 城市-->
							<p style="padding: 4px 0px;">
								<span class="per">国别</span>
								<el-tag v-if="!!detailForm.area_gb && detailForm.area_gb != ''" :key="detailForm.area_gb" :id="detailForm.area_gb" type="success" style="margin:4px;" closable :disable-transitions="false" @close="handleClose5('area_gb')">
									{{detailForm.area_gb}}
								</el-tag>
								<el-button v-if="!detailForm.area_gb || detailForm.area_gb == ''" class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('area_gb')">+添加</el-button>
							</p>
							<p style="padding: 4px 0px;">
								<span class="per">城市</span>
								<el-tag v-if="!!detailForm.area_sf && detailForm.area_sf != ''" :key="detailForm.area_sf" :id="detailForm.area_sf" type="success" style="margin:4px;" closable :disable-transitions="false" @close="handleClose5('area_sf')">
									{{detailForm.area_sf}}
								</el-tag>
								<el-button v-if="!detailForm.area_sf || detailForm.area_sf == ''" class="button-new-tag" plain type="danger" style="padding: 6px 15px ; margin-left: 10px;" size="small" @click="showElement('area_sf')">+添加</el-button>
							</p>
						</div>
					</el-card>
				</div>
			</div>
		</div>
		<!--<el-backtop target=".DXSCDetail" :bottom="100">-->
		<!--<i class="el-icon-caret-top"></i>-->
		<!--</el-backtop>-->
		<!--翻译弹框-->
		<el-dialog title="翻译" :visible.sync="dialogVisible" width="50%">
			<div class="originText"><span>原文：</span>{{originText}}</div>
			<div class="transText"><span>译文：</span>{{transText}}</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogClose">关 闭</el-button>
			</span>
		</el-dialog>

		<!--新增要素弹框-->
		<div v-if="elementVisible">
			<el-dialog :title="elementVisibleTitle" :visible.sync="elementVisible" width="40%">
				<factor :type="eleType" @elementForm="elementFormValue"></factor>
				<span slot="footer" class="dialog-footer center">
					<el-button size="small" type="default" @click="elementCancel">取 消</el-button>
					<el-button size="small" type="primary" @click="elementOk">确 定</el-button>
				</span>
			</el-dialog>
		</div>

		<!--生成态势成品弹框-->
		<div v-if="reportShow">
			<el-dialog title="生成报告" :visible.sync="reportShow" width="30%">
				<report :id="detailId" :type="'DXSC'" @closeReport="closeReport"></report>
			</el-dialog>
		</div>

		<!--更多列表弹框-->
		<el-dialog :visible.sync="moreListVisible" width="70%" class="moredialog">
			<DataTableItem @sortTypeChange="dealSortChange" @tableClick="dealTableClick" @pageChange="dealPageChange" @sizeChange="dealSizeChange" :tableInfo="materialTable">
			</DataTableItem>
		</el-dialog>
	</div>
</template>

<script>
import ArticleViewer from "../assistReorganizeCommon/ArticleViewer"
import DocMaterialViewer from "../assistReorganizeCommon/DocMaterialViewer"
import DataTableItem from "../assistReorganizeCommon/DataTableItem";
import { formatDate } from "../assets/js/time"
import MoreList from "./MoreList"
import TimeLine from "./TimeLine"
import Handle from "./Handle"
import Report from "./Report"
import Factor from "./Factor"
const ES = '/es'
const API = '/rest/v1'
const CM = '/common'
const TRANSLATE = '/transform'
const URL = '/index_sczb/sc_info/'
const SEARCH = '/cm/dict'
const ANALYSIS = 'getRight/'
const ELEMENTDELETE = '/db_sczb/entity_info'
const ADDELEMENT = '/cm/entity_info/saveOrUpdate/element'
const ABSTRACT = 'saveOrUpdate'
export default {
	name: "DXSCDetail",
	components: {
		ArticleViewer,
		DocMaterialViewer,
		Factor,
		Report,
		DataTableItem,
		TimeLine,
		MoreList,
		Handle,
	},
	data () {
		return {
			// 根据文章来源设置handle的显示与隐藏
			handle_isshow: true,
			// 当前来源
			currentsource: '',
			// 文章Id
			detailId: '',
			// 详情预翻译tab页
			activeName: 'yw',
			currentViewer: "",
			// 详情相关
			detailForm: {
				author: '',
				check_status: '',
				classify: [],
				content: '',
				create_by: '',
				create_time: '',
				data_source: '',
				abstract: "",
				update_by: "",
				update_time: "",
				direction: [],
				source_url: "",
				file_type: "",
				file_path: "",
				id: '',
				is_lx: '',
				language: '',
				publish_time: '',
				title: '',
				sys_translate: [],
				translate_content: '',
				area_gb: '',//国别
				area_sf: '',//省份
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
					// {
					//   prop: "is_lx",
					//   label: "素材类型",
					//   width: 4,
					//   style: "color: #999; text-align: center;"
					// },
					{
						prop: "data_source",
						label: "信息来源",
						width: 6,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "author",
						label: "作者",
						width: 4,
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
			// 头部的文本框
			textShow: false,
			// 划选翻译弹框
			dialogVisible: false,
			originText: '',
			transText: '',
			// 更多列表弹框
			moreListVisible: false,
			params: {},
			moreListType: '',
			// 右侧分析相关
			// 分类
			classify: {},
			classifyStr: '',
			// 来源
			data_source: {},
			// 方向
			direction: {},
			// 相似文章
			xswz: [],
			xswzStr: 5,
			directionStr: '',
			// 要素
			element: [],
			// 新增要素的弹框
			elementVisible: false,
			//新增要素的弹框title
			elementVisibleTitle: '新增要素',
			// 要素类型
			eleType: '',
			// 要素弹框传过来的form表单
			eleForm: {},
			// 人物
			person: [],
			// 机构
			org: [],
			// 目标
			weapon: [],
			// 事件
			field: [],
			// 位置
			location: [],
			// 地域
			// area: {},
			// 划选文本
			// selectedText: '',
			// 当前内容的ID
			currentId: [],
			// 操作分类
			typeTrees: [],
			// 控制态势成品弹框显示隐藏
			reportShow: false,
			//拖拽分割线改变原文译文框宽度
			startX: 0,
			resizeLeft: 0,
			endX: 0,
			canDrag: false
		}
	},
	mounted () {

	},
	created () {
		let date = new Date()
		this.time = formatDate(date.getTime())
		this.getTypes()
		// 获取素材 Id
		this.detailId = this.$route.query.id
		this.currentId.push(this.detailId)
		// 左侧详情 + 右侧相关分析
		this.getDetail(this.detailId)

		// 判断文章来源动态设置按钮操作的显示隐藏
		var str = WebTool.urlQuery(location.href, "from")
		if (str === 'dbsc') {
			this.handle_isshow = false
		}
	},
	methods: {
		updateViewer () {
			var documentArray = ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "pdf", "html"];
			var mediaArray = ["audio", "video", "image"];
			var ret = "";
			if (documentArray.indexOf(this.detailForm.file_type) !== -1) {
				ret = "DocumentViewer";
			}
			else if (mediaArray.indexOf(this.detailForm.file_type) !== -1) {
				ret = "MediaItemViewer";
			}
			else if (this.detailForm.id) {
				ret = "ArticleViewer";
			}
			else { };
			this.currentViewer = ret;
			return ret;
		},
		// 获取素材详情
		getDetail (id) {
			var _self = this;
			this.ajaxGET(API + URL + id).then(r => {
				for (var k in _self.detailForm) {
					_self.detailForm[k] = r[k];
				}
				_self.updateViewer();
				_self.classifyStr = r.classify;
				if (_self.$refs.myHandleItem) {
					_self.$refs.myHandleItem.currentClass = r.classify;
				}

				_self.directionStr = dictMap.data.sc_fx[r.direction]
			}).catch(e => {
				_self.$message({
					message: '请求详情失败：' + e,
					type: 'warning'
				})
			})
			// 右侧相关分析
			this.ajaxGET(API + URL + ANALYSIS + id).then(r => {
        console.log(r,778866)
				this.currentsource = r;
				// 分类
				this.classify = r.classify
				// 来源
				this.data_source = r.data_source
				// 方向
				this.direction = r.direction
				// 要素
				this.element = r.element
				// 人物
				this.person = r.person
				// 机构
				this.org = r.org
				// 目标
				this.weapon = r.Weapon
				// 事件
				this.field = r.field
				// 位置
				this.location = r.location
				// 地域
				// this.area = r.area
			}).catch(e => {
				this.$message({
					message: '请求相关分析失败：' + e,
					type: 'warning'
				})
			})
			//请求相似文章
			this.getxswzList()
		},
		// 点击表格中某条数据到详情
		dealTableClick (name, param) {
			if (name === "title") {
				var path = "/dxscdetail";
				let { href } = this.$router.resolve({
					path: path,
					query: {
						id: param.id,
						from: "dxscdetail"
					}
				});
				window.open(href, '_blank')
			}
		},
		dealSortChange (param) {
			var dsl = this.dsl || {};
			var tParam = {};
			tParam[param.key] = param.value;
			if (!param.value) {
				dsl.order = JSON.stringify(tParam);
			}
			else {
				delete dsl.order;
			}
			dsl.pageNo = 1;
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
			sessionStorage.setItem('currentpage', val)
			this.updateTableData(dsl);
		},
		dealSizeChange (val) {
			var dsl = this.dsl || {};
			this.dsl.pageNo = 1;
			dsl.pageSize = val;
			this.updateTableData(dsl);
		},
		updateTableData (dsl, name) {
			dsl = dsl || {};
			name = name || this.adapterName;
			var _self = this;
			if (name == 'xswz') {
				var id = WebTool.urlQuery(location.href, "id")
				let params = {
					pageNo: 1,
					pageSize: 10
				}
				this.ajaxGET('/rest/v1/sc/xsd/' + id, params).then(d => {
					_self.materialTable.data = d;
					_self.materialTable.page = d.pager;
				}).catch(e => {
					_self.$message({
						message: "请求相似文章失败：：" + e,
						type: 'warning'
					})
				});
			} else {
				if (!name || typeof (this.adapter[name]) !== "function") {
					return false;
				}
				this.adapter[name](dsl, function (d) {
					var tData = d.data;
					var t = tData.data.map(item => {
						item.is_lx = dictMap.data.sc_lx[item.is_lx];
						return item;
					});
					_self.materialTable.data = t;
					_self.materialTable.page = tData.pager;
				});
			}
			this.dsl = dsl;
			this.adapterName = name;
		},
		// 获取操作分类
		getTypes () {
			this.ajaxGET(API + SEARCH).then(r => {
				// 分类
				this.typeTrees = r.sc_fl.map(d => {
					let obj = {
						'id': d.id,
						'label': d.name,
						'classify': d.value
					}
					if (d.value === this.classifyStr) {
						this.classifyStr = d.name
					}
					return obj
				})
				r.sc_fx.map(d => {
					if (d.value === this.directionStr) {
						this.directionStr = d.name
					}
				})
				// 方向
			}).catch(e => {
				this.$message({
					message: '获取头部筛选数据失败：' + e,
					type: 'warning'
				})
			})
		},
		textBlur (e) {
			this.textShow = true
		},
		// input focus效果
		textFocus (e) {
			this.textShow = true
		},
		// 更新摘要
		submitAbstract () {
			this.ajaxPOST(ES + URL + ABSTRACT, {
				saveOrUpdate: JSON.stringify({
					abstract: this.detailForm.abstract,
					id: this.detailId
				})
			}).then(r => {
				if (r !== '') {
					this.$message({
						message: '摘要编辑成功',
						type: 'success'
					})
				}
			}).catch(e => {
				this.$message({
					message: '更新摘要失败：' + e,
					type: 'warning'
				})
			})
			this.textShow = false
		},
		// 生成态势成品
		report () {
			this.reportShow = true
		},
		// 关闭生成态势成品弹框
		closeReport () {
			this.reportShow = false
		},

		// 删除人物
		handleClose (tag, index) {
			this.ajaxDELETE(CM + ELEMENTDELETE + '/' + tag.id).then(_ => {
				this.person.splice(index, 1)
			}).catch(e => {
				this.$message({
					message: e,
					type: 'warning'
				})
			})
		},

		// 删除机构
		handleClose2 (tag, index) {
			this.ajaxDELETE(CM + ELEMENTDELETE + '/' + tag.id).then(_ => {
				this.org.splice(index, 1)
			}).catch(e => {
				this.$message({
					message: e,
					type: 'warning'
				})
			})
		},

		// 删除目标
		handleClose4 (tag, index) {
			this.ajaxDELETE(CM + ELEMENTDELETE + '/' + tag.id).then(_ => {
				this.weapon.splice(index, 1)
			}).catch(e => {
				this.$message({
					message: e,
					type: 'warning'
				})
			})
		},
		// 删除事件
		handleClose6 (tag, index) {
			this.ajaxDELETE(CM + ELEMENTDELETE + '/' + tag.id).then(_ => {
				this.field.splice(index, 1)
			}).catch(e => {
				this.$message({
					message: e,
					type: 'warning'
				})
			})
		},

		// 删除地域
		handleClose5 (type) {
			let params = {
				id: this.detailId
			}
			params[type] = ''
			this.ajaxPOST("sczb-URL-prefix/index_sczb/sc_info/saveOrUpdate", {
				saveOrUpdate: JSON.stringify(params)
			}).then(r => {
				this.detailForm[type] = ''
			}).catch(e => {
				this.$message({
					message: e,
					type: 'warning'
				})
			})
		},

		// 删除地理位置
		handleClose3 (tag, index) {
			this.ajaxDELETE(CM + ELEMENTDELETE + '/' + tag.id).then(_ => {
				this.location.splice(index, 1)
			}).catch(e => {
				this.$message({
					message: e,
					type: 'warning'
				})
			})
		},

		// 新增要素 area_gb  国别  area_sf 省份
		showElement (type) {
			//清空上次选择
			this.eleForm = {}
			this.eleType = type
			if (type == 'area_gb' || type == 'area_sf') {
				this.elementVisibleTitle = '新增地理位置'
			} else {
				this.elementVisibleTitle = '新增要素'
			}
			this.elementVisible = true
		},

		// 取消要素
		elementCancel () {
			this.elementVisible = false
		},

		// 获取弹框组件传来的要素值
		elementFormValue (val) {
			this.eleForm = val
		},

		// 确认新增要素
		elementOk () {
			if (!this.eleForm.value || this.eleForm.value === '') {
				this.$message({
					message: '要素不能为空！',
					type: 'warning'
				})
				return
			}
			//area_gb  国别  area_sf 省份
			if (this.eleForm.typ == 'area_gb' || this.eleForm.typ == 'area_sf') {
				let params = {
					id: this.detailId
				}
				params[this.eleForm.typ] = this.eleForm.value
				this.ajaxPOST("sczb-URL-prefix/index_sczb/sc_info/saveOrUpdate", {
					saveOrUpdate: JSON.stringify(params)
				}).then(r => {
					this.detailForm[this.eleForm.typ] = this.eleForm.value
				}).catch(e => {
					this.$message({
						message: e,
						type: 'warning'
					})
				})
			} else {
				let params = {
					saveOrUpdate: JSON.stringify({
						name: this.eleForm.value,
						type: this.eleForm.typ,
						sc_id: this.detailId
					})
				}
				this.ajaxPOST(API + ADDELEMENT, params).then(r => {
					if (r === '') {
						this.$message({
							message: '新增的要素已存在！',
							type: 'warning'
						})
						return
					}
					if (this.type === 'person') {
						this.person.push({
							name: this.eleForm.value,
							id: r
						})
					} else if (this.type === 'org') {
						this.org.push({
							name: this.eleForm.value,
							id: r
						})
					} else if (this.type === 'Weapon') {
						this.weapon.push({
							name: this.eleForm.value,
							id: r
						})
					} else if (this.type === 'field') {
						this.field.push({
							name: this.eleForm.value,
							id: r
						})
					} else if (this.type === 'location') {
						this.location.push({
							name: this.eleForm.value,
							id: r
						})
					}
					this.getDetail(this.detailId)
				}).catch(e => {
					this.$message({
						message: '新增要素失败：' + e,
						type: 'warning'
					})
				})
			}
			this.elementVisible = false
		},
		// 关闭翻译弹框
		dialogClose () {
			this.dialogVisible = false
			this.originText = ''
			this.transText = ''
		},

		// 进入详情
		toDetail (item) {
			let { href } = this.$router.resolve({
				path: '/dxscdetail',
				query: {
					id: item.id
				}
			})
			window.open(href, '_blank')
			// 获取素材 Id
			// this.detailId = item.id
			// this.currentId.push(this.detailId)
			// 左侧详情 + 右侧相关分析
			// this.getDetail(this.detailId)
		},

		// 显示更多列表
		openMoreList (adapterName, param) {
			var dsl = {
				pageNo: 1,
				pageSize: 10,
				sc_id: this.detailForm.id
			}
			if (param) {
				dsl.exact_search = JSON.stringify(param);
			}
			this.updateTableData(dsl, adapterName)
			// this.params = {
			//   pageNo: 1,
			//   pageSize: 10,
			// }
			// this.params.order = JSON.stringify({create_time: "desc"})
			// if (str === 'element') { // 要素
			//   this.moreListType = 'element'
			// } else if (str === 'source') { // 来源
			//   this.moreListType = 'source'
			//   this.params.exact_search = JSON.stringify({data_source: this.data_source.name})
			// } else if (str === 'direction') { // 方向
			//   this.moreListType = 'direction'
			//   this.params.exact_search = JSON.stringify({direction: this.directionStr})
			// } else if (str === 'type') { // 分类
			//   this.moreListType = 'type'
			//   this.params.exact_search = JSON.stringify({classify: this.classifyStr})
			// }
			this.moreListVisible = true
		},

		// 点击更多列表里某条数据显示详情，关闭弹框
		moreListShow (item) {
			let { href } = this.$router.resolve({
				path: '/dxscdetail',
				query: {
					id: item.id
				}
			})
			window.open(href, '_blank')
			// 获取素材 Id
			this.detailId = item.id
			this.currentId.push(this.detailId)
			// 左侧详情 + 右侧相关分析
			this.getDetail(this.detailId);
			this.moreListVisible = false
		},

		// 关闭更多列表弹框
		moreListClose () {
			this.moreListVisible = false
		},
		//相似文章信息获取 xswz
		getxswzList () {
			var _self = this;
			var id = WebTool.urlQuery(location.href, "id")
			let params = {
				pageNo: 1,
				pageSize: 6
			}
			this.ajaxGET('/rest/v1/sc/xsd/' + id, params).then(d => {
				_self.xswzStr = d.length
				_self.xswz = []
				d.forEach((item, index) => {
					if (index < 5) {
						_self.xswz.push({
							title: item.title,
							id: item.id
						})
					}
				});
			}).catch(e => {
				this.$message({
					message: "请求相似文章失败：：" + e,
					type: 'warning'
				})
			});
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
				//分割线--100px
				moveLen = moveLen < (mainArea.clientWidth * 0.3) ? (mainArea.clientWidth * 0.3) : moveLen
				moveLen = moveLen > (mainArea.clientWidth * 0.7) ? (mainArea.clientWidth * 0.7) : moveLen
				resize.style.left = moveLen - 110
				leftArea.style.width = moveLen - 110 + 'px'
				rightArea.style.width = (mainArea.clientWidth - moveLen - 110 - 100) + 'px'
			}
		}
	}
}
</script>

<style scoped>
.grid-content {
	white-space: normal !important;
}
.DXSCDetail {
	overflow-y: scroll;
	overflow-x: hidden;
	width: calc(100% - 20px);
	height: calc(100% - 20px);
	padding: 10px;
	background: #ffffff;
}
.rightButton li {
	margin: 5px 0;
}
.center {
	text-align: center;
}
.right {
	text-align: right;
}
.padding {
	padding: 10px 0;
}
.dTitle {
	font-size: 24px;
	border-bottom: 1px solid #cccccc;
	font-weight: 400;
	height: 68px;
	line-height: 68px;
}
.dInfo {
	padding: 5px 0;
}
.contentText {
	text-indent: 2em;
	padding: 0 10px;
	line-height: 26px;
}
.listNum {
	padding: 0 20px 0 0;
}
.tagDiv {
	font-size: 14px;
	margin: 20px 0;
}
.currentSource {
	font-size: 14px;
	margin-left: 30px;
}
.per {
	font-weight: bold;
	padding: 2px 6px;
	/*color: #409EFF;*/
}
.org {
	font-weight: bold;
	padding: 2px 6px;
	/*color: #67C23A;*/
}
.el-icon-refresh {
	cursor: pointer;
}
.originText {
	margin-bottom: 20px;
	font-weight: 500;
}
.el-dropdown-menu {
	z-index: 9;
	width: 200px;
}
.item {
	cursor: pointer;
}
.originUrl {
	font-size: 14px;
	color: #409eff;
}
.verticall-ine {
	/*width: 1px;*/
	display: inline-block;
	height: 700px;
	/*background: #ccc;*/
	/*margin: 130px 44px 0;*/
	/*position: absolute;*/
	/*left: 57%;*/
	/*top: 16%;*/
}
.font16 {
	font-size: 16px;
}
.pad10 /deep/ .el-card__header {
	padding: 10px 20px !important;
}
.moredialog /deep/ .el-dialog__body {
	padding: 15px 20px;
	height: 600px;
}

/*按钮区*/
.buttons {
	margin: 0 10px;
	/*position: fixed;*/
	/*top: 140px;*/
	/*right: 41%;*/
}
/*详情页面页头*/
.xqym {
	font-size: 18px;
	color: #303133;
	padding-left: 10px;
}
/*一键置顶*/
.el-icon-caret-top::before {
	content: '\e78f';
}
</style>
