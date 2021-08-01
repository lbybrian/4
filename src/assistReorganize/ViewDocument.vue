<template>
  <div style="height: 100%;">
    <div size="mini" style="padding: 10px; width: 100%; z-index: 3; position: relative; background-color: #fff;">预览文档</div>
    <DocumentViewer :options="params" style="height: 100%;"></DocumentViewer>
  </div>
</template>
<style scoped>
* {
  box-sizing: border-box;
}

.contentArea {
  width: 50%;
  padding: 40px 30px 10px 30px;
  height: 100%;
  position: relative;
  float: left;
  box-sizing: border-box;
}

.contentArea::before {
  content: attr(label);
  position: absolute;
  top: 5px;
  left: 50%;
  margin-left: -10px;
}

.mainArea {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
}
</style>
<script>
  import DocumentViewer from "../assistReorganizeCommon/DocumentViewer";

export default {
  components: {
    DocumentViewer
  },
  name: "YLWD",
  props: {},
  created() {
    this.params.id = decodeURIComponent(WebTool.urlQuery(location.hash, "id"));
  },
  methods: {
    goBack(name, param) {
      var from =  this.$route.query.from;
      this.$router.push({
        path: `/${from}`
      });
    }
  },

  data: function() {
    return {
      params: {
        id: "",
        file_type: "document",
        table_info: "tscp_info"
      }
    };
  }
};
</script>


