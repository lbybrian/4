<template>
	<div>
		<el-row style="margin-top: 0px; height: 100%;" :gutter="5">
			<el-col :span="24" style="height: 100%; ">
				<div class="documentArea" style="height: 100%; width: 100%;">
					<div class="taskPageTitle" style="margin-bottom: 10px;">
						<div style="padding: 5px 10px;background: #fff;">
							<span>文档标注 / 标注内容 <el-button @click="backToDocList" style="margin-left: 10px;background-color: #00BF35;color:#fff;" size="mini" round>返回</el-button></span>
							<span style="margin:0 10px">
								<el-button type="text" :disabled="beforeDocDisabled" @click="beforeDoc">上一篇</el-button>
							</span>
							<span>
								<el-button type="text" :disabled="afterDocDisabled" @click="afterDoc">下一篇</el-button>
							</span>
							<!-- 标签类别颜色图例 -->
							<el-switch v-model="isMark" active-color="#dcdfe6" inactive-color="#00BF35" inactive-text="显示标注" style="margin-left: 10px;" @change="isMarkChange"></el-switch>
							<div style="width: 50%;display: inline-block;margin: 0 20px;">
								<span v-for="d in labelColorList.entitys" :key="d.id" class="labelColorSpan" @click="labelMarked(d,$event)">
									{{d.label}} <span :style="{backgroundColor: d.color}" class="labelColorStyle"></span>
								</span>
							</div>
							<!-- 暂注释事件的图例 -->
							<!-- <div style="width: 54%;position: absolute;left: 506px;">
                <span v-for="d in labelColorList.events" :key="d.id" class="labelColorSpan" @click="labelMarked(d,$event)">
                  {{d.label}} <span :style="{backgroundColor: d.color}" class="labelColorStyle"></span>
                </span>
              </div> -->
							<span class="opArea" style="float: right;">
								<el-button @click="conformChecked" size="mini" style="background-color: #00BF35;color:#fff;margin-top: 6px;">提交</el-button>
							</span>
						</div>
					</div>
					<div class="contentTitle" style="background: #fff;border-bottom: 1px solid #E9E9E9;">
						<p style="padding-top: 10px;font-size: 18px;font-weight: 700;text-align: center;line-height: 32px;">
							{{current.title}}
						</p>
						<p style="font-size: 14px;text-align: center;line-height: 32px;">
							{{current.create_time}}
						</p>
					</div>
					<el-row style="height: calc(100% - 145px);overflow-y: auto;background: #fff;">
						<el-col :span="!isMarkData?14:24" style="border-right: 1px solid #D9D9D9;">
							<div v-show="!isMark" style="height: calc( 100% - 90px ); width: 100%;">
								<EntityLabelTool ref="labelToolItem" @updataMarkedData="updataMarkedData"></EntityLabelTool>
							</div>
							<div v-show="isMark" style="height: calc( 100% - 90px ); width: 100%;">
								<!-- 显示未标注的纯文章 -->
								<div class="contentArea" style="padding: 10px; height: 100%; overflow: auto; width: 100%;">
									<div class="contentContainer" style="width: 100%; height: auto; position: relative; float: left;">
										<div ref="isNotMarked" class="docContentItem" style="padding: 10px; position: relative; z-index: 1;"></div>
									</div>
								</div>
							</div>
							<div>
								<span style="float: right;">
									<el-button type="text" :disabled="afterDocDisabled" @click="afterDoc">下一篇</el-button>
								</span>
								<span style="float: right;margin:0 10px">
									<el-button type="text" :disabled="beforeDocDisabled" @click="beforeDoc">上一篇</el-button>
								</span>
							</div>
						</el-col>
						<el-col :span="!isMarkData?10:0" style="height: 100%;">
							<div style="height: calc( 100% - 90px ); padding: 0 40px;">
								<MarkedDataInfo ref="markedDataInfo" :markedDates='markedDates'></MarkedDataInfo>
							</div>
						</el-col>
					</el-row>

				</div>
			</el-col>
		</el-row>
		<DialogItem :config="viewDataConfigDialog">
			<template>
				<LabelDataInfo :viewDataJson='viewDataJson'></LabelDataInfo>
			</template>
		</DialogItem>
	</div>
</template>

<script>
import DialogItem from "@/autoTagCommon/dialogItem";
import EntityLabelTool from "@/autoTagCommon/entityLabelTool";
import LabelDataViewer from "@/autoTagCommon/labelDataViewer";
import MarkedDataInfo from "@/autoTagCommon/markedDataInfo";
import DataTable from "@/autoTagCommon/dataTable";
import MarkRecord from "@/autoTagCommon/markRecord";
export default {
	components: {
		DialogItem,
		EntityLabelTool,
		LabelDataViewer,
		MarkRecord,
		DataTable,
		MarkedDataInfo
	},
	beforeMount () {
		this.markedDates.tdocId = this.nowList.id
	},
	mounted () {
		this.getDocById()
    console.log(4444444444)
		// this.getMarklist()
		// 获取各类别标签颜色
		this.getLabelColor();
	},
	data () {
		return {
			//文档查询筛选参数配置项
			dataFilter: {
				value: "",
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
			current: {
				title: "",
				data: {
					content: "#测试"
				}
			},
			isMark: false,//是否标注本文章 false显示标注

			viewDataConfigDialog: {
				visible: false,
				title: '查看数据',
				withFooter: false,
				data: '',
				width: '1000px',
			},
			dataBox: {
				id: this.$route.query.id,
				docId: this.$route.query.id,
				useId: this.$route.query.id,
				labelData: [],
				linkData: [],
				type: 'entity',
			},
			currentData: {
				docId: "",
				content: '',
				relation: [],
				labels: [],
			},
			isMark: false,//是否标注本文章 false显示标注
			isMarkData: false,//是否显示标注数据 false显示
			markedDates: {
				name: 'labelData',
				tdocId: '',//当前文档id
			},
			// 上一篇 下一篇是否可点击
			beforeDocDisabled: false,
			afterDocDisabled: false,
			upDownDoc: {},
			// 筛选类别展示
			labelColorList: {},//所有类别色值集合
			labelMarkedArr: [],//选中类别集合
			nowList: JSON.parse(localStorage.getItem("nowList")),
			listPage: JSON.parse(localStorage.getItem("listPage")),
			// 查看数据参数
			viewDataJson: {
				name: 'labelData',
				labels: [],
				relation: []
			},
		};
	},
	methods: {
		// 获取文档信息
		getDocById () {
			let that = this
			console.log(this.nowList, 998000)
			this.switchCurrentData(this.nowList, function (dd) {
				that.current.title = dd.title;
				that.current.create_time = dd.create_time;
				that.current.docId = dd.docId;
				// 显示未标注的纯文章
				let elem = that.$refs.isNotMarked;
				elem.innerHTML = dd.content;
				that.updateToolCanvas(dd);
			});
		},
		//获取标注结果
		getMarklist () {
			let that = this
			let iMarkSearchEntityInfo = {
				id: "528f5891a32845e684a69a9af453b631"
			}
			this.adapter.postMarklist(iMarkSearchEntityInfo, function (d) {
				console.log(d.data, 8899)
				if (d.data.meta.success) {
					let docData = d.data.data

					// that.current.data.content = docData.data.zwnr.replace(/\r/g, "")
				} else {
					_self.$message({
						message: d.data.meta.message,
						type: 'error'
					});
				}
			})
		},

		//筛选事件标签类型     *保留实体role
		filtrateType (data, type) {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				if (item.role == 'leader' || item.type == type) {
					result.push(item)
				}
			}
			return result;
		},
		//筛选标签连线类型     *保留实体role的连线
		linkDataType (data) {
			let result = [];
			let ret = data.findItemIndex('roleType', 'leader')
			if (ret.length > 0) {
				ret.map(item => {
					result.push(data[item])
				})
			}
			return result;
		},


		// 返回标注列表页
		backToDocList () {
			this.$router.go(-1)

		},
		// 获取文档内容
		switchCurrentData (tData, callback) {
			console.log(tData)
			let that = this;
			let iMarkSearchInfo = {
				pageNo: that.listPage.pageNo,
				pageSize: that.listPage.pageSize,
				startTime: that.listPage.startTime,
				endTime: that.listPage.endTime,
				q: that.listPage.q,
				id: tData.id,
				order: that.listPage.order
			}
			that.adapter.getDocById(iMarkSearchInfo, function (d) {
				if (d.data.meta.success) {
					var content = d.data.data.data.zwnr.replace(/\r/g, "");
					var currentData = {
						title: d.data.data.data.qbbt,
						docId: d.data.data.data.id,
						create_time: d.data.data.data.create_time,
						content: content,
						labels: tData.labels || [],
						relation: tData.relation || []
					}
					// 用于上一篇 下一篇使用的参数
					that.upDownDoc = {
						last: d.data.data.last,
						lastPageNo: d.data.data.lastPageNo,
						top: d.data.data.top,
						topPageNo: d.data.data.topPageNo,
					}
					console.log(that.upDownDoc, 555666)
					that.beforeDocDisabled = d.data.data.top === '' ? true : false,
						that.afterDocDisabled = d.data.data.last === '' ? true : false,
						localStorage.setItem("currentData", JSON.stringify(currentData));

					if (typeof (callback) === "function") {
						callback(currentData);
					}
				} else {
					that.$message({
						message: d.data.meta.message,
						type: "error"
					})
				}
			})
			// var prefix = "/static/mock/document/";
			// var url = prefix + tData.name;
			// $.get(url, function (d) {
			// });
		},
		//更新文档标注区域中的标签和连线
		updateToolCanvas (currentData) {
			this.$refs.labelToolItem.updateData(currentData);
			this.updataMarkedData('labelData')
		},
		// 根据文档id获取数据显示文档详情
		checkIdOther (d) {
			this.markedDates.tdocId = d.id;
			var _self = this;
			this.switchCurrentData(d, function (dd) {
				_self.current.title = dd.title;
				_self.current.create_time = dd.create_time;
				_self.current.docId = dd.docId;
				// 显示未标注的纯文章
				let elem = _self.$refs.isNotMarked;
				elem.innerHTML = dd.content;
				_self.updateToolCanvas(dd);
			});
		},
		// 标注详情页--提交
		conformChecked () {
			let _this = this;
			this.$confirm("确定提交吗？", "提示", {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let iMarkDocTjInfo = {
					comments: "",
					tdocId: _this.markedDates.tdocId
				}
				_this.adapter.docTj(iMarkDocTjInfo, function (d) {
					if (d.data.meta.success) {
						_this.$message({
							message: d.data.meta.message,
							type: 'successs'
						});
					} else {
						_this.$message({
							message: d.data.meta.message,
							type: 'error'
						});
					}
				});
			});
		},
		// 标注详情页--上一篇
		beforeDoc () {
			this.checkIdOther({ id: this.upDownDoc.top });
		},
		// 标注详情页--下一篇
		afterDoc () {
			console.log(this.upDownDoc, 99999999)
			this.checkIdOther({ id: this.upDownDoc.last });
		},
		// 是否显示标注--change事件
		// 显示标注按钮--点击显示全部标签关系或者显示纯文本（显示纯文本是清空所有已选标签类别）
		isMarkChange () {
			if (this.isMark) {
				let spans = document.querySelectorAll('.labelColorSpan');
				spans.forEach(item => {
					item.style.color = '';
					item.style.border = '';
				});
				this.labelMarkedArr = [];
			} else {
				this.$refs.labelToolItem.updateContentArea(this.labelMarkedArr);
			}
		},
		// 在标注详情--显示选中的标签类别
		labelMarked (data, $event) {
			if ($event.toElement.style.color == '') {
				$event.toElement.style.color = data.color;
				$event.toElement.style.border = '1px solid' + data.color;
				this.labelMarkedArr.push(data.id);
			} else {
				$event.toElement.style.color = '';
				$event.toElement.style.border = '';
				if (this.labelMarkedArr.indexOf(data.id) != -1) {
					this.labelMarkedArr.splice(this.labelMarkedArr.indexOf(data.id), 1);
				}
			}
			this.$refs.labelToolItem.updateContentArea(this.labelMarkedArr);
		},
		// 标注-各标签类别颜色集合
		getLabelColor () {
			let _self = this;
			this.adapter.getLabelColor({}, function (res) {
				console.log(res)
				if (res.data.meta.success) {
					_self.labelColorList = res.data.data;
				} else {
					_self.$message({
						message: res.data.meta.message,
						type: "error"
					})
				}
			})
		},
		// 标注详情页--标注数据发生变化时更新右侧标签以及关系展示数据
		updataMarkedData (type) {
			if (type == 'labelData') {
				this.$refs.markedDataInfo.updateLabelData();
			} else if (type == 'relationData') {
				this.$refs.markedDataInfo.updaterelationData();
			}
		},
	},
};

</script>

<style scoped>
* {
	box-sizing: border-box;
}
.documentArea {
	height: 100%;
	/* background-color: #fff; */
	border-radius: 5px;
}

.backBox /deep/ .el-button--primary {
	background: #4f78e0;
	color: #fff;
	border: none;
	border-radius: 0;
	font-size: 14px;
}

.backBox /deep/ .el-button--primary {
	letter-spacing: 4px;
}

.documentArea {
	height: 100%;
	border-radius: 5px;
}

.opArea .el-dropdown-link {
	cursor: pointer;
	margin-left: 10px;
}
.labelColorSpan {
	font-size: 14px;
	margin-right: 10px;
	padding: 4px;
	border-radius: 4px;
	vertical-align: bottom;
	cursor: pointer;
}
.labelColorStyle {
	display: inline-block;
	width: 25px;
	height: 12px;
	border-radius: 10px;
	vertical-align: middle;
}
/deep/ .el-icon-search {
	color: #00bf35;
	font-weight: 800;
}
/deep/ .el-button--text {
	color: #00bf35;
}
/deep/ .el-switch__label.is-active {
	color: #00bf35;
}
/deep/ .el-button.is-disabled {
	color: #c0c4cc;
}
/deep/ .el-tabs__item.is-active {
	color: #00bf35;
}
/deep/ .el-tabs__item:hover {
	color: #00bf35;
}
/deep/ .el-tabs__active-bar {
	background-color: #00bf35;
}
/deep/ .el-radio-button__inner:hover {
	color: #00bf35;
}
</style>
