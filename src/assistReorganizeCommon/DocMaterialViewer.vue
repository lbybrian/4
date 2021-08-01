<template>
  <div style="height: 100%; position: relative; float: left; width: 100%;">
    <div class="articleTitleArea">
      <p class="articaltit" :title="params.title">{{params.title}}</p>
      <p class="articaltit" :title="params.translate_title" v-if="!!params.translate_title && params.language !='zh'"> {{params.translate_title}} </p>
    </div>
    <el-divider class="titleDivider" style="float: left; position: relative;"></el-divider>
    <p style="text-align: center; width: 100%; position:relative; float: left;">
      <span>{{params.data_source}}</span>
      <span style="margin-left: 20px;">{{params.publish_time}}</span>
      <span style="margin-left: 20px;">{{params.author}}</span>
    </p>
    <div style="margin: 15px 0px; height: 150px; display: inline-block; text-align: center; position: relative; width: 100%; float: left;">
      <h2 style="width: 100%; text-align: left; font-weight: 700;  margin: auto; max-width: 800px;">中文摘要：</h2>
      <div
        v-if="state===true"
        style=" width: 100%; display: inline-block; overflow: visible; position: relative; max-width: 800px;"
      >
        <el-input
          resize="none"
          :rows="5"
          type="textarea"
          placeholder="请输入内容"
          v-model="params.abstract"
          maxlength="2000"
          show-word-limit
          style="height: auto; "
        ></el-input>
        <el-button
          @click="switchAbstract"
          style="position: absolute; right:0px; bottom: -30px;"
          size="mini"
          type="primary"
          plain
        >确定</el-button>
      </div>
      <div
        v-else
        style="position: relative; margin: auto; box-sizing: border-box; border-left: solid 1px #ddd; border-top: solid 1px #ddd; border-radius: 5px; box-shadow: 1px 1px 1px #999; padding: 5px; height: 114px; max-width: 800px; "
      >
        <p style="text-align: left;text-indent: 2em; height: 100%; overflow:auto; max-width: 800px;">{{params.abstract}}</p>
        <p class="editinfo">
          用户{{params.update_by}}于{{params.update_time}} 最后编辑
          <el-button v-on:click="switchAbstract" size="mini" plain>编辑</el-button>
        </p>
      </div>
    </div>

    <div style="position: relative; width: 100%; float: left;">
<!--      <el-switch-->
<!--        v-if="params.file_type==='pdf'"-->
<!--        v-model="ocrFlag"-->
<!--        @change="transChange"-->
<!--        active-color="#13ce66"-->
<!--        inactive-color="#ff4949"-->
<!--        style="vertical-align: text-bottom; margin: 10px 0px;"-->
<!--        active-text="开启划选"-->
<!--        inactive-text="关闭划选"></el-switch>-->
      <el-button
        v-if="params.file_type==='pdf' && nowPath==='/BJQ'"
        size="mini"
        @click="ocrRequest(params.file_type)"
        :loading="ocrLoading"
        style="position: absolute; z-index:3; top: 25px; left: 100px;"
        type="primary">OCR识别</el-button>
    </div>
    <el-row style="margin-top: 20px; position: relative; float: left; width: 100%;">
      <el-col :span="24">
        <el-tabs type="card" v-model="activeName">
          <!--:label="params.file_type || '文档'"-->
          <el-tab-pane label="原文" name="yw" style="width:100%; position: relative; height: 600px;">
            <div v-if="params.file_type==='pdf'" style="height: 100%;">
              <div style="width: 100%; height: 100%;">
                <div  class="pdfFileViewArea" style="width: 100%; height: 100%"></div>
              </div>
              <!--<div class="imageItemArea imageWithOcr" v-if="ocrFlag">-->
                <!--<div :style="selectBoxStyle" class="boxSelectItem">-->
                  <!--<span class="r"></span>-->
                  <!--<span class="l"></span>-->
                  <!--<span class="t"></span>-->
                  <!--<span class="b"></span>-->
                  <!--<span class="br"></span>-->
                  <!--<span class="bl"></span>-->
                  <!--<span class="tr"></span>-->
                  <!--<span class="tl"></span>-->
                  <!--<div class="inner"></div>-->
                <!--</div>-->
              <!--</div>-->
            </div>
            <div v-if="params.file_type === 'html'"  style="height: 100%;">
              <iframe v-if="display" :src="params.file_path" width="100%" height="100%" frameborder="0px"></iframe>
            </div>
            <div v-if="params.file_type !== 'pdf' && params.file_type !== 'html'"  style="height: calc( 100% + 47px );"  class="bishengDocument">
              <iframe v-if="display" :src="docUrl" width="100%" height="100%" frameborder="0px"></iframe>
            </div>
          </el-tab-pane>
          <el-tab-pane label="机器预翻译" name="yfy" v-if="params.language !=='zh'">
            <div class="contentText" v-html="params.sys_translate || '暂无翻译结果'"></div>
          </el-tab-pane>
          <el-tab-pane label="人工翻译" name="rgfy" v-if="params.language !=='zh'">
            <div class="contentText" v-html="params.translate_content || '暂无翻译结果'"></div>
          </el-tab-pane>
        </el-tabs>
        <p v-if="params.file_type !== 'html'"  style="padding: 10px 0px; text-align: center;" ><a download="" target="_blank" :href="docDownloadUrl">下载文档</a></p>
      </el-col>
    </el-row>
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
.imageItemArea {
  position: absolute;
  top: 0px;
  left: 60px;
  z-index: 333;
  float: left;
  width: calc( 100% - 138px );
  height: 100%;
  overflow: hidden;
}

.titleDivider {
  float: left;
  margin: 10px 0;
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
    margin-top: -47px;
  }
.editinfo{
  text-align: right;
  font-size: 13px;
  bottom: -35px;
  position: absolute;
  right: 0px;
  color: red;
  overflow: hidden;
  background: floralwhite;
}
.articaltit{
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  overflow: hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

.boxSelectItem {
  position: absolute;
  z-index: 2;
  left: 30px;
  top:20px;
  background-color: rgba(255, 255, 255, 0.2);

}
/*四边*/
.boxSelectItem .t,
.boxSelectItem .b,
.boxSelectItem .l,
.boxSelectItem .r {
  position: absolute;
  z-index: 1;
  background: #666;
}
.boxSelectItem .l,
.boxSelectItem .r {
  width: 2px;
  height: 100%;
  cursor: col-resize;
}
.boxSelectItem .t,
.boxSelectItem .b {
  width: 100%;
  height: 2px;
  cursor: row-resize;
}
.boxSelectItem .t {
  top: 0;
}
.boxSelectItem .b {
  bottom: 0;
}
.boxSelectItem .l {
  top: 0;
  left: 0;
}
.boxSelectItem .r {
  right: 0;
}
/*四角*/
.boxSelectItem .tl,
.boxSelectItem .bl,
.boxSelectItem .br,
.boxSelectItem .tr {
  width: 10px;
  height: 10px;
  position: absolute;
  background: #fff;
  border:1px solid #666;
  z-index: 2;
  cursor: nwse-resize
}
.boxSelectItem .tl {
  left: -5px;
}
.boxSelectItem .bl {
  left: -5px;
}
.boxSelectItem .tr {
  right: -5px;
}
.boxSelectItem .br {
  right: -5px;
  bottom: -5px;
}
.boxSelectItem .bl {
  bottom: -5px;
}
.boxSelectItem .tl,
.boxSelectItem .tr {
  top: -5px;
}
.boxSelectItem .tr,
.boxSelectItem .bl {
  cursor: nesw-resize;
}
/*内核*/
.boxSelectItem .inner {
  width: 100%;
  height: 100%;
}

  /deep/ .el-textarea .el-input__count {
    bottom: -20px !important;
    left: 0px !important;
    right: auto !important;
  }


</style>

<script>
  import pdfObject from 'pdfobject'
export default {
  created() {
    this.params = this.options || this.params;
    this.docDownloadUrl = this.adapter.config.previewfile.url + "?file_path=" + this.params.file_path;
    this.updateContent();
    this.nowPath = this.$route.path;
  },
  mounted() {
    // var _self = this;
    // if(this.params.file_type === "pdf" && this.transValue) {
    //   setTimeout(function(){
    //     _self.initialImageSelect();
    //     _self.params.inited = true;
    //   }, 200);
    // }
  },
  updated() {
    this.params = this.options || this.params;
    this.transferContent();
    // var _self = this;
    this.docDownloadUrl = this.adapter.config.previewfile.url + "?file_path=" + this.params.file_path;
    // if(this.params.file_type === "pdf"  && this.transValue  &&  !_self.params.inited) {
    //   setTimeout(function(){
    //     _self.initialImageSelect();
    //     _self.params.inited = true;
    //   }, 200);
    // }
  },
  watch: {
    "params.id"(val, older) {
      this.updateContent();

    }
  },
  computed: {
    selectBoxStyle() {
      var style = {
        width: this.boxStyle.width + "px",
        height: this.boxStyle.height + "px",
        top: this.boxStyle.top + "px",
        left: this.boxStyle.left + "px"
      }
      return style;
    }
  },
  data() {
    return {
      state: true,
      ocrFlag: false,
      display: false,
      ocrLoading: false,
      transValue: false,
      activeName: "yw",
      docUrl: "",
      docDownloadUrl: "",
      boxStyle: {
        width: 50,
        height: 50,
        left: 0,
        top: 0
      },
      olderInfo: {
        width: 50,
        height: 50,
        left: 0,
        top: 0,
        x: 0,
        y: 0
      },
      params: {
        id: "",
        title: "",
        file_type: "pdf",
        file_path: "sc_info/20200718154428/RAND_Human-machine detection of online-based malign information.pdf"
      },
      nowPath:''
    };
  },
  methods: {
    transChange(val) {
      this.transValue = val;
      if(!this.transValue) {
        this.params.inited = false;
      }
    },
    ocrRequest(type) {
      // x1: this.boxStyle.left,
      // y1: this.boxStyle.top,
      // x2: this.boxStyle.left + this.boxStyle.width,
      // y2: this.boxStyle.top + this.boxStyle.height
      var param = {
        _path: this.params.id,
        type:type
      }
      var _self = this;
      this.ocrLoading = true;
      this.adapter.ocrRequest(param, function(d) {
        _self.ocrLoading = false;
        var ret = d.data.data || "【识别结果为空】";
        _self.$alert(ret, 'OCR识别结果', {
          confirmButtonText: '确定'
        });
      })
    },
    // initialImageSelect() {
    //   var _self = this;
    //   $(".boxSelectItem>span").off("mousedown")
    //   $(".boxSelectItem>span").on("mousedown", function(ev) {
    //     _self.recordMouseDown(ev, "size");
    //     var obj = this;
    //     $(document).off("mousemove");
    //     $(document).on("mousemove", function(event) {
    //       if(_self.olderInfo.down) {
    //         _self.adjustBoxStyle(event, obj.className);
    //       }
    //     });
    //
    //     $(document).off("mouseup");
    //     $(document).on("mouseup", function(event) {
    //       $(document).off("mousemove");
    //       _self.olderInfo.down = false;
    //     })
    //   });
    //
    //   $(".boxSelectItem").off("mousedown")
    //   $(".boxSelectItem").on("mousedown", function(ev) {
    //     _self.recordMouseDown(ev, "move");
    //     $(document).off("mousemove");
    //     $(document).on("mousemove", function(event) {
    //       if(_self.olderInfo.down) {
    //         _self.moveBoxItem(event);
    //       }
    //     });
    //     $(document).off("mouseup");
    //     $(document).on("mouseup", function(event) {
    //       $(document).off("mousemove");
    //       _self.olderInfo.down = false;
    //     })
    //   })
    //   this.boxStyle.left = 0;
    //   this.boxStyle.top = 0;
    //   this.boxStyle.width = 50;
    //   this.boxStyle.height = 50;
    // },
    // recordMouseDown(ev, type) {
    //   var oEv = ev || event;
    //   oEv.stopPropagation();
    //   this.olderInfo.width = this.boxStyle.width;
    //   this.olderInfo.height = this.boxStyle.height;
    //   this.olderInfo.left = this.boxStyle.left;
    //   this.olderInfo.top = this.boxStyle.top;
    //   this.olderInfo.x = oEv.clientX;
    //   this.olderInfo.y = oEv.clientY;
    //   this.olderInfo.down = true;
    // },
    // moveBoxItem(ev) {
    //   var oevent = ev || event;
    //   var disX = oevent.clientX - this.olderInfo.x;
    //   var disY = oevent.clientY - this.olderInfo.y;
    //   this.boxStyle.left = this.olderInfo.left + disX;
    //   this.boxStyle.top = this.olderInfo.top + disY;
    //   console.log(this.boxStyle.left);
    //
    // },
    // adjustBoxStyle(ev, objClassName) {
    //   var oEv = ev || event;
    //   let disY = (this.olderInfo.top + (oEv.clientY - this.olderInfo.y)),
    //     disX = (this.olderInfo.left + (oEv.clientX - this.olderInfo.x));
    //   if(disX > this.olderInfo.left+this.olderInfo.width){
    //     disX = this.olderInfo.left+this.olderInfo.width
    //   }
    //   if(disY > this.olderInfo.top+this.olderInfo.height){
    //     disY=this.olderInfo.top+this.olderInfo.height
    //   }
    //   if (objClassName == 'tl') {
    //     this.boxStyle.width = this.olderInfo.width - (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.height = this.olderInfo.height - (oEv.clientY - this.olderInfo.y);
    //     this.boxStyle.left = disX;
    //     this.boxStyle.top = disY;
    //   }
    //   else if (objClassName == 'bl') {
    //     this.boxStyle.width = this.olderInfo.width - (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.height = this.olderInfo.height + (oEv.clientY - this.olderInfo.y);
    //     this.boxStyle.left = disX;
    //     // this.boxStyle.top = this.olderInfo.top + (oEv.clientY - this.olderInfo.y) - this.boxStyle.height;
    //   }
    //   else if (objClassName == 'tr') {
    //     this.boxStyle.width = this.olderInfo.width + (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.height = this.olderInfo.height - (oEv.clientY - this.olderInfo.y);
    //     this.boxStyle.right = this.olderInfo.left - (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.top = disY;
    //   }
    //   else if (objClassName == 'br') {
    //     this.boxStyle.width = this.olderInfo.width + (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.height = this.olderInfo.height + (oEv.clientY - this.olderInfo.y);
    //     this.boxStyle.right = this.olderInfo.left - (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.bottom = this.olderInfo.top + (oEv.clientY + this.olderInfo.y);
    //   }
    //   else if (objClassName == 't') {
    //     this.boxStyle.height = this.olderInfo.height - (oEv.clientY - this.olderInfo.x);
    //     this.boxStyle.top = disY;
    //   }
    //   else if (objClassName == 'b') {
    //     this.boxStyle.height = this.olderInfo.height + (oEv.clientY - this.olderInfo.y);
    //     this.boxStyle.bottom = disY + 'px';
    //   }
    //   else if (objClassName == 'l') {
    //     this.boxStyle.height = this.olderInfo.height;
    //     this.boxStyle.width = this.olderInfo.width - (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.left = disX;
    //   }
    //   else if (objClassName == 'r') {
    //     this.boxStyle.height = this.olderInfo.height;
    //     this.boxStyle.width = this.olderInfo.width + (oEv.clientX - this.olderInfo.x);
    //     this.boxStyle.right = disX;
    //   }
    //   else {}
    // },
    updateContent() {
      if(this.params.file_type==="pdf") {
        this.updatePdfUrl();
      }
      else if(this.params.file_type === "html") {
        var path = this.params.file_path;
        if(path.charAt(0) != '/'){
          this.params.file_path = this.adapter.config.htmlFilePath.url + path;
        }
      }
      else {
        this.updateDocData(this.params.id);
      }
      this.display = true;
      this.transferContent();
    },
    // 预览区方法
    switchAbstract() {
      if (this.state && this.params.abstract) {
        this.updateAbstract();
      }
      this.state = !this.state;
    },
    updateAbstract() {
      var param = {
        abstract: this.params.abstract
      };
      var _self = this;
      this.adapter.saveAbstract({
        _path: this.params.id,
        saveOrUpdate: JSON.stringify(param)
      }, function(d) {
        _self.$message({
          message: "保存成功",
          type: "success"
        });
        _self.updateMaterialParam(_self.params.id)
      });
    },
    //更新当前素材参数
    updateMaterialParam(id) {
      var _self = this;
      this.adapter.getMaterialParam({
        _path: id
      }, function(d){
        if(d.data && d.data.data) {
          _self.params.update_by = d.data.data.update_by || _self.params.update_by;
          _self.params.update_time = d.data.data.update_time || _self.params.update_time;
          _self.params.abstract = d.data.data.abstract;
        }
        _self.$emit("abstractChange", _self.params);
      })
    },
    transferContent() {
      if(this.params.content) {
        this.params.content = this.params.content.replace(/\n/g, "<br/>");
      }
      if(this.params.sys_translate) {
        if(this.params.sys_translate.constructor.name === "Array") {
          this.params.sys_translate = this.params.sys_translate.join("\n");
        }
        this.params.sys_translate = this.params.sys_translate.replace(/\n/g, "<br/>");
      }
      if(this.params.translate_content) {
        if(this.params.translate_content.constructor.name === "Array") {
          this.params.translate_content = this.params.translate_content.join("\n");
        }
        this.params.translate_content = this.params.translate_content.replace(/\n/g, "<br/>");
      }
    },
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
      this.adapter.getBisengDocData({_path: id, table_name: tableInfo}, function(d){
        var tData = d.data;
        if(tData.status === 0 && tData.data) {
          tData = tData.data;
          _self.docUrl = decodeURIComponent(tData.url);
        }
      })}
  },
  props: {
    options: Object
  }
};
</script>


