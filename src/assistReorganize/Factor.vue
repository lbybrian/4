<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item>
      <el-input size="small" value="人物" v-if="type==='person'" v-model="formInline.type" disabled></el-input>
      <el-input size="small" value="机构" v-if="type==='org'" v-model="formInline.type" disabled></el-input>
      <el-input size="small" value="目标" v-if="type==='Weapon'" v-model="formInline.type" disabled></el-input>
      <el-input size="small" value="事件" v-if="type==='field'" v-model="formInline.type" disabled></el-input>
      <el-input size="small" value="地点" v-if="type==='location'" v-model="formInline.type" disabled></el-input>
      <el-input size="small" value="国别" v-if="type==='area_gb'" v-model="formInline.type" disabled></el-input>
      <el-input size="small" value="城市" v-if="type==='area_sf'" v-model="formInline.type" disabled></el-input>
    </el-form-item>

    <el-form-item>
      <el-autocomplete size="small" v-model="formInline.value" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
    </el-form-item>
  </el-form>
</template>

<script>
  const API = '/api'
  const ELEMENT = '/cm/element_info/name/_search'
	export default {
		name: "Factor",
    props: ['type'],
    data() {
		  return {
        formInline: {
          type: '',
          value: '',
          typ: '',
          id: ''
        },
      }
    },
    created() {
		  if (this.type === 'person') {
		    this.formInline.type = '人物'
      } else if (this.type === 'org') {
        this.formInline.type = '机构'
      } else if (this.type === 'Weapon') {
        this.formInline.type = '目标'
      } else if (this.type === 'field') {
        this.formInline.type = '事件'
      } else if (this.type === 'location') {
        this.formInline.type = '地点'
      } else if (this.type === 'area_gb') {
        this.formInline.type = '国别'
      } else if (this.type === 'area_sf') {
        this.formInline.type = '城市'
      }
    },
    methods: {
      querySearchAsync(queryString, cb) {
        if (queryString === '') {
          return false
        }
        let params = {
          q: queryString,
          size: 10,
          exact_search: JSON.stringify({type: this.type})
        }
        this.ajaxGET(API + ELEMENT, params).then(r => {
          let arr = r.map(d => {
            return {
              id: d.id,
              value: d.name
            }
          })
          cb(arr)
          if (arr.length === 0) {
            this.formInline.value = queryString
            this.formInline.typ = this.type
            this.$emit('elementForm', this.formInline)
          }
        }).catch(e => {
          this.$message({
            message: '请求要素失败：' + e,
            type: 'warning'
          })
        })
      },
      handleSelect(item) {
        this.formInline.value = item.value
        this.formInline.typ = this.type
        this.formInline.id = item.id
        this.$emit('elementForm', this.formInline)
      },
    }
	}
</script>

<style scoped>

</style>
