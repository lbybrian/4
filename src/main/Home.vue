<template>
  <div class="home">
    <el-container style="width: 100%;height:100%;">
      <el-header style="height:79px;padding: 0; margin: 0;">
        <public-head></public-head>
      </el-header>
      <el-main>
        <transition>
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import publicHead from "@/common/publicHead";
export default {
  name: 'Home',
  components: {
    publicHead
  }
}
</script>

<style scoped>
.home {
  height: 100%;
  background: #f9fafc;
}
.el-head {
  margin: 0;
  padding: 0;
}
</style>
