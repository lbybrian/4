<template>
	<div class="containerArea">
		<el-table v-if="isShow" :data="dataInfo.data" ref="dataTableItem" :height="dataInfo.height" :max-height="dataInfo.maxHeight" :stripe="dataInfo.stripe || false" :border="dataInfo.border || false" :empty-text="dataInfo.emptyText || '暂无数据'" :fit="dataInfo.fit === undefined ? true : dataInfo.fit" :highlight-current-row="dataInfo.heightCurrentRow" :show-header="dataInfo.showHeader === undefined ? true : dataInfo.showHeader" @selection-change="handleSelectionChange" @cell-click="dealCellClick" @sort-change="dealSortChange" @current-change="dealHighlightChange" style="width: 100%" v-loading="dataInfo.loading" element-loading-text="拼命加载中" :header-cell-style="{background:'#fbfbfb'}">
			<el-table-column v-if="dataInfo.withSelection" type="selection" width="50" align="center"></el-table-column>
			<el-table-column v-if="dataInfo.withIndex" label="" type="index" align="center"></el-table-column>
			<slot v-for="d in dataInfo.header">
				<el-table-column :sortable="d.sortable" :align="d.align" :prop="d.prop" :label="d.label" :fixed="d.fixed" :header-align="d.headerAlign || d.align" :width="d.width" :index="d.index" :min-width="d.minWidth" :show-overflow-tooltip="d.showOverflowTooltip" :class-name="d.className" :resizable="d.resizable">
					<template slot-scope="scope">
						<slot v-if="!!d.buttons">
							<slot v-for="t in d.buttons">
								<el-button @click="
                    dealClickButton(
                      t.eventName || t.label,
                      scope.row,
                      scope.$index
                    )
                  " v-if="
                    !t.condition ||
                    (scope.row[d.prop].constructor.name === 'Array' &&
                      scope.row[d.prop].indexOf(t.condition) !== -1) ||
                    (scope.row[d.prop].constructor.name === 'String' &&
                      scope.row[d.prop] === t.condition)
                  " :type="t.type || 'text'" :class="t.class" :size="t.size || 'small'">
									{{ t.text }}
								</el-button>
							</slot>
						</slot>
						<slot v-else-if="!!d.radios">
							<el-radio-group size="small" v-if="!!scope.row[d.radios]" v-model="scope.row.value" @change="dealRadioChange(scope.row,scope.$index)">
								<el-radio v-for="r in scope.row[d.radios]" :key="r.label" :label="r.label" border style="margin: 0 0 10px 0">{{r.name}}</el-radio>
							</el-radio-group>
							<span v-else-if="!d.style" :prop="d.prop">{{
                scope.row[d.prop]
              }}</span>
							<div v-else :prop="d.prop" :style="d.style">
								<span :prop="d.prop">{{ scope.row[d.prop] }}</span>
							</div>
						</slot>
            <slot v-else-if="!!d.tag">
              <el-tag  :effect="d.effect"  :type="tagFun(d.tagData,scope.row[d.prop]).type" :prop="d.prop">{{ tagFun(d.tagData,scope.row[d.prop]).label }}</el-tag>
						</slot>
						<slot v-else>
							<span v-if="!!d.hightLightStyle" :prop="d.prop" v-html="scope.row[d.prop]"></span>
							<div v-else-if="!!d.style" :prop="d.prop" :style="d.style">
								<span :prop="d.prop">{{ scope.row[d.prop] }}</span>
							</div>
							<span v-else :prop="d.prop">{{
                scope.row[d.prop]
              }}</span>
						</slot>
					</template>
				</el-table-column>
			</slot>
		</el-table>
		<slot v-if="!!dataInfo.page">
			<el-pagination :style="dataInfo.style || 'margin-top: 10px;text-align:right'" :page-size="dataInfo.page.pageSize || 20" :page-sizes="dataInfo.page.sizes || [10, 20, 50, 100]" :pager-count="5" :current-page="dataInfo.page.currentPage" :page-count="dataInfo.page.count || 1" :layout="dataInfo.page.layout || 'prev, pager, next, sizes'" :total="dataInfo.page.total || 0" :background="dataInfo.page.background" @size-change="dealSizeChange" @current-change="dealPageChange">
			</el-pagination>
		</slot>
	</div>
</template>

<script>
export default {
	name: "",
	beforeMount () {
		if (this.dataObj) {
			this.dataInfo = this.dataObj;
		}
	},
	data () {
		return {
			isShow: true,
			//表格参数
			dataInfo: {
				//表格是否带checkbox
				withSelection: true,
				//表格是否带索引
				withIndex: true,
				//表格头部配置信息
				header: [{
					prop: "date",
					label: "XX",
					width: "180",

				},
				{
					prop: "name",
					label: "XX",
					width: "180",
					align: "center",
				},
				{
					prop: "address",
					label: "XX",
				},
				],
				data: [],
				//表格的分页参数配置
				page: {
					sizes: [20, 50, 100, 200],
					count: 1,
					layout: "prev, pager, next",
					total: 200,
					background: false,
				},
				loading: true
			},

		};
	},
	watch: {},
	mounted () {
		this.tableItem = this.$refs.dataTableItem;
	},
	methods: {
		//更新表格区域信息
		updateData (newObj) {
			this.isShow = false;
			this.$nextTick(function () {
				this._updateData(newObj);
				this.isShow = true;
			});
		},
		//更新表格数据
		_updateData (newObj) {
			for (var k in newObj) {
				this.$set(this.dataInfo, k, newObj[k]);
			}
		},
		//清除选中状态
		clearSelection () {
			this.tableItem.clearSelection();
		},
		//设置选中行
		dealHighlightChange (val) {
			this.$emit("highlightChange", val);
		},
		//设置当前行尾选中状态
		setCurrentRow (row) {
			this.tableItem.setCurrentRow(row);
		},
		//选中和非选中切换
		toggleRowSelection (row, selected) {
			this.tableItem.toggleRowSelection(row, selected);
		},
		//清楚表格排序
		clearSort () {
			this.tableItem.clearSort();
		},
		//响应复选状态变化
		handleSelectionChange (val) {
			this.dataInfo.selected = val;
			this.$emit("selection-change", val);
		},
		//响应表格分页条数变化
		dealSizeChange (val) {
			this.dataInfo.page.pageSize = val;
			this.dataInfo.page.current = 1;
			this.$emit("size-change", this.dataInfo.page.current || 1, val);
		},
		//响应表格当前页码变化
		dealPageChange (val) {
			this.dataInfo.page.current = val;
			this.$emit("page-change", val, this.dataInfo.page.pageSize);
		},
		//响应点击单元格事件
		dealCellClick (row, column, cell, event) {
			this.$emit("cell-click", row, column, cell, event);
		},
		//响应表格中按钮点击事件
		dealClickButton (eventName, row, index) {
			this.$emit("button-click", eventName, row, index);
		},
		//响应排序事件
		dealSortChange (param) {
			this.$emit("sort-change", param);
		},
		// 表格中存在radio时响应事件
		dealRadioChange (row, index) {
			console.log(row, index)
		},
    tagFun(a,b){
      for (const key of a) {
        if (key.value == b) {
          return key
        }
      }
    }
	},
	created () { },
	props: {
		dataObj: Object,
	},
};

</script>

<style scoped>
.containerArea {
	width: 100%;
	height: 100%;
}

.containerArea /deep/ .el-pagination {
	padding-left: 0px;
	padding-right: 0px;
}

.containerArea /deep/ .el-pagination__sizes {
	margin-right: 0px;
}

.containerArea /deep/ .el-pagination .el-select .el-input {
	margin-right: 0px;
}
</style>
