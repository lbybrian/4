<template>
  <div>
    <form-head :signObj='signObj'></form-head>
    <table-list :signObj='signObj'></table-list>
    <!--<page-tool :signObj='signObj'></page-tool>-->
  </div>
</template>

<script>
	import FormHead from '@/visualCommon/FormHead';
	import TableList from '@/visualCommon/TableList';
//	import PageTool from '@/visualCommon/PageTool';
  export default {
    name: "DataAll",
    components: {
    	FormHead,
    	TableList,
//  	PageTool
    },
    data() {
      return {
      	signObj:{
      		isShow:false,//模块筛选栏
      		operate:false,//操作按钮
      		pageSign:true,//分页
      	}
      }
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {}
  }
</script>
<style scoped>
  
</style>
