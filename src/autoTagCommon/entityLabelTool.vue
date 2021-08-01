<template>
  <div class="contentArea" style="padding: 10px; height: 100%; overflow: auto; width: 100%;">
    <div class="contentContainer" style="width: 100%; height: auto; position: relative; float: left;">
      <div class="relationCanvasItem" ref="relationCanvasItem"
        style="position: absolute; top: 0px; left: 0px; width: 100%; z-index: 0; height: 100%;"></div>
      <div @mouseup="handleSelectText" ref="entityContentArea" class="docContentItem"
        style="padding: 10px; position: relative; z-index: 1;"></div>
    </div>
    <DialogItem @confirmDialog="confirmLabelConfig" :config="labelConfigDialog">
      <template>
        <div class="topFormArea" style="margin-bottom: 10px; margin-top: -20px;">
          <el-radio-group size="mini" v-model="labelInfoConfig.type" style="margin-bottom: 10px; text-align: center;">
            <el-radio-button label="entity">实体标签</el-radio-button>
            <el-radio-button label="event">事件标签</el-radio-button>
          </el-radio-group>
          <el-form :inline="true" :model="labelInfoConfig" class="demo-form-inline" label-suffix=":">
            <el-form-item v-if="labelInfoConfig.type === 'entity' " label="标注方式">
              <el-select size="mini" v-model="labelInfoConfig.mode" placeholder="标注方式">
                <el-option label="标注当前" value="current"></el-option>
                <!-- <el-option label="标注所有" value="all"></el-option> -->
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-row style="margin-bottom: 20px; width: 100%; position: relative; float: left;" :gutter="5">
          <el-col :span="24">
            <el-input style="width: 100%; margin-bottom: 10px;" size="small" placeholder="请输关键词检索标签"
              v-model="labelInfoConfig.keyword" class="keywordInput">
              <el-button size="small" type="primary" slot="append" @click="handleSerchEvent('entityAevent')" icon="el-icon-search"></el-button>
            </el-input>
            <div class="treeChildStyle" style="height: 300px;overflow: auto;">
              <LabelTree ref="entity" v-if="labelInfoConfig.type === 'entity' " :tree="entityLabel.data" :isOrder="entityLabel.isOrder"
                :treeCheckStrictly="entityLabel.treeCheckStrictly" :treeShowCheckbox="entityLabel.treeShowCheckbox" :defaultExpandedKeys='entityLabel.defaultExpandedKeys'
                :nodeKey="entityLabel.nodeKey" :collect="entityLabel.collect" :hideParentCheckBox="true" :accordion="true" :highlightCurrent="true" :treeCheckSingel="entityLabel.treeCheckSingel"
                :expandClickNode="entityLabel.expandClickNode" @nodeClick="nodeClick" @appendNodeSubmit="appendNodeSubmit" @editNode="editNode"
                @editNodeSubmit="editNodeSubmit" @removeNode="removeNode" @nodeExpand="nodeExpand" @appendNode="appendNode"
                style="width: 100%; float: left; " :colorIsShow="entityLabel.colorIsShow">
              </LabelTree>
              <LabelTree ref="event" v-else :tree="eventLabel.data" :isOrder="eventLabel.isOrder"
                :treeCheckStrictly="eventLabel.treeCheckStrictly" :treeShowCheckbox="eventLabel.treeShowCheckbox" :defaultExpandedKeys='eventLabel.defaultExpandedKeys'
                :nodeKey="eventLabel.nodeKey" :collect="eventLabel.collect" :hideParentCheckBox="true" :accordion="true" :highlightCurrent="true" :treeCheckSingel="eventLabel.treeCheckSingel"
                :expandClickNode="eventLabel.expandClickNode" @nodeClick="nodeClick" @appendNodeSubmit="appendNodeSubmit" @editNode="editNode"
                @editNodeSubmit="editNodeSubmit" @removeNode="removeNode" @nodeExpand="nodeExpand" @appendNode="appendNode"
                style="width: 100%; float: left; ">
              </LabelTree>
            </div>
          </el-col>
          <el-col :span="24" style="margin:10px 0">
						<h3>推荐标签</h3>
						<div>
							<div class="recommendTags">
								<el-tag class="tagBox" v-for="tag in recommendTags" :key="tag.name" hit  @click="recommendHandle(tag)">
									{{tag.name}}
								</el-tag>
							</div>
						</div>
					</el-col>
					<el-col :span="24" style="margin:10px 0">
						<h3>已选标签</h3>
						<div class="selectedTags">
							<el-tag class="tagBox" v-for="tag in selectedTags" :key="tag.name" hit closable @close="handleClose(tag)">
								{{tag.name}}
							</el-tag>
						</div>
					</el-col>
        </el-row>
      </template>
    </DialogItem>
    <DialogItem @confirmDialog="confirmRelationConfig" :config="relationConfigDialog">
      <template>
        <div>
          <el-button v-if="relationConfigDialog.delVisible" style="margin-bottom: 12px;" @click="conformDelRaletion" type="primary" size="mini">删除当前关系连线并关闭弹窗</el-button>
          <el-input v-model="relationConfigDialog.data" style="width: 100%; margin-bottom: 10px;" size="small" placeholder="请输关键词检索关系">
            <el-button size="small" type="primary" slot="append" @click="handleSerchEvent('relations')" icon="el-icon-search"></el-button>
          </el-input>
          <div class="treeChildStyle" style="height: 200px;overflow: auto;">
            <LabelTree ref="relationLabel" :tree="relationLabel.data" :isOrder="relationLabel.isOrder"
              :treeCheckStrictly="relationLabel.treeCheckStrictly" :treeShowCheckbox="relationLabel.treeShowCheckbox" :defaultExpandedKeys='relationLabel.defaultExpandedKeys'
              :nodeKey="relationLabel.nodeKey" :collect="relationLabel.collect" :hideParentCheckBox="true" :accordion="true" :highlightCurrent="true" :treeCheckSingel="relationLabel.treeCheckSingel"
              :expandClickNode="relationLabel.expandClickNode" @nodeClick="nodeClick" @appendNodeSubmit="appendNodeSubmit" @editNode="editNode"
              @editNodeSubmit="editNodeSubmit" @removeNode="removeNode" @nodeExpand="nodeExpand" @appendNode="appendNode"
              style="width: 100%; float: left;">
            </LabelTree>
          </div>
        </div>
      </template>
    </DialogItem>
  </div>
</template>

<script>
  import DialogItem from "@/autoTagCommon/dialogItem";
  import LabelTree from '@/common/tree';
  import cytoscape from "cytoscape";
  import EventItem from "@/autoTagCommon/labelEventItem"
  var color = "rgb(64, 158, 255)";
  export default {
    components: {
      DialogItem,
      LabelTree,
      EventItem,
    },
    data() {
      return {
        userMessage:{},
        currentData:{},
        labelConfigDialog: {
          visible: false,
          title: "添加标注信息",
          withFooter: true,
          width: "1000px"
        },
        labelInfoConfig: {
          type: "entity",
          mode: "current",
          keyword: "",
          eventTrigger: 0
        },
        relationConfig: {
          type: "entityRelation"
        },
        entityLabel: {
          data: [],
          nodeKey: 'id',
          treeShowCheckbox: true,
          treeCheckStrictly: true,
          treeCheckSingel: true,
          collect: false,
          keyword: "",
          expandClickNode:true,
          defaultExpandedKeys:[],
          entityLabelId:'',
          isOrder:true,
          colorIsShow:false,
        },
        eventLabel: {
          data: [],
          nodeKey: 'id',
          treeShowCheckbox: true,
          treeCheckStrictly: true,
          treeCheckSingel: true,
          collect: false,
          keyword: "",
          expandClickNode:true,
          defaultExpandedKeys:[],
          eventLabelId:'',
          isOrder:true,
        },
        relationLabel: {
          data: [],
          nodeKey: 'id',
          treeShowCheckbox: true,
          treeCheckStrictly: true,
          treeCheckSingel: true,
          collect: false,
          expandClickNode:true,
          defaultExpandedKeys:[],
          keyword: "",
          isOrder:true,
        },
        relationConfigDialog: {
          visible: false,//弹窗是否显示
          delVisible:false,//删除按钮是否显示
          raletionsIndes:-1,
          title: "添加标注信息",
          withFooter: true,
          data: "",
          width: "1000px"
        },
        params: {
          zoom: 1,
          map: {
            id: "id",
            label: "label",
            source: "source",
            target: "target",
            image: "image",
          },
          style: [{
            selector: 'node',
            style: {
              'width': '5px',
              "height": "5px",
              "background-color": color
            }
          }, {
            selector: 'edge',
            style: {
              'width': 0.5,
              'line-color': color,
              "label": "data(label)",
              "color": color,
              "taxi-direction": "downward",
              "font-size": 12,
              "line-cap": "round",
              'target-arrow-color': color,
              'target-arrow-shape': 'triangle',
              'curve-style': 'unbundled-bezier'
            }
          }]
        },
        viewDataConfigDialog: {
          visible: false,
          title: "查看数据",
          withFooter: false,
          data: "",
          width: "1000px"
        },
        dataInfo: {
          content:'',
          relation: [],
          labels: []
        },
        addNode:{},
        editNodes:{},
        //编辑默认回显选择节点
        labelChoosedtype:'',//当前树
        labelChoosedNode:'',//当前节点
        	selectedTags: [
				{ name: '标签一' },
				{ name: '标签二' },
				{ name: '标签三' },
				{ name: '标签四' },
				{ name: '标签五' }
			],
			recommendTags: [
				{ name: '标签六' },
				{ name: '标签七' },
				{ name: '标签八' },
				{ name: '标签九' },
				{ name: '标签十' }
			]
      };
    },
    props: {
      // dataObj: Object,
    },
    beforeMount() {
      this.updateLabelData();
    },
    created(){},
    mounted() {
      this.userMessage = JSON.parse(localStorage.getItem("userinfo"));
      var h = $(".contentArea").height();
      $(".contentContainer").css("min-height", h - 200);
      $(".el-tab-pane").css({
        "height": h - 160,
        "overflow": "auto"
      });
      // this.$nextTick(function () {
      //   var tData = this.dataObj || this.dataInfo;
      //   tData = {
      //     ...tData
      //   };
      //   this.updateData(tData);
      // });
    },
    methods: {
      // 获取实体、事件、关系标签数据
      updateLabelData() {
        var _self = this;
        this.adapter.getLabelZtree({},function(d){
          d.data.data.forEach(item=>{
            if(item.typeFlag === 'a'){
              _self.adapter.getLabelZtree({
                label_id:item.id,
              },function(d){
                console.log(d.data.data,666)
                _self.entityLabel.data = d.data.data;
                _self.entityLabel.entityLabelId = item.id;
              })
            }else if(item.typeFlag === 'b'){
              _self.adapter.getLabelZtree({
                label_id:item.id,
              },function(d){
                _self.eventLabel.data = d.data.data;
                _self.eventLabel.eventLabelId = item.id;
              })
            }
          });
        });
        this.adapter.relationSearch({},function(d){
            _self.relationLabel.data = d.data.data;
        });
      },
      // 初始数据并且获取标签数据
      updateData(tData) {
        this.dataInfo.labels = [];
        this.dataInfo.relation = [];
        this.dataInfo.content = tData.content;
        this.currentData = JSON.parse(localStorage.getItem("currentData"));
        console.log(this.getAllTextOffset('印'));
        this.getMarklist();
      },
      // 查询标签以及标签关系
      getMarklist(){
        let _this = this;
        let iMarkSearchEntityInfo = {
          id:this.currentData.docId
        }
        this.adapter.markList(iMarkSearchEntityInfo,function(res){
          if(res.data.meta.success){
            let tData = res.data.data;
            if(!!tData){
              _this.dataInfo.labels = tData.labels;
              _this.dataInfo.relation = tData.lines;
            }
            // label相同合并text
            // _this.$emit("updataMarkedDates");
            _this.updateContentArea();
          }else{
            _this.$message({
              message: res.data.meta.message,
              type: 'error'
            });
          }
        });
      },
      // 删除本地的关系数据
      removeRelationById(id, flag) {
        if (!flag) {
          this.dataInfo.relation.removeItem("source", id);
          this.dataInfo.relation.removeItem("target", id);
          this.dataInfo.relation.removeItem("id", id);
        } else {
          this.dataInfo.relation.removeItem(flag, id);
        }
      },
      // 查找关系index
      findRelation(sId, tId) {
        var ret = -1;
        var arr = this.dataInfo.relation;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].source === sId && arr[i].target === tId) {
            ret = i;
            break;
          }
        }
        return ret;
      },
      getPrefixLabel(node, n) {
        var arr = [];
        node = node.parent;
        while (node && node.data) {
          if (node.data.label) {
            arr.push(node.data.label);
          }
          node = node.parent;
        }

        return arr;
      },
      confirmLabelConfig() {
        if(this.labelConfigDialog.labelsIndes){
          this.labelConfigDialog.data = this.dataInfo.labels[parseInt(this.labelConfigDialog.labelsIndes)];
        }
        var type = this.labelInfoConfig.type;
        this.labelConfigDialog.data.type = type;
        var nodes = this.$refs[type].getCheckedNodes();
        if (nodes && nodes.length !== 0) {
          this.labelConfigDialog.data.name = nodes[nodes.length-1].label;
          this.labelConfigDialog.data.type = type;
          // var nodeId = nodes[0].$treeNodeId;
          var item = nodes[nodes.length - 1];
          var node = this.$refs[type].getNode(item.id);
          var arr = this.getPrefixLabel(node);
          var labelType = arr.join("→");
          var label = item.label + "(" + arr.join("→") + ")";
          if (arr.length === 0) {
            label = item.label;
          }
          if (type === "event") {
            arr.push(item.label);
            // labelType = arr.join("-");
            // label = labelType;
          }

          this.labelConfigDialog.data.labelType = labelType;
          this.labelConfigDialog.data.label = label;
          this.labelConfigDialog.data.labelId = item.id;
          // 新增、编辑、删除标签关系 method方法名 params参数
          this.saveOrUpdateOrDel('saveOrUpdate',this.labelConfigDialog.data);
          // 添加成功清空选项
          this.$refs[type].clean();
        }
      },
      confirmRelationConfig() {
        var type = this.relationConfig.type;
        var nodes = this.$refs.relationLabel.getCheckedNodes();
        if (nodes && nodes.length !== 0) {
          if(this.relationConfigDialog.raletionsIndes>-1){
            let rIndex = this.relationConfigDialog.raletionsIndes;
            this.dataInfo.relation[rIndex].label = nodes[0].label;
            this.dataInfo.relation[rIndex].labelId = nodes[0].id;
            this.saveOrUpdateOrDel('saveOrUpdateRelation',this.dataInfo.relation[rIndex]);
          }else{
            this.addRelationData(this.relationConfigDialog.sNode, this.relationConfigDialog.tNode,nodes[0].label,nodes[0].id);
            this.saveOrUpdateOrDel('saveOrUpdateRelation',this.dataInfo.relation[this.dataInfo.relation.length-1]);
          }
          this.relationConfigDialog.delVisible = false;
          this.relationConfigDialog.raletionsIndes = -1;
        }else{
          this.relationConfigDialog.visible = true;
          this.$message("请添加关系！");
        }
      },
      // (新)新增、编辑、删除标签关系 method方法名 params参数
      saveOrUpdateOrDel(method,params){
        let _this = this;
        let iMarkLogInfo = {}
        if(method === 'saveOrUpdate'){
          iMarkLogInfo = {
            id: params.id||"",
            labelId: params.labelId,
            offset: params.offset,
            tdocId: this.currentData.docId,
            text: params.text,
            type: params.type,
          }
        }else if(method === 'saveOrUpdateRelation'){
          iMarkLogInfo = {
            id: params.id||"",
            label: params.labelId,
            source: params.source,
            target: params.target,
          }
        }
        this.adapter[method](iMarkLogInfo,function(res){
          if(res.data.meta.success){
            if(method === 'saveOrUpdate'){
              if(res.data.data != ''){
                _this.labelConfigDialog.data.id = res.data.data.id;
                _this.labelConfigDialog.data.color = res.data.data.color;
              }
              _this.addSpanData(_this.labelConfigDialog.data);
              _this.$emit("updataMarkedData",'labelData');
            }else if(method === 'saveOrUpdateRelation' && res.data.data != ''){
              _this.dataInfo.relation[_this.dataInfo.relation.length-1].id = res.data.data;
              _this.$emit("updataMarkedData",'relationData');
            }
            _this.$message({
              message: res.data.meta.message,
              type: 'successs'
            });
            _this.updateContentArea();
          }else{
            _this.$message({
              message: res.data.meta.message,
              type: 'error'
            });
          }
        });
      },
      // 标签、关系删除
      delLabelOrRelation(id,type){
        let _this = this;
        let mesDate = {
          id:id,
          type:type
        }
        this.adapter.labelOrRelationDel(mesDate,function(res){
          if(res.data.meta.success){
            _this.$message({
              message: res.data.meta.message,
              type: 'successs'
            });
            if(type == 0){
              _this.$emit("updataMarkedData",'labelData');
            }else if(type == 1){
              _this.$emit("updataMarkedData",'relationData');
            }
            _this.updateContentArea();
          }else{
            _this.$message({
              message: res.data.meta.message,
              type: 'error'
            });
          }
        });
      },
      addSpanData(data) {
        let flag = true;
        if(this.dataInfo.labels.length != 0){
          this.dataInfo.labels.forEach(item=>{
            if(item.id == data.id){
              item = data;
              flag = false;
            }
          });
        }
        if(flag){
          if (data && data.constructor.name !== "Array") {
            data = [data];
          }
          this.dataInfo.labels = this.dataInfo.labels.concat(data);
        }
      },
      getAllTextOffset(keyword) {
        if (!keyword) {
          return false
        }
        var reg = eval('/' + keyword + '/g');
        var arr = [];
        this.dataInfo.content.replace(reg, function (m, t) {
          arr.push({
            offset: t,
            text: m
          })
        });
        return arr;
      },
      handleSelectText(e) {
        var elem = this.$refs.entityContentArea;
        let txt = window.getSelection ?
          window.getSelection() :
          elem.selection.createRange().text;
        if (txt.toString() !== "") {
          var ret = this.getSelectTextOffset(txt);
          if (ret.text === "" || e.srcElement.className !== "docContentItem") {
            this.$message("标注区域已有标注信息。");
          } else {
            // this.$message(ret.text);
            this.labelConfigDialog.title = `添加标注信息 ( ${ret.text} )`
            this.labelConfigDialog.visible = true;
            this.labelInfoConfig.type = 'entity';
            if (this.$refs.entity) {
              this.$refs.entity.setValue("");
              this.labelChoosedtype = '';
              this.labelChoosedNode = '';
            }
            this.labelConfigDialog.data = ret;
          }
        }
      },
      // 转换/r->空格
      // turnBr(place){
      //   if(this.dataInfo.content.indexOf(place,'\\r') !== -1){
      //     this.dataInfo.content = this.dataInfo.content.replace('\\r','<br/>');
      //     this.turnBr(this.dataInfo.content.indexOf(place,'\\r'));
      //   }
      // },
      updateContentArea(flag) {
        var elem = this.$refs.entityContentArea;
        // 转换空格
        // this.turnBr(0);
        // let reg = new RegExp('\r','g')
        // this.dataInfo.content = this.dataInfo.content.replace(reg,'<br/>');
        // this.dataInfo.content.indexOf('\\r')
        //添加标注信息
        var str = this.addSpanByData(this.dataInfo.labels, this.dataInfo.content)
        elem.innerHTML = str;

        this.$nextTick(function () {
          var _self = this;
          $(".opSpanInfoArea .removeSpanBtn").off("click");
          $(".opSpanInfoArea .removeSpanBtn").on("click", function () {
            var index = $(this).attr("index");
            var d = _self.dataInfo.labels[index];
            _self.$confirm("确定要删除吗？", "提示", {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _self.dataInfo.labels.splice(index, 1);
              _self.removeRelationById(d.id);
              // 删除实体或关系---id;type 0 删除实体 1 删除关系
              _self.delLabelOrRelation(d.id,0)
              _self.updateContentArea();
            });
          });
          // checkSpanBtn
          $(".opSpanInfoArea .checkSpanBtn").off("click");
          $(".opSpanInfoArea .checkSpanBtn").on("click", function (e) {
            let ev = e || window.e
            var index = $(this).attr("index");
            var d = _self.dataInfo.labels[index];
            _self.$confirm("确认标注结果正确", "确认标注结果", {
              confirmButtonText: '正确',
              cancelButtonText: '不正确',
              type: 'warning'
            }).then(() => {
              _self.labelConfirm(index,'1');
            }).catch(() => {
              _self.labelConfirm(index,'-1');
            })
          });

          $(".opSpanInfoArea .editSpanBtn").off("click");
          $(".opSpanInfoArea .editSpanBtn").on("click", function (e) {
            let ev = e || window.e
            var index = $(this).attr("index");
            var d = _self.dataInfo.labels[index];
            _self.labelConfigDialog.title = `编辑标注 ( ${d.text} )`;
            _self.labelConfigDialog.labelsIndes = index;
            _self.labelConfigDialog.visible = true;
            // 设置默认树
            _self.labelInfoConfig.type = d.type;
            // 设置默认选中
            _self.$nextTick(()=>{
              _self.labelChoosedtype = d.type;
              _self.labelChoosedNode = d.labelId;
              _self.$refs[d.type].setValue(d.labelId);
            })
            ev.stopPropagation();
          });

          $(".spanItem").off("click");
          $(".spanItem").on("click", function () {
            var t = $(this).attr("active");
            var activeSelector = $(".spanItem[active=true]");
            if (t === "true") {
              $(this).attr("active", "false");
              $(this)[0].style.backgroundColor = '#fff';
              if ($(this).attr("flag") === "source") {
                $(".spanItem[flag=target]").attr("flag", "source");
              }
              $(this).attr("flag", "");
            } else {
              if (activeSelector.length > 1) {
                activeSelector.attr("active", "false");
              }
              $(this).attr("active", "true");
              $(this)[0].style.backgroundColor = $(this)[0].style.color;
              if (activeSelector.length == 0) {
                $(this).attr("flag", "source");
              } else if (activeSelector.length === 2) {
                $(".spanItem").attr("flag", "");
                activeSelector[0].style.backgroundColor = '#fff';
                activeSelector[1].style.backgroundColor = '#fff';
                $(this).attr("flag", "source");
              } else {
                $(this).attr("flag", "target");
              }
            }

            var sSelector = $(".spanItem[flag=source]");
            var tSelector = $(".spanItem[flag=target]");
            if (sSelector.length === 1 && tSelector.length === 1) {
              var sIndex = sSelector.attr('index');
              var tIndex = tSelector.attr("index");
              var sNode = _self.dataInfo.labels[sIndex];
              var tNode = _self.dataInfo.labels[tIndex];
              var rIndex = _self.findRelation(sNode.id, tNode.id);
              if (rIndex === -1) {
                _self.relationConfigDialog.title = `添加关系信息 ( ${sNode.text} - ${ tNode.text } )`;
                _self.relationConfigDialog.raletionsIndes = -1;
                _self.relationConfigDialog.visible = true;
                _self.relationConfigDialog.sNode = sNode;
                _self.relationConfigDialog.tNode = tNode;
                if (sNode.type === "event") {
                  _self.relationConfig.type = "eventParam";
                } else {
                  _self.relationConfig.type = "entityRelation";
                }
                // 清空默认选项
                _self.$nextTick(()=>{
                  _self.$refs.relationLabel.setValue("");
                  _self.labelChoosedtype = '';
                  _self.labelChoosedNode = '';
                })
              } else {
                var d = _self.dataInfo.relation[rIndex];
                _self.relationConfigDialog.title = `编辑关系信息 ( ${d.relationId} )`;
                _self.relationConfigDialog.visible = true;
                _self.relationConfigDialog.raletionsIndes = rIndex;
                _self.relationConfigDialog.delVisible = true;
                // 设置默认选中
                _self.$nextTick(()=>{
                  _self.labelChoosedtype = 'relationLabel';
                  _self.labelChoosedNode = d.labelId;
                  _self.$refs.relationLabel.setValue(d.labelId);
                })
              }
              // _self.labelConfigDialog.data = ret;
            }

          });

          //更新关系节点和边数据
          setTimeout(() => {
            _self.updateRelationCanvas();
          }, 200);

        });
      },
      // 机器学习结果确认
      labelConfirm(index,status){
        let labelData = this.dataInfo.labels[index];
        let _this = this;
        this.adapter.labelConfirm({"id": labelData.id,"status": status},function(d){
          if(d.data.meta.success){
            _this.$message({
              message: d.data.meta.message,
              type: 'success'
            });
            // 1确认结果更新标签 -1不认可标签结果删除此标签
            if(status == '1'){
              labelData.color = d.data.data.color;
              labelData.isAuto = d.data.data.isAuto;
            }else if(status == '-1'){
              _this.dataInfo.labels.splice(index,1);
            }
            _this.updateContentArea();
          }else{
            _this.$message({
              message: d.data.meta.message,
              type: 'error'
            });
          }
        });
      },
      conformDelRaletion(){
        let rIndex = this.relationConfigDialog.raletionsIndes;
        let d = this.dataInfo.relation[rIndex];
        let _self = this;
        _self.$confirm("确定删除该关系吗？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.removeRelationById(d.id, "id");
          // 删除实体或关系---id;type 0 删除实体 1 删除关系
          _self.delLabelOrRelation(d.id,1)
          _self.updateContentArea();
          this.relationConfigDialog.visible = false;
        }).catch(() => {})
      },
      addRelationData(sNode, tNode, label,labelId) {
        // 20210224调整id=>relationId(接口引入后id字段被占)
        var id = sNode.id + "-" + tNode.id;
        var relationId = sNode.textOffset + "-" + tNode.textOffset;
        var item = {
          relationId: relationId,
          source: sNode.id,
          target: tNode.id,
          label: label,
          labelId:labelId
        };
        this.dataInfo.relation.removeItem("id", id);
        this.dataInfo.relation.push(item);
      },
      adustNodePosition(elem) {
        var pos = {
          x: 50,
          y: 50
        }
        var tRect = elem.getBoundingClientRect();
        var pRect = $(".docContentItem")[0].getBoundingClientRect();
        pos.x = tRect.x - pRect.x;
        pos.y = tRect.y - pRect.y + 25;
        return pos;
      },
      getRelationData() {
        // var rData = rData || this.dataInfo.relation;
        var spanSelector = $(".spanItem");
        var nodes = [];
        for (var i = 0; i < spanSelector.length; i++) {
          var iSelector = spanSelector.eq(i);
          var index = iSelector.attr("index");
          var item = {
            data: this.dataInfo.labels[index]
          };
          item.position = this.adustNodePosition(iSelector[0]);
          nodes.push(item);
        }

        var edges = this.dataInfo.relation || [];
        edges = edges.map(item => {
          return {
            data: item
          }
        })

        return {
          edges: edges,
          nodes: nodes
        }
      },
      updateRelationCanvas() {
        var rData = this.getRelationData();
        var params = {
          ...this.params
        };
        rData.nodes = rData.nodes || [];
        rData.edges = rData.edges || [];
        params.container = this.$refs.relationCanvasItem;
        params.elements = [];
        this.cy = cytoscape(params);
        this.cy.edges().remove();
        this.cy.nodes().remove();
        params.elements = params.elements.concat(rData.nodes);
        params.elements = params.elements.concat(rData.edges);
        for (var i = 0; i < params.elements.length; i++) {
          var elem = params.elements[i];
          this.cy.add(elem)
        }
      },
      //获取选中文本的偏移量
      getSelectTextOffset(txt) {
        var lastNode = txt.baseNode.previousElementSibling
        var pos = txt.baseOffset
        let str = txt.baseNode.data.slice(txt.baseOffset, txt.focusOffset)
        if (lastNode) {
          var tPos = Number(lastNode.getAttribute('offset'))
          var text = lastNode.innerText
          var tText = text.split('\n')[0]
          pos += tPos + tText.length
        }
        // 20210224调整id->textOffset(接口引入后id字段被占)
        // var id = `${str}[${pos}]`;
        // var textOffset = `${str}[${pos}]`;
        let ret = {
          text: str,
          type: txt.type,
          offset: pos,
          // id: id
          // textOffset:textOffset
        }
        return ret
      },
      // 改标签内容和样式
      addSpanByData(data, text) {
        if (!data || data.length === 0) {
          return text
        }
        data.sort(function (a, b) {
          return a.offset - b.offset
        })
        var rStr = text.slice(0, data[0].offset);
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var tStr = '';
          if(item.isAuto == '2'){
            tStr =
              `<span style="position: relative;border: solid 1px ${item.color};color: ${item.color};border-bottom: none;" type="${item.type}" class="spanItem" index=${i} id="${item.id}" title="${item.label}" offset=${item.offset}>${item.text}
                  <div class="spanInfoArea" style="border: solid 1px ${item.color};color: ${item.color}">${item.label}
                  <span class="opSpanInfoArea">
                  <i title="确认标注结果" index=${i} class="el-icon-document-checked checkSpanBtn"></i>
                  <i title="编辑标注信息" index=${i} class="el-icon-setting editSpanBtn" style="margin-left: 5px;"></i>
                  <i title="删除标注信息" index=${i} class="el-icon-delete removeSpanBtn" style="margin-left: 5px;"></i></span></div></span>`;
          }else{
            tStr =
              `<span style="position: relative;border: solid 1px ${item.color};color: ${item.color};border-bottom: none;" type="${item.type}" class="spanItem" index=${i} id="${item.id}" title="${item.label}" offset=${item.offset}>${item.text}
                  <div class="spanInfoArea" style="border: solid 1px ${item.color};color: ${item.color}">${item.label}
                  <span class="opSpanInfoArea">
                  <i title="编辑标注信息" index=${i} class="el-icon-setting editSpanBtn"></i>
                  <i title="删除标注信息" index=${i} class="el-icon-delete removeSpanBtn" style="margin-left: 10px;"></i></span></div></span>`;
          }
          // var tStr = '<span style="position: relative;" type="' + item.type + '" class="spanItem" index=' + i +
          //   ' id="' + item.id + '" title="' + item.label + '" offset=' + item.offset + '>' + item.text +
          //   '<div class="spanInfoArea" style="">' + item.label +
          //   '<span class="opSpanInfoArea"><i title="编辑标注信息" index=' + i +
          //   ' class="el-icon-setting editSpanBtn"></i> <i title="删除标注信息" class="removeSpanBtn el-icon-delete" index=' +
          //   i + ' style="margin-left: 10px;"></i></span></div></span>'
          rStr += tStr
          if (i < data.length - 1) {
            rStr += text.slice(data[i].offset + data[i].text.length, data[i + 1].offset);
          } else {
            rStr += text.slice(data[i].offset + data[i].text.length);
          }
        }
        return rStr
      },
      // labelInfoConfig.type
      //tree横向展示动态设置宽度、高度
      autoWidthAheight(level){
        console.log(level,66777)
        let str = '.el-tree>.el-tree-node>.el-tree-node__children';
        let heightArr = [];
        for(var i =0;i<=level-1;i++){
          let nodes = document.querySelectorAll(str);
          nodes.forEach(item=>{
            item.style.width =  350*(level-i) + "px";
            heightArr.push(item.style.height);
          });
          str += '>.el-tree-node>.el-tree-node__children';
        }
        if(heightArr.length >0){
          let maxHeight = heightArr.reduce(function(x,y){return (x>y)?x:y});
          let classNode = document.getElementsByClassName('el-tree-node__children');
          for(var i =0;i<=classNode.length-1;i++){
            classNode[i].style.height =  maxHeight;
          }
        }
      },
      // 树查询操作
      handleSerchEvent(val) {
        let _self = this;
        let keyword = '';
        let url = "";
        let labelId = '';
        if(val === 'entityAevent'){
          keyword = this.labelInfoConfig.keyword;
          url = "getLabelZtree";
          if(_self.labelInfoConfig.type === 'entity'){
            labelId = this.entityLabel.entityLabelId
          }else{
            labelId = this.eventLabel.eventLabelId
          }
        }else if(val === 'relations'){
          keyword = this.relationConfigDialog.data;
          url = "relationSearch";
        }
        this.adapter[url]({
          q: keyword,
          label_id:labelId
        },function(d){
          if(val === 'entityAevent'){
            if(_self.labelInfoConfig.type === 'entity'){
              _self.entityLabel.data = d.data.data;
              _self.entityLabel.defaultExpandedKeys = [];
              _self.getDefaultExpandedKeys(d.data.data,"entityLabel",0);
            }else{
              _self.eventLabel.data = d.data.data;
              _self.eventLabel.defaultExpandedKeys = [];
              _self.getDefaultExpandedKeys(d.data.data,"eventLabel",0);
            }
          }else if(val === 'relations'){
            _self.relationLabel.data = d.data.data;
            _self.relationLabel.defaultExpandedKeys = [];
            _self.getDefaultExpandedKeys(d.data.data,"relationLabel",0);
          }
        })
      },
      // 默认展开keys--参数 item数据 type那颗树 count节点level
      getDefaultExpandedKeys(item,type,count){
        if(!!item[0].children && item[0].children.length > 0){
          count = count+1;
          this[type].defaultExpandedKeys.push(item[0].id);
          this.getDefaultExpandedKeys(item[0].children,type,count);
        }else{
          this.$nextTick(function () {
            this.autoWidthAheight(count);
          })
        }
      },
      // 点击节点
      nodeClick(data, node, self) {
        console.log(data, node, self)
      },
      //展开icon事件
      nodeExpand(data,node,self){
        let _self = this;
        let url = "";
        let keyword = '';
        // true则为关系树
        if(this.relationConfigDialog.visible){
          url = "relationSearch";
          keyword = this.relationConfigDialog.data;
        }else{
          url = "getLabelZtree";
          keyword = this.labelInfoConfig.keyword;
        }
        this.adapter[url]({
          q:keyword,
          label_id:data.id
        },function(d){
          data.children = d.data.data;
          // 编辑时默认展示已选中的
          _self.$nextTick(()=>{
            if(_self.labelChoosedtype != ''){
              _self.$refs[_self.labelChoosedtype].setValue(_self.labelChoosedNode);
            }
          });
          _self.autoWidthAheight(node.level);
        })
      },
      //添加node节点 初始
      appendNode(node,data){
        if(node.level == 1){
          this.entityLabel.colorIsShow = true;
        }else{
          this.entityLabel.colorIsShow = false;
        }
        this.addNode = {};
        this.addNode.node = node;
        this.addNode.data = data;
      },
      // 新增节点
      appendNodeSubmit(nodeName) {
        let newChild = {
          id:'',
          label:nodeName.labels,
          children:[],
          parentId:this.addNode.data.id,
          orderby:nodeName.orderBy
        }
        let oJson = {};
        oJson.label = nodeName.label;
        oJson.orderby = nodeName.orderBy;
        oJson.parentId = this.addNode.data.id;
        if(this.labelInfoConfig.type === 'entity'){
          oJson.color = nodeName.color;
        }
        let _self = this;
        let url = "";
        // true则为关系树
        if(this.relationConfigDialog.visible){
          url = "relationAdd";
        }else{
          url = "addNode";
        }
        this.adapter[url](oJson,function(res){
          if(res.data.data === "失败"){
            _self.$message({
              message:res.data.meta.message,
              type:"warning"
            })
          }else{
            _self.$message({
              message:res.data.meta.message,
              type:"success"
            })
            _self.isShow = false;
            newChild.id = res.data.data;
            let getArrChild = _self.addNode.data.children;
            // 排序
            _self.treeSort(getArrChild,newChild);
          }
        })
      },
      //编辑节点 初始化
      editNode(node,data){
        console.log(node,data)
        this.editNodes = {};
        this.editNodes.node = node;
        this.editNodes.data = JSON.parse(JSON.stringify(data));
        if(node.level == 1){
          this.entityLabel.colorIsShow = true;
        }else{
          this.entityLabel.colorIsShow = false;
        }
      },
      // 编辑节点
      editNodeSubmit(data) {
        let _self = this;
        let url = "";
        let getEleNodeOrderBy = this.editNodes.node.parent.data.children; //获取同级节点
        let oBject = {};
        oBject.id = this.editNodes.data.id;
        oBject.label = data.labels;
        oBject.orderby = data.orderBy;
        if(this.labelInfoConfig.type === 'entity'){
          oBject.color = data.color;
        }
        // true则为关系树
        if(this.relationConfigDialog.visible){
          url = "editLabelRelation";
        }else{
          url = "editNode";
        }
        this.adapter[url](oBject,function(res){
          if(res.data.data === "失败"){
            _self.$message({
              message:res.data.meta.message,
              type:"warning"
            })
          }else{
            _self.$message({
              message:res.data.meta.message,
              type:"success"
            })
            _self.isShow = false;
            _self.editNodes.data.label = data.labels;
            _self.editNodes.data.orderby = data.orderBy;
            let editIndex = getEleNodeOrderBy.findItem("id",_self.editNodes.data.id);
            getEleNodeOrderBy.splice(editIndex,1);
            // 排序
            _self.treeSort(getEleNodeOrderBy,_self.editNodes.data);
          }
        })

      },
      // tree新增编辑后排序
      treeSort(getArrChild,newChild){
        if(getArrChild.length === 0 || newChild.orderby >= parseInt(getArrChild[getArrChild.length-1].orderby)){
          getArrChild.push(newChild);
        }else if(newChild.orderby < parseInt(getArrChild[0].orderby)){
          getArrChild.splice(0,0,newChild);
        }else{
          let insertIndex = -1;
          getArrChild.forEach((item,index)=>{
            if(newChild.orderby >= parseInt(item.orderby) && newChild.orderby <= parseInt(getArrChild[index+1].orderby)){
              insertIndex = index;
            }
          })
          if(insertIndex > -1){
            getArrChild.splice(insertIndex+1,0,newChild);
          }
        }
      },
      // 删除节点
      removeNode(node, data) {
        let _that = this;
        if (data.children && data.children.length > 0) {
          this.$message.error('有子节点，请先删除子节点')
        } else {
          this.$confirm('确定删除该节点吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              let urls = "";
              // true则为关系树
              if(_that.relationConfigDialog.visible){
                urls = "/relation/delLabelRelation/";
              }else{
                urls = "/bqgl/delLabel/";
              }
              $.post({
                url:urls+ node.data.id,
                success:function(res){
                  if(res.data.data === "失败"){
                    _that.$message({
                      message: res.meta.message,
                      type:"warning"
                    })
                  }else{
                    _that.$message({
                      message: res.meta.message,
                      type:"success"
                    })
                    node.remove();
                  }
                }
              })
            }).catch(()=>{});
        }
      },
      // 所选标签删除
		handleClose (tag) {
			this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
		},
		recommendHandle (tag) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }

		}
    }
  };

</script>

<style scope>
  * {
    box-sizing: border-box;
  }

  .docContentItem {
    height: auto;
    min-height: 400px;
    width: 100%;
    line-height: 3.5;
    border-radius: 5px;
    white-space: pre-line;
  }

  .spanItem {
    border: solid 1px rgb(64, 158, 255);
    color: rgb(64, 158, 255);
    border-bottom: none;
    display: inline-block;
    line-height: 25px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-left: 10px;
    min-width: 60px;
    cursor: pointer;
    padding: 0px 3px;
    text-align: center;
  }

  .spanItem[type=event] {
    color: rgb(103, 194, 58);
    border-color: rgb(103, 194, 58);
  }

  .spanItem[active=true] {
    color: #000 !important;
    background-color: rgb(64, 158, 255);
  }

  .spanItem[type=event][active=true] {
    color: #000;
    background-color: rgb(103, 194, 58);
  }

  .el-radio.is-bordered {
    margin-left: 0px !important;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
  }



  /deep/ .el-tabs__content {
    height: calc(100% - 60px) !important;
  }

  /deep/ .el-tab-pane {
    height: 100% !important;
  }

  /deep/ .el-dialog__body {
    padding: 20px 20px !important;
  }

  /deep/ .is-leaf+label.el-checkbox {
    display: none !important;
  }

  .spanInfoArea {
    position: absolute;
    bottom: -15px;
    left: -1px;
    width: calc(100% + 2px);
    min-width: 60px;
    line-height: 15px;
    font-size: 10px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    color: rgb(64, 158, 255);
    border: solid 1px rgb(64, 158, 255);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 3px;
    padding-right: 3px;
  }

  .spanItem[type=event] .spanInfoArea {
    color: rgb(103, 194, 58);
    border-color: rgb(103, 194, 58);
  }

  .opSpanInfoArea {
    position: absolute;
    display: none;
    line-height: 1;
    background-color: rgba(252, 252, 252, 0.8);
    right: 0px;
    top: 0px;
    width: 100%;
    padding: 2px 0px;
    text-align: center;
  }

  .topFormArea .el-form-item {
    margin-bottom: 0px !important;
  }

  .spanInfoArea:hover .opSpanInfoArea {
    display: inline-block;
  }

  .opSpanInfoArea i {
    position: relative;
  }
  .treeChildStyle /deep/ .el-tree-node{
    width: 236px;
  }
  .treeChildStyle /deep/ .el-tree-node__content{
    padding-left: 0px !important;
  }
  .treeChildStyle /deep/ .el-tree-node__children{
    width: 236px;
    position: absolute;
    top: 0px;
    left: 236px;
  }
  /* .treeChildStyle /deep/ .el-checkbox{
    display: inline-block !important;
  } */
  .selectedTags .tagBox,
.recommendTags .tagBox {
	margin-right: 10px;
  margin-top: 10px;
}
</style>
