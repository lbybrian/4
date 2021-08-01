import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
//解决控制台报错（连续点击同一个路由或刷新页面时。当前路由的冗余导航）
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
// import RouteConfig from 'static/config/route';
import Home from "@/main/Home";
import LabelManager from "@/autoTag/LabelManager"; // 标签管理
import DocumentMarkList from "@/autoTag/DocumentMarkList"; // 文档标注列表
import DocumentMark from "@/autoTag/DocumentMark"; // 文档标注
import DocManagement from "@/autoTag/DocManagement"; // 源文档管理
import DocCheck from "@/autoTag/DocCheck"; // 源文档管理
import TaskList from "@/autoTag/taskList"; // 任务列表
import SCLB from "@/assistReorganize/SCLB"; // 素材列表
import MBGL from "@/assistReorganize/MBGL"; // 模板管理
import ViewDocument from "@/assistReorganize/ViewDocument"; // 模板管理
import ZBCB from "@/assistReorganize/ZBCB"; // 整编出报
import BJQ from "@/assistReorganize/BJQ"; // 编辑区
import ZBSH from "@/assistReorganize/ZBSH"; // 整编审核
import SCFY from "@/assistReorganize/SCFY"; // 整编翻译
import DXSCDetail from "@/assistReorganize/DXSCDetail"; // 素材列表详情
import DXSC from "@/assistReorganize/DXSC"; // 素材列表详情

// import RelationShow from "@/assistConfirm/relationShow"; // 多源情报关联展示
// import InfoConfirm from "@/assistConfirm/infoConfirm"; // 关联信息挖掘印证
import DataPretreatment from "@/assistConfirm/dataPretreatment"; // 情报数据预处理
import AutoRelation from "@/assistConfirm/autoRelation"; // 情报自动关联
import Assessment from "@/assistConfirm/assessment"; // 情报评估管理
import AssessmentDetail from "@/assistConfirm/assessmentDetail"; // 情报评估管理详情页
import VariedShow from "@/assistConfirm/variedShow"; // 多手段展示

import Excavate from "@/assistConfirm/excavate"; // 情报关系挖掘
import Yzdb from "@/assistConfirm/yzdb"; // 情报印证对比
import Removal from "@/assistConfirm/removal"; // 情报整合去重

import Visual from "@/visualTool/Visual"; // 可视化
import Qbsjjr from "@/visualTool/Qbsjjr"; // 情报数据接入
import Qbsjzx from "@/visualTool/Qbsjzx"; // 情报数据展示
import DwVisual from "@/visualTool/DwVisual"; // 二/三维可视化
import Analyze from "@/visualTool/Analyze"; // 分析方法可视化
import Stgxzx from "@/visualTool/Stgxzx"; // 实体关系展现


export default new Router({
  routes: [
    {
      component: Home,
      name: "Home",
      path: "/",
      children: [
        {
          component: LabelManager,
          path: "/"
        },
        {
          component: LabelManager,
          path: "/label"
        },
        {
          component: DocumentMarkList,
          path: "/markList"
        },{
          component: DocumentMark,
          path: "/mark"
        },
        {
          component: DocManagement,
          path: "/docManagement"
        },{
          component: DocCheck,
          path: "/docCheck"
        },
        {
          component: ZBSH,
          path: "/zbsh"
        },{
          component: DXSC,
          path: "/dxsc"
        },{
          component: TaskList,
          path: "/taskList"
        },
        {
          component: SCLB,
          path: "/sclb"
        },{
          component: MBGL,
          path: "/mbgl"
        },{
          component: ViewDocument,
          path: "/viewDocument"
        },
        {
          component: DXSCDetail,
          path: "/dxscdetail"
        },
        {
          component:BJQ,
          path: "/bjq"
        },
        {
          component: ZBCB,
          path: "/zbcb"
        },
        {
          component: SCFY,
          path: "/scfy"
        },
        {
          component: DataPretreatment,
          path: "/dataPretreatment"
        },
        {
          component: AutoRelation,
          path: "/autoRelation"
        },
        {
          component: Assessment,
          path: "/assessment"
        },
        {
          component: AssessmentDetail,
          path: "/assessmentDetail"
        },
        {
          component: VariedShow,
          path: "/variedShow"
        },
        {
          component: Excavate,
          path: "/excavate"
        },
        {
          component: Yzdb,
          path: "/yzdb"
        },
        {
          component: Removal,
          path: "/removal"
        },
        {
          component: Visual,
          path: "/visual",
          children: [
            {
              component: Qbsjjr,
              path: "qbsjjr"
            },
            {
              component: Qbsjzx,
              path: "qbsjzx"
            },
            {
              component: Stgxzx,
              path: "stgxzx"
            },
            {
              component: DwVisual,
              path: "dwvisual"
            },
            {
              component: Analyze,
              path: "analyze"
            }
          ]
        }
      ]
    }
  ]
});
