<template>
  <div :searchType="searchType"  style="position: relative;">
    <el-row>
      <el-col :span="9" v-if="searchType.options.length > 1">
        <el-row style="line-height: 2">
          <el-col :span="24">
            <label>筛选条件:</label>
            <el-select lable="" size="mini" v-model="searchType.select" style="width: calc( 100% - 80px );"  multiple filterable allow-create default-first-option placeholder="请选择筛选条件">
              <el-option v-for="item in searchType.options" :key="item.value ||item" :label="item.label||item" :value="item.value||item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="9" :offset="0">
        <el-row style="line-height: 2">
          <el-col :span="24">
            <label style="float:left">关键词搜索：</label>
            <el-input label="" style="width: calc( 100% - 100px );"  placeholder="请输入内容" v-model="searchType.value" size="mini" clearable></el-input>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4" :offset="0">
        <el-button @click="$emit('submitSearchInput')" type="primary" size="mini">搜索</el-button>
        <el-button @click="$emit('reset')" type="primary" size="mini">重置</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "SearchItem",
  data() {
    return {
      value: "",
      select: ""
    };
  },
  watch: {
    // "searchType.value"(v) {
    //   this.$emit('submitSearchInput');
    // }
  },
  created(){

  },
  props: {
    searchType: Object
  }
};
</script>

<style scoped>
.el-select {
  width: 100px;
}
.el-select .el-input {
  width: 80px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
