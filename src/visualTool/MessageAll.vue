<template>
	<div>
		<form-body :dataObj="dataForm"></form-body>

    <!-- <check-box :dataObj="dataForm"></check-box> -->
	</div>
</template>

<script>
	import FormBody from '@/visualCommon/FormBody'
	import CheckBox from '@/visualCommon/CheckBox';

	export default {
		name: "Rule",
components: {
		FormBody,
		CheckBox
	},
	data() {
		return {
			dataForm: {
				textareas: [{
          title:'####情报简介',
          describe:'数据集适用领域、背景等'
        },
        {
          title:'####情报内容',
          describe:'情报内元素组成、元素名称等'
        },
        {
          title:'####情报来源',
          describe:'情报源头'
        },
        {
          title:'####情报探索方向',
          describe:'情报有哪些用途、实践场景'
        },
        ],
				cardList: [],
				tableData: [
				        {
				          name: "AAA部门",
				          value: [],
				          checkAll: false,
				          type: "checkbox",
				          key: "bglx",
				          items: ["李俊","张横","彭玘","单廷珪","魏定国","欧鹏","邓飞", "燕顺","童威", "童猛"]
				        },
				        {
				          name: "BBB部门",
				          value: [],
				          type: "checkbox",
				          checkAll: false,
				          key: "status",
				          dict: "dbrw_rwzt",
				          items: ["穆春","李忠","郑天寿","宋万","索超","张清","朱仝","史进","穆弘"]
				        },
				        {
				          name: "CCC部门",
				          value: [],
				          type: "checkbox",
				          checkAll: false,
				          key: "mjcf",
				          items: ["黄信", "孙立", "宣赞", "郝思文", "韩滔" ,"马麟","陈达", "杨春", "杨林","周通"]
				        },
				        {
				          name: "DDD部门",
				          value: [],
				          type: "checkbox",
				          checkAll: false,
				          key: "mj",
				          items: ["樊瑞","鲍旭","项充", "李衮","薛永","施恩","杜迁","邹渊","邹润","龚旺", "丁得孙","焦挺", "石勇"]
				        }
				    ],
			},
		}
	},
	watch: {},
	created() {},
	mounted() {},
	methods: {}
}</script>

<style scoped>
	.headbox {
		box-sizing: border-box;
		float: left;
	}
</style>
