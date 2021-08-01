<template>
  <div class="containerArea">
    <el-table v-if="isShow" :data="dataInfo.data" ref="dataTableItem" :height="dataInfo.height"
      :max-height="dataInfo.maxHeight" :stripe="dataInfo.stripe || false" :border="dataInfo.border || false"
      :empty-text="dataInfo.emptyText || '暂无数据'" :fit="dataInfo.fit === undefined ? true : dataInfo.fit"
      :highlight-current-row="dataInfo.heightCurrentRow"
      :show-header="dataInfo.showHeader === undefined ? true : dataInfo.showHeader"
      @selection-change="handleSelectionChange" @cell-click="dealCellClick" @sort-change="dealSortChange"
      @current-change="dealHighlightChange" style="width: 100%">
      <el-table-column v-if="dataInfo.withSelection" type="selection" width="50" align="center"></el-table-column>
      <el-table-column v-if="dataInfo.withIndex" label="" type="index" align="center"></el-table-column>
      <slot v-for="d in dataInfo.header">
        <el-table-column :sortable="d.sortable" :align="d.align" :prop="d.prop" :label="d.label" :fixed="d.fixed"
          :header-align="d.headerAlign || d.align" :width="d.width" :index="d.index" :min-width="d.minWidth"
          :show-overflow-tooltip="d.showOverflowTooltip" :class-name="d.className" :resizable="d.resizable">
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
                    (t.condition.constructor.name === 'Array' &&
                      t.condition.indexOf(scope.row[d.prop]) !== -1) ||
                    (t.condition.constructor.name === 'String' &&
                      t.condition === scope.row[d.prop])
                  " :type="t.type || 'text'" :class="t.class" :size="t.size || 'small'">
                  {{ t.text }}
                </el-button>
              </slot>
            </slot>
            <slot v-if="!!d.radios">
              <el-radio-group size="small" v-if="!!scope.row[d.radios]" v-model="scope.row.value"
                @change="dealRadioChange(scope.row,scope.$index)">
                <el-radio v-for="r in scope.row[d.radios]" :key="r.label" :label="r.label" border
                  style="margin: 0 0 10px 0">{{r.name}}</el-radio>
              </el-radio-group>
              <span v-else-if="!d.style" :prop="d.prop">{{
                scope.row[d.prop]
              }}</span>
              <div v-else :prop="d.prop" :style="d.style">
                <span :prop="d.prop">{{ scope.row[d.prop] }}</span>
              </div>
            </slot>
            <slot v-else>
              <span v-if="!d.style" :prop="d.prop">{{
                scope.row[d.prop]
              }}</span>
              <div v-else :prop="d.prop" :style="d.style">
                <span :prop="d.prop">{{ scope.row[d.prop] }}</span>
              </div>
            </slot>
          </template>
        </el-table-column>
      </slot>
    </el-table>
    <slot v-if="!!dataInfo.page">
      <el-pagination :style="dataInfo.style || 'margin-top: 10px;text-align:right'"
        :page-size="dataInfo.page.pageSize || 20" :page-sizes="dataInfo.page.sizes || [10, 20, 50, 100]"
        :pager-count="5" :current-page="dataInfo.page.currentPage" :page-count="dataInfo.page.count || 1"
        :layout="dataInfo.page.layout || 'prev, pager, next, sizes'" :total="dataInfo.page.total || 1000"
        :background="dataInfo.page.background" @size-change="dealSizeChange" @current-change="dealPageChange">
      </el-pagination>
    </slot>
  </div>
</template>

<script>
  export default {
    beforeMount() {
      if (this.dataObj) {
        this.dataInfo = this.dataObj;
      }
    },

    data() {
      return {
        isShow: true,
        dataInfo: {
          withSelection: true,
          withIndex: true,
          header: [{
              prop: 'name',
              label: '源文本-偏移',
              // width: "180",
              align: 'left',
            },
            {
              prop: 'size',
              label: '目标文本-偏移',
              // width: "180",
              align: 'center',
              radios: 'radios',
            },
          ],
          data: [{
              name: '苦行僧1',
              size: '2M',
              radios: [{
                label: "1",
                name: "标签1"
              }, {
                label: "2",
                name: "标签2"
              }],
              value: ''
            },
            {
              name: '苦行僧2',
              size: '2M',
              radios: [{
                label: "3",
                name: "标签3"
              }, {
                label: "4",
                name: "标签4"
              }],
              value: ''
            },
          ],
          page: {
            sizes: [20, 50, 100, 200],
            count: 1,
            layout: "prev, pager, next",
            total: 200,
            background: false,
          },
        },
      };
    },
    watch: {},
    mounted() {
      this.tableItem = this.$refs.dataTableItem;
    },
    methods: {
      updateData(newObj) {
        this.isShow = false;
        this.$nextTick(function () {
          this._updateData(newObj);
          this.isShow = true;
        });
      },
      _updateData(newObj) {
        for (var k in newObj) {
          this.$set(this.dataInfo, k, newObj[k]);
        }
      },
      clearSelection() {
        this.tableItem.clearSelection();
      },
      dealHighlightChange(val) {
        this.$emit("highlightChange", val);
      },
      setCurrentRow(row) {
        this.tableItem.setCurrentRow(row);
      },
      toggleRowSelection(row, selected) {
        this.tableItem.toggleRowSelection(row, selected);
      },
      clearSort() {
        this.tableItem.clearSort();
      },
      handleSelectionChange(val) {
        this.dataInfo.selected = val;
        this.$emit("selection-change", val);
      },
      dealSizeChange(val) {
        this.dataInfo.page.size = val;
        this.dataInfo.page.current = 1;
        this.$emit("size-change", this.dataInfo.page.current || 1, val);
      },
      dealPageChange(val) {
        this.dataInfo.page.current = val;
        this.$emit("page-change", val, this.dataInfo.page.size);
      },
      dealCellClick(row, column, cell, event) {
        this.$emit("cell-click", row, column, cell, event);
      },
      dealClickButton(eventName, row, index) {
        this.$emit("button-click", eventName, row, index);
      },
      dealSortChange(param) {
        this.$emit("sort-change", param);
      },
      dealRadioChange(row, index) {
        console.log(row, index)
      }
    },
    created() {},
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

  /deep/ .el-pagination {
    padding-left: 0px;
    padding-right: 0px;
  }

  /deep/ .el-pagination__sizes {
    margin-right: 0px;
  }

  /deep/ .el-pagination .el-select .el-input {
    margin-right: 0px;
  }

</style>
