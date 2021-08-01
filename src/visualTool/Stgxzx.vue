<template>
	<div>
		<div class="center audit">
		    <el-tabs v-model="activeName" @tab-click="" >
		      <el-tab-pane label="我的模型" name="1" v-show="activeName==='1'">
		      	<my-model></my-model>
		      </el-tab-pane>
		      
		    </el-tabs>
  		</div>



	</div>
</template>

<script>
	import MyModel from '@/visualTool/MyModel'
	export default {
		name: "Rule",
		data() {
			return {
				activeName:'1'
			}
		},
		components: {
			MyModel
		},
		created() {},
		mounted() {},
		methods: {}
	}
</script>

<style scoped>
  .center{
    padding: 20px;
    margin:20px;
    box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);
  }
</style>
