<template>
	<div >
		<el-row :span="24" :gutter="20" style="height: 100%; ">
			<el-col :span="18">
				<el-card shadow="always">
					<div class="taskPageTitle">
						<h3 style="padding: 15px 20px;">
							<el-row>
								<el-col :span="2" class="backBox">
									<el-button @click="backToDocList" style="margin-left: 10px;" type="primary" size="mini">返回</el-button>
								</el-col>
								<el-col :span="8" :offset="0">
									<el-input size="small" placeholder="请输关键词检索" v-model="dataFilter.keyword" class="keywordInput">
										<el-button size="small" type="primary" slot="append" @click="handleSerchEvent">
											搜索
										</el-button>
									</el-input>
								</el-col>
								<el-col :span="14" :offset="0" class="backBox" style="text-align:right">
                  <el-button size="small" type="primary" @click="handleSubmit">
											提交
										</el-button>
								</el-col>
							</el-row>
						</h3>
					</div>
					<div class="contentTitle">
						<h3>{{current.title}}</h3>
						<div class="contentTitle_part" style="text-align:center">
							<el-tag type="danger" size="small" effect="dark">负面</el-tag>
							<span>来源：环球新闻</span>
							<span>发布时间：2020-10-20</span>
						</div>
					</div>
					<div class="content_part">
						<div v-show="!isMark" style="height: calc( 100% - 90px ); width: 100%;">
							<EntityLabelTool ref="labelToolItem" ></EntityLabelTool>
						</div>
						<div v-show="isMark" style="height: calc( 100% - 90px ); width: 100%;">
							<!-- 显示未标注的纯文章 -->
							<div class="contentArea" style="padding: 10px; height: 100%; overflow: auto; width: 100%;">
								<div class="contentContainer" style="width: 100%; height: auto; position: relative; float: left;">
									<div ref="isNotMarked" class="docContentItem" style="padding: 10px; position: relative; z-index: 1;"></div>
								</div>
							</div>
						</div>
					</div>
				</el-card>

			</el-col>
			<el-col :span="6">
				<el-card shadow="always">
					<div>
						<h4 style="margin-bottom:20px">协同标注记录</h4>
						<MarkRecord :dataBox="recordData" @echoClick="echoClick"></MarkRecord>
					</div>
					<div style="margin-top:20px;">
						<h4 style="margin-bottom:20px">可视化统计</h4>
						<div>
							<h5>标注次数统计</h5>
							<BarChart style="height: 300px" :dataObj="barOneDataObj" ref="barOne"></BarChart>
						</div>
						<div>
							<h5>已标注次数统计</h5>
							<BarChart style="height: 300px" :dataObj="barTwoDataObj" ref="barTwo"></BarChart>
						</div>
					</div>

				</el-card>
			</el-col>
		</el-row>
		<DialogItem :config="viewDataConfigDialog">
			<template>
				<LabelDataViewer :dataObj="current.data" ref="myLabelDataViewer"></LabelDataViewer>
			</template>
		</DialogItem>
	</div>
</template>

<script>
import DialogItem from "@/autoTagCommon/dialogItem";
import EntityLabelTool from "@/autoTagCommon/entityLabelTool";
import LabelDataViewer from "@/autoTagCommon/labelDataViewer";
import DataTable from "@/autoTagCommon/dataTable";
import MarkRecord from "@/autoTagCommon/markRecord";
import BarChart from "@/baseCharts/barChart";
export default {
	components: {
		DialogItem,
		EntityLabelTool,
		LabelDataViewer,
		MarkRecord,
		DataTable,
		BarChart
	},
	beforeMount () {

	},
	mounted () {
		this.getDocById()
		this.getMarklist()
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
			recordData: {
				title: '记录一',
				labelName: "光头强",
				marked: "熊大",
				auditor: "熊二",
			},
			barOneDataObj: {
				name: "标注次数",
				color: ['#1890ff'],
				data: [
					{
						name: "陈大话",
						value: 10,
					},
					{
						name: "王大花",
						value: 90,
					},
					{
						name: "陈志国",
						value: 30,
					},
					{
						name: "王爱国",
						value: 40,
					},
					{
						name: "张爱国",
						value: 20,
					},
					{
						name: "李爱国",
						value: 5,
					}
				],
			},
			barTwoDataObj: {
				name: "已标注次数",
				color: ['#facc14'],
				data: [
					{
						name: "猪八戒",
						value: 5,
					},
					{
						name: "王大花",
						value: 60,
					},
					{
						name: "陈志国",
						value: 25,
					},
					{
						name: "王爱国",
						value: 15,
					},
					{
						name: "张爱国",
						value: 20,
					},
					{
						name: "李爱国",
						value: 8,
					}
				],
			},
      nowList:JSON.parse(localStorage.getItem("nowList"))
		};
	},
	methods: {
		// 获取文档信息
		getDocById () {
			let that = this
			this.adapter.postDocById({ id: this.$route.query.id }, function (d) {
				if (d.data.meta.success) {
					let docData = d.data.data
					that.current.title = docData.data.qbbt
					that.currentData.content = docData.data.zwnr.replace(/\r/g, "")
					var currentData = {
						title: docData.data.qbbt,
						docId: docData.data.id,
						content: that.currentData.content,
						labels: that.nowList.labels || [],
						relation: that.nowList.relation || []
					}
					localStorage.setItem("currentData", JSON.stringify(currentData));
					that.$nextTick(() => {
						that.$refs.labelToolItem.updateData(that.currentData)
					})
				} else {
					_self.$message({
						message: d.data.meta.message,
						type: 'error'
					});
				}
			})
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

		//更新文档标注区域中的标签和连线
		updateToolCanvas () {
			// var _self = this
			// _self.$nextTick(() => {
			// 			_self.$refs.labelToolItem.updateData(_self.entityLabel)
			// 		})
			console.log(this.dataBox, 999888)
		},
		// 返回标注列表页
		backToDocList () {
			this.$router.go(-1)
		},
		//关键字检索
		handleSerchEvent () {
			let keyword = this.dataFilter.keyword.trim()
			if (keyword) {
				if (window.find(keyword, false, false, true)) {
					window.find(keyword, false, false, true)
				} else {
					this.$message({
						type: 'warning',
						message: '已经到文章结尾，请向前查找！'
					});
				}
			} else {
				this.$message({
					type: 'warning',
					message: '请输入要查询的关键字'
				});
			}
		},


		// 返回文档列表
		backToDocList () {
			this.$router.go(-1)
		},


		// 回显
		echoClick (data) {
			console.log(data, 56789)
		},
    // 标注提交
    handleSubmit(){
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
          _this.adapter.docTj(iMarkDocTjInfo,function(d){
            if(d.data.meta.success){
              _this.$message({
                message: d.data.meta.message,
                type: 'successs'
              });
            }else{
              _this.$message({
                message: d.data.meta.message,
                type: 'error'
              });
            }
          });
        });
    }
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
.keywordInput /deep/ .el-input-group__append,
.backBox /deep/ .el-button--primary{
	background: #4f78e0;
	color: #fff;
	border: none;
	border-radius: 0;
	font-size: 14px;
}
.keywordInput /deep/ .el-input-group__append button,
.backBox /deep/ .el-button--primary {
	letter-spacing: 4px;
}
.pitchOn {
	color: #6186e4;
}
.contentTitle {
	text-align: center;
}
.contentTitle h3 {
	padding: 15px 20px 15px 20px;
}
.contentTitle .contentTitle_part span {
	display: inline-block;
	margin: 0px 20px 0px 20px;
}
.contentTitle .contentTitle_part /deep/ .el-tag {
	letter-spacing: 2px;
	font-size: 14px;
}
.content_part {
	min-height: 600px;
}
</style>
