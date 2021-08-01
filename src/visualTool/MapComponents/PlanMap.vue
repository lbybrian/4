<template>
  <div>
    <div id="container" ref="container"></div>
  </div>
</template>
<script>
  import '@/assets/js/amap.js'
  export default {
    name: "",
    props: {
      dataObj: Object,
    },
    data() {
      return {
        dataInfo: {
          deploy: {
            center: [103.00, 36.00],
            zoom: 2
          },
        }
      }
    },
    mounted() {
      this.updateData(this.dataInfo)
    },
    methods: {
      updateData(newObj) {
        let planmap = new AMap.Map("container",newObj.deploy);
      },
    },
  };
</script>

<style scoped>
  #container {
    width:100%;
    height: 1000px;
    /* min-height: 1000px; */
  }
</style>
