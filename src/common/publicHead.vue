<template>
  <div class="pubhead">

    <el-col :span="5"
            style="height: 100%;">
      <!--<img src="../assets/image/logo.png"/>-->
      <div>
        <span class="systemtitle">大数据分析通用工具</span>
      </div>
    </el-col>
    <el-col :span="15"
            style="height: 100%;">
      <el-menu :default-active="activeIndex"
               class="el-menu-demo"
               mode="horizontal"
               @select="handleSelect">
        <el-submenu index="1">
          <template slot="title"><span class="menutitle">数据自动标签</span></template>
          <el-menu-item index="/label">标签管理</el-menu-item>
          <el-menu-item index="/markList">文档标注</el-menu-item>
          <el-menu-item index="/docManagement">源文档管理</el-menu-item>
          <el-menu-item index="/taskList">任务管理</el-menu-item>

        </el-submenu>

        <el-submenu index="2">
          <template slot="title"><span class="menutitle">情报辅助整编</span></template>
          <el-menu-item index="/dxsc">文本素材</el-menu-item>
          <el-menu-item index="/sclb">待编素材</el-menu-item>
          <el-menu-item index="/zbcb">整编任务</el-menu-item>
          <el-menu-item index="/bjq">编辑区</el-menu-item>
          <el-menu-item index="/zbsh">整编审核</el-menu-item>
          <el-menu-item index="/scfy">整编翻译</el-menu-item>
          <el-menu-item index="/dxscdetail">素材详情</el-menu-item>
          <el-menu-item index="/mbgl">模板管理</el-menu-item>

        </el-submenu>

        <el-submenu index="3">
          <template slot="title"><span class="menutitle">情报辅助印证</span></template>
          <el-submenu index="/relationShow">
            <template slot="title">多源情报关联展示</template>
            <el-menu-item index="/dataPretreatment">情报数据预处理</el-menu-item>
            <el-menu-item index="/autoRelation">情报自动关联</el-menu-item>
            <el-menu-item index="/assessment">情报评估管理</el-menu-item>
            <el-menu-item index="/variedShow">多手段展示</el-menu-item>
          </el-submenu>
          <el-submenu index="infoConfirm">
            <template slot="title">关联信息挖掘印证</template>
            <el-menu-item index="/excavate">情报关系挖掘</el-menu-item>
            <el-menu-item index="yzdb">情报印证对比</el-menu-item>
            <el-menu-item index="/removal">情报整合去重</el-menu-item>
          </el-submenu>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title"><span class="menutitle">可视化工具</span></template>
          <el-submenu index="4-1">
            <template slot="title"><span  :style="showColor">数据可视化</span></template>
            <el-menu-item index="/visual/qbsjjr">情报数据接入</el-menu-item>
            <el-menu-item index="/visual/qbsjzx">情报数据展现</el-menu-item>
            <el-menu-item index="/visual/stgxzx">实体关系展现</el-menu-item>
          </el-submenu>
          <el-menu-item index="/visual/dwvisual">二/三维可视化</el-menu-item>
          <el-menu-item index="/visual/analyze">分析方法可视化</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
    <el-col :span="4"
            style="height: 100%;">
      <div class="grid-content bg-purple">
        <div>
          <i class="el-icon-user"></i>
          欢迎 : {{ username}}&nbsp;&nbsp;
          <!--<el-avatar shape="circle" :size="40" src="../assets/image/user.png"></el-avatar>-->
          <el-link href="#/loginOut" type="primary">退出</el-link>
        </div>
      </div>
    </el-col>

  </div>
</template>

<script>
export default {
  name: "publicHead",
  created () {

  },
  data () {
    return {
      username: 'admin管理员',
      activeIndex: '/',
      showColor:{
        color: ''
      },
      url: '../assets/image/user.png'
    }

  },
  watch:{
    $route: {
        handler(newValue, oldValue) {
          // console.log(typeof newValue.path)
             if(newValue.path === '/visual/dwvisual' || newValue.path === '/visual/analyze'){
                  this.showColor.color=''
              }else{
                this.showColor.color='#409eff'
              }
        },
        deep:true,
        immediate: true
    },
  },
  methods: {
    goHome () {
      // this.$router.push({
      //   path: `/label`
      // });
      /*location.reload()*/
      // location.hash = `/home`
    },
    exitLogin (val) {
      if (val == "exitLogin") {
        this.$router.push({
          path: `/loginOut`
        });
      }
    },
    handleSelect (key, keyPath) {
      this.$router.push({
        path: key
      });
      sessionStorage.setItem("path", key);
    }
  },
  mounted () {
    if (!sessionStorage.getItem("path")) {
      this.$router.push({ path: "/label" });
      this.activeIndex = "/label";
    } else {
      this.activeIndex = sessionStorage.getItem("path");
      // this.$router.push({ path: sessionStorage.getItem("path") });
    }
  },
}
</script>

<style scoped>
.pubhead {
  height: 79px !important;
  line-height: 79px;
  border-bottom: 1px solid #ccc;
  color: #606263;
  width: 100%;
  background-size: 100%;
  background: #fff;
}
.pubhead .systemtitle {
  font-size: 32px;
  font-weight: 500;
  padding-left: 0px;
  display: inline-block;
  text-align: center;
  width: 100%;
}
/* .menutitle {
  color: #ffffff;
} */
.menutitle:hover {
  color: #409EFF !important;
}
/deep/ .el-menu.el-menu--horizontal {
  border-bottom: solid 0px #e6e6e6;
  background: transparent;
}
/deep/ .el-menu--horizontal > .el-menu-item {
  font-size: 20px;
  float: left;
  height: 80px;
  line-height: 80px;
  margin: 0;
  color: #606263;
}
/deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
  font-size: 20px;
  height: 80px;
  line-height: 80px;
  color: #606263;
}
/deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: transparent;
  color: #f8f8f8;
}
/deep/ .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: transparent;
  color: #409EFF;
}
/deep/ .el-menu--horizontal .el-menu .el-menu-item.is-active,
.el-menu--horizontal .el-menu .el-submenu.is-active > .el-submenu__title {
  color: #409EFF;
}
/deep/ .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #409EFF !important;
  color: #409EFF !important;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  outline: 0;
  color: #409eff;
}
.el-menu--horizontal .el-menu .el-menu-item.is-active,
.el-menu--horizontal .el-menu .el-submenu.is-active > .el-submenu__title {
  color: #409eff;
}
/deep/ .el-menu--horizontal > .el-menu-item.is-active {
  color: #409eff !important;
}
/deep/ .el-submenu__title i {
  color: white;
}
</style>
