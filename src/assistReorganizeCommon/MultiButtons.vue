<template>
  <div :options="options" style="display: inline-block; width: 50px;">
    <slot v-for="d in options">
      <el-popover
        v-if="d.children && d.children.length > 0"
        placement="left-start"
        trigger="hover"
        v-model="d.visible"
      >
        <div style="text-align: right; margin: 0; width: 150px;" class="rButs1">
          <slot v-for="item in d.children">
            <el-button
              style=" margin: 5px 0; width: 100%;"
              size="mini"
              type="primary"
              :disabled="item.disabled"
              @click="$emit('buttonClick', item.name)"
            >{{item.name}}</el-button>
          </slot>
        </div>
        <el-button style="margin-left: 0px; margin-top: 2px;" type="primary" size="mini" slot="reference">{{d.name}}</el-button>
      </el-popover>
      <el-button
        class="rButs"
        v-else
        style="margin: 5px 0;"
        size="mini"
        type="primary"
        slot="reference"
        @click="$emit('buttonClick', d.name)"
        :disabled="d.disabled"
      >{{d.name}}</el-button>
    </slot>
  </div>
</template>

<script>
export default {
  name: "MultiButtons",
  data() {
    return {
      buttons: []
    };
  },
  props: {
    options: Array
  },
  beforeMount() {
    this.buttons = this.options;
  }
};
</script>

<style scoped>
.el-popover {
  min-width: 20px !important;
  width: 20px;
}
 /*.rButs .el-button {*/
    /*width: 80px;*/
    /*display: block;*/
  /*}*/
.rButs.el-button /deep/ span{
    width: 50px!important;
    word-break: break-all!important;
    white-space: pre-line !important;
    display: block;
    line-height:16px;
  }
.rButs1 .el-button /deep/ span{
  width: 50px!important;
  word-break: break-all!important;
  white-space: pre-line !important;
  display: block;

}
</style>
