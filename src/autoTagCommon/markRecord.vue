<template>
	<div>
    <h5 style="margin-bottom:10px">{{dataBox.title}}</h5>
		<el-row class="record">
			<el-col :span="5" :offset="0">
				<p style="border-right:1px solid #C5C5C5;border-bottom:1px solid #C5C5C5;">标签名称</p>
				<p style="border-right:1px solid #C5C5C5;border-bottom:1px solid #C5C5C5;">标注人</p>
				<p style="border-right:1px solid #C5C5C5;">审核人</p>
			</el-col>
			<el-col :span="14" :offset="0">
				<p style="border-right:1px solid #C5C5C5;border-bottom:1px solid #C5C5C5;">{{dataBox.labelName || "暂无"}}</p>
				<p style="border-right:1px solid #C5C5C5;border-bottom:1px solid #C5C5C5;">{{dataBox.marked  || "暂无"}}</p>
				<p style="border-right:1px solid #C5C5C5;">{{dataBox.auditor  || "暂无"}}</p>
			</el-col>
			<el-col :span="5" :offset="0" style="line-height:124px;">
				<el-button type="text" @click="echoClick">回显</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	name: "demo",
	props: {
		dataBox: Object,
	},
	methods: {
		echoClick () {
			this.$emit('echoClick', this.dataBox)
		}
	}
}
</script>

<style scoped>
.record {
	line-height: 30px;
	border: 1px solid #c5c5c5;
	text-align: center;
}
.record p {
	padding: 5px 5px;
	font-size: 14px;
}
</style>
