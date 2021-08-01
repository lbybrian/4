<template>
	<div :tableInfo="tableInfo" class="dataTableArea" style="">
		<el-row class="tableHeader tableRow">
			<slot v-for="item in tableInfo.header">
				<el-col :span="item.width" :sort="item.sort">
					<div :style="item.style || 'text-align: center;'" v-if="item.type === 'checkbox' && !item.flag" class="grid-content">
						<el-checkbox v-model="tableInfo.checkAll" :indeterminate="tableInfo.isIndeterminate" name="type" label @change="handleCheckAllChange"></el-checkbox>
					</div>
					<div :style="item.style || 'text-align: center;'" v-else class="grid-content" :sortType="item.sortType" @click="dealClickHeader(item)"><span class="headerItem">{{item.label}}</span></div>
				</el-col>
			</slot>
		</el-row>
		<slot v-if="tableInfo.data.length !== 0">
			<div v-for="(d, index) in tableInfo.data" :key="index" class="tableItem">
				<el-row class="tableContent tableRow">
					<slot v-for="item in tableInfo.header">
						<el-col :span="item.width">
							<!--              <div-->
							<!--                :style="item.style || 'text-align: center;'"-->
							<!--                v-if="item.type === 'checkbox' && item.prop==='sbqx' && d.issbCheckedAble"-->
							<!--                class="grid-content"-->
							<!--              >-->
							<!--                <el-checkbox-->
							<!--                  @change="handleCheckedChange(d,item.prop)"-->
							<!--                  v-model="d.issbChecked"-->
							<!--                  :key="d.id"-->
							<!--                  label-->
							<!--                  name="type"-->
							<!--                ></el-checkbox>-->
							<!--              </div>-->
							<div :style="item.style || 'text-align: center;'" v-if="item.type === 'checkbox'" class="grid-content">
								<div v-if="item.prop==='sbqx'">
									<el-checkbox v-if="d.issbCheckedAble" @change="handleCheckedChange(d,item.prop)" v-model="d.issbChecked" :key="d.id" label name="type"></el-checkbox>
								</div>
								<div v-else>
									<!--name="type"-->
									<el-checkbox @change="handleCheckedChange(d,item.prop)" v-model="d.isChecked" :key="d.id" label name="type"></el-checkbox>
								</div>
							</div>
							<div :style="item.style || 'text-align: center;'" v-else-if="item.type === 'radio'" class="grid-content">
								<el-radio @change="handleRadioSelect(d)" v-model="tableInfo.select" :key="d.id" :label="d.id" name="type"><span></span></el-radio>
							</div>
							<div :style="item.style || 'text-align: center;'" v-else-if="item.type === 'indicator'" class="grid-content">
								<slot v-for="(t, i) in item.items">
									<el-tag v-if="item.map[t] && item.map[t][d[t]]  && item.map[t][d[t]] !== '0'" size="mini" :type="item.map[t][d[t]].type || 'text'">{{item.map[t][d[t]].label || item.map[t][d[t]]}}</el-tag>
								</slot>

							</div>
							<div :style="item.style || 'text-align: center;'" v-else-if="item.type === 'index'" class="grid-content">{{index+1}}</div>
							<div :style="item.style || 'text-align: center;'" v-else-if="item.render" @click="$emit('tableClick', item.prop,  d)" class="grid-content">
								<span v-if="item.render.constructor.name === 'String'" v-html="item.render"></span>
								<span v-if="item.render.constructor.name === 'Function'" v-html="item.render(index, d)"></span>
							</div>
							<div :style="item.style || 'text-align: center;'" v-else-if="item.buttons" class="grid-content">
								<slot v-for="(t, i) in item.buttons" >
									<div :key="i">
                      <slot v-if="( !t.showCondition  || t.showCondition.value.indexOf(d[t.showCondition.key]) != -1 ) && ( !t.hideCondition || (d[t.hideCondition.key] != t.hideCondition.value  && t.hideCondition.value.indexOf(d[t.hideCondition.key]) === -1))">
										<el-popover v-if="t.type === 'popover'" placement="left" width="200" trigger="click" :title="t.popTitle" v-model="d.visible">
											<p style="margin: 5px 0px;">{{t.popover}}</p>
											<div style="text-align: right; margin: 0">
												<el-button size="mini" type="text" @click="d.visible = false">取消</el-button>
												<el-button type="primary" size="mini" @click="d.visible = false; $emit('buttonClick', (t.eventName || t.name),  d, index)">确定</el-button>
											</div>
											<el-button size="mini" :title="t.name" slot="reference" :class="t.class" style="cursor: pointer; margin: 0px 5px;">{{t.text}}</el-button>
										</el-popover>
										<i size="mini" :title="t.name" type="primary" :style="t.style || 'cursor: pointer; margin: 0px 5px;'" v-else-if="t.type==='dialog'" @click="$emit('buttonClick', (t.eventName || t.name),  d, index)" :class="t.class">{{t.text}}</i>
										<i :title="t.name" :style="t.style || 'cursor: pointer; margin: 0px 5px;'" v-else-if="t.type==='icon'" @click="$emit('buttonClick', (t.eventName || t.name),  d, index)" :class="t.class">{{t.text}}</i>
										<el-link v-else-if="t.type==='download'" :href="d.href" :download="d.title + t.subfix" :style="t.style || 'cursor: pointer; margin: 0px 5px;'">
											<i :class="t.class">{{t.text}}</i>
										</el-link>
									</slot>
                  </div>
								</slot>
							</div>
							<div v-else class="grid-content" :flag="item.flag + '-' + d[item.flag]">
								<slot v-if="item.prop.constructor.name==='String'">
									<p :key="item.prop" @click="$emit('tableClick', item.prop,  d)" :style="item.style || 'text-align: center;'" :title="d[item.prop]">{{ d[item.prop] === 0 ? "0" : (d[item.prop]||"-") }}</p>
								</slot>
								<slot v-else-if="item.prop.constructor.name==='Array'">
									<slot v-for="(v,i) in item.prop ">
										<p :prop="v"  :key="i" :style="item.style[v] || item.style || 'text-align: center;'" v-if="d[v]!==undefined && d[v]!==''" @click="$emit('tableClick', v,  d)" :title="d[v]">{{ d[v] === 0 ? "0" : (d[v]||"-") }}</p>
									</slot>
								</slot>
							</div>
						</el-col>
					</slot>
				</el-row>
				<el-row v-if="tableInfo.extra">
					<el-col :span="tableInfo.extra.width" :offset="tableInfo.extra.offset || 0">
						<div :style="tableInfo.extra.style || 'text-align: left;'" class="grid-content">{{ d[tableInfo.extra.prop] }}</div>
					</el-col>
				</el-row>
			</div>
		</slot>
		<slot v-if="tableInfo.data.length === 0">
			<div style="text-align: center; padding: 20px; color: #999; border-bottom: solid 1px #ddd;">暂无数据</div>
		</slot>
		<el-pagination v-if="tableInfo.page && tableInfo.page.total" class="tablePagination" :layout="tableInfo.pageLayout || 'total, sizes, prev, pager, next, jumper'" :total="tableInfo.page.total" :current-page="Math.ceil((tableInfo.page.start || 1)/(tableInfo.page.limit || 10))" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
	</div>
</template>

<style>
.dataTableArea {
	float: left;
	position: relative;
	width: 100%;
}

.tableItem {
	padding: 12px 0px;
	float: left;
	position: relative;
	border-bottom: 1px solid #ebeef5;
	width: 100%;
	font-family: 'Microsoft YaHei';
}

/* .tableItem:hover {
  background-color: #e7f4ff;
} */
.tableContent:first {
	border: none;
}
.tableHeader {
	font-weight: 700;
	border-bottom: 1px solid #ebeef5;
	padding-bottom: 12px;
}

.tableHeader .grid-content {
	font-size: 14px !important;
	font-weight: normal !important;
}

.tableHeader .el-col[sort='yes'] .grid-content {
}

.tableHeader .el-col[sort='yes'] .grid-content .headerItem {
	display: inline-block;
	position: relative;
}
.tableHeader .el-col[sort='yes'] .grid-content .headerItem:before {
	position: absolute;
	right: -12px;
	top: 0px;
	content: '';
	display: inline-block;
	width: 0px;
	height: 0px;
	border: 5px solid transparent;
	border-bottom: 5px solid #ddd;
}

.tableHeader
	.el-col[sort='yes']
	.grid-content[sortType='asc']
	.headerItem:before {
	border-bottom: 5px solid #409eff;
}

.tableHeader .el-col[sort='yes'] .grid-content .headerItem:after {
	position: absolute;
	right: -12px;
	top: 12px;
	content: '';
	display: inline-block;
	width: 0px;
	height: 0px;
	border: 5px solid transparent;
	border-top: 5px solid #ddd;
}

.tableHeader
	.el-col[sort='yes']
	.grid-content[sortType='desc']
	.headerItem:after {
	border-top: 5px solid #409eff;
}

.grid-content {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.tablePagination {
	position: relative;
	float: left;
	width: 100%;
	margin: 10px 0px;
	text-align: center;
}

.el-tag + .el-tag {
	margin-left: 5px;
}

.tableContent {
	display: flex;
	align-items: center;
}
</style>

<script>
export default {
	name: "DataTableItem",
	props: {
		tableInfo: Object
	},
	beforeMount () {
		this.updateSelected();
		this.info = this.tableInfo;
		this.handleCheckedChange();
	},
	updated () {
		this.updateSelected();
	},
	methods: {
		dealClickHeader (item) {
			item.sortArray = item.sortArray || ["desc", "asc"];
			if (item.sort === "yes") {
				if (!item.sortType) {
					item.sortType = item.sortArray[1];
				}
				else {
					var index = (item.sortArray.indexOf(item.sortType) + 1) % item.sortArray.length;
					item.sortType = item.sortArray[index]
				}
				this.$emit("sortTypeChange", {
					key: item.prop,
					value: item.sortType
				});
				var key = item.prop;
				for (var i = 0; i < this.tableInfo.header.length; i++) {
					var item = this.tableInfo.header[i];
					if (item.prop !== key && item.sortType) {
						item.sortType = "";
					}
				}
			}
		},
		handleRadioSelect (d) {
			// console.log(d);
			this.tableInfo.selectData = d;
			this.$emit("selectChange", d);
		},
		updateSelected () {
			var count = 0;
			var value = this.tableInfo.value;
			if (!this.tableInfo || !this.tableInfo.data) {
				return false;
			}
			this.tableInfo.data.forEach(item => {
				if (value.indexOf(item.id) !== -1) {
					this.$set(item, "isChecked", true);
					count++;
				}
				else {
					this.$set(item, "isChecked", false);
				}
			});
			if (count === 0) {
				this.tableInfo.checkAll = false;
				this.tableInfo.isIndeterminate = false;
			}
			else if (count === this.tableInfo.data.length) {
				this.tableInfo.checkAll = true;
				this.tableInfo.isIndeterminate = false;
			}
			else {
				this.tableInfo.checkAll = false;
				this.tableInfo.isIndeterminate = true;
			}
			return count;
		},
		updateChecked () {
			var count = 0;
			this.info.value = [];
			this.info.data.map(item => {
				if (item.isChecked) {
					count++;
					this.info.value.push(item.id);
				}
			});
			return count;
		},
		handleCurrentChange (val) {
			this.info.page.pageNo = val;
			this.$emit("pageChange", val);
		},
		handleSizeChange (val) {
			this.info.page.pageSize = val;
			this.$emit("sizeChange", val);
		},
		emitClickEvent (name, param) { },
		handleCheckAllChange (val) {
			this.info.data.map(item => {
				this.$set(item, "isChecked", val);
			});
			this.info.isIndeterminate = false;
			this.updateChecked();
			this.$emit("selectChange", val);
		},
		handleCheckedChange (val, prop) {
			var count = this.updateChecked();
			this.info.isIndeterminate = count > 0 && count < this.info.data.length;
			if (!this.info.isIndeterminate) {
				this.info.checkAll = count === this.info.data.length;
			}
			if (val) {
				if (prop) {
					this.$emit("selectChange", val, prop);
				} else {
					this.$emit("selectChange", val);
				}
			}
		}
	}
};
</script>
