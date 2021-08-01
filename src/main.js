// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.config.productionTip = false;


import axios from 'axios'
Vue.prototype.$axios = axios
//封装接口
import Adapter from "./assets/js/adapter";
Vue.prototype.adapter = window.adapter = new Adapter(InterfaceConfig);
Vue.prototype.tAdapter = window.tAdapter = webCpu.initAdapter(InterfaceConfig)

// 拖拽
import VueDND from 'awe-dnd';
Vue.use(VueDND);
//公共方法
import utilOther from "./assets/js/util.js";
Vue.prototype.utilOther = utilOther;
window.utilOther = utilOther;

import util from "./assets/js/utilCommon";
Vue.prototype.util = util;
window.util = util;

window.initAppData = function() {
  var t = WebTool.urlQuery(location.href, "data");
  if (t) {
    t = JSON.parse(decodeURIComponent(t));
    if (t && t.token && t.user && t.user.topPerms) {
      localStorage.setItem("token", t.token);
      localStorage.setItem("logined", JSON.stringify(t.user));
      saveMenuData(t.user.topPerms);
    }
  }

  // var tData = localStorage.getItem("dictData");
  // tData = JSON.parse(tData);
  // console.log(tData);
  // if (location.hash === "#/" || location.hash.search("/ylwd") !== -1) {
  //   util.intiAppItem(tData);
  // } else {
  //   util.updateDictData();
  // }
  util.getDictDataMap(function (tData) {
    if (Object.keys(tData).length !== 0) {
      localStorage.setItem("dictData", JSON.stringify(tData));
      localStorage.setItem("dict", JSON.stringify(tData));
    }
  });
};

initAppData();

var tApp =new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
window.dealConfirm = function(callback, options) {
  options = options || {};
  var content = options.content || "确定删除？";
  var title = options.title || "提示";
  var confirmText = options.confirmText || "确定";
  var cancelButtonText = options.cancelButtonText || "取消";
  var type = options.cancelButtonText || 'warning';

  tApp.$confirm(content, title, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelButtonText,
    type: type
  }).then(() => {
    if(typeof callback === "function") {
      callback();
    }
  }).catch(() => { // 取消删除

  })
}
