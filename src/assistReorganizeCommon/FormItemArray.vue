<template>
  <div>
    <el-form ref="myFormItem" class="formItem" :model="model" label-width="90px" :rules="rules" label-position="left" label-suffix=":">
      <slot v-for="(item, index) in conditions">
        <el-form-item
          class="formLine"
          :label="item.name"
          :key="item.key"
          :dict="item.dict"
          :prop="item.prop"
          :model="model[item.prop]"
          style="margin-bottom: 0px;"
        ><div :style="">
          <el-checkbox
            v-if="item.type === 'checkbox' && item.checkAll !== undefined"
            v-model="item.checkAll"
            label="全部"
            :indeterminate="item.isIndeterminate"
            name="type"
            :size="item.size || 'mini'"
            @change="handleCheckAllChange(item)"
          ></el-checkbox>
          <slot v-for="d in item.items">
            <slot v-if="!item.hideItems || (item.hideItems.indexOf(d) === -1)">
              <slot v-if="d.type === 'checkbox' || item.type === 'checkbox' ">
                <el-checkbox
                  @change="handleCheckedChange(item)"
                  v-model="model[item.prop]"
                  :label="d.name || d"
                  name="type"
                  :size="item.size || 'mini'"
                ></el-checkbox>
              </slot>
              <slot v-else-if="d.type === 'radio' || item.type === 'radio' ">
                <el-radio
                  @change="$emit('onChange', conditions, 'radio', item)"
                  :value="model[item.prop]"
                  v-model="model[item.prop]"
                  :label="d.name || d"
                  :size="item.size || 'mini'"
                  name="type"
                ></el-radio>
              </slot>
              <slot v-else-if="d.type === 'switch' || item.type === 'switch' ">
                <el-form-item :label="d.name" prop="delivery">
                  <span v-if="d">{{d}}</span>
                  <el-switch
                    @change="$emit('onChange', conditions, 'switch', item)"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    v-model="model[item.prop]"
                    :size="item.size || 'mini'"
                  ></el-switch>
                </el-form-item>
              </slot>
              <slot v-else-if="d.type === 'dateRange' || item.type === 'dateRange' ">
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['', '']"
                  :size="item.size || 'mini'"
                  v-model="model[item.prop]"
                  :picker-options="item.pickerOptions"
                  @change="$emit('onChange', conditions, 'dateRange', item)"
                ></el-date-picker>
              </slot>
              <slot v-else-if="d.type === 'tags' || item.type === 'tags' ">
                <el-tag
                  class="eTagItem"
                  v-for="tag in item.value"
                  closable
                  :key="item.value"
                  :type="tag.type"
                  :size="item.size || 'mini'"
                  @close="handleRemoveTag(item, tag)"
                  style="margin-left: 5px;"
                >{{tag.name}}</el-tag>
              </slot>
              <slot v-else-if="d.type === 'text' || item.type === 'text'">
                <el-input
                  :size="item.size || 'mini'"
                  v-model="model[item.prop]"
                  :disabled="d.disabled || item.disabled"
                  :placeholder="d.placeholder || item.placeholder"
                  @change="$emit('onChange', conditions, 'input', item.value)"
                ></el-input>
              </slot>
              <slot v-else-if="d.type === 'select' || item.type === 'select' ">
                <el-select
                  :size="item.size || 'mini'"
                  v-model="model[item.prop]"
                  :disabled="d.disabled || item.disabled"
                  :placeholder="d.placeholder || item.placeholder"
                  @change="$emit('onChange', conditions, 'select', item.value)"
                >
                  <el-option
                    v-for="tItem in d.options"
                    :label="tItem.label || tItem"
                    :value="tItem.value || tItem"
                    :key="tItem.value"
                  ></el-option>
                </el-select>
              </slot>
              <slot v-else-if="d.type === 'textarea' || item.type === 'textarea'">
                <el-input
                  type="textarea"
                  v-model="model[item.prop]"
                  :disabled="d.disabled || item.disabled"
                  :size="item.size || 'mini'"
                  :placeholder="d.placeholder"
                  @change="$emit('onChange', conditions, 'textarea', item.value)"
                ></el-input>
              </slot>
              <slot v-else-if="d.type === 'datePicker' || item.type === 'datePicker'">
                <el-date-picker
                  v-model="model[item.prop]"
                  :size="item.size || 'mini'"
                  :format="d.format || item.format || 'yyyy-MM-dd HH:mm:ss'"
                  :value-format="d['value-format'] || item['value-format'] || 'yyyy-MM-dd HH:mm:ss'"
                  :type="(d.pickerType || item.pickerType) || 'datetime'"
                  :placeholder="(d.placeholder || item.placeholder) || '选择日期时间'"
                  @change="$emit('onChange', conditions, 'datePicker', item.value)"
                ></el-date-picker>
              </slot>
            </slot>
          </slot>
        </div>
          <el-button v-if="item.status !== undefined" class="opBtn" @click="switchOptionsStatus(item)"  type="text" size="mini">
            <span v-if="item.status === true">展开<i class="el-icon-arrow-down"></i></span>
            <span  v-if="item.status === false">收起<i class="el-icon-arrow-up"></i></span>
          </el-button>
        </el-form-item>
      </slot>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      conditions: [],
      rules: {

      },
      model: {

      }
    };
  },
  props: {
    formData: Object
  },
  created() {
    this.conditions = this.util.updateOptionItems(this.formData.group);
    this.rules = this.formData.rules;
    this.model = this.formData.model;
    this.initCheckItems();
  },
  methods: {
    switchOptionsStatus(item) {
      item.status = !item.status;
      if(item.status) {
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
    handlePreview(item) {
    },
    handleRemove(item) {

    },
    getFormItem() {
      var form = this.$refs.myFormItem;
      return form;
    },
    initCheckItems() {
      var sData = sessionStorage.getItem("aKeyTask");
      var key
      // var sDateCurrentTime = sessionStorage.getItem("oCurrentTime");
      if(sData) {
        sData = JSON.parse(sData);
        key = sData.oDicVal;
      }
      var obj = {}
      for(var i = 0; i < this.conditions.length; i++) {
        var item = this.conditions[i];
        if(item.type === "checkbox") {
          if(!!key && key === item.dict || key === item.key) {
            var oNewArr = sData.testKey.split("&")
            var oItemsVal = []
            oNewArr.forEach(item => {
              var arr2 = item.split("=")
              obj[arr2[0]] = eval((arr2[1]))
            })
            obj.values.forEach((v,i)=>{
              oItemsVal.push(item.items[v])
            })
            item.checkAll = false;
            item.isIndeterminate = true;
            item.value = oItemsVal;
          }
          else {
            item.value = [];
            for(var j = 0; j < item.items.length; j++) {
              item.value.push(item.items[j]);
            }
          }
          this.handleCheckedChange(item, true);
          sessionStorage.removeItem("aKeyTask")
        }

        if(obj.publish_time != null){
          if(item.key == "publish_time" || item.key == "create_time"){
            item.value = [this.getDate(),this.getDate()]
          }
        }
      }
      this.$emit("onChange", this.conditions, 'checkbox', item);
    },
    //获取当前日期
    getDate(){
      var oDate = new Date();
      var oY = oDate.getFullYear();
      var oM = this.toZero(oDate.getMonth() + 1);
      var oD = this.toZero(oDate.getDate());
      var oYdate = oY + '-' + oM + '-' + oD;
      return oYdate;
    },
    //补零
    toZero(n){
      if(n < 10){
        return "0" + n;
      }else{
        return n;
      }
    },
    dealPickerEvent(start, end, item) {
      item.value = [start, end];
    },
    handleCheckAllChange(item) {
      var tItems = [...item.value]
      item.value = item.checkAll ? item.items : [];
      item.isIndeterminate = false;
      if(this.conditionItems.length !== 0 && tItems.length !== 0) {
        this.$emit("onChange", this.conditions, 'checkbox', item);
      }
    },
    handleCheckedChange(item, flag) {
      let checkedCount = item.value.length;
      item.checkAll = checkedCount === item.items.length;
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < item.items.length;

      if(this.conditionItems.length !== 0 && !flag) {
        this.$emit("onChange", this.conditions, 'checkbox', item);
      }

    },
    handleRemoveTag(item, tag) {
      var index = -1;
      for (var i = 0; i < item.value.length; i++) {
        if (item.value[i].name === tag.name) {
          index = i;
          break;
        }
      }
      item.value.splice(index, 1);
    }
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
}

</style>
