<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="报告标题：" prop="title">
      <el-input size="small" v-model="ruleForm.title"></el-input>
    </el-form-item>

    <el-form-item label="报告类型：" prop="lx">
      <!--<el-select size="small" v-model="ruleForm.lx" placeholder="请选择" @change="typeChange">-->
        <!--<el-option v-for="item in ruleForm.bglx" :key="item.value" :label="item.name" :value="item.value"></el-option>-->
      <!--</el-select>-->
      专项快报
    </el-form-item>

    <el-form-item label="报告模板：" prop="mb">
      <el-select size="small" v-model="ruleForm.mb" placeholder="请选择" @change="templateChange">
        <el-option v-for="item in ruleForm.bgmb" :key="item._id" :label="item.name" :value="item._id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="关键词：" prop="key_word">
      <el-tag size="medium" :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
    </el-form-item>

    <el-form-item label="报告内容：" prop="content" v-if="type!=='FWBSC'">
      <el-input size="small" type="textarea" :rows="2" v-model="ruleForm.content"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button @click="resetForm('ruleForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">完成</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  const ES = '/es'
  const API = '/api'
  const CM = '/common'
  const URL = '/index_sczb/sc_info/'
  const CMURL = '/db_sczb/mbgl_info'
  const SEARCH = '/cm/dict'
  const REPORT = '/index_sczb/tscp_info/saveOrUpdate/report'
  const DOWNLOADURL = '/cm/log_file/download?id_path='
	export default {
		name: "Report",
    props: ['id', 'type'],
    data() {
		  return {
        ruleForm: {
          title: '',
          lx: '',
          mb: '',
          bglx: '',
          bgmb: '',
          key_word: '',
          content: '',
        },
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        rules: {
		      title: [{ required: true, message: '请输入报告标题', trigger: 'blur' }],
          mb: [{ required: true, message: '请选择报告模板', trigger: 'blur' }]
        },
      }
    },
    created() {
		  // 获取form表单数据
		  // this.getType()
      this.getTemplate()
    },
    methods: {
      // 获取报告类型
      getType() {
        this.ajaxGET(API + SEARCH).then(r => {
          this.ruleForm.bglx = r.bglx
        }).catch(e => {
          this.$message({
            message: '获取报告类型失败：' + e,
            type: 'warning'
          })
        })
      },

      // 获取报告模板
      getTemplate() {
        this.ajaxGET(CM + CMURL, {
          limit: '0',
          query: JSON.stringify({mblx: '3'})// 快报是3
        }).then(r => {
          this.ruleForm.bgmb = r
        }).catch(e => {
          this.$message({
            message: '获取报告模板失败：' + e,
            type: 'warning'
          })
        })
      },

      // 报告类型
      typeChange(val) {
        this.getType()
        this.ruleForm.bglx = val
      },

      // 报告模板
      templateChange(val) {
        this.getTemplate()
        this.ruleForm.bgmb = val
      },

      // 关键词效果
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },

      // 取消
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.$emit('closeReport')
      },

      // 生成报告
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ajaxPOST(API + REPORT, {
              saveOrUpdate: JSON.stringify({
                title: this.ruleForm.title,
                content: this.ruleForm.content,
                bglx: this.ruleForm.lx,
                key_word: this.dynamicTags,
                bgmb: this.ruleForm.mb,
                sc_id: this.id
              })
            }).then(r => {
              // 生成报告成功 下载报告
              this.$emit('closeReport')
              let url =  API + DOWNLOADURL + r
              location.href = url
            }).catch(e => {
              this.$message({
                message: '生成报告失败：' + e,
                type: 'warning'
              })
            })
          } else {
            this.$message({
              message: '请按要求填写信息！',
              type: 'warning'
            })
            return false
          }
        });
      },
    }
	}
</script>

<style scoped>

</style>
