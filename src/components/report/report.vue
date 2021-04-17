<template>
    <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
        <el-card>
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  created() {
    // this.getEchartsData()
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    // 准备数据和配置项
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.echartsData = res.data
    console.log('this.echartsData: ', this.echartsData);
    const result = _.merge(res.data, this.options)
    // 展示数据
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {
    // async getEchartsData() {
    //   const { data: res } = await this.$http.get('reports/type/1')
    //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.echartsData = res.data
    //   console.log('this.echartsData: ', this.echartsData);
    // }
  },
  components: {

  },
};
</script>

<style scoped lang="less">

</style>
