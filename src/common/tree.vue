<template>
  <div style="height: 100%;">
    <el-tree class="custom-tree-node" :flag="hideParentCheckBox" :data="tree" ref="tree" :accordion="accordion"
      :node-key="nodeKey" :default-expand-all="expandAll" :expand-on-click-node="expandClickNode"
      :highlight-current="highlightCurrent" :indent="treeIndent" :show-checkbox="treeShowCheckbox"
      :check-strictly="treeCheckStrictly" :default-expanded-keys="defaultExpandedKeys" :check-on-click-node="checkonclicknode"
      @node-click="nodeClick" @check="check" @check-change="checkChange" @node-expand="nodeExpand">
      <div class="span-ellipsis" slot-scope="{ node, data }" :id="'nodeId' + node.id"
        @mouseenter="enter('nodeId' + node.id, data, node)" @mouseleave="leave('nodeId' + node.id, data)">
        <span class="span_label" :title="node.label" v-if="collect">{{ `${node.label}(${ data.count || 0})` }}</span>
        <span class="span_label" :title="node.label" v-else>{{ node.label }}</span>
        <span class="hoverIcon span_label_show" v-if="editable" style=" display: none;">
          <span class="el-icon-circle-plus opButton" v-if="isClickBtn && editableData.indexOf('entityappendNode')!=-1" @click.stop="() => entityappendNode(node, data)" title="新增实体"></span>
          <span class="el-icon-plus opButton" style="color: #409EFF" v-if="editableData.indexOf('appendNode')!=-1" @click.stop="() => appendNode(node, data)" title="添加"></span>
          <span class="el-icon-edit opButton" v-if="editableData.indexOf('editNode')!=-1" @click.stop="() => editNode(node, data)" title="编辑"></span>
          <span class="el-icon-close opButton" v-if="editableData.indexOf('removeNode')!=-1" @click.stop="() => removeNode(node, data)" title="删除"></span>
        </span>
      </div>
    </el-tree>
    <el-dialog :title="dialogData.title" :visible.sync="dialogData.visible" append-to-body @close="closeDialog">
      <el-form :model="dialogData.form" :rules="dialogData.tagRule" ref="form">
        <el-form-item label="名称" label-width="120px" prop="label">
          <el-input v-model="dialogData.form.label" auto-complete="off" autofocus placeholder="输入名称"></el-input>
        </el-form-item>

        <!-- 菜单infomation -->
        <div class="menuTxtBox" v-if="isShowMenu">
          <el-form-item label="类型" label-width="120px">
            <el-radio-group v-model="dialogData.form.resource">
              <el-radio label="0">菜单</el-radio>
              <el-radio label="1">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="路径" label-width="120px" prop="address">
            <el-input v-model="dialogData.form.address" auto-complete="off" autofocus placeholder="输入路径"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="排序" label-width="120px" prop="is_order" v-if="isOrder">
          <el-input-number v-model="dialogData.form.is_order" controls-position="right" size="small" :min="1" style="width: 20%" placeholder="输入排列顺序"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" v-if="isShowMenu">
            <el-input type="textarea" v-model="dialogData.form.noteText"></el-input>
          </el-form-item>
        <el-form-item label="设置颜色" label-width="120px" prop="color" v-if="colorIsShow">
          <div class="block">
            <el-color-picker v-model="dialogData.form.color"></el-color-picker>
          </div>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="dialogSure('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'tree',
    props: {
      tree: {
        type: Array,
        default: [],
        required: true,
      },
      expandAll: {
        //全部展开
        type: Boolean,
        default: false,
      },
      expandClickNode: {
        //点击节点展开与否
        type: Boolean,
        default: false,
      },
      accordion: {
        //是否手风琴模式
        type: Boolean,
        default: false,
      },
      nodeKey: {
        //唯一标识
        type: String,
        required: true,
      },
      highlightCurrent: {
        //当前选择是否高亮
        type: Boolean,
        default: false,
      },
      treeIndent: {
        //水平缩进
        type: Number,
        default: 12,
      },
      treeShowCheckbox: {
        //是否复选
        type: Boolean,
        default: true,
      },
      treeCheckStrictly: {
        //是否严格的遵循父子不互相关联的做法配合单选(20210304将父子不关联与是否单选功能分开)
        type: Boolean,
        default: true,
      },
      treeCheckSingel: {
        //是否单选
        type: Boolean,
        default: false,
      },
      defaultExpandedKeys:{
        //默认展开的节点的 key 的数组
        type: Array,
        default: ()=>{return []},
      },
      editable: {
        //可否编辑
        type: Boolean,
        default: true,
      },
      editableData: {
        //可编辑按钮权限
        type: Array,
        default: ()=>{return ["entityappendNode", "appendNode", "editNode", "removeNode"]},
      },
      collect: {
        //是否展示统计
        type: Boolean,
        default: true,
      },
      hideParentCheckBox: {
        //是否展示统计
        type: Boolean,
        default: true,
      },
      isShow:{
        type:Boolean,
        default: false,
      },
      colorIsShow:{
        type:Boolean,
        default:false
      },
      checkonclicknode:{
        type:Boolean,
        default:false
      },
      //是否显示实体按钮
      isClickBtn:{
        type:Boolean,
        default:false
      },
      // 是否显示排序
      isOrder:{
        type:Boolean,
        default:true
      },
      //是否显示menu输入信息
      isShowMenu:{
        type:Boolean,
        default:false
      }
    },
    data() {
      var checkLabel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入名称'));
        } else if(value.indexOf('→') != -1){
          callback(new Error("名称中不能包含特殊字符'→'"));
        }else{
          callback();
        }
      };
      // var writeUrl = (rule,value,callback) => {
      //   if(value === ''){
      //     callback(new Error('请输入路径'))
      //   }else{
      //     callback()
      //   }
      // };
      return {
        checkBoxData: [],
        dialogData: {
          title: '',
          visible: false,
          form: {
            label: '',
            is_order:'',
            color:"#409EFF",
            address:'',
            resource:'0',
            noteText:'',
          },
          tagRule: {
            label: [
              {validator: checkLabel, trigger: 'blur',message:"请输入名称"},
              { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            // address:[
            //   {validator:writeUrl,trigger: 'blur',message:"请输入路径"}
            // ],
          },
          
        },
        
      }
    },
    methods: {
      // 鼠标移入移除 控制左侧标签树icon的显隐
      enter(id, data, node) {
        data.show = true
        $('#' + id)
          .children('.hoverIcon')
          .show()
      },
      leave(id, data) {
        data.show = false
        $('#' + id)
          .children('.hoverIcon')
          .hide()
      },
      // 实体新增
      entityappendNode(node,data){
        this.dialogData.visible = true
        this.dialogData.title = '添加实体标签'
        let key = this.$refs.tree.getCheckedKeys()
        console.log(node,data,key,"添加实体标签")
        this.$emit('entityappendNode', node,data,key);
      },
      //添加子节点
      appendNode(node, data) {
        console.log(node,data,"添加节点")
        this.dialogData.visible = true
        this.dialogData.title = '添加节点'
        this.$emit('appendNode', node,data);
      },
      editNode(node, data) {
        console.log(node, data, '编辑')
        this.dialogData.visible = true
        this.dialogData.title = '编辑节点'
        this.$nextTick(() => {
          this.dialogData.form.label = node.label
          this.dialogData.form.is_order = node.data.orderby
          this.dialogData.form.color = node.data.color
          this.dialogData.form.address = node.data.menuUrl
          this.dialogData.form.resource = node.data.menuType
          this.dialogData.form.noteText = node.data.reMark
        })

        this.$emit('editNode', node,data);
      },
      removeNode(node, data) {
        this.$emit('removeNode', node, data)
      },
      //节点点击事件
      nodeClick(data, node, self) {
        let key = this.$refs.tree.getCheckedKeys()
        this.$emit('nodeClick', data, node, self, key)
      },
      //icon点击事件
      nodeExpand(data, node, self){
        this.$emit('nodeExpand', data, node, self)
      },
      // 选中事件
      check(data, node) {
        let flat = this.$refs.tree.getCheckedNodes() //所选中的结构集合
        let key = this.$refs.tree.getCheckedKeys() //所选中的节点Key集合
        this.$emit('nodeCheck', data, node, flat, key)
      },
      //选中节点变化事件
      checkChange(data, checked, node) {
        if (this.treeCheckSingel && checked) {
          this.$refs.tree.setCheckedNodes([data])
        }
      },
      //关闭弹框
      closeDialog() {
        this.dialogData.visible = false
        // this.dialogData.form.label = ''
        this.$refs.form.resetFields()
      },
      // 弹窗提交
      dialogSure() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.dialogData.title == '添加节点') {
              if(this.colorIsShow == false){
                this.dialogData.form.color = ""
              }
              this.appendNodeSubmit(this.dialogData.form)
              this.dialogData.visible = false
            } else if(this.dialogData.title == '添加实体标签'){
              this.entityAppendNodeSubmit(this.dialogData.form)
              this.dialogData.visible = false
            }else {
              this.editNodeSubmit(this.dialogData.form)
              this.dialogData.visible = false
            }
          }
        })
      },
      //实体新增提交
      entityAppendNodeSubmit(data) {
        console.log(data,"实体新增标签")
        console.log(this.dialogData.form)
        data["labels"] = this.dialogData.form.label;
        if(this.isShow == false){
          this.dialogData.visible = false
        }else{
          this.dialogData.visible = true
        }
        this.$emit('entityAppendNodeSubmit', data)
      },
      //新增提交
      appendNodeSubmit(data) {
        console.log(data,"新增ztree")
        console.log(this.dialogData.form)
        data["labels"] = this.dialogData.form.label;
        data["orderBy"] = this.dialogData.form.is_order;
        if(this.isShow == false){
          this.dialogData.visible = false
        }else{
          this.dialogData.visible = true
        }
        this.$emit('appendNodeSubmit', data)
      },
      //编辑提交
      editNodeSubmit(data) {
        console.log(this.dialogData.form.label);
        data["labels"] = this.dialogData.form.label;
        data["orderBy"] = this.dialogData.form.is_order;
        if(this.isShow == false){
          this.dialogData.visible = false
        }else{
          this.dialogData.visible = true
        }
        this.$emit('editNodeSubmit', data)
      },
      //获取选中的node
      getCheckedNodes() {
        return this.$refs.tree.getCheckedNodes()
      },
      //设置目前勾选的节点
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes()
      },
      //获取选中的节点的 key 所组成的数组
      getCheckedKeys() {
        return this.$refs.tree.getCheckedKeys()
      },
      //通过 keys 设置目前勾选的节点
      setCheckedKeys(keys) {
        return this.$refs.tree.setCheckedKeys(keys)
      },
      getNode(key) {
        return this.$refs.tree.getNode(key);
      },
      //获取当前被选中节点的 key
      getCurrentKey() {
        return this.$refs.tree.getCurrentKey()
      },
      //获取当前被选中节点的 data
      getCurrentNode() {
        return this.$refs.tree.getCurrentNode()
      },
      //删除 Tree 中的一个节点
      remove() {
        return this.$refs.tree.remove()
      },
      //为 Tree 中的一个节点追加一个子节点
      append() {
        return this.$refs.tree.append()
      },
      setValue(labelId){
        this.$refs.tree.setCheckedKeys([labelId],true);
      },
      clean(){
        this.$refs.tree.setCheckedKeys([]);
      },
      // getVal(val){
      //   console.log(val)
      //   if(val == 0){
      //     this.dialogData.form.txtLabel = '路径'
      //   }else{
      //     this.dialogData.form.txtLabel = '标示'
      //   }
      // }
    },
  }

</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .opButton {
    margin-left: 7px;
  }

  .span_label {
    float: left;
    width: calc(100% - 120px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .span_label_show {
    float: right;
    width: 105px;
    /*overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;*/
  }

  .span-ellipsis {
    float: right;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }



  /* /deep/ .custom-tree-node[flag=true] .el-tree-node__expand-icon+label.el-checkbox {
    display: none;
  }

  /deep/ .custom-tree-node[flag=true] .is-leaf+label.el-checkbox {
    display: inline-block !important;
  } */

</style>
