<template>
	<div style="padding-top: 10px; margin-top: 0px; height: 100%; position:relative;">
		<el-row style="margin-top: 0px; height: 100%;" :gutter="5">
			<el-col :span="24" style="height: 100%;">
				<div class="documentList">
					<el-card shadow="always" style="margin-top: 20px;">
						<el-row :gutter="20" style="padding-bottom: 8px;padding-top: 8px;">
							<el-col :span="6" :offset="8">
								<el-radio-group v-model="relationEvent" @change="relationChange()">
									<el-radio label="event">事件关联</el-radio>
									<el-radio label="target">目标关联</el-radio>
									<el-radio label="spacetime">时空关联</el-radio>
								</el-radio-group>
							</el-col>
						</el-row>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<div class="editGroup">
							<i class="el-icon-document-add"></i>
							<i class="el-icon-edit"></i>
							<i class="el-icon-share"></i>
							<i class="el-icon-wind-power"></i>
							<i class="el-icon-goods"></i>
							<i class="el-icon-picture-outline"></i>
							<i class="el-icon-delete"></i>
						</div>
						<div class="cont">
							<transition name="slide-fade">
								<div v-show="btnflag"
										style="position: absolute; right: 0px;width: 36px; height: 100px;
									top: 50%; margin-top: -50px;">
									<button @click="alterBtn"
													style="cursor: pointer; font-size: 18px; color: white"
													class="right-but">
										<i data-v-4f282e14="" class="el-icon-d-arrow-left"></i>
									</button>
								</div>
							</transition>
							<div class="relationTu">
								<img src="../assets/image/assistConfirm/guanxi.png" />
							</div>
							<transition name="slide-fade">
							<div v-show="!btnflag" class="contRight">
								<button @click="alterBtn"
												style="
													cursor: pointer;
													font-size: 18px;
													color: white;
													position: absolute;
													left: -35px;
												"
												class="right-but right-but-close">
									<i data-v-4f282e14=""
										class="el-icon-d-arrow-right"></i>
								</button>
								<div class="filtrateContent">
									<div class="con-item">
										<span class="title">情报知识属性详情</span>
										<p class="con">情报知识属性详情的相关分析</p>
									</div>
									<div class="con-item">
										<span class="title">知识描述</span>
										<p class="con">情报知识属性详情的知识描述，情报知识属性详情的知识描述，
											情报知识属性详情的知识描述，情报知识属性详情的知识描述，情报知识属性详情的知识描述，</p>
									</div>
									<div class="con-item">
										<span class="title">知识文档</span>
										<div class="download" v-for="(item,index) in downloadData" :key="index">
											<p><img :src="xlsxImg" class="zsimg"/>{{item.name}} ({{item.attr}})</p>
											<el-button type="primary" size="mini" @click="download(item.url)">点击下载</el-button>
										</div>
									</div>
									<div class="con-item">
										<span class="title">知识描述</span>
										<p class="con">情报知识属性详情的知识描述，情报知识属性详情的知识描述，
											情报知识属性详情的知识描述，情报知识属性详情的知识描述，情报知识属性详情的知识描述，</p>
									</div>
								</div>
							</div>
						</transition>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		name: "autoRelation",
		mounted () {

		},
		data () {
			return {
				relationEvent: 'event',
				btnflag: false,
				xlsxImg:require('../assets/image/assistConfirm/xlsx.png'),
				pptImg:require('../assets/image/assistConfirm/ppt.png'),
				wordImg:require('../assets/image/assistConfirm/word.png'),
				downloadData:[
					{	type:'xlsx',name:'报告方案.xlsx',attr:'19KB',url:'123'},
					{	type:'ppt',name:'报告方案.ppt',attr:'19KB',url:'123'},
					{	type:'word',name:'报告方案.word',attr:'19KB',url:'123'},
				]
			}
		},
		methods:{
			//侧边框切换
			alterBtn () {
				this.btnflag = !this.btnflag;
			},

			//关联切换
			relationChange(){
				console.log(this.relationEvent)
			},

			//下载
			downloadJSON (data, name) {
				var str = JSON.stringify(data);
				var blob = new Blob([str], {
					type: 'text/json'
				}),
					e = document.createEvent('MouseEvents'),
					a = document.createElement('a')
				a.download = name || "未命名.json";
				a.href = window.URL.createObjectURL(blob)
				a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
				e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
				a.dispatchEvent(e)
			},

			// 下载弹框
			download (url) {
				this.$confirm('是否下载该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						console.log(url)
						this.$message({
							type: 'success',
							message: '下载成功!'
						});
					}).catch(() => {});
			},
		},
	}
</script>

<style scoped>
* {
	box-sizing: border-box;
}

.documentList {
	height: 100%;
	background-color: #fff;
	border-radius: 5px;
}

/deep/ .el-radio-group{
	display: flex;
	justify-content: space-between;
}

.editGroup{
	width: 100%;
	height: 40px;
	border-bottom: 1px #aca7a7 solid;
}
.editGroup i{
	font-size: 24px;
	margin-left: 20px;
	color: #0c63ff;
}
.cont {
	width: 100%;
	height: 100%;
	display: flex;
	position: relative;
}
.relationTu{
	width: 100%;
	height: 600px;
}
.relationTu img{
	width: 90%;
	height: 100%;
}
.contRight{
	width: 30%;
	position: relative;
	box-shadow: 1px 1px 1px 2px #ccc;
	box-sizing: border-box;
}
.filtrateContent {
  height: 100%;
  box-sizing: border-box;
	padding: 16px;
	font-size: 14px;
	background: white;
}
.filtrateContent .con-item{
	padding: 10px 0;
}
.filtrateContent .con-item .title{
	font-weight: bold;
	font-size: 16px;
}
.filtrateContent .con-item .con{
	line-height: 24px;
}
.filtrateContent .con-item .download{
	width: 100%;
	height: 40px;
	border:1px #999 dashed;
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
}
.filtrateContent .con-item .download .zsimg{
	width: 16px;
	height: 16px;
	vertical-align: middle;
	margin-right: 10px;
}
.right-but {
  background: #2586fe;
  border-radius: 6px 0 0 6px;
  width: 36px;
  height: 100px;
  font-size: 22px;
  color: white;
  /* pointer-events: none;  */
  /* 阻止默认事件 */
  border: 0;
}
.right-but-close {
  top: 50%;
  margin-top: -50px;
}
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,.slide-fade-leave-to  {
  transform: translateX(100%);
}


</style>
