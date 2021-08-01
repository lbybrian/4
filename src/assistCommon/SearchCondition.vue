<template>
  <div :conditions="conditionItems">
    <el-form ref="myFormItem"
             class="formItem"
             :label-width="labelWidth || '90px'"
             label-position="left"
             label-suffix=":">
      <slot v-for="(item, index) in conditions">
        <el-form-item class="formLine"
                      :label="item.name"
                      :key="item.key"
                      :dict="item.dict"
                      :prop="item.prop"
                      :myRequired="item.required || '0'"
                      style="margin-bottom: 0px; position: relative; float:left; width: 100%;">
          <div :style="item.style || {
          height: '40px',
          overflow: 'hidden',
          float: 'left'
          }">
            <el-checkbox v-if="item.type === 'checkbox' && item.checkAll !== undefined"
                         v-model="item.checkAll"
                         label="全部"
                         :indeterminate="item.isIndeterminate"
                         name="type"
                         :size="item.size || 'mini'"
                         @change="handleCheckAllChange(item)"></el-checkbox>
            <slot v-for="d in item.items">
              <slot v-if="!item.hideItems || (item.hideItems.indexOf(d) === -1)">
                <slot v-if="d.type === 'checkbox' || item.type === 'checkbox' ">
                  <el-checkbox @change="handleCheckedChange(item)"
                               v-model="item.value"
                               :label="d.name || d"
                               name="type"
                               :size="item.size || 'mini'"></el-checkbox>
                </slot>
                <slot v-else-if="d.type === 'radio' || item.type === 'radio' ">
                  <el-radio @change="$emit('onChange', conditions, 'radio', item)"
                            :value="d.value|| d"
                            v-model="item.value"
                            :label="d.value|| d"
                            :size="item.size || 'mini'"
                            name="type">{{d.name || d}}</el-radio>
                </slot>
                <slot v-else-if="d.type === 'switch' || item.type === 'switch' ">
                  <el-form-item :label="d.name"
                                prop="delivery">
                    <span v-if="d">{{d}}</span>
                    <el-switch @change="$emit('onChange', conditions, 'switch', item)"
                               active-color="#13ce66"
                               inactive-color="#ff4949"
                               :size="item.size || 'mini'"></el-switch>
                  </el-form-item>
                </slot>
                <slot v-else-if="d.type === 'dateRange' || item.type === 'dateRange' ">
                  <el-date-picker type="daterange"
                                  unlink-panels
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  :default-time="['', '']"
                                  :size="item.size || 'mini'"
                                  v-model="item.value"
                                  :picker-options="item.pickerOptions"
                                  value-format="yyyy-MM-dd"
                                  @change="$emit('onChange', conditions, 'dateRange', item)"></el-date-picker>
                </slot>
                <slot v-else-if="d.type === 'tags' || item.type === 'tags' ">
                  <el-tag class="eTagItem"
                          v-for="tag in item.value"
                          closable
                          :key="item.value"
                          :type="tag.type"
                          :size="item.size || 'mini'"
                          @close="handleRemoveTag(item, tag)"
                          style="margin-left: 5px;">{{tag.name}}</el-tag>
                </slot>
                <slot v-else-if="d.type === 'text' || item.type === 'text'">
                  <el-input :size="item.size || 'mini'"
                            v-model="item.value"
                            :disabled="d.disabled || item.disabled"
                            :placeholder="d.placeholder || item.placeholder"
                            @change="$emit('onChange', conditions, 'input', item.value)"></el-input>
                </slot>
                <slot v-else-if="d.type === 'select' || item.type === 'select' ">
                  <el-select :size="item.size || 'mini'"
                             v-model="item.value"
                             :multiple="item.multiple"
                             :disabled="d.disabled || item.disabled"
                             :placeholder="d.placeholder || item.placeholder"
                             @change="$emit('onChange', conditions, 'select', item.value)">
                    <el-option v-for="tItem in d.options"
                               :label="tItem.label || tItem"
                               :value="tItem.value || tItem"
                               :key="tItem.value"></el-option>
                  </el-select>
                </slot>
                <slot v-else-if="d.type === 'textarea' || item.type === 'textarea'">
                  <el-input type="textarea"
                            v-model="item.value"
                            :disabled="d.disabled || item.disabled"
                            :size="item.size || 'mini'"
                            :placeholder="d.placeholder"
                            @change="$emit('onChange', conditions, 'textarea', item.value)"></el-input>
                </slot>
                <slot v-else-if="d.type === 'datePicker' || item.type === 'datePicker'">
                  <el-date-picker v-model="item.value"
                                  :size="item.size || 'mini'"
                                  :format="d.format || item.format || 'yyyy-MM-dd HH:mm:ss'"
                                  :value-format="d['value-format'] || item['value-format'] || 'yyyy-MM-dd HH:mm:ss'"
                                  :type="(d.pickerType || item.pickerType) || 'datetime'"
                                  :placeholder="(d.placeholder || item.placeholder) || '选择日期时间'"
                                  @change="$emit('onChange', conditions, 'datePicker', item.value)"></el-date-picker>
                </slot>
              </slot>
            </slot>
          </div>
          <el-button v-if="item.status !== undefined"
                     class="opBtn"
                     @click="switchOptionsStatus(item)"
                     type="text"
                     size="mini">
            <span v-if="item.status === true">展开<i class="el-icon-arrow-down"></i></span>
            <span v-if="item.status === false">收起<i class="el-icon-arrow-up"></i></span>
          </el-button>
        </el-form-item>

      </slot>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SearchCondition",
  data () {
    return {
      conditionItems: []
    };
  },
  props: {
    conditions: Array,
    labelWidth: String,
  },
  methods: {
    switchOptionsStatus (item) {
      item.status = !item.status;
      if (item.status) {
        item.style = {
          height: "40px",
          overflow: "hidden",
          float: 'left'
        }
      }
      else {
        item.style = {
          height: "auto",
          float: 'left'
        }
      }
    },
    handlePreview (item) {
    },
    handleRemove (item) {

    },
    getFormItem () {
      var form = this.$refs.myFormItem;
      return form;
    },
    initCheckItems () {
      var sData = sessionStorage.getItem("aKeyTask");
      var key = ''
      var oNewArr
      var obj = {}
      var oItemsVal = []
      var oNewVal = []
      var oResetVal = [];
      if (sData) {
        sData = JSON.parse(sData);
        if (sData.oDicVal.indexOf(',') != -1) {
          key = sData.oDicVal.split(",");
        } else {
          key = sData.oDicVal;
        }
        oNewArr = sData.testKey.split("&");
        oNewVal = sData.oDicVal.split(",")
      }

      var _self = this;
      for (var i = 0; i < this.conditions.length; i++) {
        var item = this.conditions[i];
        //报文审核--成品管理--去掉未设置状态
        if (this.$route.path == '/cpsh' || this.$route.path == '/cpbw') {
          if (item.name == '报文类型' || item.name == '密级') {
            item.items.splice(item.items.indexOf('未设置'), 1)
          }
        }
        if (item.type === "checkbox") {
          if (!!key && key === item.dict || key === item.key || key.indexOf(item.dict) != -1) {
            oNewArr.forEach(item => {
              var arr2 = item.split("=")
              obj[arr2[0]] = eval((arr2[1]))
            })
            if (!!obj.moreVal && item.key == 'fy_rwzt') {
              obj.moreVal.forEach((v, i) => {
                oItemsVal.push(item.items[v]);
              })
            } else {
              oItemsVal = [];
              if (oNewVal[1] == "ljrw_xiaoyi" || oNewVal[2] == "ljrw_xiaoyi") {
                _self.conditions[0].value = ["校译任务"];
                _self.conditions[0].checkAll = false;
                _self.conditions[0].isIndeterminate = true;
                obj.values.forEach((v, i) => {
                  oItemsVal.push(this.conditions[1].items[v])
                });
              } else if (oNewVal[1] == "ljrw_xiezhu") {
                _self.conditions[0].value = ["协助任务"];
                _self.conditions[0].checkAll = false;
                _self.conditions[0].isIndeterminate = true;
                obj.values.forEach((v, i) => {
                  oItemsVal.push(this.conditions[1].items[v])
                });
              } else if (oNewVal[1] == "ljrw_geren" || oNewVal[2] == "xz_one") {
                _self.conditions[0].value = ["个人任务"];
                _self.conditions[0].checkAll = false;
                _self.conditions[0].isIndeterminate = true;
                obj.values.forEach((v, i) => {
                  oItemsVal.push(this.conditions[1].items[v])
                });
              } else {
                obj.values.forEach((v, i) => {
                  oItemsVal.push(item.items[v])
                })
              }
            }

            item.checkAll = false;
            item.isIndeterminate = true;
            item.value = oItemsVal;
          }
          else {
            item.value = [];
            for (var j = 0; j < item.items.length; j++) {
              item.value.push(item.items[j]);
            }
          }
          this.handleCheckedChange(item, true);
          sessionStorage.removeItem("aKeyTask")
        }
        /*if(obj.publish_time != null){
          if(item.key == "publish_time" || item.key == "create_time"){
            item.value = [this.getDate(),this.getDate()]
          }
        }*/
        if (obj.publish_time != null) {
          if (item.key == "create_time") {
            item.value = [this.getDate(), this.getDate()]
          }
        }
      }
      this.$emit("onChange", this.conditions, 'checkbox', item);
    },
    //获取当前日期
    getDate () {
      var oDate = new Date();
      var oY = oDate.getFullYear();
      var oM = this.toZero(oDate.getMonth() + 1);
      var oD = this.toZero(oDate.getDate());
      var oYdate = oY + '-' + oM + '-' + oD;
      return oYdate;
    },
    //补零
    toZero (n) {
      if (n < 10) {
        return "0" + n;
      } else {
        return n;
      }
    },
    dealPickerEvent (start, end, item) {
      item.value = [start, end];
    },
    handleCheckAllChange (item) {
      var tItems = [...item.value]
      item.value = item.checkAll ? item.items : [];
      item.isIndeterminate = false;

      if (item.dict === 'fy_rwlx' && this.conditions[1].items.length < 6) {
        this.conditions[1].items = []
        this.conditions[1].value = []
        for (var k in this.conditions[1].dataMap) {
          this.conditions[1].items.push(k)
          this.conditions[1].value.push(k)
        }
      }
      if (this.conditionItems.length !== 0 && tItems.length !== 0) {
        this.$emit("onChange", this.conditions, 'checkbox', item);
      }
    },
    handleCheckedChange (item, flag) {
      let checkedCount = item.value.length;
      item.checkAll = checkedCount === item.items.length;

      item.isIndeterminate =
        checkedCount > 0 && checkedCount < item.items.length;

      if (item.dict === 'fy_rwlx' && this.conditions[0].dataMap['个人任务']) {
        this.conditions[1].items = []
        this.conditions[1].value = []
        for (var k in this.conditions[1].dataMap) {
          this.conditions[1].items.push(k)
          this.conditions[1].value.push(k)
        }
        for (var k in item.dataMap) {
          var count = 0
          item.value.forEach(items => {
            if (k === items) {
              count = 1
            }
          })
          if (count == 0 && item.value.length != 0) {
            if (k === '个人任务') {
              this.conditions[1].items.splice(this.conditions[1].items.indexOf('进行中'), 1)
              this.conditions[1].items.splice(this.conditions[1].items.indexOf('已发布'), 1)
              if (this.conditions[1].value.indexOf('进行中') != -1) {
                this.conditions[1].value.splice(this.conditions[1].value.indexOf('进行中'), 1)
              }
              if (this.conditions[1].value.indexOf('已发布') != -1) {
                this.conditions[1].value.splice(this.conditions[1].value.indexOf('已发布'), 1)
              }
              this.conditions[1].checkAll = true;
              this.conditions[1].isIndeterminate = false;
            } else if (k === '协助任务') {
              this.conditions[1].items.splice(this.conditions[1].items.indexOf('协助中'), 1)
              this.conditions[1].items.splice(this.conditions[1].items.indexOf('协助完成'), 1)
              if (this.conditions[1].value.indexOf('协助中') != -1) {
                this.conditions[1].value.splice(this.conditions[1].value.indexOf('协助中'), 1)
              }
              if (this.conditions[1].value.indexOf('协助完成') != -1) {
                this.conditions[1].value.splice(this.conditions[1].value.indexOf('协助完成'), 1)
              }
              this.conditions[1].checkAll = true;
              this.conditions[1].isIndeterminate = false;
            } else if (k === '校译任务') {
              if (item.value.indexOf('个人任务') == -1) {
                this.conditions[1].items.splice(this.conditions[1].items.indexOf('校译中'), 1)
                this.conditions[1].items.splice(this.conditions[1].items.indexOf('校译完成'), 1)
                if (this.conditions[1].value.indexOf('校译中') != -1) {
                  this.conditions[1].value.splice(this.conditions[1].value.indexOf('校译中'), 1)
                }
                if (this.conditions[1].value.indexOf('校译完成') != -1) {
                  this.conditions[1].value.splice(this.conditions[1].value.indexOf('校译完成'), 1)
                }
              }
              this.conditions[1].checkAll = true;
              this.conditions[1].isIndeterminate = false;
            }
          }
        }
      }
      if (this.conditionItems.length !== 0 && !flag) {
        this.$emit("onChange", this.conditions, 'checkbox', item);
      }
    },
    handleRemoveTag (item, tag) {
      var index = -1;
      for (var i = 0; i < item.value.length; i++) {
        if (item.value[i].name === tag.name) {
          index = i;
          break;
        }
      }
      item.value.splice(index, 1);
    }
  },
  beforeMount () {
    this.conditionItems = this.util.updateOptionItems(this.conditions);
    this.initCheckItems();
  }
};
</script>

<style scoped>
.formLine > label {
  font-weight: 700;
}

.formLine:nth-child(odd) {
  background-color: #fff;
}
.opBtn {
  position: absolute;
  right: 0px;
  top: 5px;
}

/deep/ .el-form-item__content {
  padding-right: 30px;
  position: static;
}
/deep/ .el-form-item[myrequired="1"] .el-form-item__label:before {
  content: "*";
  color: red;
  display: inline-block;
}
</style>
