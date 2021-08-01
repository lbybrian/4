<template>
  <div :dataItems="dataItems" style="margin: 10px 0px; padding-bottom: 10px; ">
    <p style="padding: 10px 0px;">
      <label style="cursor: pointer;">
        <el-checkbox
          v-model="dataItems.checkAll"
          :indeterminate="dataItems.isIndeterminate"
          name="type"
          label
          @change="handleCheckAllChange"
          style="display: inline-block; margin-right: 5px;"
        ></el-checkbox>全部
      </label>
    </p>

    <div class="dataItemsList">
      <el-row :gutter="20" class="tableContent tableRow">
        <el-col v-for="(d, index) in dataItems.data" :span="4" :key="d.id">
          <el-card :body-style="{ padding: '0px' }">
            <img
              :src="adapter.config.fileCaptrue.url + '/' + d.id"
              class="image"
              width="100%"
              height="200px"
            />
            <div style="padding: 14px;">
              <label style="cursor: pointer; display: inline-block; text-align: center; width: 100%; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;">
                <el-checkbox
                  @change="handleCheckedChange(d)"
                  v-model="d.isChecked"
                  :key="d.id"
                  label
                  name="type"
                  style="display: inline-block;"
                ></el-checkbox>
                <span>{{d.title}}</span>
              </label>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      v-if="dataItems.page && dataItems.page.total"
      class="tablePagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataItems.page.total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<style>
.dataItemsList {
  padding: 10px 0px 5px 0px;
  border-bottom: solid 1px #eee;
}
.tableContent:first {
  border: none;
}
.tableHeader {
  font-weight: 700;
  box-shadow: 0px 2px 0px #eee;
}

.tablePagination {
  margin: 10px 0px;
}
</style>

<script>
export default {
  name: "DataItemList",
  props: {
    dataItems: Object
  },
  beforeMount() {
    this.updateSelected();
    this.info = this.dataItems;
    this.handleCheckedChange();
  },
  updated() {
    this.updateSelected();
  },
  methods: {
    handleRadioSelect(d) {
      this.dataItems.selectData = d;
    },
    updateSelected() {
      var count = 0;
      var value = this.dataItems.value;
      this.dataItems.data.forEach(item => {
        if (value.indexOf(item.id) !== -1) {
          this.$set(item, "isChecked", true);
          count++;
        } else {
          this.$set(item, "isChecked", false);
        }
      });
      if (count === 0) {
        this.dataItems.checkAll = false;
        this.dataItems.isIndeterminate = false;
      } else if (count === this.dataItems.data.length) {
        this.dataItems.checkAll = true;
        this.dataItems.isIndeterminate = false;
      } else {
        this.dataItems.checkAll = false;
        this.dataItems.isIndeterminate = true;
      }
      return count;
    },
    updateChecked() {
      var count = 0;
      this.info.value = [];
      this.info.data.map(item => {
        if (item.isChecked) {
          count++;
          this.info.value.push(item.id);
        }
      });
      return count;
    },
    handleCurrentChange(val) {
      this.$emit("pageChange", val);
    },
    emitClickEvent(name, param) {},
    handleCheckAllChange(val) {
      this.info.data.map(item => {
        this.$set(item, "isChecked", val);
      });
      this.info.isIndeterminate = false;
      this.updateChecked();
    },
    handleCheckedChange(val) {
      var count = this.updateChecked();
      this.info.isIndeterminate = count > 0 && count < this.info.data.length;
      if (!this.info.isIndeterminate) {
        this.info.checkAll = count === this.info.data.length;
      }
    }
  }
};
</script>
