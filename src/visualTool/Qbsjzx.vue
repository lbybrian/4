<template>
  		<div class="center">
		    <el-tabs v-model="activeName" @tab-click="" >
		      <el-tab-pane label="全局信息" name="1" v-show="activeName==='1'">
		      	<message-all ></message-all>
		      </el-tab-pane>
		      <el-tab-pane label="画布信息" name="2" v-show="activeName==='2'">
		      	<message-canvas ></message-canvas>
		      </el-tab-pane>
		    </el-tabs>
  		</div>
</template>

<script>
	import MessageAll from "@/visualTool/MessageAll"; //全局信息
	import MessageCanvas from "@/visualTool/MessageCanvas"; // 画布信息
	export default {
		name: "Qbsjzx",
		data(){
			return{
				activeName:'1',

			}
		},
		components:{
			MessageAll,
			MessageCanvas
		}
	}
</script>

<style scoped>
.center{
  min-height: 600px;
  padding: 20px;
  margin:20px;
  box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);
}
</style>
