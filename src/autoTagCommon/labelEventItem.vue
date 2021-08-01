<template>
  <div class="event-box">
    <div class="event-item" :data="dataInfo" v-for="(items,index) in dataInfo" :key="index">
      <p class="event-mb"><span class="e-left">【{{index + 1}}】</span><span class="e-right" :title="items.event_list[0].trigger">{{items.event_list[0].trigger}}</span></p>
      <div>
        <dataTableItem :dataObj="items.event_list[0]"></dataTableItem>
      </div>
    </div>
  </div>
</template>

<script>
import dataTableItem from "@/autoTagCommon/dataTable.vue"
  export default {
    name: 'labelEventItem',
    props: {
      eventData:Array
    },
    components:{
      dataTableItem,
    },
    beforeMount() {

    },
    created(){
      if (this.eventData) {
        this.dataInfo = this.eventData;
      }
      this.dealDataFn(this.dataInfo);
    },
    data() {
      return {
        dataInfo: [

        ]
      }
    },
    methods: {
      dealDataFn(data){
        data.forEach((items,index)=>{
          let oEventList = items.event_list;
          let header = [];
          let odata = [];
          let oLabel = {};
          oEventList.forEach((item,dx)=>{
            let argus = item.arguments;
            argus.forEach((list,id)=>{
              header.push({
                "prop":list.argument_start_index.toString(),
                "label":list.role
              })
              oLabel[list.argument_start_index] = list.argument;
            })
            odata.push(oLabel)
            item.withSelection = false
            item.withIndex = false
            item.border = true
            item.data = odata
            item.header = header
          })
        })
        console.log(data)
      },

    },
  }

</script>

<style scoped>
.event-box .event-item{
  margin-bottom: 20px;
  padding:20px;
  border:1px solid #d1d1d1;
}
.event-mb{
  margin-bottom: 10px;
}
.e-left{
  float: left;
}
.e-right{
  display: inline-block;
  white-space: nowrap;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
