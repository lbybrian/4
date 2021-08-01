<template>
  <div class="mainArea">
    <el-row>
      <el-form :model="daiyiform"
               :rules="rules"
               ref="form"
               label-position="right"
               class="demo-ruleForm"
               :validate-on-rule-change="false">
        <el-form-item label="任务主题"
                      label-width="80px"
                      prop="label">
          <el-input v-model="daiyiform.label"
                    auto-complete="off"
                    autofocus
                    placeholder="请填写任务主题"></el-input>
        </el-form-item>
        <el-form-item label="完成时间"
                      label-width="80px"
                      prop="time">
          <el-date-picker v-model="daiyiform.time"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="需求描述"
                      label-width="80px"
                      prop="xqms">
          <el-input type="textarea"
                    :rows="2"
                    v-model="daiyiform.xqms"
                    auto-complete="off"
                    autofocus
                    placeholder="请填写需求描述"></el-input>
        </el-form-item>
        <el-form-item label="语种选择"
                      label-width="80px"
                      prop="lanaguagesvalue">
          <el-select v-model="daiyiform.lanaguagesvalue"
                     placeholder="请选择">
            <el-option v-for="item in languagesoptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div class="rightArea">
        <div class="contentArea"
             style="background-color: #fdfdfd; float: left; position:relative;">
          <DataTableItem style="position: relative; float: left; width: 100%;"
                         @pageChange="dealPageChange"
                         @selectChange="dealSelectChange"
                         @sizeChange="dealSizeChange"
                         :tableInfo="this.info"
                         @buttonClick="dealButtonClick" />
        </div>
      </div>
      <div class="leftArea"
           style="box-shadow: 1px 0px 0px #f2f2f2;">
        <div class="contentArea"
             style="padding: 10px; overflow: auto;">
          <el-tree :data="treeData.data"
                   node-key="treeData.nodeKey"
                   :show-checkbox="treeData.showCheckbox || false"
                   ref="commonDataTree"
                   default-expand-all
                   @node-click="dealDataTree"
                   :expand-on-click-node="false">
          </el-tree>
        </div>
      </div>
    </el-row>

  </div>
</template>
<script>
import CommonDataTree from "../assistReorganizeCommon/CommonDataTree";
import DataTableItem from "../assistReorganizeCommon/DataTableItem";

export default {
  components: {
    CommonDataTree,
    DataTableItem
  },
  beforeMount () {
    this.info = this.tableInfo;
  },
  mounted () {
    this.updateDeptTree();
    this.updateRolesData();
  },
  watch: {
    treeData: {
      handler (newValue) {
        this.value = newValue;
      },
      deep: true
    }
  },
  methods: {
    // 接受表单数据
    getformdata () {
      if (this.daiyiform.label === '') {
        this.$message({
          message: '请输入任务主题！',
          type: 'warning'
        })
        return
      }
      if (this.daiyiform.time === '') {
        this.$message({
          message: '请选择完成时间！',
          type: 'warning'
        })
        return
      }
      if (this.daiyiform.xqms.trim() === '') {
        this.$message({
          message: '请输入需求描述！',
          type: 'warning'
        })
        return
      }
      if (this.daiyiform.lanaguagesvalue.trim() === '') {
        this.$message({
          message: '请选择语种！',
          type: 'warning'
        })
        return
      }
      var res = this.daiyiform;
      this.$emit('getformdata', res)
    },
    dealPageChange (val) {
      this.updateUserRoleTable(this.currentDept, val, 10);
    },
    dealSizeChange (val) {
      this.updateUserRoleTable(this.currentDept, 1, val);
    },
    dealSelectChange (val) {
      this.$emit('selectChange', this.tableInfo.selectData)
    },
    updateRolesData () {
      var _self = this;
      this.adapter.getRolesList({}, function (d) {
        var tData = d.data.data;
        _self.roleSelectTree.data = tData;
        _self.roleSelectTree.data = tData.map(function (item) {
          item.label = item.name;
          item.id = item._id;
          if (item.children) {
            item.children = item.children.map(function (d) {
              d.label = d.name;
              d.id = d._id;
              return d;
            })
          }
          return item;
        });
      });
    },
    updateDeptTree (callback) {
      var _self = this;
      this.adapter.getDeptTree({}, function (d) {
        var tData = d.data.data;
        _self.treeData.data = _self.util.transferTreeData(tData);
        if (typeof (callback) === "function") {
          callback(tData);
        }
      });
    },
    dealDataTree (param) {
      var id = param._id;
      var _self = this;
      this.currentDept = id;
      this.updateUserRoleTable(id);
      // this.getformdata()
    },
    updateUserRoleTable (id, pager, size) {
      var _self = this;
      this.adapter.getDeptUsers({
        dept_id: id,
        query_type: 'fy',
        pageNo: pager,
        pageSize: size
      }, function (d) {
        var tData = d.data.data;
        var newData = d.data;
        _self.tableInfo.data = tData.map(function (item) {
          item.roleItems = item.roles;
          item.id = item.username;
          var roles = item.roles;
          _self.currentUserRoles = roles;
          if (roles && roles.length > 0) {
            var str = roles[0].name;
            for (let i = 1; i < roles.length; i++) {
              str += "," + roles[i].name;
            }
            item.roles = str;
          }
          else {
            item.roles = "";
          }
          return item;
        });
        _self.tableInfo.page = newData.pager;
      })
    },
    updateSelectedNodes () {
      var selectNodes = this.$refs.roleSelectTree.getCheckedNodes();
      var ids = selectNodes.map(function (tItem) {
        return tItem._id;
      })
      var param = {
        user_id: this.currentRecord.data._id,
        role_ids: ids
      }
      var query = {
        user_roles: JSON.stringify(param)
      }
      var _self = this;
      this.adapter.updateUserRoles(query, function () {
        _self.updateUserRoleTable(_self.currentDept)
      });
    },

    dealButtonClick (name, param, index) {
      if (typeof this[name] === "function") {
        this[name](param, index);
      }
    }
  },
  data: function () {
    return {
      languagesoptions: [
        {
          value: 'zh',
          label: '中文'
        }, {
          value: 'en',
          label: '英语'
        }, {
          value: 'jp',
          label: '日语'
        }, {
          value: 'kor',
          label: '韩语'
        }, {
          value: 'fra',
          label: '法语'
        }, {
          value: 'ru',
          label: '俄语'
        }],
      info: {
        checkAll: false,
        isIndeterminate: false,
        value: [],
        selectData: '',
        pageLayout: "total, prev, pager, next, jumper",
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
            label: "",
            type: "radio",
            width: 2
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
              "text-align: left; font-weight: 700; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;",
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
            label: "语言方向他",
            width: 3,
            style: "color: #999; text-align: center;"
          },
          {
            prop: "taskNum",
            label: "任务数量",
            width: 3,
            style: "color: #999; text-align: center;"
          },

        ],
        data: []
      },
      // currentRecord: {
      //   input: "",
      //   select: "",
      //   dialogVisible: false
      // },
      treeData: {
        showCheckbox: false,
        "nodeKey": "_id",
        data: []
      },
      roleSelectTree: {
        defaultCheckedKeys: [],
        data: [{
          "_id": "adfasdfaafd",
          "label": "捡报员"
        }, {
          "_id": "aaaaaaaa",
          "label": "整编员"
        }],
        showCheckbox: true,
        "nodeKey": "id"
      },
      // 待译弹窗上面表格
      daiyiform: {
        label: '',
        time: '',
        xqms: '',
        lanaguagesvalue: '',
      },
      // 待译弹窗表格验证
      rules: {
        label: [
          { required: true, message: '请输入任务主题', trigger: 'blur' },
        ],
        time: [
          { required: true, message: '请选择完成时间', trigger: 'change' }
        ],
        lanaguagesvalue: [
          { required: true, message: '请选择一个语种', trigger: 'change' }
        ],
        xqms: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    tableInfo: Object
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.mainArea {
  width: 100%;
  height: auto;
  min-height: 500px;
  float: left;
  position: relative;
  box-sizing: border-box;
}

.rightArea {
  width: 100%;
  position: relative;
  padding-left: 240px;
  height: auto;
  float: left;
}

.leftArea {
  width: 230px;
  float: left;
  height: auto;

  position: absolute;
  z-index: 2;
}

.contentArea {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.multiButtons {
  position: fixed;
  top: 100px;
  right: 35px;
  z-index: 999;
}
</style>
