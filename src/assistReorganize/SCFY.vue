<template>
  <div style="height: 100%;">
    <div class="mainArea"
         style="width: 100%; height: calc( 100% - 56px ); position: relative;">
      <div class="optionArea">
        <el-select v-model="forgein"
                   size="small"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <i style="margin: 0px 20px;"
           class="el-icon-d-arrow-right">中文</i>
        <el-button size="small"
                   :loading="submitInputLoading"
                   @click="submitInput"
                   type="primary">翻译</el-button>
      </div>
      <div class="contentArea">
        <div class="leftArea">
          <el-input type="textarea"
                    :autosize="{ minRows: 15}"
                    placeholder="请输入内容"
                    v-model="original"
                    class="textareaInput"
                    ref="textAreaValue"></el-input>
        </div>
        <div class="rightArea">
          <div class="resultArea">
            <div v-for="d in translation">
              <div v-if="state">
                <div v-for="ds in d"
                     class="activeStyle">
                  <p style="color:#1890ff">{{ds.src}}</p>
                  <p>{{ds.tgt}}</p>
                </div>
              </div>
              <div v-else>
                <span v-for="ds in d"
                      class="activeStyle"
                      @mouseover="textLight(ds.src)"
                      @mouseout="clearTextLight">{{ds.tgt}}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      <p style="text-align: right; padding-right: 30px; font-size: 13px;">
        双语对照
        <el-switch v-model="state"
                   active-color="#13ce66"
                   inactive-color="#ff4949"></el-switch>
      </p>
    </div>
  </div>
</template>
<style scoped>
* {
  box-sizing: border-box;
}

.textareaInput >>> .el-textarea__inner {
  height: 100% !important;
  font-size: 16px;
}

.textareaInput {
  font-size: 16px;
  height: 100%;
}

.contentArea {
  height: calc(100% - 90px);
  position: relative;
  overflow: hidden;
}

.optionArea {
  padding: 15px;
  text-align: center;
}

.optionArea .el-select {
  width: auto;
}

.contentArea > div {
  width: 50%;
  padding: 10px 30px 3px 30px;
  height: 100%;
  position: relative;
  float: left;
  box-sizing: border-box;
  overflow: hidden;
}

.rightArea > div {
  border-radius: 5px;
  border: solid 1px #ddd;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 5px 15px;
  overflow: auto;
}

.resultArea > div {
  margin-bottom: 15px;
  font-size: 16px;
}

.mainArea {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
}
.activeStyle:hover {
  background: rgba(101, 162, 240, 0.4);
}
.textareaInput >>> .el-textarea__inner::selection {
  background: rgba(101, 162, 240, 0.4);
}
.textareaInput >>> .el-textarea__inner::-moz-selection {
  background: rgba(101, 162, 240, 0.4);
}
</style>
<script>
// import FormItemCard from "../components/FormItemCard";
// import DataTableItem from "../components/DataTableItem";

export default {
  components: {
    // FormItemCard,
    // DataTableItem
  },
  name: "FYGJ",
  props: {},
  mounted () {
    this.updateOptionItems();
  },
  methods: {
    recoverInputArea () { },
    submitInput () {
      this.submitInputLoading = true
      if (this.forgein == 'auto') {
        var _self = this
        this.adapter.dxscDetailDetect({
          "targetLangCode": "zh",
          "domainCode": "gen",
          "text": this.original
        },
          function (d) {
            _self.submitInputLoading = false
            if (d.data.success) {
              _self.translation = d.data.result.transResults
            } else {
              _self.$message({
                message: d.data.errorDesc,
                type: 'warning'
              })
            }
          })
      } else {
        var _self = this
        this.adapter.fygjTxtDetect({
          "sourceLangCode": this.forgein,
          "targetLangCode": "zh",
          "domainCode": "gen",
          "transText": this.original
        },
          function (d) {
            _self.submitInputLoading = false
            if (d.data.success) {
              _self.translation = d.data.result.transResults
            } else {
              _self.$message({
                message: d.data.errorDesc,
                type: 'warning'
              })
            }
          })
      }
    },
    updateOptionItems (value) {
      var _self = this;
      if (!this.dataMap) {
        this.util.getDictDataMap(function (d) {
          _self.dataMap = d;
          _self._updateOptionItems(_self.dataMap["sys_yz"], value);
        });
      } else {
        this._updateOptionItems(_self.dataMap["sys_yz"], value);
      }
    },
    _updateOptionItems (map, value) {
      this.options = [
        {
          label: "自动检测语种",
          value: "auto"
        }
      ];
      for (var k in map) {
        if (k !== "cn") {
          //与通用翻译接口文档做一致性处理
          //日语jp->ja 韩语kor->ko
          if (k == 'jp') {
            this.options.push({ label: map[k], value: 'ja' });
          } else if (k == 'kor') {
            this.options.push({ label: map[k], value: 'ko' });
          } else {
            this.options.push({ label: map[k], value: k });
          }
        }
      }
      this.forgein = value || this.forgein;
    },
    textLight (txt) {
      var textNode = this.$refs.textAreaValue.$el.children[0]
      textNode.selectionStart = this.$refs.textAreaValue.value.indexOf(txt)
      textNode.selectionEnd = this.$refs.textAreaValue.value.indexOf(txt) + txt.length
      textNode.focus()
    },
    clearTextLight () {
      var textNode = this.$refs.textAreaValue.$el.children[0]
      textNode.selectionStart = 0
      textNode.selectionEnd = 0
      textNode.focus()
    }
  },
  data: function () {
    return {
      state: false,
      translation: [],
      original: "",
      options: [],
      forgein: "auto",
      submitInputLoading: false
    };
  }
};
</script>


