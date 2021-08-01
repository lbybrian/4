<template>
	<div style="padding-top: 10px; margin-top: 0px; height: 100%; position: relative;">
		<el-row style="margin-top: 0px; height: 100%;" :gutter="5">
			<el-col :span="24" style="height: 100%; ">
				<div class="documentList">
					<el-card shadow="always" style="margin-top: 20px;">
						<div class="dataFilterArea">
							<el-row :gutter="20">
								<el-col :span="22">
									<SearchItem :searchType="searchType"
											@submitSearchInput="dealSearchEvent"
											@reset="clearItem"
											style="min-width: 60%; float: left; margin: 10px 0px; " />
									<SearchCondition :conditions="conditions"
											@onChange="dealChangeEvent"
											style="margin-bottom: 10px;" />
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<el-tabs v-model="activeName" class="el-menu-demo" mode="horizontal"  @tab-click="handleClick">
							<el-tab-pane label="全部" name="all">
								<el-button type="primary" icon="el-icon-edit" 
								size="mini" style="float: right; margin-bottom: 10px; margin-right: 10px;" @click="removeEdit">
								去重修改</el-button>
								<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
									<DataTable ref="docListItem" :dataObj="docListTable" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
								</div>
							</el-tab-pane>
							<el-tab-pane label="标识" name="bs">
								<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
									<DataTable ref="docListItem" :dataObj="docListTable" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
								</div>
							</el-tab-pane>
							<el-tab-pane label="属性" name="sx">
								<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
									<DataTable ref="docListItem" :dataObj="docListTable" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
								</div>
							</el-tab-pane>
							<el-tab-pane label="业务" name="yw">
								<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
									<DataTable ref="docListItem" :dataObj="docListTable" @button-click="dealButtonClick" @page-change="dealPageChange" @size-change="dealSizeChange" @sort-change="sortChange"></DataTable>
								</div>
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
			activeName:'all', 
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
				// q: _self.dataFilter.keyword,
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

		//搜素
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
			console.log('22',this.searchType)
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
			console.log(this.activeName);
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

		// 去重修改
		removeEdit(){
			this.$confirm('是否去重修改该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '去重修改成功!'
          });
        }).catch(() => {});
		},
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
	top: -3px;
	color: #333333;
}
/deep/ .el-timeline {
	padding:0 150px;
}
/deep/ .el-tabs__header .is-top{
	padding:0 16px;
}
</style>
