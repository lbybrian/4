<template>
  <div v-show="status === true" class="chartArea" ref="chartItem"></div>
</template>

<script>
// 引入基本模板
var echarts = require("echarts/lib/echarts");
// 引入散点图组件
require("echarts/lib/chart/effectScatter");
require("echarts/lib/chart/scatter");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

export default {
  name: "",
  data() {
    return {
      status: true,
      itemStyle: {
        // type: ["effectScatter", "scatter"],
        type: "effectScatter"
      },
      titleStyle: {
        text: "",
      },
      tooltip: {},
      option : {
    xAxis: {
        scale: true
    },
    yAxis: {
        scale: true
    },
    series: []
},
      dataInfo: {},
    };
  },
  props: {
    dataObj: Object,
  },
  beforeMount() {
  },
  mounted() {
    var data = this.dataInfo;
    this.$nextTick(function () {
      var tData = this.dataObj || this.dataInfo;
      this.updateData(tData);
    });
  },
  methods: {
    updateData(data) {
      //恢复默认
      this.dataInfo = {
        xAxisStyle: { ...this.xAxisStyle },
        yAxisStyle: { ...this.yAxisStyle },
        itemStyle: { ...this.itemStyle },
        titleStyle: { ...this.titleStyle },
        tooltip: { ...this.tooltip },
        data: [],
      };

      var arr = [
        "xAxisStyle",
        "yAxisStyle",
        "itemStyle",
        "titleStyle",
        "tooltip",
      ];
      //按参数更新dataObj
      for (var k in data) {
        if (arr.indexOf(k) !== -1) {
          for (var j in data[k]) {
            this.dataInfo[k][j] = data[k][j];
          }
        } else {
          this.dataInfo[k] = data[k];
        }
      }
      this.dataInfo.itemStyle.type = "scatter"; //item的type固定，不可外部修改
      //生成全新的chart option
      this.updateOption();
      //按新的option更新图表
      this.initChart();
    },
    updateOption() {
      var data = this.dataInfo;
      this.option.title = data.titleStyle;
      this.option.series = [];
      // var name = data.name || "-";
      var name = data.name || data.titleStyle.text;
      if (typeof name === "string") {
        name = [name];
      }
      //根据name 数组和itemStyle初始化series;
      for (var i = 0; i < name.length; i++) {
        var item = { ...data.itemStyle };
        item.data = [];
        item.name = name[i];
        this.option.series.push(item);
      }
      if (name.length > 1) {
        this.option.legend = data.legendStyle || {
          show: true,
        };
        this.option.legend.data = name;
      }

      //初始化xAxis和yAxis
      this.option.xAxis = data.xAxisStyle;
      this.option.yAxis = data.yAxisStyle;
      this.option.tooltip = data.tooltip;
      this.option.color = data.color;
      var mode = data.mode || "vertical"; //horizontal or vertical
      var axisData;
      if (mode === "vertical") {
        this.option.xAxis.data = [];
        axisData = this.option.xAxis;
      } else {
        this.option.yAxis.data = [];
        axisData = this.option.yAxis;
      }

      //更新Axis和series元素里的data
      data.data = data.data || [];
      for (var i = 0; i < data.data.length; i++) {
        var item = data.data[i];
        axisData.data.push(item.name);
        if (typeof item.value === "number") {
          item.value = [item.value];
        }
        for (var j = 0; j < this.option.series.length; j++) {
          this.option.series[j].data.push(item.value[j] || 0);
        }
      }
    },
    updateView(elem, option) {
      if (this.chart) {
        echarts.dispose(this.chart);
      }
      this.chart = echarts.init(elem);
      // 绘制图表
      this.chart.setOption(option);
      this.$forceUpdate();
      this.initChartEvent();
    },
    initChart() {
      var elem = this.$refs.chartItem;
      this.updateView(elem, this.option);
    },
    initChartEvent() {
      var _self = this;
      this.chart.off("click");
      this.chart.on("click", function (e) {
        if (e.componentType === "series") {
          _self.$emit("click", {
            name: e.name,
            value: e.data,
            seriesName: e.seriesName
          });
        }
      });

      this.chart.off("mouseover");
      this.chart.on("mouseover", function (e) {
       if (e.componentType === "series") {
          _self.$emit("mouseover", {
            name: e.name,
            value: e.data,
            seriesName: e.seriesName
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.chartArea {
  height: 100%;
  min-height: 400px;
}
</style>
