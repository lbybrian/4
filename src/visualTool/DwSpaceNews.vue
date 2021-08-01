<template>
  <div>
    <PlanMap v-if="dataInfo.planMap"></PlanMap>
    <GisMap v-else-if="dataInfo.gisMap"></GisMap>
    <ThreeDMap v-else-if="dataInfo.threeDMap"></ThreeDMap>
    <CityMap v-else-if="dataInfo.cityMap"></CityMap>
  </div>
</template>

<script>
import PlanMap from './MapComponents/PlanMap.vue'
import GisMap from './MapComponents/GisMap.vue'
import ThreeDMap from './MapComponents/ThreeDMap.vue'
import CityMap from './MapComponents/CityMap.vue'
  export default {
    name: '',
    props: {
      showSign:Object
    },
    components:{
      PlanMap,
      GisMap,
      CityMap,
      ThreeDMap
    },
    data() {
      return {
        dataInfo: {
          planMap:false,
          gisMap:false,
          threeDMap:false,
          cityMap:false,
        }
      }
    },
    watch: {
    },
    beforeMount() {
      this.dataInfo=this.showSign
    },
    mounted() {

    },
    methods: {},
    destroyed() {},
  }
</script>

<style scoped>
</style>
