<template>
  <div style="position: relative; width: 100%; float: left; height: 100%;">
    <div class="articleTitleArea">
      <p class="articaltit"
         :title="params.title">{{params.title}}</p>
      <p class="articaltit"
         :title="params.translate_title"
         v-if="!!params.translate_title && params.language !='zh'"> {{params.translate_title}} </p>
    </div>
    <el-divider class="titleDivider"
                style="float: left; position: relative;"></el-divider>
    <p style="text-align: center; width: 100%; position:relative; float: left;">
      <span>{{params.data_source}}</span>
      <span style="margin-left: 20px;">{{params.publish_time}}</span>
      <span style="margin-left: 20px;">{{params.author}}</span>
    </p>
    <div style="margin: 15px 0px; height: 150px; display: inline-block; text-align: center; position: relative; width: 100%; float: left;">
      <h2 style="width: 100%; text-align: left; font-weight: 700;  margin: auto; max-width: 800px;">中文摘要：</h2>
      <div v-if="state===true"
           style=" width: 100%; display: inline-block; overflow: visible; position: relative; max-width: 800px;">
        <el-input resize="none"
                  :rows="5"
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="params.abstract"
                  maxlength="2000"
                  show-word-limit
                  style="height: auto; "></el-input>
        <el-button @click="switchAbstract"
                   style="position: absolute; right:0px; bottom: -30px;"
                   size="mini"
                   type="primary"
                   plain
                   :disabled="!!params.ylcpStatus && (params.ylcpStatus === '1' || params.ylcpStatus === '2')">确定</el-button>
      </div>
      <div v-else
           style="position: relative; margin: auto; box-sizing: border-box; border-left: solid 1px #ddd; border-top: solid 1px #ddd; border-radius: 5px; box-shadow: 1px 1px 1px #999; padding: 5px; height: 114px;max-width: 800px; ">
        <p style="text-align: left;text-indent: 2em; height: 100%; overflow:auto; max-width: 800px;">{{params.abstract}}</p>
        <p class="editinfo">
          用户{{params.update_by}}于{{params.update_time}} 最后编辑
          <el-button v-on:click="switchAbstract"
                     size="mini"
                     plain>编辑</el-button>
        </p>
      </div>
    </div>

    <div v-if="!!params.content"
         style="position: relative; float: left; width: 100%; margin: 20px 0px;">
      <el-switch v-if="flag===true"
                 v-model="transValue"
                 @change="transChange"
                 active-color="#13ce66"
                 inactive-color="#ff4949"
                 style="vertical-align: text-bottom;"
                 active-text="开启划选"
                 inactive-text="关闭划选"></el-switch>
      <div style="position: relative; float: left; width: 100%;">
        <el-button v-if="params.language ==='zh'"
                   size="mini"
                   @click="switchContent"
                   style="position: absolute; z-index:3; top: 5px; left: 120px;"
                   type="primary">繁体 -> 简体</el-button>
      </div>
      <el-row v-if="params.language ==='zh'">
        <el-col :span="24">
          <el-tabs type="card"
                   v-model="activeName">
            <!--:label="params.file_type || '中文原文'"-->
            <el-tab-pane label="原文"
                         name="yw"
                         style="width:100%">
              <div v-if="params.file_type !== 'html'"
                   class="contentText">
                <div v-if="wordFlag"
                     v-html="params.content"
                     onmousedown="mouseSelectDown('addKeyword');"
                     onmouseup="mouseSelectUp()"></div>
                <div v-else
                     v-html="currentContent"
                     onmousedown="mouseSelectDown('addKeyword');"
                     onmouseup="mouseSelectUp()"></div>
              </div>
              <div v-else
                   style="height: 100%;">
                <iframe :src="docUrl"
                        width="100%"
                        height="100%"
                        frameborder="0px"></iframe>
              </div>
              <p v-if="!!params.source_url"
                 style="margin: 10px 0px 40px 0; color: #999;">原文链接: <a style="color: #699;"
                   target="_blank"
                   :href="params.source_url">{{params.source_url}}</a></p>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <el-tabs type="card"
                   v-model="activeName">
            <el-tab-pane label="原文"
                         name="yw"
                         style="width:100%">
              <div class="contentText"
                   v-html="params.content"
                   onmousedown="mouseSelectDown(); this.selectRadio='translate'"
                   onmouseup="mouseSelectUp()"></div>
              <p v-if="!!params.source_url"
                 style="margin: 10px 0px 40px 0; color: #999;">原文链接: <a target="_blank"
                   style="color: #699;"
                   :href="params.source_url">{{params.source_url}}</a></p>
            </el-tab-pane>
            <el-tab-pane label="机器预翻译"
                         name="yfy"
                         v-if="params.language !=='zh'">
              <div class="contentText"
                   v-html="params.sys_translate || '暂无翻译结果'"
                   onmousedown="mouseSelectDown('addKeyword');"
                   onmouseup="mouseSelectUp()"></div>
            </el-tab-pane>
            <el-tab-pane label="人工翻译"
                         name="rgfy"
                         v-if="params.language !=='zh'">
              <div class="contentText"
                   v-html="params.translate_content || '暂无翻译结果'"
                   onmousedown="mouseSelectDown('addKeyword');"
                   onmouseup="mouseSelectUp()"></div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <!--引入划选菜单-->
    <el-dialog title="划选原文"
               :visible.sync="selectVisible"
               width="30%">
      <div style="font-weight: bold; padding: 10px 0; font-size:14px;">{{transText}}</div>
      <el-radio-group v-model="selectRadio"
                      style="width: 100%;">
        <el-radio style="width: 120px; text-align: left;"
                  label="translate">翻译原文</el-radio>
        <el-radio style="width: 120px; text-align: left;"
                  label="addKeyword">添加关键词</el-radio>
        <el-radio style="width: 120px; text-align: left;"
                  label="produceAbstract">生成摘要</el-radio>
      </el-radio-group>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialogClose">确 定</el-button>
      </span>
    </el-dialog>
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

.titleDivider {
  float: left;
  margin: 10px 0;
}

.el-switch {
  margin-bottom: 10px;
}
.articleTitleAre > p {
  margin-bottom: 15px;
}

.editinfo {
  text-align: right;
  font-size: 13px;
  bottom: -35px;
  position: absolute;
  right: 0px;
  color: red;
  overflow: hidden;
  background: floralwhite;
}
.articaltit {
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/deep/ .el-textarea .el-input__count {
  bottom: -20px !important;
  left: 0px !important;
  right: auto !important;
}
</style>


<script>
const API = '/api'
const SAVE = '/key/saveOrUpdate'
import DocumentViewer from "../assistReorganizeCommon/DocumentViewer";
export default {
  components: {
    DocumentViewer
  },
  created () {
    // 划选鼠标事件
    let _this = this;
    window.mouseSelectDown = _this.mouseSelectDown
    window.mouseSelectUp = _this.mouseSelectUp
    this.currentContent = "";
  },
  beforeMount () {
    if (location.hash.search("/BJQ") !== -1 || location.hash.search("/bjq") !== -1) {
      this.flag = true;
    }
    this.params = this.options;
    this.transferContent();
  },
  updated () {
    this.params = this.options;
    this.transferContent();
  },
  mounted () {
    //将素材文本拖拽加入文档中。
    $(".contentText").on("dragend", function (e) {
      let txt = window.getSelection ? window.getSelection() : docBody.selection.createRange().text
      var iframe = $("#bisengDocumentIframe")[0];
      var rect = iframe.getBoundingClientRect();
      if (e.clientX > rect.x && e.clientX < rect.x + rect.width && e.clientY > rect.y && e.clientY < rect.y + rect.height) {
        iframe.contentWindow.postMessage({ command: "AddContent", content: txt.toString() }, "*");
      }
    })
  },
  data () {
    return {
      //繁体简体切换状态
      wordFlag: true,
      // 划选dialog参数
      selectVisible: false,
      //当前繁体转简体内容
      currentContent: "",
      // 菜单操作
      selectRadio: 'translate',
      // 划选文本
      selectText: '',
      // 划选翻译文本
      transText: '',
      // 划选参数end
      flag: false,
      format: true,
      activeName: "yw",
      transValue: true,
      state: true,
      params: {
        id: "",
        title: "",
        duration: "",
        file_type: "",
        abstract: "",
        translate_abstract: "",
        translate_content: "",
        translate_title: "",
        sys_translate: "",
        author: "",
        content: "",
        create_by: "",
        create_time: "",
        update_by: "",
        update_time: "",
        data_source: "",
        direction: "",
        file_path: "",
        language: "",
        publish_time: "",
        src: "",
        source_url: ""
      }
    };
  },
  watch: {
    "params.id" (val, older) {
      this.activeName = "yw";
    }
  },
  methods: {
    //生成摘要
    produceAbstract (content) {
      content = content || "";
      content = content.trim();
      if (!content) {
        this.$message({
          message: "需要选中几个文本素材。",
          type: 'warning'
        })
      }
      else {
        var _self = this;
        var param = this.abstractParam;
        param.content = content;
        delete param.ids;
        this.adapter.abstractContent(param, function (d) {
          var tData = d.data;
          if (tData.status === 0 && tData.data.length) {
            var str = "";
            tData.data.map(item => {
              str += item.trim() + "\t\r\n";
            });
            _self.util.copyText(str);
            _self.$message({
              message: "摘要已生成，并拷贝到剪贴板中。",
              type: 'success'
            })
          }
        })
      }
    },
    //繁体简体转换
    switchContent () {
      this.wordFlag = !this.wordFlag;
      if (!this.currentContent) {
        var _self = this;
        this.adapter.switchContent({
          content: _self.params.content
        }, function (d) {
          if (d.data.status === 0) {
            _self.currentContent = d.data.data;
          }
        });
      }
    },
    transferContent () {
      if (this.params.content) {
        this.params.content = this.params.content.replace(/\n/g, "<br/>");
      }
      if (this.params.sys_translate) {
        if (this.params.sys_translate.constructor.name === "Array") {
          this.params.sys_translate = this.params.sys_translate.join("\n");
        }
        this.params.sys_translate = this.params.sys_translate.replace(/\n/g, "<br/>");
      }
      if (this.params.translate_content) {
        if (this.params.translate_content.constructor.name === "Array") {
          this.params.translate_content = this.params.translate_content.join("\n");
        }
        this.params.translate_content = this.params.translate_content.replace(/\n/g, "<br/>");
      }
    },
    transChange (val) {
      this.transValue = val
    },
    // 预览区方法
    switchAbstract () {
      if (this.state && this.params.abstract) {
        this.updateAbstract();
      }
      this.state = !this.state;
    },
    updateAbstract () {
      var param = {
        abstract: this.params.abstract
      };
      var _self = this;
      this.adapter.saveAbstract({
        saveOrUpdate: JSON.stringify(param),
        _path: this.params.id
      }, function (d) {
        _self.$message({
          message: "保存成功",
          type: "success"
        });
        _self.updateMaterialParam(_self.params.id);

      });
    },
    //更新当前素材参数
    updateMaterialParam (id) {
      var _self = this;
      this.adapter.getMaterialParam({
        _path: id
      }, function (d) {
        if (d.data && d.data.data) {
          _self.params.update_by = d.data.data.update_by || _self.params.update_by;
          _self.params.update_time = d.data.data.update_time || _self.params.update_time;
          _self.params.abstract = d.data.data.abstract;
        }
        _self.$emit("abstractChange", _self.params);
      })
    },

    // 预览区划选方法
    mouseSelectDown (val) {
      if (!this.transValue) {
        return
      }
      this.selectVisible = false
      this.selectRadio = val || 'translate';
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
    },
    mouseSelectUp () {
      if (!this.transValue || !this.flag) {
        return
      }
      let docBody = document.getElementById('originContent')
      let txt = window.getSelection ? window.getSelection() : docBody.selection.createRange().text
      if (txt.toString() !== '') { // 显示划选菜单
        this.selectText = txt.toString()
        this.selectVisible = true
      }

      if (this.selectRadio === 'translate') {
        this.transFun()
      }

    },

    // 菜单确认
    dialogClose () {
      if (this.selectRadio === "addKeyword") {
        this.addKey();
      }
      else if (this.selectRadio === "produceAbstract") {
        var content = this.transText || this.selectText;
        this.produceAbstract(content);
      }
      else { }
      this.selectText = "";
      this.transText = "";
      this.selectVisible = false
    },

    // 翻译原文
    transFun () {
      var _self = this
      this.transText = '正在翻译，请稍后！'
      this.adapter.dxscDetailDetect({
        "targetLangCode": "zh",
        "domainCode": "gen",
        "text": _self.selectText
      },
        function (d) {
          if (d.data.success) {
            var txtList = d.data.result.transResults
            var mes = ''
            for (var i = 0; i < txtList.length; i++) {
              for (var j = 0; j < txtList[i].length; j++) {
                mes += txtList[i][j].tgt
              }
            }
            _self.transText = mes
          } else {
            _self.$message({
              message: d.data.errorDesc,
              type: 'warning'
            })
            _self.transText = ""
          }

        })

      this.dialogVisible = true

    },
    // 添加关键词
    addKey () {
      this.ajaxPOST(API + SAVE, {
        saveOrUpdate: JSON.stringify({
          name: this.selectText
        })
      }).then(r => {
        this.$message({
          message: '添加关键词成功！',
          type: 'success'
        })
        this.selectText = ''
      }).catch(e => {
        this.$message({
          message: '添加关键词失败：' + e,
          type: 'warning'
        })
        this.selectText = ''
      })
      // this.mouseSelectDown()
      // this.mouseSelectDown2()
    }
  },
  props: {
    options: Object,
    abstractParam: Object
  }
};
</script>


