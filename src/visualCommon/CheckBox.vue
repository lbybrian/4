<template>
  <div>
    <el-form ref="myFormItem" class="formItem" label-position="left" label-suffix=":">
      <el-checkbox v-model="checkAll" @change="handleCheckAll">全部人员</el-checkbox>
      <slot v-for="(item, index) in dataObj.tableData">
        <el-form-item class="formLine" :key="item.key" :dict="item.dict" :prop="item.prop"
          :myRequired="item.required || '0'" style="margin-bottom: 0px; position: relative; float:left; width: 100%;">
          <div :style="item.style || {
          height: '36px',
          overflow: 'hidden',
          }">
            <el-checkbox v-if="item.type === 'checkbox' && item.checkAll !== undefined" v-model="item.checkAll"
              :label="item.name" name="type" :size="item.size || 'mini'" @change="handleCheckAllChange(item)">
            </el-checkbox>
            <slot v-for="d in item.items">
              <slot v-if="!item.hideItems || (item.hideItems.indexOf(d) === -1)">
                <slot v-if="d.type === 'checkbox' || item.type === 'checkbox' ">
                  <el-checkbox @change="handleCheckedChange(item)" v-model="item.value" :label="d.name || d" name="type"
                    :size="item.size || 'mini'"></el-checkbox>
                </slot>
              </slot>
            </slot>
          </div>
        </el-form-item>
      </slot>

      <div>
        <span>已选人员</span>
        <el-tag v-for="tag in tags" type="info" :key="tag" :disable-transitions="true" closable @close="handleClose(tag)"style="margin: 0 5px;">
          {{tag}}
        </el-tag>&nbsp;&nbsp;
        <el-button type="" style="color:#409EFF;border:none;" value=""
          @click="handleAllClose"><svg t="1617702666867" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="3426" width="14" height="14">
            <path
              d="M781.28 851.36a58.56 58.56 0 0 1-58.56 58.56H301.28a58.72 58.72 0 0 1-58.56-58.56V230.4h538.56zM359.68 125.44a11.84 11.84 0 0 1 12-12h281.28a11.84 11.84 0 0 1 12 12V160H359.68zM956.8 160H734.72V125.44a81.76 81.76 0 0 0-81.76-81.76H371.68a82.08 82.08 0 0 0-81.76 81.76V160H67.2a35.36 35.36 0 0 0 0 70.56h105.12v620.8a128.96 128.96 0 0 0 128.96 128.96h421.44a128.96 128.96 0 0 0 128.96-128.96V230.4h105.12a35.2 35.2 0 0 0 35.2-35.2 34.56 34.56 0 0 0-35.2-35.2zM512 804.16a35.2 35.2 0 0 0 35.2-35.36V393.92a35.2 35.2 0 1 0-70.4 0v374.88a35.2 35.2 0 0 0 35.2 35.36m-164.32 0a35.36 35.36 0 0 0 35.36-35.36V393.92a35.36 35.36 0 1 0-70.56 0v374.88a36.32 36.32 0 0 0 35.2 35.36m328.64 0a35.36 35.36 0 0 0 35.2-35.36V393.92a35.36 35.36 0 1 0-70.56 0v374.88a35.36 35.36 0 0 0 35.36 35.36"
              fill="#4592D8" p-id="3427"></path>
          </svg><span style="font-size: 16px;margin-left: 5px">清除全部</span></el-button>
      </div>

    </el-form>
  </div>
</template>
<script>
  export default {
    name: "SearchCondition",
    data() {
      return {
        conditionItems: [],
        checkAll: false,
        tags: []
      };
    },
    props: {
      dataObj: Object,
    },
    mounted() {},
    methods: {
      handleCheckAll(item) {
        // console.log(item)
        for (let i = 0; i < this.dataObj.tableData.length; i++) {
          let arr = []
          this.dataObj.tableData[i].checkAll = item
          this.handleCheckAllChange(this.dataObj.tableData[i])
          arr = [...this.tags, ...this.dataObj.tableData[i].value];
          this.tags = [...new Set(arr)]
        }
      },
      handleCheckAllChange(item) {
        let arr = []
        item.value = item.checkAll ? item.items : [];
        arr = [...this.tags, ...item.value]
        this.tags = [...new Set(arr)]
      },
      handleCheckedChange(item, flag) {
        let arr = []
        let checkedCount = item.value.length;
        item.checkAll = checkedCount === item.items.length;
        arr = [...this.tags, ...item.value]
        this.tags = [...new Set(arr)]
      },
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      handleAllClose() {
        this.tags = [];
      },
    },
  };
</script>

<style scoped>
  .formLine>label {
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
