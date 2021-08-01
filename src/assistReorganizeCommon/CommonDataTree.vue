
<template>
  <div>
    <el-tree
      :data="data"
      node-key="_id"
      :show-checkbox="showCheckbox || false"
      ref="commonDataTree"
      default-expand-all
      @node-click="dealNodeClick"
      @check-change="dealCheckChange"
      :expand-on-click-node="false"
      >
    </el-tree>
  </div>
</template>

<script>
export default {
  mounted() {
    this.updateData();
  },
  updated( ){
    this.updateData();
  },
data() {
return {
  showCheckbox: false,
  nodeKey: "id",
  data: [],

defaultProps: {
children: 'children',
label: 'label'
},

};
},
  props: {
    treeData: Object
  },
  methods: {
    updateData() {
      for(var k in this.treeData) {
        if(k !== "data") {
          this[k] = this.treeData[k];
        }
        else {
          this.data.length = 0;
          for(var i = 0; i < this.treeData.data.length; i++) {
            this.data.push(this.treeData.data[i]);
          }
        }

      }
      // this.$forceUpdate();
    },
    dealNodeClick(data, node, obj) {
      this.$emit("dataTreeEvent", "nodeClick", node, data, obj);
    },
    dealCheckChange(data, node, obj) {
      this.$emit("dataTreeEvent", "checkChange", node, data, obj);
    },
    deleteFolderItem(d) {
      this.$emit("customClick", "deleteFolderItem", {
        _path: d._id
      });
    },
    getHalfCheckedNodes() {
      return this.$refs.commonDataTree.getHalfCheckedNodes();
    },
    switchFolderItem(d) {
      var param = {
        parent_id: d._id
      };
      if (d) {
        param.id = d._id;
      }
      this.$emit("customClick", "switchFolderItem", param);
    },
    editFolderItem(d) {
      if (this.data.input) {
        this.$emit("customClick", "editFolderItem", {
          parent_id: d._id,
          _id: item._id,
          label: this.data.input
        });
      }
    },
    checkChange(d) {

    },
    addFolderItem(d, item) {
      if (this.data.input) {
        this.$emit("customClick", "addFolderItem", {
          parent_id: d._id,
          label: this.data.input
        });
      }
    },
    handleOpen() {},
    handleClose() {},
    renderContent(h, { node, data, store }) {
      return (`
        <span class="custom-tree-node">
        <span>{node.label}</span>
        <span>
        <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
      <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
      </span>
      </span>`);
    }
  }
};
</script>

<style scoped>

</style>
