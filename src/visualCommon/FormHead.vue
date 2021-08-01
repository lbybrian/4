<template>
	<div>
		<el-form :model="FormHead" size="small" ref="FormHead" label-width="100px" class="demo-FormHead">
			<el-row>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-form-item label="数据源名称:" prop="name">
							<el-input v-model="FormHead.name" size="small" placeholder="请输入数据源名称"></el-input>
						</el-form-item>
					</div>
				</el-col>
        <el-col :span="3" class="timeHorizon" style="margin-left:60px;">
          <span v-for="item in FormHead.timeHorizon" :key="item.value" :class="item.pitch ? 'pitchOn' : ''" @click="pitchOnFun(item)">{{item.name}}</span>
        </el-col>
				<el-col :span="4">
					<el-date-picker size="small" style="width: 250px;" v-model="FormHead.dataFilter.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="FormHead.dataFilter.pickerOptions" @change="datePickChange">
					</el-date-picker>
				</el-col>
				<el-col :span="4" style="margin-left:60px;">
					<div class="grid-content bg-purple">
						<el-form-item>
							<el-button type="primary" size="small" @click="submitForm('FormHead')">查询</el-button>
							<el-button type="default" size="small" @click="resetForm('FormHead')">重置</el-button>
						</el-form-item>
					</div>
				</el-col>
			</el-row>
			<el-row v-if="signObj.isShow">
		        <el-form-item label="模块筛选:">
		          <el-button style="">全部</el-button>
		          <el-button style="">执行中</el-button>
		          <el-button style="">成功</el-button>
		          <el-button style="" type="primary">失败</el-button>
		          <el-button style="">已发布</el-button>
		          <el-button style="">未发布</el-button>
		        </el-form-item>
		    </el-row>
		</el-form>
	</div>
</template>

<script>
  import Utils from '../assets/js/util.js'

	export default {
		name: '',
		props:{
			signObj:Object,
		},
		data() {
			return {
				FormHead: {
					name: '',
//					showTime:'',
					timeHorizon: [{
			            name: '今日',
			            value: 'today',
			            pitch: false,
			          },
			          {
			            name: '本周',
			            value: 'thisWeek',
			            pitch: false,
			          }, {
			            name: '本月',
			            value: 'thisMonth',
			            pitch: false,
			          }, {
			            name: '全年',
			            value: 'annual',
			            pitch: false,
			          },
			        ],
              dataFilter: {
              	time: [],
              	keyword: "",
              	pickerOptions: {
              		shortcuts: [{
              			text: '最近一周',
              			onClick (picker) {
              				const end = new Date();
              				const start = new Date();
              				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              				picker.$emit('pick', [start, end]);
              			}
              		}, {
              			text: '最近一个月',
              			onClick (picker) {
              				const end = new Date();
              				const start = new Date();
              				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              				picker.$emit('pick', [start, end]);
              			}
              		}, {
              			text: '最近三个月',
              			onClick (picker) {
              				const end = new Date();
              				const start = new Date();
              				start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              				picker.$emit('pick', [start, end]);
              			}
              		}]
              	},
              },
				},
			}
		},
		created(){
		},
		mounted(){
		},
		methods: {
	      // 日期点击
        	pitchOnFun (data) {
        		this.FormHead.timeHorizon.forEach(item => {
        		  item.pitch = false
        		})
        		data.pitch = true
          switch (data.value) {
        			case 'today':
        				this.FormHead.dataFilter.time = [Utils.getToday().startTime,Utils.getToday().endTime]
        				break;
        			case 'thisWeek':
        				this.FormHead.dataFilter.time = [Utils.getCurrWeekDays().startTime,Utils.getCurrWeekDays().endTime]
        				break;
        			case 'thisMonth':
        				this.FormHead.dataFilter.time = [Utils.getCurrMonthDays().startTime,Utils.getCurrMonthDays().endTime]
        				break;
        			case 'annual':
        				this.FormHead.dataFilter.time = [Utils.getCurrYearDays().startTime,Utils.getCurrYearDays().endTime]
        				break;
        		}
        	},
        datePickChange (val) {
        		this.timeHorizon.forEach(item => {
        			item.pitch = false
        		})
        	},
	      //获取数据
	      getList(){

	      },
        // 查询
        submitForm(formName) {
          for(let key in this.ruleForm) {
            this.params[key] = this.ruleForm[key]
          }
          // this.$refs.list.getList(1,10,this.params)
        },
        // 重置搜索框
        resetForm(formName) {
          this.$refs[formName].resetFields()
          this.ruleForm = {
            name: '',
            type: '',
            cycleSign: '',
            status: '',
          }
          for(let key in this.ruleForm) {
            this.params[key] = this.ruleForm[key]
          }
          // this.$refs.list.getList(1, 10, this.params)
        },
	      // 每页几条
	      handleSizeChange(val) {
	        this.pageSize = val
	        this.currentPage = 1
	        // this.getList(this.currentPage, this.pageSize, this.obj)
	      },

	      // 当前第几页
	      handleCurrentChange(val) {
	        this.currentPage = val
	        // this.getList(this.currentPage, this.pageSize, this.obj)
	      },
	    }
	}
</script>

<style>
  .timeHorizon {
    line-height: 32px;
  }

  .timeHorizon span {
    padding: 0 10px;
    font-size: 14px;
    cursor: pointer;
  }
  .pitchOn {
  	color: #6186e4;
  }
</style>
