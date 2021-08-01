<template>
	<div>
		<table-list :signObj='signObj'></table-list>
	</div>
</template>

<script>
	import TableList from '@/visualCommon/TableList';
//	import PageTool from '@/visualCommon/PageTool';

	export default {
		name: "DataMy",
		components: {
			TableList,
//			PageTools
		},
		data() {
			return {
				signObj: {
					isShow: false, //模块筛选栏
					operate: false, //操作按钮
					pageSign: true, //分页
				},
			}
		},
		watch: {},
		created() {},
		mounted() {},
		methods: {}
	}
</script>

<style scoped>

</style>