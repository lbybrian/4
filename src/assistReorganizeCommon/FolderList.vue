<template>
  <div :folderInfo="folderInfo">
    <slot v-for="(d, index) in folderInfo.data"  >
      <el-menu
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        v-bind:key="d.id"
        :router="true"
        :default-openeds="defaultOpeneds"
        style="background-color: #ddd; margin-bottom: 15px;"
      >
        <el-submenu :index="index + ''">
          <template slot="title">
            <span slot="title">{{d.label}}</span>
          </template>
          <el-menu-item-group style="background-color: #eee;">
            <slot v-if="!d.hideOther">
              <el-menu-item @click="switchFolderItem(d);">
                <label >未分组</label>
              </el-menu-item>
            </slot>

            <slot v-for="item in d.children">
              <el-menu-item  @click="switchFolderItem(d, item);">
                <label
                  :title="item.label"
                  style="width: 90px; overflow: hidden; white-space:nowrap; text-overflow:ellipsis; display: inline-block;"
                >{{item.label}}</label>
                <div style="display: inline-block; float: right; position: absolute; right: 10px;">
                  <el-popover placement="right" width="200" v-model="item.visible" trigger="click">
                    <el-input
                      :placeholder="folderInfo.placeholder"
                      v-model="folderInfo.input"
                      size="small"
                      class="input-with-select"
                    >
                      <el-button
                        @click="editFolderItem(d, item); item.visible=false;"
                        slot="append"
                      >确认</el-button>
                    </el-input>
                    <el-button
                      slot="reference"
                      style="margin-left: 10px;"
                      type="text"
                      @click="item.visible=false; folderInfo.input = item.label;"
                      icon="el-icon-edit-outline"
                    ></el-button>
                  </el-popover>
                  <el-popover placement="right" width="200" v-model="item.tVisible" trigger="click">
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.tVisible = false">取消</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="item.tVisible = false; deleteFolderItem(d, item);"
                      >确定</el-button>
                    </div>
                    <el-button
                      slot="reference"
                      style="margin-left: 0px;"
                      type="text"
                      @click="item.tVisible=false; folderInfo.input = item.label;"
                      icon="el-icon-delete"
                    ></el-button>
                  </el-popover>
                </div>
              </el-menu-item>
            </slot>
            <slot v-if="!d.hideAddButton">
            <el-menu-item>
              <el-popover placement="right" width="200" v-model="d.visible" trigger="click">
                <el-input
                  size="small"
                  :placeholder="folderInfo.placeholder"
                  v-model="folderInfo.input"
                  class="input-with-select"
                >
                  <el-button @click="addFolderItem(d, item); d.visible=false;" slot="append">确认</el-button>
                </el-input>
                <el-button @click="folderInfo.input='';" type="text" slot="reference">新建目录</el-button>
              </el-popover>
            </el-menu-item>
            </slot>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </slot>
  </div>
</template>

<script>
export default {
  name: "FolderList",
  props: {
    folderInfo: Object
  },
  data() {
    return {
      "defaultOpeneds": ["0", "1"]
    }
  },
  methods: {
    deleteFolderItem(d, item) {
      this.$emit("customClick", "deleteFolderItem", {
        id: item._id
      });
    },
    switchFolderItem(d, item) {
      var param = {
        parent_id: d._id
      };
      if (item) {
        param.id = item._id;
      }
      this.$emit("customClick", "switchFolderItem", param);
    },
    editFolderItem(d, item) {
      if (this.folderInfo.input) {
        this.$emit("customClick", "editFolderItem", {
          parent_id: d._id,
          _id: item._id,
          label: this.folderInfo.input
        });
      }
    },
    addFolderItem(d, item) {
      if (this.folderInfo.input) {
        this.$emit("customClick", "addFolderItem", {
          parent_id: d._id,
          label: this.folderInfo.input
        });
      }
    },
    handleOpen() {},
    handleClose() {}
  }
};
</script>

<style scoped>
.el-menu-item {
  padding: 0px;
  padding-left: 20px !important;

}
.el-submenu__title {
  background-color: #666;
  color: #fff;
  padding-left: 10px !important;
}
.el-submenu__title:hover {
  background-color: #999;
}
  .el-menu-vertical-demo:nth-child(2){
    display: none;
  }
</style>
