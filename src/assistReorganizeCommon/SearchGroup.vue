<template>
  <div  style="position: relative;">
    <div style="float: left; position: relative; width: 100%;">
      <!--<el-input :disabled="mode !== 'simple'" style="width: calc( 100% - 280px ); margin-right: 10px; float: left;" placeholder="请输入内容" v-model="info.value" size="mini">-->
      <!--</el-input>-->
      <el-autocomplete
        size="mini"
        v-model="info.value"
        :disabled="mode === 'complex' && info.options[0].label !== '成品管理-成品库'||isAllDisable"
        style="width: calc( 100% - 280px ); margin-right: 10px; float: left;"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        placeholder="请输入内容"
        @select="handleSelect"
        @keyup.enter.native="handleSelect">
      </el-autocomplete>
      <el-button style="float: left;" @click="switchSearchMode" :disabled="isAllDisable" size="mini" type="text">{{switchBtnText}}</el-button>
      <el-button style="float: right;"  v-if="mode !== 'complex'" :disabled="isAllDisable" size="mini" @click="resetSearchItem()" >重置</el-button>
      <el-button style="float: right;" v-if="mode !== 'complex'" :disabled="isAllDisable" type="primary" size="mini" @click="submitSearchItem()" icon="el-icon-search">检索</el-button>
    </div>
    <div v-if="mode === 'complex'" style="margin-top: 10px; width: 100%; float: left;">
      <div v-for="(d, i) in info.inputArray" style="margin-bottom: 10px;">
        <el-select style="width: 145px;" v-model="d.select" size="mini"  placeholder="请选择" v-if="showAll">
          <el-option
            v-for="item in d.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input style="width: calc( 100% - 430px ); margin-right: 15px;"  v-model="d.value" size="mini"></el-input>
        <el-button v-if="i !== 0"  @click="removeInputItem(i)"  plain size="mini" icon="el-icon-minus" circle></el-button>
        <el-button v-if="showAll" plain size="mini" @click="addInputItem(i)" icon="el-icon-plus" circle></el-button>
      </div>
      <el-button style="float: right; margin-top: -40px; margin-right: 65px;"  type="primary" size="mini" @click="submitSearchItem()" icon="el-icon-search">检索</el-button>
      <el-button style="float: right; margin-top: -40px;"   size="mini" @click="resetSearchItem()" >重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var options = [{
      label: "标题",
      value: "title"
    }, {
      label: "摘要",
      value: "abstract"
    }];
    return {
      mode: "simple",
      switchBtnText: "高级检索",
      info: {
        value: "",
        options: options,
        inputArray: [{
          value: "",
          select: "",
          options: JSON.parse(JSON.stringify(options))
        }]
      },
      showAll:true,
      isAllDisable:false//是否全禁用
    };
  },
  created(){
    this.info.options = this.options || this.info.options;
    if(this.info.options[0].label == '成品管理-成品库'){
      this.showAll = false
      this.switchBtnText = '二次检索'
    }else{
      this.showAll = true
      this.switchBtnText = '高级检索'
    }
    var _self = this;
    this.info.inputArray = this.info.inputArray.map(item => {
      if(_self.options) {
        item.options = JSON.parse(JSON.stringify(_self.info.options));
      }
      item.select = item.options[0].value;
      return item;
    })
  },
  methods: {
    querySearchAsync(queryString, cb) {
      const API = '/api'
      if (queryString.trim() === '') {
        return
      }
      let params = {
        q: queryString,
        size: 10,
      }
      this.ajaxGET(API + '/cm/search_log/search/dic_search', params).then(r => {
        if (r.length > 0) {
          cb(r)
        } else {
          cb([])
        }
      }).catch(e => {
        this.$message({
          message: '请求下拉数据失败：' + e,
          type: 'warning'
        })
      })
    },
    handleSelect() {

    },
    submitSearchItem() {
      var ret = [];
      if(this.mode === "complex") {
        for(var i = 0; i < this.info.inputArray.length; i++) {
          var item = this.info.inputArray[i];
          if(item.value !== "") {
            var tItem = {};
            tItem.key = item.select.split(",");
            tItem.value = item.value.trim();
            ret.push(tItem);
          }
        }
      }
      else if(this.info.value) {
        ret.keyword = this.info.value.trim();
      }
      else {}
      this.info.input = ret;
      this.$emit("submitSearch", this.info, this.mode);
    },
    _submitSearchItem() {
      var ret = {};
      if(this.mode === "complex") {
        for(var i = 0; i < this.info.inputArray.length; i++) {
          var item = this.info.inputArray[i];
          if(item.value !== "") {
            ret[item.select] = ret[item.select] || [];
            ret[item.select].push(item.value);
          }
          if(this.info.value) {
            ret.keyword = this.info.value;
          }
        }
      }
      else if(this.info.value) {
        ret.keyword = this.info.value;
      }
      else {}
      this.info.input = ret;
      this.$emit("submitSearch", this.info, this.mode);
    },
    resetSearchItem() {
      this.info.value = "";
      this.info.inputArray.length = 1;
      for(var i = 0; i < this.info.inputArray.length; i++) {
        this.info.inputArray[i].value = "";
      }
      this.$emit("resetSearch", this.info, this.mode);
    },
    switchSearchMode() {
      if(this.mode === "complex") {
        this.mode = "simple";
        this.info.inputArray.length = 1;
        for(var i = 0; i < this.info.inputArray.length; i++) {
          this.info.inputArray[i].value = "";
        }
        if(this.info.options[0].label == '成品管理-成品库'){
          this.switchBtnText = '二次检索'
        }else{
          this.switchBtnText = '高级检索'
        }
      }
      else {
        this.mode = "complex";
        // this.info.value = "";
        this.switchBtnText= "普通检索";
        if(this.info.options[0].label != '成品管理-成品库'){
          this.info.value = "";
        }
      }
    },
    addInputItem(index) {
      index = index || 0;
      var item = {
        value: "",
        select: "",
        options: JSON.parse(JSON.stringify(this.info.options))
      }
      item.select = item.options[0].value;
      this.info.inputArray.splice(index + 1, 0, item);
    },
    removeInputItem(index) {
      if(index && typeof(index) === "number") {
        this.info.inputArray.splice(index, 1);
      }
    },
    //用于成品管理回显已添加数据
    changeInputValue(val){
      this.info.value = val
    },
    //用于文本素材高价值推荐时禁用searchgroup
    allDisable(val){
      this.isAllDisable = val
      if(val){
        this.resetSearchItem()
        this.mode = "simple";
        this.switchBtnText = '高级检索'
      }
    }
  },

  props: {
    options: Array
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
