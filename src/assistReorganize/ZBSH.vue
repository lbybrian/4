<template>
	<div style="padding: 10px 0;">
		<el-card shadow="always" style="margin-top: 20px;">
			<div class="topArea">
				<el-link class="downloadBtn" style="margin-top: 7px;" :download="downloadName" :disabled="downloadDisabled" :href="downloadUrl" size="mini" type="primary">批量下载</el-link>
				<el-input placeholder="请输入内容" v-model="searchType.value" class="input-with-select searchItem" size="small">
					<el-button @click="dealSearchEvent" slot="append" icon="el-icon-search"></el-button>
				</el-input>
				<el-button class="freshListBtn" size="small" @click="updateTableData" type="primary">刷新列表</el-button>

			</div>
		</el-card>
		<el-card shadow="always" style="margin-top: 20px;">
			<DataTableItem class="tableItem" @pageChange="dealPageChange" @selectChange="dealSelectChange" @buttonClick="dealButtonClick" :tableInfo="tableInfo" />
		</el-card>
	</div>
</template>

<script>
import DataTableItem from "../assistReorganizeCommon/DataTableItem";

export default {
	components: {
		DataTableItem
	},
	name: "",
	beforeMount () {
		// this.getDictData();
	},
	mounted () {
		this.updateTableData();
	},
	methods: {
		dealSearchEvent () {
			var query = {
				title: this.searchType.value
			};
			this.updateTableData({ search: JSON.stringify(query) });
		},
		viewItem (param) {
			var url = this.adapter.config.previewPdf.url + param.id;
			localStorage.setItem("currentReportData", JSON.stringify(param));
			this.$router.push({
				path: `/ylwd?from=cbjl`
			});
		},
		getDictData (callback) {
			var _self = this;
			this.adapter.queryDictData({}, function (d) {
				let arr = d.data.data.bglx;
				_self.dictMap = {};
				for (var i = 0; i < arr.length; i++) {
					var key = arr[i].value;
					_self.dictMap[key] = arr[i].name;
				}
				if (typeof callback === "function") {
					callback();
				}
			});
		},
		updateTableData (dsl) {
			if (this.dictMap) {
				this._updateTableData(dsl);
			} else {
				var _self = this;
				this.getDictData(function () {
					_self._updateTableData(dsl);
				});
			}
		},
		_updateTableData (dsl) {
			var _self = this;
			dsl = dsl || {};
			this.adapter.pressRecordTable(dsl, function (d) {
				var tData = d.data;
				var t = tData.data.map(item => {
					return {
						id: item.id,
						title: item.title,
						time: item.create_time,
						author: item.create_by || "",
						type: dictMap.data[item.bglx],
						size: item.words || ""
					};
				});
				_self.tableInfo.data = t;
				_self.tableInfo.page = tData.pager;
			});
			this.dsl = dsl;
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
			this.adapter.downloadMultiRecord(
				{
					id_paths: ids
				},
				function (res) {
					const fileName = "报告记录压缩包";
					const content = res.data;
					_self.util.downloadItem(fileName, content);
				}
			);
		},
		downloadItem (param) {
			var _self = this;
			this.adapter.downloadMould(
				{
					id_path: param.id
				},
				function (res) {
					const fileName = param.title + ".doc";
					const content = res.data;
					_self.util.downloadItem(fileName, content);
				}
			);
		},
		dealButtonClick (name, param) {
			var _self = this;
			if (name && typeof this[name] === "function") {
				this[name](param);
			}
		},
		dealPageChange (val) {
			var dsl = this.dsl;
			dsl.pageNo = val;
			this.updateTableData(dsl);
		},
		dealSelectChange (val) {
			this.downloadUrl = "";
			if (this.tableInfo.value.length !== 0) {
				var ids = JSON.stringify(this.tableInfo.value);
				this.downloadUrl = this.adapter.config.downloadMultiRecord.url;
				this.downloadUrl += "?id_paths=" + ids;
				var token = localStorage.getItem("token");
				if (token) {
					this.downloadUrl += "&token=" + token;
				}
				this.downloadDisabled = false;
			}
			else {
				this.downloadDisabled = true;
			}
		}
	},
	data: function () {
		return {
			searchType: {
				value: "",
				select: "",
				options: [
					{
						label: "标题",
						value: 1
					},
					{
						label: "摘要",
						value: 2
					},
					{
						label: "正文",
						value: 3
					},
					{
						label: "来源",
						value: 4
					},
					{
						label: "作者",
						value: 5
					}
				]
			},
			downloadUrl: "",
			downloadName: "成品报文压缩包.zip",
			downloadDisabled: true,
			activeName: "first",
			dictMap: null,
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
						prop: "title",
						label: "序号",
						type: "index",
						width: 2,
						style: "color: #999; text-align: center;"
					},
					{
						prop: "title",
						label: "报告标题",
						style: "text-align: left; font-weight: 700;",
						width: 7
					},
					{
						prop: "type",
						label: "报告类型",
						width: 3
					},
					{
						prop: "time",
						label: "出报时间",
						width: 3
					},
					{
						prop: "author",
						label: "编者",
						width: 2
					},
					{
						prop: "size",
						label: "字数统计",
						width: 2
					},
					{
						prop: "id",
						label: "查看/下载",
						width: 2,
						content: "",
						buttons: [
							{
								type: "icon",
								class: "el-icon-view",
								name: "查看",
								eventName: "viewItem",
								text: ""
							},
							{
								type: "icon",
								class: "el-icon-download",
								name: "下载",
								eventName: "downloadItem",
								text: ""
							}
						]
					}
				],
				data: []
			}
		};
	}
};
</script>

<style scoped>
.topArea {
	width: 100%;
	position: relative;
	float: left;
	margin-bottom: 20px;
}

.searchItem {
	width: 200px;
	float: right;
}

.downloadBtn {
	float: left;
	margin-left: 10px;
}

.freshListBtn {
	float: right;
	margin-right: 10px;
}

/* .tableItem {
  margin-top: 180px;
} */
</style>

