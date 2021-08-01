<template>
  <div>
    <!-- <div id="allmap" ref="allmap"> </div> -->
    <img style="width: 90%;height: 90%;" src="../../assets/image/visualImgs/ball.jpg" />
  </div>
</template>
<!-- <script src="../../assets/js/map/baidu.js"></script> -->
<script>
  // import '@/assets/js/amap.js'
  export default {
    name: "",
    props: {
      dataObj: Object,
    },
    whatch:{
    },
    data() {
      return {
        // map:""
      }
    },
    mounted() {
      // GL版命名空间为BMapGL
      var map = new window.BMapGL.Map("allmap");    // 创建Map实例
      map.centerAndZoom(new window.BMapGL.Point(118.5, 27.5), 5);  // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      map.setMapType(BMAP_EARTH_MAP);      // 设置地图类型为地球模式
    },
    methods: {},
  };
</script>
<style scoped>
  #allmap {
    /* min-height: 1000px; */
    width: 100%;
    height: 1000px;
    /* resize: both; */
  }
</style>
