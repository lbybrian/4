<template>
    <div>
      <!--<img src="../assets/image/444.png" width="100%"/>-->
      	<router-view></router-view>
    </div>
</template>

<script>
	import Qbsjjr from "@/visualTool/Qbsjjr"; // 情报数据接入
	import Qbsjzx from "@/visualTool/Qbsjzx"; // 情报数据展示
	import DwVisual from "@/visualTool/DwVisual"; // 二/三维可视化
	import Analyze from "@/visualTool/Analyze"; // 分析方法可视化
	export default {
		name: "Visual",
		data(){
			return{
				
			}
		},
		components:{
			Qbsjjr,
			Qbsjzx,
			DwVisual,
			Analyze,
		}
	}
</script>

<style scoped>

</style>
