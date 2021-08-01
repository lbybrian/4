<template>
  <div class="DXSC" v-if="layShow">
    <div class="topFilter">
      <el-row :gutter="20">
        <el-col :span="24">
          <SearchCondition :conditions="conditions" @onChange="dealChangeEvent" style="padding-right: 150px; padding-left: 20px;" />
        </el-col>
      </el-row>
      <div class="grid-content bg-purple" style="position: fixed; z-index: 100; right: 30px; top: 90px;">
        <handle :isList="true" :arrList="tableInfo.value" :alldata="tableInfo.data" :types="typeTrees" @getList="getList" @showRight="showRight"></handle>
      </div>

      <el-drawer title="分析统计" id="elDrawer" :visible.sync="rightForm" direction="rtl" size="100%">
        <DXSCrightForm id="elDrawerForm"></DXSCrightForm>
      </el-drawer>
      <el-row class="filter">
        <SearchGroup :options="searchOptions" ref="addInputValue" style="display: inline-block; width: 700px;" @resetSearch="dealResetSearch" @submitSearch="dealSubmitSearch"></SearchGroup>
        <el-checkbox v-model="highTj"
                     @change="highTjGetList"
                     style="position: absolute;top: 24px;left: 800px;">高价值推荐</el-checkbox>
      </el-row>
    </div>

    <!--动向素材列表数据-->
    <DataTableItem
      style="position: relative; float: left; width: 100%;"
      :tableInfo="tableInfo"
      @sortTypeChange="dealSortChange"
      @tableClick="dealTableClick"
      @pageChange="dealPageChange"
      @sizeChange="dealSizeChange"
    />

  </div>
</template>

<script>
  import SearchCondition from "../assistReorganizeCommon/SearchCondition";
  import DXSCrightForm from './DXSCrightForm'
  import { formatDate } from '../assets/time'
  import SearchGroup from "../assistReorganizeCommon/SearchGroup";
  import DataTableItem from "../assistReorganizeCommon/DataTableItem";
  import Handle from "./Handle"

  const API = '/rest/v1'

  const SEARCH = '/cm/dict'
  const YS = '/sczb-URL-prefix/ys/page'
  export default {
		name: "",
    components: {
      Handle,
      DXSCrightForm,
      SearchCondition,
      DataTableItem,
      SearchGroup
    },
    data() {
		  return {
        // 新增的search_after 查询参数
        //previous_sort:[],// 前一次查询的最后一条数据的sort_value
        next_sort:[],// 当前页面最后一条数据的sort_value
        before_page:1 ,// 跳转前的页码
        tableInfo: {
          checkAll: false,
          isIndeterminate: false,
          value: [],
          page: {
            total: 0
          },
          header: [
            {
              label: "",
              type: "checkbox",
              width: 1
            },
            {
              prop: "title",
              label: "序号",
              type: "index",
              width: 1,
              style: "text-align: center;"
            },
            {
              prop:  ["title", "abstract"],
              label: "标题",
              style: {
                title: "text-align: left; font-weight: 700; font-size: 16px; cursor: pointer; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;",
                abstract: "text-align: left; cursor: pointer; font-size: 12px; overflow: hidden; white-space:nowrap; text-overflow:ellipsis; "
              },
              flag: "is_read",
              width: 9
            },
            {
              prop: "status",
              label: "处理状态",
              type: "indicator",
              items: ["sc_dyzt", "is_fq", "is_db","is_ct_bw"],
              map: {
                is_fq: {
                  1: {
                    label: dictMap.data.sc_fq[1],
                    type: "warning"
                  }
                },
                is_db: {
                  1: {
                    label: dictMap.data.sc_clzt[1],
                    type: "primary"
                  }
                },
                sc_dyzt: {
                  1: {
                    label: dictMap.data.sc_dyzt[1],
                    type: "success"
                  },
                  2: {
                    label: dictMap.data.sc_dyzt[2],
                    type: "success"
                  }
                },
                is_ct_bw: {
                  1: {
                    label: dictMap.data.is_ct_bw[1],
                    type: "success"
                  }
                }
              },
              width: 4,
              style: "text-align: center;"
            },
            {
              prop: "publish_time",
              label: "发布时间",
              width: 3,
              sort: "yes",
              sortType: "",
              style: "text-align: center; cursor: pointer;"
            },
            {
              prop: "data_source",
              label: "信息来源",
              width: 2,
              style: "text-align: center;"
            },
            {
              prop: "author",
              label: "作者",
              width: 2,
              style: "text-align: center;"
            },
            {
              prop: "language",
              label: "语种",
              width: 2,
              style: "text-align: center;"
            }
          ],
          data: [

          ]
        },
		    searchOptions: [{
          label: "仅标题",
          value: "title"
        }, {
          label: "标题或首段",
          value: "title,author"
        }, {
          label: "标题或摘要",
          value: "title,abstract"
        }, {
          label: "标题或正文",
          value: "title,content"
        }, {
          label: "来源或作者",
          value: "data_source,author"
        }],
		    // 高级搜索条件
        // 控制简单关键字禁用
        simpleButton: false,
        // 搜索框
        searchInput: '',
        // 高级检索显示条件
        isCondition: false,
        // 动态添加行
        dynamicRows: [
          {
            selectOptions: [
              {
                value: 'title',
                label: '标题'
              },
              {
                value: 'abstract',
                label: '摘要'
              },
              {
                value: 'content',
                label: '正文'
              },
              {
                value: 'data_source',
                label: '来源'
              },
              {
                value: 'author',
                label: '作者'
              }
            ],
            selectValue: '',
            selectInput: '',
          }
        ],
		    //查询条件
        conditions: [
          {
            name: "分类",
            dict: "sc_fl",
            key: "classify",
            value: [],
            type: "checkbox",
            status: true,
            checkAll: true,
            dataMap: {},
            items: ["政策", "制度", "活动"]
          },
          {
            name: "方向",
            dict: "sc_fx",
            key: "direction",
            value: [],
            type: "checkbox",
            checkAll: false,
            dataMap: {},
            items: ["美国", "日本", "韩国", "越南"]
          },
          {
            name: "语种",
            dict: "sys_yz",
            key: "language",
            value: [],
            type: "checkbox",
            checkAll: false,
            dataMap: {},
            items: ["中文", "英文", "日文", "韩文", "俄文"]
          },
          {
            dict: "sc_dyzt",
            key: "sc_dyzt",
            name: "翻译状态",
            checkAll: true,
            value: "",
            type: "checkbox",
            dataMap: {},
            items: ["动向素材", "成品报文", "非文本素材"]
          },
          {
            dict: "sc_ydzt",
            key: "is_read",
            name: "阅读状态",
            checkAll: true,
            value: "",
            type: "checkbox",
            dataMap: {},
            items: ["动向素材", "成品报文", "非文本素材"]
          },
          {
            dict: "sc_fq",
            key: "is_fq",
            name: "废弃状态",
            checkAll: true,
            value: "",
            type: "checkbox",
            dataMap: {},
            items: ["动向素材", "成品报文", "非文本素材"]
          },
          {
            dict: "sc_clzt",
            key: "sc_clzt",
            name: "待编状态",
            checkAll: true,
            value: "",
            type: "checkbox",
            dataMap: {},
            items: ["动向素材", "成品报文", "非文本素材"]
          },
          {
            dict: "is_ct_bw",
            key: "is_ct_bw",
            name: "生成报文",
            checkAll: true,
            value: "",
            type: "checkbox",
            dataMap: {},
            items: ["已生成", "未生成"]
          },
          {
            key: "publish_time",
            name: "发布时间",
            value: "*",
            dataMap: {},
            type: "dateRange",
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
              shortcuts: [
                {
                  text: "最近一周",
                  onClick(picker) {
                    const end = new Date();
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit("pick", [date, end]);
                  }
                },
                {
                  text: "最近一个月",
                  onClick(picker) {
                    const end = new Date();
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit("pick", [date, end]);
                  }
                },
                {
                  text: "最近三个月",
                  onClick(picker) {
                    const end = new Date();
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit("pick", [date, end]);
                  }
                }
              ]
            },
            items: [
              {
                name: "全部",
                value: "*",
                type: "radio"
              },
              ""
            ]
          }
        ],
		    // 全选css效果控制
        isIndeterminate1: false,
        isIndeterminate2: false,
        isIndeterminate3: false,
        isIndeterminate4: true,
        isIndeterminate5: false,
        isIndeterminate_fq: true,
        isIndeterminate_sc_clzt: true,
        isIndeterminate_sc_dyzt: true,
        // 复选状态
        map_isIndeterminate:{},
        checkAll1: true,
        checkAll2: true,
        checkAll3: true,
        checkAll4: true,
        checkAll5: true,
        checkAll_fq: true,
        checkAll_sc_clzt: true,
        checkAll_sc_dyzt: true,
        // 全选状态
        map_checkAll: {},
        // 分类
        types: [],
        checkedTypes: [],
        classify: [],
        // 方向
        directions: [],
        checkedDirections: [],
        direction: [],
        // 语种
        languages: [],
        checkedLanguages: [],
        language: [],
        // 阅读状态
        statuses: [],
        checkedStatuses: ['未读'],
        // 选中数据
        checkedStatuses_fq: [],
        checkedStatuses_sc_clzt: [],
        checkedStatuses_sc_dyzt: [],
        map_checkedStatuses: {},
        statuses_fq: [],
        statuses_sc_clzt: [],
        statuses_sc_dyzt: [],
        //  数据参数值
        map_statuses: {},
        status: [],
        status_fq: [],
        status_sc_clzt: [],
        status_sc_dyzt: [],
        // 选中的数据值
        map_status: {},
        // 发布时间
        time: '',
        timeDisabled: true,
        // 选择方向
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 人工翻译
        transValue: false,

        // 右侧统计页面
        rightForm: false,
        // 分类下拉树
        typeTrees: [],

        height: 0,
        // 选中的列表
        selectFromList: '',
        // 传给列表子组件的参数
        params: {
          pageNo: 1,
          pageSize: 10,
          exact_search: JSON.stringify({
            is_lx: '1'
          }),
          is_human_translation: JSON.stringify(false),
          in_search: JSON.stringify({
            classify: '',
            direction: '',
            language: '',
            is_read: ['0'],
          }),
          q: "",
          query_type: "",
          with_or_not_search: "",
          rang_search: '',
          words_search: '',
        },
        highTj:false,
        layShow:false
      }
    },
    watch:{
      $router:function(to,from){
        // console.log(to)
      }
    },
    created() {
      var _self = this
      setTimeout(function(){
        _self.layShow = true
      },10)
      // 获取头部筛选数据
      this.getHeadData()
    },
    mounted() {
      this.checkAllChange4(true);
    },
    methods: {
      dealTableClick(name, param) {
        if (name === "title" || name === "abstract") {
          var path  = "/dxscdetail";
          if(param.is_lx !== "1") {
            path = "/fwbscdetail"
          }
          let {href} = this.$router.resolve({
            path: path,
            query: {
              id: param.id,
              from: "dxsc"
            }
          });
          window.open(href,'_blank')
        }
      },
      dealSortChange(param){
        var dsl = this.dsl || {};
        var tParam = {};
        tParam[param.key] = param.value;
        if(param.value) {
          dsl.order = JSON.stringify(tParam);
        }
        else {
          delete dsl.order;
        }
        dsl.pageNo = 1;
        dsl.pageSize = this.params.pageSize;
        this.updateTableData(dsl);

        var key = param.key;
        for(var i = 0; i < this.tableInfo.header.length; i++) {
          var item = this.tableInfo.header[i];
          if(item.prop !== key && item.sortType) {
            item.sortType = "";
          }
        }
        // console.log(param);
      },
      // 跳页和点击页码
      dealPageChange(val) {
        // console.log("page changed:" + val);
        var dsl = this.dsl || {};
        this.before_page = dsl.pageNo;

        dsl.pageNo = val;
        dsl.pageSize = this.params.pageSize;
        this.updateTableData(dsl);
      },
      dealSizeChange(val) {
        var dsl = this.dsl || {};
        this.dsl.pageNo = 1;
        this.params.pageSize = val
        dsl.pageSize = this.params.pageSize;
        this.updateTableData(dsl);
      },
      //点击提交检索按钮响应函数
      dealSubmitSearch(info, mode) {
        var dsl = this.dsl || {};
        var param = {};
        if(mode === "simple") {
          if(info.value != ''){
            dsl.q = info.value;
            dsl.query_type = "simple";
            delete dsl.with_or_not_search;
          }else{
            delete dsl.q;
            delete dsl.with_or_not_search;
            delete dsl.query_type;
          }
        }
        else if(mode === "complex") {
          if(info.value) {
            dsl.q = info.value;
          }else{
            delete dsl.q;
          }
          if(info.input.length != 0){
            dsl.query_type = "high";
            dsl.with_or_not_search = JSON.stringify(info.input);
          }else{
            delete dsl.with_or_not_search;
            delete dsl.query_type;
          }
        }
        dsl.pageNo = 1;
        dsl.pageSize = this.params.pageSize;
        this.updateTableData(dsl);
      },
      //重置检索按钮时间响应函数
      dealResetSearch(info, mode) {
        var dsl = this.dsl || {};
        delete dsl.q;
        delete dsl.with_or_not_search;
        delete dsl.query_type;
        this.params = dsl;
        dsl.pageNo = 1;
        dsl.pageSize = this.params.pageSize;
        this.updateTableData(dsl);
      },
      // 高级检索显示控制
      showCondition() {
        this.isCondition = true;

        this.searchInput = '';
        this.simpleButton = true
      },
      // 添加行
      addRow() {
        this.dynamicRows.push({
          selectOptions: [
            {
              value: 'title',
              label: '标题'
            },
            {
              value: 'abstract',
              label: '摘要'
            },
            {
              value: 'content',
              label: '正文'
            },
            {
              value: 'data_source',
              label: '来源'
            },
            {
              value: 'author',
              label: '作者'
            }
          ],
          selectValue: '',
          selectInput: '',
        })
      },

      // 删除行
      removeRow(i) {
        this.dynamicRows.splice(i, 1)
      },
      // 简单搜索
      querySearchAsync(queryString, cb) {
        if (queryString.trim() === '') {
          return
        }
        let params = {
          q: queryString,
          size: 10,
        }
        this.ajaxGET(API + '/cm/search_log/search/dic_search', params).then(r => {
          if (r.length > 0) {
            cb(r)
          } else {
            cb([])
          }
        }).catch(e => {
          this.$message({
            message: '请求下拉数据失败：' + e,
            type: 'warning'
          })
        })
      },

      // 模糊匹配搜索
      handleSelect(item) {
        this.activeTab = ''
        this.params.q = this.searchInput.trim()
        this.activeTab = '1'
        this.params.exact_search = JSON.stringify({
          is_lx: this.activeTab
        })
        this.params.pageNo = 1
      },

      // 高级检索button
      searchQuery() {
        let getAPIFlag = true
        let arr = []
        for (let i = 0; i < this.dynamicRows.length; i++) {
          if (this.dynamicRows[i].selectValue === '' || this.dynamicRows[i].selectInput === '') {
            this.$message({
              message: '关键字和筛选条件不能为空！',
              type: 'warning'
            })
            getAPIFlag = false
            break
          } else {
            arr.push({
              key: this.dynamicRows[i].selectValue.split(','),
              value: this.dynamicRows[i].selectInput
            })
          }
        }
        if (getAPIFlag) {
          this.params.with_or_not_search = JSON.stringify(arr)
        }
      },

      // 筛选搜索方法end
		  init(){
		    let map = {is_fq: false,languages:true,classify:true,direction:true,is_read:true,sc_clzt:false,sc_dyzt:false}
		    this.map_isIndeterminate = map;
		    this.map_checkAll = map;
        let host_proxy = this;
        $.each(map,function(key,value){
          host_proxy.map_checkedStatuses[key] = [];
          host_proxy.map_statuses[key] =[]
          host_proxy.map_status[key] =[]
          host_proxy.map_isIndeterminate[key] = value
          host_proxy.map_checkAll[key] = value
        })
      },
		  // 获取头部筛选数据
      getHeadData() {
        var _self = this;
        this.ajaxGET(API + SEARCH).then(r => {
          // 分类
          _self.types = r.sc_fl
          _self.checkedTypes = _self.types.map(d => {
            return d.name
          })
          _self.typeTrees = _self.types.map(d => {
            let obj = {
              'id': d.id,
              'label': d.name,
              'classify': d.value
            }
            return obj
          })

          // 方向
          _self.directions = r.sc_fx
          _self.checkedDirections = _self.directions.map(d => {
            return d.name
          })
          _self.treeData = r.sc_fx.map(d => {
            let obj = {
              'id': d.id,
              'label': d.name
            }
            return obj
          })

          // 语种
          _self.languages = r.sys_yz
          _self.checkedLanguages = _self.languages.map(d => {
            return d.name
          })

          // 阅读状态
          _self.statuses = r.sc_ydzt
          // 废弃状态
          _self.statuses_fq = r.sc_fq;
          _self.statuses_sc_clzt = r.sc_clzt;
          _self.statuses_sc_dyzt = r.sc_dyzt;
          // 废弃状态
          _self.map_statuses["sc_clzt"] =  r.sc_clzt;
          _self.map_statuses["is_fq"] = r.sc_fq;
          _self.map_statuses["is_read"] = r.sc_ydzt;
          _self.map_statuses["languages"] = r.sys_yz;
          _self.map_statuses["directions"] = r.sc_fx;
          _self.map_statuses["classify"] = r.sc_fl;

        }).catch(e => {
          _self.$message({
            message: '获取头部筛选数据失败：' + e,
            type: 'warning'
          })
        })
      },

      // 头部管理分类连接
      elTag() {
        this.$router.push({
          path: '/flgl'
        })
      },

		  // 此方法处理 删除文件后，列表不更新问题
		  getList() {
        var _self= this
        setTimeout(function(){
          _self.updateTableData();
        },800)
        // this.updateTableData();
      },
		  // 分类
      checkAllChange1(val) {
        this.checkedTypes = val ? this.types.map(d => { return d.name}) : []
        this.isIndeterminate1 = false
        this.classify = []
        if (this.checkedTypes.length > 0) {
          this.types.forEach(d => {
            this.classify.push(d.value)
          })
        }
        this.addInSearch();
        this.params.rang_search = JSON.stringify({
          publish_time: {
            start: this.time[0],
            end: this.time[1],
            format: 'time'
          }
        })
        this.addInSearch();
      },
      checkedTypesChange(value) {
        let checkedCount = value.length
        this.checkAll1 = checkedCount === this.types.length
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.types.length
        this.classify = []
        this.types.forEach(d => {
          this.checkedTypes.forEach(dd => {
            if (d.name === dd) {
              this.classify.push(d.value)
            }
          })
        })
        this.addInSearch();
      },

      // 方向
      checkAllChange2(val) {
        this.checkedDirections = val ? this.directions.map(d => { return d.name}) : []
        this.isIndeterminate2 = false
        this.direction = []
        if (this.checkedDirections.length > 0) {
          this.directions.forEach(d => {
            this.direction.push(d.value)
          })
        }
        this.addInSearch();
      },
      checkedDirectionsChange(value) {
        let checkedCount = value.length
        this.checkAll2 = checkedCount === this.directions.length
        this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.directions.length
        this.direction = []
        this.directions.forEach(d => {
          this.checkedDirections.forEach(dd => {
            if (d.name === dd) {
              this.direction.push(d.value)
            }
          })
        })
        this.addInSearch();
      },

      // 语种
      checkAllChange3(val) {
        this.checkedLanguages = val ? this.languages.map(d => { return d.name}) : []
        this.isIndeterminate3 = false
        this.language = []
        if (this.checkedLanguages.length > 0) {
          this.languages.forEach(d => {
            this.language.push(d.value)
          })
        }
        this.addInSearch();
      },
      checkedLanguagesChange(value) {
        let checkedCount = value.length
        this.checkAll3 = checkedCount === this.languages.length
        this.isIndeterminate3 = checkedCount > 0 && checkedCount < this.languages.length
        this.language = []
        this.languages.forEach(d => {
          this.checkedLanguages.forEach(dd => {
            if (d.name === dd) {
              this.language.push(d.value)
            }
          })
        })
        this.addInSearch();
      },

      // 阅读状态
      checkAllChange4(val) {
		    // console.log(val)
		    // console.log(this.isIndeterminate4)
		    // console.log(this.checkAll4)
        this.checkedStatuses = val ? this.statuses.map(d => { return d.name}) : []
        this.isIndeterminate4 = false
        // console.log(this.isIndeterminate4)
        this.status = []
        if (this.checkedStatuses.length > 0) {
          this.statuses.forEach(d => {
            this.status.push(d.value)
          })
        }
        this.addInSearch();
      },

      // 废弃状态
      checkAllChange_fq(val) {
        // console.log(val)
        this.checkedStatuses_fq = val ? this.statuses_fq.map(d => { return d.name}) : []
        this.isIndeterminate_fq = false
        this.status_fq = []
        if (this.checkedStatuses_fq.length > 0) {
          this.statuses_fq.forEach(d => {
            this.status_fq.push(d.value)
          })
        }
        this.addInSearch();
      },
      // 处理状态
      checkAllChange_sc_clzt(val) {
        // console.log(val)
        this.checkedStatuses_sc_clzt = val ? this.statuses_sc_clzt.map(d => { return d.name}) : []
        this.isIndeterminate_sc_clzt = false
        this.status_sc_clzt = []
        if (this.checkedStatuses_sc_clzt.length > 0) {
          this.statuses_sc_clzt.forEach(d => {
            this.status_sc_clzt.push(d.value)
          })
        }
        this.addInSearch();
      },

      // 处理状态
      checkAllChange_sc_dyzt(val) {
        // console.log(val)
        this.checkedStatuses_sc_dyzt = val ? this.statuses_sc_dyzt.map(d => { return d.name}) : []
        this.isIndeterminate_sc_dyzt = false
        this.status_sc_dyzt = []
        if (this.checkedStatuses_sc_dyzt.length > 0) {
          this.statuses_sc_dyzt.forEach(d => {
            this.status_sc_dyzt.push(d.value)
          })
        }
        this.addInSearch();

      },
      //获取当前日期
      getDate(){
        var oDate = new Date();
        var oY = oDate.getFullYear();
        var oM = this.toZero(oDate.getMonth() + 1);
        var oD = this.toZero(oDate.getDate());
        var oYdate = oY + '-' + oM + '-' + oD;
        return oYdate;
      },
      //补零
      toZero(n){
        if(n < 10){
          return "0" + n;
        }else{
          return n;
        }
      },
      dealChangeEvent(d, type, item) {
        var dsl = this.util.getConditionParam(d);
        var temp = this.util.checkConditions(dsl, this.dsl);
        var createTime = sessionStorage.getItem("create_times");
        var map_children = {
          "start":this.getDate(),
          "end":this.getDate(),
          "format":"date"
        }
        if(createTime){
          var createArr = createTime.split(",");
          if(createArr[1] == 1){
            dsl.rang_search = JSON.stringify({"create_time":map_children});
          }
          //sessionStorage.removeItem("create_times");
        }else{
          if(dsl.rang_search && dsl.rang_search !== "{}") {
            var tt= JSON.parse(dsl.rang_search);
            if(tt.publish_time) {
              tt.publish_time.start = formatDate(tt.publish_time.start).substr(0,10);
              tt.publish_time.end = formatDate(tt.publish_time.end).substr(0,10);
              tt.publish_time.format = 'date';
              dsl.rang_search = JSON.stringify(tt);
            }
          }
          else {//测试阶段为方便测试暂时注释--以后还要放开--勿删——————————————————————————
            // var tt = {
            //   publish_time: {
            //     start: this.util.latestDate(),
            //     end:  this.util.latestDate(),
            //     format: "date"
            //   }
            // }
            // dsl.rang_search = JSON.stringify(tt);
          }
        }

        if (temp || item.type==="dateRange" ||  (type === 'switch') || (type === "input")) {
          dsl.pageNo = 1;
          dsl.pageSize = this.params.pageSize;
          this.updateTableData(dsl);
          if(createTime){
            sessionStorage.removeItem("create_times");
            delete dsl.rang_search;
          }
          this.dsl = dsl;
        }

      },
      updateTableData(dsl, groupId) {
        dsl = dsl || this.dsl || {};
        var _self = this;
        // 获取参数传递的pageNo
        let param_pageNo = dsl.pageNo;
        if(param_pageNo-this.before_page==1){// 说明向后
          dsl.next_sort = this.next_sort;
        }/*else if(param_pageNo-this.before_page==-1){
          dsl.previous_sort = this.previous_sort;
          console.log("向前")
        }*/else{
          delete dsl.next_sort
          delete dsl.previous_sort
        }
        this.adapter.dxscList(dsl, function(d) {
          var tData = d.data;
          var t = tData.data;
          // search_after
          if(t.length>0) {
            // 先将 next_sort 赋值给   previous_sort
            _self.previous_sort = _self.next_sort
            // 记录最后一条数据
            _self.next_sort = t[t.length - 1]["sort-values"]
          }
          t.forEach(item=>{
            item.language = dictMap.data.sys_yz[item.language]
          })
          _self.tableInfo.data = t;
          _self.before_page = dsl.pageNo;
          _self.tableInfo.page = tData.pager;
        });
        this.dsl = dsl;
        // console.log(this.dsl);
      },
      // 全选事件
      com_checkAllChange(val,type) {
        this.map_checkAll[type] = !val
        // console.log(this.map_checkAll[type])
        this.map_checkedStatuses[type] = val ? this.map_statuses[type].map(d => { return d.name}) : []
        this.map_isIndeterminate[type] = false
        this.map_status[type] = []
        if (this.map_checkedStatuses[type].length > 0) {
          this.map_statuses[type].forEach(d => {
            this.map_status[type].push(d.value)
          })
        }
        let in_map = {};
        let host_proxy = this;
        $.each(host_proxy.map_status,function (key,value) {
          in_map[key] = value.length==0?"" :value
        })
        this.params.in_search = JSON.stringify(in_map)
        this.$refs.list.getList2(1, 20, this.params)
      },
      // 单选点击事件
      com_checkedStatusesChange(value,type) {
        let checkedCount = value.length
        this.map_checkAll[type] = checkedCount === this.map_statuses[type].length
        this.map_isIndeterminate[type] = checkedCount > 0 && checkedCount < this.map_statuses[type].length
        this.map_status[type] = []
        this.map_statuses[type].forEach(d => {
          this.map_checkedStatuses[type].forEach(dd => {
            if (d.name === dd) {
              this.map_status[type].push(d.value)
            }
          })
        })
        let in_map = {};
        let host_proxy = this;
        $.each(host_proxy.map_status,function (key,value) {
          in_map[key] = value.length==0?"" :value
        })
        this.params.in_search = JSON.stringify(in_map)
        this.$refs.list.getList2(1, 20, this.params)
      },

      checkedStatusesChange(value) {
        let checkedCount = value.length
        this.checkAll4 = checkedCount === this.statuses.length
        this.isIndeterminate4 = checkedCount > 0 && checkedCount < this.statuses.length
        this.status = []
        this.statuses.forEach(d => {
          this.checkedStatuses.forEach(dd => {
            if (d.name === dd) {
              this.status.push(d.value)
            }
          })
        })
        this.addInSearch();
      },

      checkedStatusesChange_sc_clzt(value) {
        let checkedCount = value.length
        this.checkAll_sc_clzt = checkedCount === this.statuses_sc_clzt.length
        this.isIndeterminate_sc_clzt = checkedCount > 0 && checkedCount < this.statuses_sc_clzt.length
        this.status_sc_clzt = []
        this.statuses_sc_clzt.forEach(d => {
          this.checkedStatuses_sc_clzt.forEach(dd => {
            if (d.name === dd) {
              this.status_sc_clzt.push(d.value)
            }
          })
        })
        this.addInSearch();
      },

      checkedStatusesChange_sc_dyzt(value) {
        let checkedCount = value.length
        this.checkAll_sc_dyzt = checkedCount === this.statuses_sc_dyzt.length
        this.isIndeterminate_sc_dyzt = checkedCount > 0 && checkedCount < this.statuses_sc_dyzt.length
        this.status_sc_dyzt = []
        this.statuses_sc_dyzt.forEach(d => {
          this.checkedStatuses_sc_dyzt.forEach(dd => {
            if (d.name === dd) {
              this.status_sc_dyzt.push(d.value)
            }
          })
        })
        this.addInSearch();
      },
      checkedStatusesChange_fq(value) {
        let checkedCount = value.length
        this.checkAll_fq = checkedCount === this.statuses_fq.length
        this.isIndeterminate_fq = checkedCount > 0 && checkedCount < this.statuses_fq.length
        this.status_fq = []
        this.statuses_fq.forEach(d => {
          this.checkedStatuses_fq.forEach(dd => {
            if (d.name === dd) {
              this.status_fq.push(d.value)
            }
          })
        })
        this.addInSearch();
      },

      addInSearch(){
        this.params.in_search = JSON.stringify({
          classify: this.classify.length === 0 ? '' : this.classify,
          direction: this.direction.length === 0 ? '' : this.direction,
          language: this.language.length === 0 ? '' : this.language,
          is_read: this.status.length === 0 ? '' : this.status,
          is_fq: this.status_fq.length === 0 ? '' : this.status_fq,
          sc_clzt: this.status_sc_clzt.length === 0 ? '' : this.status_sc_clzt,
          sc_dyzt: this.status_sc_dyzt.length === 0 ? '' : this.status_sc_dyzt,
        })
       sessionStorage.setItem('in_serch_val',this.params.in_search)
        // var getsearchinfo = sessionStorage.getItem('in_serch_val')
        // console.log(getsearchinfo)

      },
      // 发布时间
      timeAll(val) {
        this.time = ''
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        this.timeDisabled = val
        if (this.timeDisabled) {
          this.params.rang_search = JSON.stringify({
            publish_time: {
              start: formatDate(start),
              end: formatDate(end),
              format: 'time'
            }
          })
        } else {
          this.params.rang_search = ''
        }
        this.$refs.list.getList2(1, 20, this.params)
      },
      timeChange(val) {
        if (val === null) {
          this.timeDisabled = true
          this.checkAll5 = true
          this.params.rang_search = ''
        } else {
          this.params.rang_search = JSON.stringify({
            publish_time: {
              start: formatDate(this.time[0]),
              end: formatDate(this.time[1]),
              format: 'time'
            }
          })
        }
        this.$refs.list.getList2(1, 20, this.params)
      },

      // 人工翻译
      transChange(val) {
        this.transValue = val
        this.params.is_human_translation = JSON.stringify(this.transValue)
        this.$refs.list.getList2(1, 20, this.params)
      },

      // 从列表子组件获取选中的数据
      getSelectFromList(arr) {
        this.selectFromList = arr.map(d => {
          return d.id
        })
      },
      // 显示右侧统计图表
      showRight() {
        this.rightForm = true
      },
      //高价值推荐
      highTjGetList(){
        // this.$refs.addInputValue.allDisable(this.highTj);
        var dsl = this.dsl || {};
        if(this.highTj){
          dsl.high_tj = "true"
        }else{
          if(dsl.high_tj){
            delete dsl.high_tj
          }
        }
        dsl.pageNo = 1;
        dsl.pageSize = this.params.pageSize;
        this.updateTableData(dsl);
      }
    }
	}
</script>

<style scoped>
  .DXSC{
    position: relative;
    float:left;
    overflow-x: hidden;
    height: auto;
    width: 100%;
    background: #ffffff;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .el-checkbox-group{
    display: inline-block;
    margin-left: 20px;
  }
  .el-date-editor{
    margin-left: 20px;
  }
  .el-tree{
    width: 200px!important;
  }
  .el-tag{
    cursor: pointer;
    margin:5px;
  }
  .rightButton li {
    margin: 5px 0;
  }
  .filter{
    padding: 20px;
    margin-top: 20px;
    border-top: 1px dashed #ccc;
    border-bottom: 1px dashed #ccc;
  }

  .topFilter {
    padding-bottom: 20px;
  }

  .topFilter /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #606266;
  }
/*.cpgl /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #606266;
}*/
  /deep/ .formLine[dict='sc_ydzt'],
  /deep/ .formLine[dict='sc_fq'],
  /deep/ .formLine[dict='sc_clzt'],
  /deep/ .formLine[dict='sc_dyzt'] {
    display: inline-block;
    width: 50%;
    float: left;
    position: relative;
  }
/*高级检索样式*/
  .elLink{
    line-height: 40px;
    padding-left: 20px;
  }
  .dynamicRow{
    margin: 10px auto;
  }
  /deep/ .grid-content[flag=is_read-1] p:first-child {
    color: #657180;
    font-weight: normal !important;
  }

  /deep/ .grid-content[flag=is_read-0] p:first-child {
    color: #464c5b;
    font-weight: 900 !important;
  }

  /deep/ .formLine[dict='sys_yz'],
  /deep/ .formLine[dict='is_ct_bw'],
  /deep/ .formLine[dict='sc_dyzt'],
  /deep/ .formLine[dict='sc_fq'],
  /deep/ .formLine[dict='sc_ydzt'],
  /deep/ .formLine[dict='sc_clzt'] {
    width: 50% !important;
  }

</style>
