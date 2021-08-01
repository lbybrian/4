<template>
  <div>
    <ul class="rightButton">
      <li v-if="isList===true"
          style="height: 50px;">
        <img v-if="$route.path == '/dxsc'"
             style="cursor: pointer;width: 56px;"
             @click="showRigthForm"
             src="../assets/image/account.png">
      </li>
      <li v-if="isList===true&&isSearch!==true">
        <el-button size="small"
                   @click="read"
                   type="primary">标记已读</el-button>
      </li>
      <li v-if="isSearch!==true">
        <el-button size="small"
                   type="primary"
                   @click="setClass">设置分类</el-button>
      </li>

      <li>
        <el-button size="small"
                   type="primary"
                   @click="handleToUse">加入待编</el-button>
      </li>
      <li>
        <el-button class="sqfy"
                   size="small"
                   type="primary"
                   @click="handleTrans">加入待译</el-button>
      </li>
      <li v-if="isSearch!==true">
        <el-button size="small"
                   type="primary"
                   @click="batchFq">标记废弃</el-button>
      </li>
    </ul>

    <el-dialog title="设置分类"
               :visible.sync="setClassVisible"
               width="40%"
               append-to-body>
      <div class="classItemsArea">
        <el-radio-group v-model="currentClass"
                        size="mini">
          <el-radio v-for="d in types"
                    :key="d.id"
                    :label="d.classify"
                    border>{{d.label}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="mini"
                   @click="setClassVisible = false">取 消</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="setClassVisible = false; submitSetClass()">确 定</el-button>
      </span>
    </el-dialog>
    <!--点击采用-加入待编 树弹框-->
    <el-dialog title="加入待编"
               :visible.sync="dialogVisible"
               width="60%"
               append-to-body>
      <SelectRoleUser ref="selectMaterialUser"
                      roleType="zb"></SelectRoleUser>
      <span slot="footer"
            class="dialog-footer">
        <el-button sizi="mini"
                   @click="cancelToEdit">取 消</el-button>
        <el-button sizi="mini"
                   type="primary"
                   @click="yesToEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="申请翻译"
               :visible.sync="dialogVisible1"
               width="60%"
               append-to-body>
      <el-form :model="translateTask.model"
               :rules="translateTask.rules"
               ref="translateTaskForm"
               label-position="right"
               class="demo-ruleForm"
               :validate-on-rule-change="false">
        <el-form-item label="任务主题"
                      label-width="80px"
                      prop="label">
          <el-input v-model="translateTask.model.label"
                    auto-complete="off"
                    autofocus
                    placeholder="请填写任务主题"></el-input>
        </el-form-item>
        <el-form-item label="完成时间"
                      label-width="80px"
                      prop="date">
          <el-date-picker v-model="translateTask.model.date"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item label="语种选择" label-width="80px" prop="language">-->
        <!--          <el-select v-model="translateTask.model.language" placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in translateTask.languageOptions"-->
        <!--              :key="item.value"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="需求描述"
                      label-width="80px"
                      prop="description">
          <el-input type="textarea"
                    :rows="2"
                    v-model="translateTask.model.description"
                    auto-complete="off"
                    autofocus
                    placeholder="请填写需求描述"></el-input>
        </el-form-item>

      </el-form>
      <SelectRoleUser ref="selectTranslateUser"
                      roleType="fy"></SelectRoleUser>
      <span slot="footer"
            class="dialog-footer">
        <el-button sizi="mini"
                   @click="cancelTodaiyi">取 消</el-button>
        <el-button sizi="mini"
                   type="primary"
                   @click="yesTodaiyi">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import AddToDaiyi from './addTodaiyi'
import SelectRoleUser from "../assistReorganizeCommon/SelectRoleUser"
// const ES = '/es'
const API = '/rest/v1'
const URL = '/index_sczb/sc_info/'
export default {
  name: "Handle",
  props: ['arrList', 'types', 'isList', 'isSearch', 'select', 'alldata'],
  components: {
    SelectRoleUser,
    AddToDaiyi
  },
  data () {
    var options = [];
    for (var k in dictMap.data.sys_yz) {
      var item = {
        label: dictMap.data.sys_yz[k],
        value: k
      };
      options.push(item);
    }
    return {
      // 采用 加入待编
      dialogVisible: false,
      dialogVisible1: false,
      // 弹框选中的节点树
      currentClass: "",
      setClassVisible: false,
      selectNodes: [],
      defaultChecked: [],
      usernames: '',
      formdata: [],
      tableInfo: {
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
              "text-align: left; font-weight: 700; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;",
            width: 3
          },
          {
            prop: "roles",
            label: "当前角色",
            width: 8,
            style: "color: #999; text-align: center; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;"
          },
          {
            prop: "languages",
            label: "语言方向",
            width: 4,
            style: "color: #999; text-align: center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"
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
      iLength: 0,
      radio: 1,
      radioSelect: false,
      checkedSelect: true,
      translateTask: {
        // 待译弹窗表格验证
        rules: {
          label: [
            { required: true, message: '请输入任务主题', trigger: 'blur' },
          ],
          date: [
            { required: true, message: '请选择完成时间', trigger: 'change' }
          ],
          // language: [
          //   { required: true, message: '请选择一个语种', trigger: 'change' }
          // ],
          description: [
            { required: true, message: '请填写翻译需求描述', trigger: 'blur' }
          ]
        },
        model: {
          label: '',
          date: '',
          description: '',
          // language: ''
        },
        languageOptions: options
      }
    }
  },
  created () {
    this.currentClass = this.select;
  },
  mounted () {
    if (this.types && this.select) {
      this.types.forEach(d => {
        if (d.label === this.select) {
          this.defaultChecked.push({
            id: d.id,
            label: d.label
          })
        }
      })
    }
    this.currentClass = this.select;
  },
  updated () {
    // this.currentClass = this.select;
  },
  methods: {
    // 右侧统计页面
    showRigthForm () {
      this.$emit('showRight', 'showRight')
    },
    // 获取弹窗子组件表单数据
    getformdata (res) {
      this.formdata = res;
    },
    // 已读操作
    read () {
      if (this.arrList.length === 0) {
        this.$message({
          message: '请选择要标记的数据！',
          type: 'warning'
        })
        return
      }
      this.ajaxPOST(API + '/read', {
        ids: JSON.stringify(this.arrList)
      }).then(_ => {
        this.$message({
          message: '标记已读成功！',
          type: 'success'
        })
        this.$emit('getList')
      }).catch(e => {
        this.$message({
          message: '标记已读失败：' + e,
          type: 'warning'
        })
      })
    },

    setClass () {
      if (this.arrList.length === 0) {
        this.$message({
          message: '请选择要分类的列表数据！',
          type: 'warning'
        })
        return
      }
      this.setClassVisible = true;
    },

    // 分类操作
    submitSetClass () {
      if (!this.currentClass) {
        this.$message({
          message: '需要选中一个分类！',
          type: 'warning'
        });
        return false;
      }
      var _self = this;
      this.ajaxPOST(API + URL + 'id/batchUpdate', {
        update_data: JSON.stringify({
          classify: this.currentClass
        }),
        ids: JSON.stringify(this.arrList)
      }).then(r => {
        _self.$message({
          message: '标记分类成功！',
          type: 'success'
        })

        _self.$emit('getList')
        // _self.currentClass = "";
      }).catch(e => {
        _self.$message({
          message: '标记分类失败：' + e,
          type: 'warning'
        })
      })


    },
    //节点单选
    clickCheckedNode (data, checked) {
      let _self = this;
      this.iLength++;
      if (_self.iLength % 2 === 0) {
        if (checked) {
          _self.$refs.typeTrees.setCheckedNodes([]);
          _self.$refs.typeTrees.setCheckedNodes([data.id]);
        } else {
          _self.$refs.typeTrees.setCheckedNodes([])
        }
      }

    },
    // 批量删除
    batchFq () {
      if (this.arrList.length === 0) {
        this.$message({
          message: '请选择要废弃的数据！',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将废弃文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认删除
        this.ajaxPOST(API + "/original/sc/deleteBatch", {
          ids: JSON.stringify(this.arrList)
        }).then(_ => {
          this.$message({
            message: '废弃成功！',
            type: 'success'
          })
          this.$emit('getList')
        }).catch(e => {
          this.$message({
            message: '废弃失败：' + e,
            type: 'warning'
          })
        })
      }).catch(() => { // 取消废弃
        this.$message({
          message: '取消废弃',
          type: 'warning'
        })
      })
    },
    // 备份掉
    batchDelete () {
      if (this.arrList.length === 0) {
        this.$message({
          message: '请选择要删除的数据！',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认删除
        this.ajaxDELETE(ES + URL, {
          ids: JSON.stringify(this.arrList)
        }).then(_ => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.$emit('getList')
        }).catch(e => {
          this.$message({
            message: '删除失败：' + e,
            type: 'warning'
          })
        })
      }).catch(() => { // 取消删除
        this.$message({
          message: '取消删除',
          type: 'warning'
        })
      })
    },
    // 采用-加入待编
    handleToUse (val) {
      if (this.arrList.length === 0) {
        this.$message({
          message: '请选择要加入待编的数据！',
          type: 'warning'
        })
        return
      }
      this.dialogVisible = true
    },
    // 关闭待编弹框
    cancelToEdit () {
      this.dialogVisible = false
    },

    // 获取待编文件树选中的值
    getSelectNodes (arr) {
      this.usernames = arr;
    },
    // 确认加入待编
    yesToEdit () {
      var user = this.$refs.selectMaterialUser.info.select;
      if (!user) {
        this.$message({
          message: '请选择整编员！',
          type: 'warning'
        })
        return
      }
      var save_data = JSON.stringify({
        "user_ids": [user],
        "sc_ids": this.arrList,
        "sc_type": "db",

      })
      this.ajaxPOST(API + '/original/sc/users', {
        save_data: save_data
      }).then(_ => {
        this.$message({
          message: '加入待编成功！',
          type: 'success'
        })
        this.$emit('getList')
        this.$refs.selectMaterialUser.info.select = ""
      }).catch(e => {
        this.$message({
          message: '加入待编失败！' + e,
          type: 'warning'
        })
      })
      this.dialogVisible = false

    },

    // 加入翻译
    handleTrans (val) {
      if (this.arrList.length === 0) {
        this.$message({
          message: '请选择要加入翻译的数据！',
          type: 'warning'
        })
      } else {
        let count = 0;
        this.alldata.forEach(items => {
          this.arrList.forEach(item => {
            if (item == items.id && items.language == '中文') {
              count++
            }
          })
        })
        if (count > 0) {
          this.$message({
            message: '所选素材中存在语种为中文的素材，请重新选择！',
            type: 'warning'
          })
        } else {
          this.dialogVisible1 = true
        }
      }
    },

    // 关闭待译弹框
    cancelTodaiyi () {
      this.dialogVisible1 = false
    },
    //确认加入翻译
    yesTodaiyi () {
      var form = this.$refs.translateTaskForm;
      var _self = this;
      form.validate(valid => {
        if (valid) {
          _self._yesTodaiyi();
        }
      })
    },
    clearTranslateTask () {
      this.$refs.selectTranslateUser.info.select = "";
      for (var k in this.translateTask.model) {
        this.translateTask.model[k] = "";
      }
    },
    // 提交确认加入翻译
    _yesTodaiyi () {
      var user = this.$refs.selectTranslateUser.info.select;
      if (!user) {
        this.$message({
          message: '请选择翻译员！',
          type: 'warning'
        })
        return
      }
      //选取选中的第一篇文章的语种传到后台
      var nowLanguage = ''
      this.alldata.forEach(item => {
        if (this.arrList[0] == item.id) {
          nowLanguage = item.language
        }
      })
      for (var k in dictMap.data.sys_yz) {
        if (nowLanguage == dictMap.data.sys_yz[k]) {
          nowLanguage = k
        }
      }
      var save_data = JSON.stringify({
        "user_id": user,
        "sc_ids": this.arrList,
        "theme": this.translateTask.model.label,
        "end_time": this.translateTask.model.date,
        "desc": this.translateTask.model.description,
        "language": nowLanguage
        // "language":this.translateTask.model.language
      })
      var _self = this
      this.ajaxPOST(API + '/original/sc/translate_task', {
        save_data: save_data
      }).then(_ => {
        _self.$message({
          message: '创建翻译任务成功！',
          type: 'success'
        })
        _self.$emit('getList')

        //创建翻译任务成功后清空选项
        this.clearTranslateTask();

      }).catch(e => {
        _self.$message({
          message: '创建翻译任务失败！' + e,
          type: 'warning'
        })

      })
      this.dialogVisible1 = false;
    },

  }
}
</script>

<style scoped>
.rightButton li {
  margin: 5px 0;
  list-style: none;
}
.el-tree {
  width: 200px !important;
}

/deep/ .el-radio--mini.is-bordered {
  width: 100%;
  margin-left: 0px !important;
  width: calc(33.3% - 15px);
  margin-right: 15px;
  margin-bottom: 5px;
}

/deep/ .el-radio-group {
  width: 100%;
}
</style>
