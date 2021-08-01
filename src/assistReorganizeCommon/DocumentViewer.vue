<template>
  <div style="height: 100%; position: relative; float: left; width: 100%;">
    <div  style="position: relative; float: left; width: 100%; height: calc( 100% - 10px );  overflow: hidden;" >
      <div v-if="params.file_type==='pdf'" class="pdfFileViewArea" style="height: 600px;"></div>
      <iframe v-if="params.file_type === 'html'" :src="params.file_path" width="100%" height="100%" frameborder="0px"></iframe>
      <div v-if="params.file_type==='eml'">
        <div v-html="params.content"></div>
      </div>
      <div v-if="params.file_type !== 'pdf' && params.file_type !== 'html' && params.file_type !== 'eml'" style="height: 100%; position: absolute; float: left; width: 100%; top: -48px;">
        <div class="bishengDocument">
          <iframe :src="docUrl" width="100%" height="100%" frameborder="0px"></iframe>
        </div>
      </div>
    </div>
    <p v-if="params.file_type !== 'html'&& params.file_type !== 'eml'"  style="padding: 0px 0px; text-align: center;" ><a download="" target="_blank" :href="docDownloadUrl">下载文档</a></p>
  </div>
</template>
<style scoped>
.articleTitleArea {
  float: left;
  position: relative;
  width: 100%;
  font-weight: 900;
  text-align: center;
}

.el-switch {
  margin-bottom: 10px;
}
  .articleTitleAre>p {
    margin-bottom: 15px;
  }

  .bishengDocument {
    position: relative;
    float: left;
    width: 100%;
    height: 100%;
    margin-top: 0px;
  }

</style>

<script>
  import pdfObject from 'pdfobject'
export default {
  created() {
    this.params = this.options || this.params;
    if(this.params.file_type==="pdf") {
      this.updatePdfUrl();
    }
    else if(this.params.file_type === "html") {
      this.params.file_path = this.adapter.config.htmlFilePath.url + this.params.file_path;
    } else {
      this.updateDocData(this.params.id);
    }
    if(this.params.content) {
      this.params.content = this.params.content.replace(/\n/g, "<br/>");
    }
    this.docDownloadUrl = this.adapter.config.previewfile.url + "?file_path=" + this.params.file_path;
  },
  updated() {
    this.params = this.options || this.params;
  },
  data() {
    return {
      state: false,
      docUrl: "",
      params: {
        id: "",
        title: "",
        docDownloadUrl: "",
        file_type: "pdf",
        file_path: "sc_info/20200718154428/RAND_Human-machine detection of online-based malign information.pdf"
      }
    };
  },
  methods: {
    updatePdfUrl() {
      var token = localStorage.getItem("token");
      var _self = this;
      setTimeout(function(){
        if(token) {
          var url = adapter.config.previewPdf.url + _self.params.id || "static/testData/test.pdf";
          // var url = "static/testData/test.pdf";
          if(url.search(/\?/) === -1) {
            url += "?token=" + token;
          }
          else {
            url += "&token=" + token;
          }
        }
        var options = {
          pdfOpenParams:{
            toolbar:0
          }
        }
        window.currentPdf = pdfObject.embed(url, ".pdfFileViewArea",options);
      }, 100);
    },
    updateDocData(id) {
      var _self = this;
      var tableInfo = this.params.table_info || "sc_info";
      var from = WebTool.urlQuery(location.href, "from");
      if(from === "mbgl") {
        tableInfo = "mbgl_info"
      }
      this.adapter.getBisengDocData({_path: id, table_name: tableInfo}, function(d){
        var tData = d.data;
        if(tData.status === 0 && tData.data) {
          tData = tData.data;
          _self.docUrl = decodeURIComponent(tData.url);
        }
      })
    }
  },
  props: {
    options: Object
  }
};
</script>


