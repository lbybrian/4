<template>
  <div style="padding-bottom: 10px; width: 100%;">
    <el-dialog  :center="true" :title="config.title" :visible.sync="config.visible" :width="config.width || '60%'" center>
      <div v-html="config.content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="config.visible = false; emitClickEvent(false)">取消</el-button>
        <el-button
            size="mini"
            type="primary"
            @click="config.visible = false; emitClickEvent(true)"
          >确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<style scoped>
/deep/ .el-dialog__header {
  text-align: left;
}
/deep/ .el-dialog__body {
  padding: 20px 20px 10px;
}
  /deep/ .el-dialog__footer {
    text-align: right;
    padding-right: 25px;
  }
</style>

<script>
export default {
  name: "CommonTable",
  props: {
    options: Object
  },
  created() {
    this.config = this.options;
  },
  data() {
    return {
      config: {
        visible: false,
        title: "----",
        width: "60%",
        content: ""
      }
    }
  },
  methods: {
    emitClickEvent(flag) {
      this.$emit("confirm", flag);
    }
  }
};
</script>
