<template>
	<div style="padding-top: 10px; margin-top: 0px; height: 100%; position: relative;">
		<el-row style="margin-top: 0px; height: 100%;" :gutter="5">
			<el-col :span="24" style="height: 100%; ">
				<div class="documentList">
					<el-card shadow="always" style="margin-top: 20px;">
						<div class="dataFilterArea">
							<el-row :gutter="20">
								<el-col :span="22">
									<SearchCondition :conditions="conditions"
											@onChange="dealChangeEvent"
											style="margin-bottom: 10px;" />
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
							<el-tab-pane label="列表" name="listData">
								<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
									<DataTable ref="docListItem" :dataObj="docListTable" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
								</div>
							</el-tab-pane>
							<el-tab-pane label="因果图" name="causeEffect">
								<TimeLine :dataObj="causeEffectData" ref="exampleTestItem">
    						</TimeLine>
							</el-tab-pane>
							<el-tab-pane label="时序图" name="sequential" style="padding:40px 220px;">
								<el-timeline>
									<el-timeline-item 
									v-for="(item,index) in timeLineData"
									:key="index"
									:timestamp="item.time" 
									:class="index % 2 != 0 ? 'odd-item' : ''"
									placement="top" 
									type='primary'>
										<el-card>
											<h4>{{item.title}}{{index+1}}:</h4>
											<p>{{item.con}}</p>
										</el-card>
									</el-timeline-item>
								</el-timeline>
							</el-tab-pane>
						</el-tabs>
					
					</el-card>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import DataTable from "@/assistCommon/dataTable";
import SearchCondition from "@/assistCommon/SearchCondition";
import SearchItem from "@/assistCommon/SearchItem";
import TimeLine from "@/assistCommon/timeLine";

export default {
	name:'excavate',
	components: {
		DataTable,
		SearchCondition,
		SearchItem,
		TimeLine
	},
	beforeMount () {

	},
	mounted () {

	},
	data () {
		return {
			activeName:'listData', //listData causeEffect  sequential
			//文档查询筛选参数配置项
			searchType: {
        value: "",
        select: "title",
				options: [
          {
            label: "情报主题",
            value: "title"
          }
        ]
      },
			//文档表格配置参数项
			docListTable: {
				withSelection: true,
				// withIndex: true,
				heightCurrentRow: true,
				header: [{
					prop: "qbbt",
					label: "情报标题",
					minWidth: "100",
					align: "ceter",
				},
				{
					prop: "qbnr",
					label: "情报内容",
					minWidth: "300",
					align: "left",
					showOverflowTooltip:true,
				},
				{
					prop: "bq",
					label: "标签",
					minWidth: "160",
					align: "center",
					tag: true,
          effect:'dark',
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
						},{
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
					prop: "fl",
					label: "分类",
					minWidth: "100",
					align: "center",
				},
				{
					prop: "time",
					label: "时间",
					minWidth: "100",
					align: "center",
				},
				{
					prop: "sjr",
					label: "收集人",
					minWidth: "100",
					align: "center",
				},
				{
					prop: "date",
					label: "操作",
					width: "200",
					align: "center",
					//表格中数据行中的按钮列表
					buttons: [
						{
							text: "查看",
							eventName: "checkedData"
						}
					],
				},
				],
				data: [
					{
						qbbt:'情报主题000',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						fl:'人物事件分类',
						time:'2021/3/30',
						bq:'4',
						sjr:'张三'
					},
					{
						qbbt:'情报主题000',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						fl:'人物事件分类',
						time:'2021/3/30',
						bq:'5',
						sjr:'张三'
					},
					{
						qbbt:'情报主题000',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						fl:'事件分析分类',
						time:'2021/3/30',
						bq:'6',
						sjr:'张三'
					},
					{
						qbbt:'情报主题000',
						qbnr:'内容内容4',
						fl:'人物事件分类',
						time:'2021/3/30',
						bq:'4',
						sjr:'张三'
					},
					{
						qbbt:'情报主题000',
						qbnr:'内容内容5',
						fl:'事件分析分类',
						time:'2021/3/30',
						bq:'5',
						sjr:'张三'
					},
					{
						qbbt:'情报主题000',
						qbnr:'内容内容6',
						fl:'人物事件分类',
						time:'2021/3/30',
						bq:'6',
						sjr:'张三'
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
			conditions: [
        {
          name: "基于对象",
          value: [0,1,2,3,4,5,6],
          checkAll: false,
          type: "checkbox",
          key: "bglx",
          items: ["人物", "事件", "组织", "机构", "部队", "设施"]
        },
        {
          name: "基于要素",
          value: [0,1,2,3,4,5],
          type: "checkbox",
          checkAll: false,
          key: "status",
          dict: "dbrw_rwzt",
          items: ["地点", "内容", "来源", "领域", "类型"]
        }
      ],
			timeLineData:[
				{
					title:'情报内容',
					time:'2018/4/12',
					con:'这是关于2018年的情报内容XXX'
				},
				{
					title:'情报内容',
					time:'2019/4/12',
					con:'这是关于2019年的情报内容XXX'
				},
				{
					title:'情报内容',
					time:'2020/4/12',
					con:'这是关于2020年的情报内容XXX'
				},
				{
					title:'情报内容',
					time:'2021/4/12',
					con:'这是关于2021年的情报内容XXX'
				},
			],
			causeEffectData: {
            showSign:false,
            leftButton: false,
            rightButton: false,
            width: 0,
            middleWidth: 360,
            boxWidth: 490,
            N: 3,
            divUlWidth: '0px',
            divUlMarginLeft: '0px',
            detailList:[],
          list: [{
              time: '2012/12/12',
              source: '环球网',
              title: '《Palantir技术探秘》《Palantir技术探秘》《Palantir技术探秘》',
              percent: '95%',
              others:['测试数据11',{ces:'测试数据22'}],
            },
            {
              time: '2013/12/12',
              source: '222222环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '21%',
              others:['测试数据11',{ces:'测试数据22'}],
            },
            {
              time: '2014/12/12',
              source: '333333333环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '43%',
              others:['测试数据11',{ces:'测试数据22'}],
            },
            {
              time: '2015/12/12',
              source: '44444444444环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '54%',
              others:['测试数据11'],
            },
            {
              time: '2016/12/12',
              source: '5555555555环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '24%',
              others:['测试数据22'],
            },
            {
              time: '2017/12/12',
              source: '666666666666环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '67%',
              others:[],
            },
            {
              time: '2018/12/12',
              source: '7777777777777环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '65%',
              others:[],
            },
            {
              time: '2019/12/12',
              source: '环球网',
              title: '《Palantir技术探秘》《Palantir技术探秘》《Palantir技术探秘》',
              percent: '36%',
              others:[],
            },
            {
              time: '2020/12/12',
              source: '222222环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '81%',
              others:[],
            },
            {
              time: '2021/12/12',
              source: '333333333环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '32',
              others:[],
            },
            {
              time: '2022/12/12',
              source: '44444444444环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '57%',
              others:[],
            },
            {
              time: '2023/12/12',
              source: '5555555555环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '98%',
              others:[],
            },
            {
              time: '2024/12/12',
              source: '666666666666环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '43%',
              others:[],
            },
            {
              time: '2025/12/12',
              source: '7777777777777环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '75%',
              others:[],
            },
            {
              time: '2026/12/12',
              source: '环球网',
              title: '《Palantir技术探秘》《Palantir技术探秘》《Palantir技术探秘》',
              percent: '95%',
              others:[],
            },
            {
              time: '2027/12/12',
              source: '222222环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '34',
              others:[],
            },
            {
              time: '2028/12/12',
              source: '333333333环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '67%',
              others:[],
            },
            {
              time: '2029/12/12',
              source: '44444444444环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '91%',
              others:[],
            },
            {
              time: '2030/12/12',
              source: '5555555555环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '58%',
              others:[],
            },
            {
              time: '2031/12/12',
              source: '666666666666环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '99%',
              others:[],
            },
            {
              time: '2032/12/12',
              source: '7777777777777环球网2',
              title: '《Palantir技术探秘2》《Palantir技术探秘2》《Palantir技术探秘2》',
              percent: '78%',
              others:[],
            }
          ]
        }
	
		};
	},
	methods: {
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
					_self.docListTable.data = d.data.data.data;
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
		handleSerchEvent () {
			this.docListTable.page.currentPage = 1;
			// this.$message("处理检索事件");
			this.updateDocList();
		},

		updateTableData (query) {
      query = query || this.dsl || {};
      var _self = this;
      this.adapter.cbjlDataTable({}, function (d) {
        console.log(d,"eeeeeeeeeeeeeeeeeee")
        var tData = d.data;
        //var checkState = dictMap.data.dbrw_rwzt;
        //var typeMap = dictMap.data.bglx
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
          // item.mj = dictMap.data.mj[item.mj] || item.mj;
          return item;
        });
        _self.tableInfo.data = t;
        _self.tableInfo.page = tData.pager;
      });
      this.dsl = query;
    },

		// 筛选条件变化
		dealChangeEvent (d) {
      var dsl = this.util.getConditionParam(d);
      if (dsl.rang_search) {
        var tt = JSON.parse(dsl.rang_search);
        // if (tt.create_time) {
        //   tt.create_time.start = tt.create_time.start.split("T")[0];
        //   tt.create_time.end = tt.create_time.end.split("T")[0];
        //   tt.create_time.format = 'date';
        //   dsl.rang_search = JSON.stringify(tt);
        // }
      }
      dsl.pageNo = 1;
      dsl.pageSize = this.pageSize;
      this.updateTableData(dsl);
      /*dsl.rang_search = '{}';*/
      this.dsl = dsl;
    },

		updateList(query){
      let _this = this;
      query = query || this.dsl || {};
      this.adapter.cbjlDataTable(query,function(res){
        if(res.data.code === 200){
          _this.tableInfo.data = res.data.data.records;
          _this.tableInfo.page.total = 100;
        }
      })
    },

		dealSearchEvent (param) {
      let searchVal = this.searchType.value;
      let oJson = {};
      oJson.keyWord = JSON.stringify(searchVal);
      // this.updateList(oJson);
    },

		// searchitem组件筛选条件和关键词搜索重置
    clearItem () {
      this.searchType.value = '';
      // this.dsl.search = "{}";
      this.updateTableData();
    },

		dealButtonClick (name, d) {
			if (name && typeof (this[name]) === "function") {
				this[name](d);
			}
		},

		// tab切换
		handleClick(tab, event) {
			// console.log(tab, event);
			console.log(this.activeName)
		},

		// 表格分页相关方法
		dealSelectionChange (val) {
			console.log(val)
		},
		dealSortChange (param) {
			console.log(param)
		},
		dealCellClick (row, column, cell, event) {
			console.log(row, column, cell)
		},
		//页码切换
		dealPageChange (current, size) {
			this.docListTable.page.currentPage = current;
			// this.docListTable.page.pageSize = size;
			console.log(this.current)
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

		// 查看
		checkedData (d) {
      this.$confirm('是否查看该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: ' 查看成功!'
          });
        }).catch(() => {});
		},
	},
};

</script>

<style scoped>
* {
	box-sizing: border-box;
	list-style: none;
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
/deep/ .el-timeline-item__timestamp.is-top {
	position: absolute;
	left: -117px;
	top: 24px;
	color: #333333;
}
/deep/ .el-timeline {
	padding-left: 600px;
}
/deep/ .el-timeline-item__content{
	min-width: 500px;
	width: 50%;
}
/deep/ .el-timeline-item__wrapper{
	top:-30px;
}
.odd-item /deep/ .el-timeline-item__wrapper{
	left:-600px;
}
.odd-item /deep/ .el-timeline-item__timestamp.is-top{
	left: 672px;
}
</style>
