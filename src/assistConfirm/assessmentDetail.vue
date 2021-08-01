<template>
	<div style="padding-top: 10px; margin-top: 0px; height: 100%; position: relative; overflow-x: hidden;">
		<el-row style="margin-top: 0px; height: 100%;" :gutter="5">
			<el-col :span="btnflag ? 23 : 16" style="height: 100%; ">
				<div class="documentList">
					<el-card shadow="always" style="margin-top: 20px;">
						<div class="newsInfo" style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
							<div class="newstitle">XXXXX情报</div>
							<p class="newsCon">记得加入远大之前，我正在长沙出差，那时在一家澳大利亚在华投资的中国工厂里任区域销售经理，负责江西、湖南、河南三省的销售工作，丝毫不夸张的说，当时的工作我还是很满意的，一年十来万的收入也很知足。另外的假期正常拥有，写这段文字并非是我后悔了自己选择。人，总是在不断地追求自己的价值，也在实现财富的梦想，在销售这个行业里，对远大是早有耳闻，所以，当远大通知我面试和培训的时候，我没有任何的准备就离开了上一份工作，加入到了远大的队伍。</p>
							<p class="newsBot">
								<i>时间:2021年3月16日</i>
								<i>发布者:王鲜花</i>
							</p>
						</div>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
							<img src="../assets/image/assistConfirm/pg_gxt.png" alt="">
						</div>
					</el-card>
					<el-card shadow="always" style="margin-top: 20px;">
						<div style="height: calc( 100% - 120px ); overflow: auto; width: 100%;">
							<el-input
								type="textarea"
								:rows="4"
								placeholder="编辑评论内容..."
								v-model="textarea">
							</el-input>
							<div style="text-align: right;">
								<el-button type="text">取消</el-button>
								<el-button type="text" @click="submit">发送</el-button>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
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
			<el-col :span="btnflag ? 0 : 7" :offset="btnflag ? 0 : 1" style="height: 100%; ">
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
					<div class="documentList">
						<el-card shadow="always" style="margin-top: 20px;min-height: 700px;">
							<SearchCondition :conditions="conditions"
												@onChange="dealChangeEvent"
												style="margin-bottom: 10px;" />
						</el-card>
						</div>
				</div>
					</transition>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import SearchCondition from "@/assistCommon/SearchCondition";
export default {
	name:'dataPretreatment',
	components: {
		SearchCondition
	},
	beforeMount () {

	},
	mounted () {

	},
	data () {
		return {
			textarea:'',
			btnflag:false,
			conditions: [
        {
          // name: "标签",
          value: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
          type: "checkbox",
          checkAll: false,
          key: "mj",
          items: ["标签一", "标签二", "标签三", "标签四","标签五", "标签六", "标签七", "标签八", "标签九","标签十", "标签十一","标签十二", "标签十三", "标签十四"]
        }
      ],
		}
	},
	methods: {
   //切换
		alterBtn () {
			this.btnflag = !this.btnflag;
		},
		
		// 提交评论内容
		submit(){
			console.log(this.textarea)
		},

		dealChangeEvent (d) {
			console.log(d)
    },
	},
};

</script>

<style scoped>
* {
	box-sizing: border-box;
}
 /*取消button点击的默认样式*/
button:focus {
		border: 0 none;
		outline: none;
}

.documentArea,
.documentList {
	height: 100%;
	background-color: #fff;
	border-radius: 5px;
}
.newsInfo{
	max-height:400px;
	height:300px;
	letter-spacing: .5px;
}
.newsInfo .newstitle{
	font-weight: bold;
	text-align: left;
	text-indent: 2em;
	line-height: 30px;
}
.newsInfo .newsCon{
	font-size: 14px;
	text-indent: 2em;
	line-height: 24px;
}
.newsInfo .newsBot{
	text-align: right;
}
.newsInfo .newsBot i{
	font-style: normal;
	font-size: 14px;
	margin-right: 16px;
	margin-top: 14px;
}
/deep/ .el-form-item__content div{
	overflow: initial!important;
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
.contRight{
	position: relative;
}
</style>
