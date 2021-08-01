<template>
	<div>
  		<div class="center">
		    <el-tabs v-model="activeName" @tab-click="" >
		      <el-tab-pane label="数据源" name="1" v-show="activeName==='1'">
		      	<datas-all ></datas-all>
		      </el-tab-pane>
		      <el-tab-pane label="我的数据" name="2" v-show="activeName==='2'">
		      	<datas-my ></datas-my>
		      </el-tab-pane>
		    </el-tabs>
  		</div>
  	</div>
</template>

<script>
	import DatasAll from "@/visualTool/DatasAll"; // 数据源
	import DatasMy from "@/visualTool/DatasMy"; // 我的数据
	export default {
		name: "Qbsjjr",
		data(){
			return{
				activeName:'1',

			}
		},
		components:{
			DatasAll,
			DatasMy
		}
	}
</script>

<style scoped>
.center{
  padding: 20px;
  margin:20px;
  box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);
}
</style>
