<template>
  <div style="padding-top: 10px; margin-top: 0px; height: 100%; position: relative;">
    <el-row style="margin-top: 0px; height: 100%;" :gutter="5">
      <el-col :span="4" :offset="0" class="tree_part">
        <form :model="ruleForm" class="left-form">
          <el-input v-model="ruleForm.name" size="small" placeholder="请输入"></el-input>
          <template>
            <i class="el-icon-document"></i>
            <span>舆情数据</span>
          </template>
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="" @close="">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>XXXX数据</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">数据一</template> -->
                <el-menu-item index="1-1">数据一1</el-menu-item>
                <el-menu-item index="1-2">数据一2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="可设置二标题2">
                <el-menu-item index="1-3">数据3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">数据4</template>
                <el-menu-item index="1-4-1">数据1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">XXXX数据2</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">XXXX数据3</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">XXXX数据4</span>
            </el-menu-item>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>其他</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="5-1">数据一1</el-menu-item>
                <el-menu-item index="5-2">数据一2</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>

        </form>
      </el-col>
      <el-col :span="19" style="height: 100%;margin: 20px; padding: 20px;box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);">
        <div class="right-header">
          <el-tabs class="right-header-tabs" v-model="activeName" @tab-click="">

            <!-- <el-steps :active="active" space="20" simple> -->
            <el-steps :active="active">
              <el-step>
                <template slot="title">请先在左侧选择数据源</template>
              </el-step>
              <el-step title="在下图查看数据情况,支持切换展示方式" description=""></el-step>
              <el-step title="完成" description=""></el-step>
            </el-steps>

            <el-tab-pane label="空间信息展示" name="1" v-show="activeName==='1'">
              <dw-space-news v-if="activeName==='1'" :showSign="showSign"></dw-space-news>
            </el-tab-pane>
            <el-tab-pane label="动态综合分析" name="2" v-show="activeName==='2'">
              <dw-analyze v-if="activeName==='2'"></dw-analyze>
            </el-tab-pane>
            <!--  <el-tab-pane label="空间信息展示2" name="3" >
  			    </el-tab-pane> -->
          </el-tabs>

          <el-dropdown class="right-header-dropdown" @command="handleCommand">
            <span class="el-dropdown-link">
              展示方式切换<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">平面图</el-dropdown-item>
              <el-dropdown-item command="b">地图</el-dropdown-item>
              <el-dropdown-item command="c">地球图</el-dropdown-item>
              <el-dropdown-item command="d">城市图</el-dropdown-item>
              <!-- <el-dropdown-item v-for="(ce,index) in dropdownList" :key="index" :command="ce" >{{ce.title}}</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>

          <div class="btn-box">
            <el-button type="default" size="small" @click="">取消</el-button>
            <el-button type="primary" size="small" @click="">确定</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import DwSpaceNews from '@/visualTool/DwSpaceNews'
  import DwAnalyze from '@/visualTool/DwAnalyze'
  export default {
    name: "DwVisual",
    data() {
      return {
        // 步骤1
        active: 1,
        activeName: '1',
        name: '2',
        ruleForm: {
          name: '',
        },
        showSign:{
          planMap:false,
          gisMap:true,
          threeDMap:false,
          cityMap:false,
        }
      }
    },
    components: {
      DwSpaceNews,
      DwAnalyze
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleCommand(key) {
        if(key==='a'){
           this.showSign.planMap=true;
           this.showSign.gisMap=false;
           this.showSign.threeDMap=false;
           this.showSign.cityMap=false;
           console.log(key,'key')
        }
        else if(key==='b'){
           this.showSign.planMap=false;
           this.showSign.gisMap=true;
           this.showSign.threeDMap=false;
           this.showSign.cityMap=false;
           console.log(key,'key')
        }
        else if(key==='c'){
           this.showSign.planMap=false;
           this.showSign.gisMap=false;
           this.showSign.threeDMap=true;
           this.showSign.cityMap=false;
           console.log(key,'key')
        }
        else if(key==='d'){
           this.showSign.planMap=false;
           this.showSign.gisMap=false;
           this.showSign.threeDMap=false;
           this.showSign.cityMap=true;
           console.log(key,'key')
        }

      }
    },

  }
</script>

<style scoped>
  .allbox {
    /*
    float: left;
    height: 100%;
    padding: 2px;
  */
  }

  .left {
    /*
    float: left;
    height: 100%;
    min-width: 300px;
    margin-top: 5px;
  */
  }

  .left-form {
    height: 100%;
    /*
	padding: 20px;
	color: #47AFAE;
  background:(rgba(8,58,74,0.7));
  box-shadow: 0 0 20px rgba(9,169,191,0.5);
 */
  }

  .right {
    /*
    float: left;
    height: 100%;
    padding: 20px;
    margin: 20px;
    color: #47AFAE;
    box-shadow: 0 0 5px rgba(185, 191, 191, 0.5);
  */
  }

  .right-header {
    position: relative;
    min-width: 1200px;
  }

  .right-header-dropdown {
    position: absolute;
    cursor: pointer;
    right: 6px;
    top: 10px;
  }

  .btn-box {
    position: absolute;
    margin: 20px;
    left: 45%;
  }
</style>
