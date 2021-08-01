<template>
  <div>
    <div id="container" ref="container"></div>
  </div>
</template>
<script  src="//webapi.amap.com/maps?v=1.4.15&key=e181cdf47d211f1c9a31623b9a2ea2bc&plugin=AMap.ControlBar"></script>
<!-- <script  src="//webapi.amap.com/maps?v=1.4.15&key=e181cdf47d211f1c9a31623b9a2ea2bc"></script> -->
<!-- <script src="https://webapi.amap.com/ui/1.0/main.js"></script> -->
<script>
  // import '@/assets/js/amap_city.js'
  export default {
    name: "",
    props: {
      dataObj: Object,
    },
    data() {
      return {
        map:'',
        dataInfo: {
          obj1:{
              resizeEnable: true,
              rotateEnable: true,
              pitchEnable: true,
              zoom: 17,
              pitch: 80,
              rotation: -15,
              viewMode: '3D', //开启3D视图,默认为关闭
              buildingAnimation: true, //楼块出现是否带动画
              expandZoomRange: true,
              zooms: [3, 20],
              center: [116.333926, 39.997245]
          },
          obj2:{
            showZoomBar: false,
            showControlButton: true,
            position: {
              right: '10px',
              top: '10px'
            }
          }
        }
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.dataObj ? this.dataObj : this.dataInfo;
        this.updateData(this.dataInfo)
      })
    },
    methods: {
      updateData(newObj) {
          var map = new AMap.Map("container", newObj.obj1);
          // map.addControl(new AMap.ControlBar(newObj.obj2))
          map.plugin("AMap.ControlBar", function() {
          map.addControl(new AMap.ControlBar(newObj.obj2))
        })
        // var heatmap;
        // let that = this;
        // map.plugin(["AMap.Heatmap"], function() {
        //   heatmap = new AMap.Heatmap(map, {
        //     radius: 15,
        //     opacity: [0, 0.8]
        //   });
        //   heatmap.setDataSet({
        //     // data: newObj.points,
        //     data: newObj.heatmapData,
        //     max: 5
        //   });
        // });
      },
    },
  };
</script>
 <style>
      body,
      html {
        margin: 0;
        padding: 0;
        font: 12px/16px Verdana, Helvetica, Arial, sans-serif;
        width: 100%;
        height: 100%;
      }
    </style>
<style scoped>

  #container {
   /* width:100%;
    min-height: 1000px; */
    width:100%;
    height:1000px;
    resize:both;
  }
</style>
