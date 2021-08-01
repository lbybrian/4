<template>
  <div class="editorContainer"
       style="position: relative; float: left; width: 100%;">
    <h3 class="editAreaTop">
      <el-upload :action="uploadUrl"
                 @change="handleSelectFileChange"
                 :data="uploadParam"
                 :accept="fileAccept"
                 :limit="moduleData.limit || 1"
                 style="display: inline-block; margin-right: 10px; float: left;"
                 @on-exceed="dealExceed(item)"
                 :file-list="moduleData.value"
                 :on-success="dealCompeteEvent"
                 :auto-upload="true">
        <el-button slot="trigger"
                   size="mini"
                   type="primary">导入本地模板</el-button>
      </el-upload>
      <span style="float: left;">
        选择模板:
        <el-cascader :options="moduleOptions"
                     @change="dealerCascaderChange"
                     size="mini"
                     clearable></el-cascader>
      </span>
      <el-button class="freshListBtn"
                 style="float: left; margin-left: 10px;"
                 size="mini"
                 @click="saveAsModule()"
                 type="plain"
                 icon="el-icon-upload2">生成模板</el-button>
      <el-button class="freshListBtn"
                 style="float: right; margin-right: 10px;"
                 size="mini"
                 @click="submitCheck()"
                 type="plain"
                 icon="el-icon-finished">提交审核</el-button>
      <el-button class="freshListBtn"
                 style="float: right; margin-left: 10px;"
                 size="mini"
                 @click="switchAttributePane()"
                 :icon="attributePane.icon"
                 type="text">报文属性</el-button>
    </h3>
    <div v-if="attributePane.visible"
         class="attributePane">
      <SearchCondition style="height: auto; float: left; width: 100%;"
                       labelWidth="140px"
                       :conditions="attributePane.group"></SearchCondition>
      <div style="float: left; width: 100%; position: relative; padding-top: 10px; box-sizing: border-box; text-align: center;">
        <el-button size="mini"
                   @click="attributePane.visible = false;">取 消</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="saveAttribute()">确 定</el-button>
      </div>
    </div>
    <div class="editorArea"
         :style="customStyle">
      <div style="position: absolute; width: 50px; height: 45px; background-color: rgb(2, 119, 189);">
      </div>
      <div style="position: absolute; width: 80px; height: 45px; right: 0px; background-color: rgb(2, 119, 189);">
        <!--<el-button-->
        <!--type="text"-->
        <!--style="color:#fff; float: right; margin-top: 4px; margin-right: 10px;"-->
        <!--@click="checkSentenceError()">语法检查</el-button>-->
        <el-popover placement="left"
                    width="700"
                    style="color:#fff; float: right; margin-top: 10px; margin-right: 10px;"
                    min-height="300"
                    max-height="600"
                    size="mini"
                    trigger="click">
          <el-table :data="errorInfoData">
            <el-table-column width="300"
                             property="sentence"
                             label="错误句子"></el-table-column>
            <el-table-column width="250"
                             property="description"
                             label="错误描述"></el-table-column>
            <el-table-column width="150"
                             property="type"
                             label="错误类型"></el-table-column>
          </el-table>
          <el-button @click="checkSentenceError"
                     size="mini"
                     type="text"
                     slot="reference">语法检查</el-button>
        </el-popover>
      </div>
      <iframe id="bisengDocumentIframe"
              :src="docUrl"
              width="100%"
              height="100%"
              frameborder="0px;"></iframe>
    </div>

    <el-dialog class="selectCheckerDialog"
               title="选择审核员"
               :visible.sync="centerDialogVisible"
               width="60%"
               center>
      <SelectRoleUser ref="selectCheckUser"
                      roleType="sh"></SelectRoleUser>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="centerDialogVisible = false; yesToshenhe()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="saveModuleDialog"
               :title="currentRecord.dialogTitle"
               :visible.sync="currentRecord.dialogVisible"
               width="450px">
      <div style="text-align: left; margin-bottom: 10px;">
        <SearchCondition :conditions="currentRecord.inputArray"
                         style=" width: 100%;"></SearchCondition>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="mini"
                   @click="currentRecord.dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="currentRecord.dialogVisible = false; submitModuleItem();">完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SearchCondition from "../assistReorganizeCommon/SearchCondition";
import SelectRoleUser from "../assistReorganizeCommon/SelectRoleUser"
export default {
  components: {
    SearchCondition,
    SelectRoleUser
  },
  beforeMount () {
    var currentReportData = JSON.parse(localStorage.getItem("currentReportData"));
    if (currentReportData == null) {
      return;
    }
    this.attributeAray[0].value = currentReportData.title;
    // this.attributeAray[1].value = currentReportData.bglx;
    if (currentReportData.bw_obj && currentReportData.bw_obj[0].bglx) {
      this.attributeAray[1].value = currentReportData.bw_obj[0].bglx;
    }
    if (currentReportData.bw_obj && currentReportData.bw_obj[0].direction) {
      this.attributeAray[2].value = currentReportData.bw_obj[0].direction;
    }

    this.attributeAray[3].value = currentReportData.area;
    if (currentReportData.bw_obj && currentReportData.bw_obj[0].area) {
      this.attributeAray[3].value = currentReportData.bw_obj[0].area;
    }
    // if(currentReportData.mj && this.attributeAray[2]) {
    //   this.attributeAray[2].value = dictMap.map.mj[currentReportData.mj];
    // }
    this.currentReportData = currentReportData;
    this.uploadParam.bw_id = WebTool.urlQuery(location.href, "id");
    this.getDocData(this.uploadParam.bw_id);
    this.updateModuleOptions();
    this.getReportAttribute();
  },
  computed: {
    customStyle () {
      var h = "100%";
      if (this.attributePane.visible) {
        var tHeight = Math.ceil(this.attributePane.group.length / 2) * 40 + 40;
        h = `calc( 100% - ${tHeight}px )`;
      }
      return `height: ${h} ;`;
    },
  },
  watch: {
    "attributePane.group": {
      handler (val, older) {

      },
      deep: true
    }

  },
  data () {
    var token = localStorage.getItem("token");
    var uploadUrl = "sczb-URL-prefix/mbgl/import?token=" + token;
    var time = (new Date()).getTime();
    return {
      errorInfoData: [],
      centerDialogVisible: false,
      visible: false,
      uploadUrl: uploadUrl,
      uploadParam: {
        bw_id: ""
      },
      fileFlag: time,
      moduleOptions: [],
      moduleData: {
        file: "",
        action: "",
        value: []
      },
      docUrl: "",
      fileAccept: ".docx, .doc",
      tableInfo: {
        checkAll: false,
        isIndeterminate: false,
        value: [],
        selectData: '',
        page: {
          total: ''
        },
        extra: {
          prop: "abstract",
          justify: "end",
          width: 21,
          style: "font-size: 12px;"
        },
        header: [
          {
            // prop:"_id",
            label: "选择",
            type: "radio",
            width: 1
          },
          {
            prop: "title",
            label: "序号",
            type: "index",
            width: 2,
            style: "color: #999; text-align: center;"
          },
          {
            prop: "username",
            label: "名称",
            style:
              "text-align: left; font-weight: 700; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;;",
            width: 6
          },
          {
            prop: "roles",
            label: "当前角色",
            width: 4,
            style: "color: #999; text-align: center;"
          },
          {
            prop: "languages",
            label: "语言方向",
            width: 2,
            style: "color: #999; text-align: center;"
          },
          {
            prop: "taskNum",
            label: "任务数量",
            width: 2,
            style: "color: #999; text-align: center;"
          },

        ],
        data: []
      },
      attributeAray: [
        {
          name: "标题",
          value: "",
          type: "text",
          key: "title",
          prop: "title",
          required: 1,
          items: [{
            placeholder: ""
          }]
        },
        {
          name: "报文类型",
          value: "",
          type: "select",
          key: 'bglx',
          prop: "bglx",
          required: 1,
          items: [{
            options: [
              {
                label: "A",
                value: "0"
              }
            ]
          }]
        },
        {
          name: "方向",
          value: "",
          type: "select",
          key: 'sc_fx',
          prop: "sc_fx",
          required: 1,
          items: [{
            options: [
              {
                label: "A",
                value: "0"
              }
            ]
          }]
        },
        {
          name: "地理位置",
          value: "",
          type: "text",
          key: "area",
          prop: "area",
          required: 1,
          items: [{
            placeholder: ""
          }]
        }
      ],
      currentRecord: {
        dialogVisible: false,
        dialogTitle: "保存模板",
        inputArray: [
          {
            name: "模板名称",
            value: "",
            type: "text",
            items: [{
              placeholder: "请输入模板名称"
            }]
          }, {
            name: "模板类型",
            value: "",
            dataMap: {},
            type: "radio",
            key: "mblx",
            items: []
          }]
      },
      attributePane: {
        visible: false,
        icon: "el-icon-arrow-down",
        group: []
      }
    };
  },
  methods: {
    //语法错误检查
    checkSentenceError () {
      var id = this.currentReportData.id;
      var _self = this;
      this.adapter.viewDocumentText({
        _path: id
      }, function (d) {
        _self.adapter.checkContent({ text: d.data.data, language: "zh-CN" }, function (d) {
          var tData = d.data.matches.map(item => {
            var tItem = {
              sentence: item.sentence,
              description: item.message,
              type: item.rule.description
            }
            return tItem;
          });
          _self.errorInfoData = _self.util.filterArray(tData, "sentence")
        })
      })
    },
    //验证报文属性
    checkAttribute (tParam) {
      var arr = this.attributePane.group;
      var ret = true;
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var key = arr[i].key;
        if (item.required === 1 && (!tParam[key] || tParam[key].length == 0)) {
          ret = false;
          this.$message({
            message: `${item.name}属性不可为空`,
            type: "warning"
          })
          break;
        }
      }
      return ret;
    },
    //保存报文属性
    saveAttribute () {
      var tParam = this.attributeValue();
      var ret = this.checkAttribute(tParam);
      if (!ret) {
        return false;
      }
      tParam.bglx = this.attributeAray[1].value
      var param = {
        id: this.currentReportData.id,
        title: tParam.title,
        bw_obj: tParam
      }
      //处理方向字段--sc_fx->direction
      if (!!param.bw_obj.sc_fx) {
        param.bw_obj.direction = param.bw_obj.sc_fx
        delete param.bw_obj.sc_fx
      }
      var _self = this;
      this.adapter.saveReportAttribute({
        saveOrUpdate: JSON.stringify(param)
      }, function (d) {
        if (d.data.status === 0) {
          _self.$message({
            type: "success",
            message: "保存报文属性成功"
          });
        }
        _self.currentReportData.bw_obj = [tParam];
        localStorage.setItem("currentReportData", JSON.stringify(_self.currentReportData))
      })
    },

    //生成报文属性参数
    attributeValue () {
      var param = {};
      for (var k in this.attributePane.group) {

        var item = this.attributePane.group[k];
        var key = item.key;
        if (key) {
          param[key] = item.value;
        }
      }
      return param;
    },
    //获取报文属性列表
    getReportAttribute () {
      var _self = this;
      this.adapter.reportAttribute({
        pageNo: 1,
        pageSize: 1000
      }, function (d) {
        var tData = d.data.data.map(item => {
          var tItem = {
            name: item.name,
            value: "",
            type: "text",
            multiple: (item.checkflag === 1),
            key: item.keycode,
            required: item.needflag,
            items: [{
              placeholder: ""
            }]
          }
          if (_self.currentReportData.bw_obj && _self.currentReportData.bw_obj[0]) {
            tItem.value = _self.currentReportData.bw_obj[0][item.keycode] || "";
          }

          var vArr = [];
          if (item.value) {
            vArr = item.value.split(",");
            if (vArr.length === 1) {
              vArr = item.value.split("，");
            }
          }

          item.value2 = item.value2 || [];
          if (vArr && (vArr.length > 1 || item.checkflag === 0)) {
            tItem.type = "select";
            var count = 0;
            tItem.items[0].options = vArr.map(dd => {
              var tt = {
                label: dd,
                value: item.value2[count]
              }
              count++;
              return tt;
            });
          }
          return tItem;
        });
        var tArr = _self.attributeAray.concat(tData);
        // if(_self.currentReportData.status === "已通过") {
        //   tArr = tArr.map(item => {
        //     item.disabled = true;
        //   });
        // }
        _self.attributePane.group = tArr;
      });
    },
    //提交审核
    submitCheck () {
      if (!!this.currentReportData.bw_obj) {
        this.centerDialogVisible = true
        this.currentSubmitId = this.uploadParam.bw_id;
      } else {
        this.$message({
          message: "请添加报文属性后再提交审核",
          type: 'warning'
        })
      }
    },
    //打开属性面板
    switchAttributePane () {
      this.attributePane.visible = !this.attributePane.visible;
      if (this.attributePane.visible) {
        this.attributePane.icon = "el-icon-arrow-up";
      }
      else {
        this.attributePane.icon = "el-icon-arrow-down";
      }
    },
    //保存模板
    saveAsModule () {
      this.currentRecord.dialogVisible = true;
    },
    submitModuleItem () {
      var id = this.uploadParam.bw_id;
      var name = this.currentRecord.inputArray[0].value;
      var type = this.currentRecord.inputArray[1].value;
      type = dictMap.map.mblx[type];
      var param = {
        bw_id: id,
        name: name,
        mblx: type
      }
      var _self = this;
      this.adapter.saveAsModule({
        saveOrUpdate: JSON.stringify(param)
      }, function (d) {
        if (d.data.status === 0) {
          _self.$message({
            message: "生成模板成功。",
            type: "success"
          })
        }
        _self.updateModuleOptions();
      })
    },
    //确认提交给该审核员
    yesToshenhe () {
      var user = this.$refs.selectCheckUser.info.select;
      if (!user) {
        this.$message({
          message: '请选择审核员！',
          type: 'warning'
        })
        return
      }
      var _self = this;
      var save_data = JSON.stringify({
        "check_user": user,
        "id": this.uploadParam.bw_id,
      })
      this.adapter.submitZbrwToShenhe(
        {
          saveOrUpdate: save_data
        },
        function (d) {
          if (d.data.status == 0) {
            _self.$message({
              message: "提交审核成功",
              type: "success"
            });
            //提交审核成功后返回上一页
            setTimeout(function () {
              _self.$router.push({
                path: '/cbjl'
              })
            }, 3000)
          }
        }
      );
    },
    //导入模板文件时调用
    handleSelectFileChange (a, b, c) {
      this.moduleData.file = a;
      var formData = new FormData();
      formData.append("file", this.moduleData.file.raw);
      formData.append("bw_id", this.uploadParam.bw_id);
      var url = "sczb-URL-prefix/mbgl/import";
      var _self = this;
      this.$axios({
        url: url,
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(d => {
        _self.updateDocInfo(d);
      }).catch(error => {

      })
    },
    dealCompeteEvent (d) {
      this.updateDocInfo(d.data);
      this.moduleData.value = [];
    },
    updateDocInfo (d) {
      this.docUrl = decodeURIComponent(d.url);
    },
    getDocData (id) {
      var _self = this;
      var tableInfo = "tscp_info";
      this.adapter.getBisengDocData({ _path: id, table_name: tableInfo, act_type: "openEditor" }, function (d) {
        var tData = d.data;
        if (tData.status === 0 && tData.data) {
          tData = tData.data;
          _self.docUrl = decodeURIComponent(tData.url);
        }
      })
    },
    dealExceed () {
      this.moduleData.value.length = (this.moduleData.limit || 1);
    },
    dealerCascaderChange (v) {
      var id = v[v.length - 1];
      // var d = this.moduleItemsMap[id];
      var url = `sczb-URL-prefix/mbgl/${id}/_file`
      var query = {
        bw_id: this.uploadParam.bw_id
      }

      var _self = this;
      this.ajaxGET(url, query).then(d => {
        _self.updateDocInfo(d);
      });

    },
    //更新模板列表
    updateModuleOptions () {
      var _self = this;
      this.adapter.mouldDataTable({
        pageSize: 10000000,
        pageNo: 1
      }, function (d) {
        _self.moduleOptions = [];
        _self.moduleItemsMap = {};
        var arr = d.data.data;
        var map = {};
        for (var i = 0; i < arr.length; i++) {
          var type = arr[i].mblx;
          map[type] = map[type] || [];
          _self.moduleItemsMap[arr[i]._id] = arr[i];
          var item = {
            label: arr[i].name,
            value: arr[i]._id
          }
          map[type].push(item);
        }
        for (var k in dictMap.data.mblx) {
          var tItem = {
            label: dictMap.data.mblx[k],
            value: k,
            children: map[k]
          }
          _self.moduleOptions.push(tItem);
        }
        _self.moduleOptions.sort(function (a, b) {
          var t = Number(b.value) - Number(a.value);
          return t;
        })
      });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.editAreaTop {
  position: relative;
  float: left;
  padding: 5px 10px;
  background-color: #f8f9fa;
  width: 100%;
  z-index: 3;
}

.editorArea {
  position: relative;
  float: left;
  width: 100%;
  height: 100%;
  margin-top: 5px;
}

.editorArea[isHalf="true"] {
  height: 50%;
}

/deep/ .el-form-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attributePane {
  position: relative;
  float: left;
  width: 100%;
  max-height: 50%;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
}

/deep/ .attributePane .el-form-item {
  width: 50% !important;
  float: left;
}

/deep/ .el-form-item__content > div {
  width: 100%;
}
/deep/ .el-form-item__content > div .el-select {
  width: 100%;
}

/deep/ .el-table__body-wrapper {
  max-height: 350px;
  overflow-x: hidden;
}
</style>
