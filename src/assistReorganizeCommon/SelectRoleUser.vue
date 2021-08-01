<template>
  <div class="mainArea">
    <el-row>
      <div class="rightArea">
        <div class="contentArea"
             style="background-color: #fdfdfd; float: left; position:relative;">
          <DataTableItem style="position: relative; float: left; width: 100%;"
                         @pageChange="dealPageChange"
                         @sizeChange="dealSizeChange"
                         @selectChange="dealSelectChange"
                         :tableInfo="this.info" />
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
  mounted () {
    this.updateDeptTree();
    this.updateRolesData();
    // this.info.selectData = [];
    this.info.select = "";
    // this.info.value = [];
  },
  updated () {

  },
  created () {

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
    dealPageChange (val) {
      this.updateUserRoleTable(this.currentDept, val, 10);
    },
    dealSizeChange (val) {
      this.updateUserRoleTable(this.currentDept, 1, val);
    },
    dealSelectChange (val) {
      this.$emit("userChange", val);
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
      this.currentDept = id;
      this.updateUserRoleTable(id);
    },
    updateUserRoleTable (id, pager, size) {
      var _self = this;
      this.adapter.getDeptUsers({
        dept_id: id,
        query_dept_type: 1,
        // role_name:'cpsh',
        query_type: this.roleType,
        pageNo: pager,
        pageSize: size
      }, function (d) {
        var tData = d.data.data;
        var newData = d.data;
        _self.info.data = tData.map(function (item) {
          item.roleItems = item.roles;
          item.id = item.username;
          var roles = item.roles;
          _self.currentUserRoles = roles;
          if (roles && roles.length > 0) {
            var str = roles[0].name;
            for (let i = 1; i < roles.length; i++) {
              if (roles[i] && roles[i].name) {
                str += "," + roles[i].name;
              }
            }
            item.roles = str;
          }
          else {
            item.roles = "";
          }
          return item;
        });
        _self.info.page = newData.pager;
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
    }
  },
  data: function () {
    return {
      info: {
        checkAll: false,
        isIndeterminate: false,
        select: "",
        value: [],
        selectData: '',
        pageLayout: "total, prev, pager, next, jumper",
        page: {
          total: ''
        },
        header: [
          {
            // prop:"_id",
            label: "选择",
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
              "text-align: left; font-weight: 700;",
            width: 3
          },
          {
            prop: "roles",
            label: "当前角色",
            width: 9,
            style: "color: #999; text-align: center;overflow: hidden; white-space:nowrap; text-overflow:ellipsis;"
          },
          {
            prop: "languages",
            label: "语言方向",
            width: 4,
            style: "color: #999; text-align: center;overflow: hidden; white-space:nowrap; text-overflow:ellipsis;"
          },
          {
            prop: "taskNum",
            label: "任务数量",
            width: 4,
            style: "color: #999; text-align: center;"
          },

        ],
        data: []
      },
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
    };
  },
  props: {
    roleType: String
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
