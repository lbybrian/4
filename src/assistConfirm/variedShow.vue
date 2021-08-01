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
									<SearchItem :searchType="searchType"
											@submitSearchInput="dealSearchEvent"
											@reset="clearItem"
											style="min-width: 60%; float: left; margin: 10px 0px; " />
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

export default {
	name:'dataPretreatment',
	components: {
		DataTable,
		SearchCondition,
		SearchItem
	},
	beforeMount () {

	},
	mounted () {

	},
	data () {
		return {
			activeName:'listData', //listData  sequential
			//文档查询筛选参数配置项
			searchType: {
        value: "",
        select: "title",
				options: [
          // {
          //   label: "情报主题",
          //   value: "title"
          // }
        ]
      },
			//文档表格配置参数项
			docListTable: {
				withSelection: true,
				// withIndex: true,
				heightCurrentRow: true,
				header: [{
					prop: "qbzt",
					label: "情报主题",
					minWidth: "100",
					align: "center",
				},
				{
					prop: "qbnr",
					label: "情报内容",
					minWidth: "300",
					align: "left",
					showOverflowTooltip:true,
				},
				{
					prop: "qbfl",
					label: "情报分类",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "time",
					label: "时间",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "sjr",
					label: "收集人",
					minWidth: "160",
					align: "center",
				},
				{
					prop: "date",
					label: "操作",
					width: "300",
					align: "center",
					//表格中数据行中的按钮列表
					buttons: [
						{
							text: "查看",
							eventName: "checkedData"
						},
						{
							text: "编辑",
							eventName: "editData"
						},
					],
				},
				],
				data: [
					{
						qbzt:'情报主题000',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						qbfl:'分类一',
						time:'2021/3/30',
						sjr:'张三'
					},
					{
						qbzt:'情报主题000',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						qbfl:'分类二',
						time:'2021/3/30',
						sjr:'张三'
					},
					{
						qbzt:'情报主题000',
						qbnr:'在全球供应链已经受到疫情影响的情况下，约占全球贸易12%的苏伊士运河发生堵塞，导致全球供应链压力进一步加大。一些船只已经选择绕行非洲南端，但会使得其旅程变得漫长而昂贵。',
						qbfl:'分类一',
						time:'2021/3/30',
						sjr:'张三'
					},
					{
						qbzt:'情报主题000',
						qbnr:'内容内容4',
						qbfl:'分类五',
						time:'2021/3/30',
						sjr:'张三'
					},
					{
						qbzt:'情报主题000',
						qbnr:'内容内容5',
						qbfl:'分类七',
						time:'2021/3/30',
						sjr:'张三'
					},
					{
						qbzt:'情报主题000',
						qbnr:'内容内容6',
						qbfl:'分类八',
						time:'2021/3/30',
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
          name: "分类",
          value: [0,1,2,3],
          checkAll: false,
          type: "checkbox",
          key: "bglx",
          items: ["分类一", "分类二", "分类三", "分类四"]
        },
        {
          name: "主题",
          value: [0,1,2,3,4],
          type: "checkbox",
          checkAll: false,
          key: "status",
          dict: "dbrw_rwzt",
          items: ["主题一", "主题二", "主题三", "主题四"]
        },
        {
          name: "标签",
          value: [0,1,2,3,4],
          type: "checkbox",
          checkAll: false,
          key: "mj",
          items: ["标签一", "标签二", "标签三", "标签四"]
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
			]
	
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
		dealChangeEvent (d) {
			console.log('111',d)
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

		//searchitem组件筛选条件
		dealSearchEvent (param) {
      let searchVal = this.searchType.value;
			console.log(searchVal)
      let oJson = {};
      oJson.keyWord = JSON.stringify(searchVal);
      this.updateList(oJson);
    },

		// 关键词搜索重置
    clearItem () {
      this.searchType.value = '';
      this.dsl.search = "{}";
      this.updateTableData();
    },

		dealButtonClick (name, d) {
			if (name && typeof (this[name]) === "function") {
				this[name](d);
			}
		},

		// tab切换
		handleClick(tab, event) {
			console.log(tab, event);
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

		//查看
		checkedData(){
			this.$confirm('是否查看该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '点击查看成功!'
          });
        }).catch(() => {});
		},

		//编辑
		editData(){
			this.$confirm('是否编辑该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          });
        }).catch(() => {});
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
