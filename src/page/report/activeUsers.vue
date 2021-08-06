<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never" style="border: 0"
             body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>活跃用户数</span>
      </div>
    </el-card>
    <div style="padding: 10px 20px;">
      请选择年份：
      <el-date-picker
          v-model="value"
          type="year"
          value-format="yyyy"
          :picker-options="pickerOptions"
          placeholder="选择年">
      </el-date-picker>
      <el-button @click="submit" style="margin-left: 10px;" type="primary">确认</el-button>
      <el-button @click="resetData">重置</el-button>
    </div>
    <div style="min-width: 1200px;background: #ffffff">
      <div id="myChart" :style="{maxWidth: '1100px', height: '400px', margin: '20px auto'}"></div>
    </div>
  </div>
</template>

<script>
import { activeUsers } from '@/api/report'
import {deepClone} from "@/utils/util";
export default {
  name: "index",
  data() {
    return {
      value: null,
      yearObj: {
        '一月': 0,
        '二月': 0,
        '三月': 0,
        '四月': 0,
        '五月': 0,
        '六月': 0,
        '七月': 0,
        '八月': 0,
        '九月': 0,
        '十月': 0,
        '十一月': 0,
        '十二月': 0
      },
      yearList: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() || time.getTime() <= new Date('2018-01-01');
        }
      }
    }
  },
  mounted() {
    this.value = new Date().getFullYear()+''
    this.getData()
  },
  methods: {
    getData() {
      activeUsers(this.value).then((res) => {
        if (res.code === 200) {
          const series = []
          const yearObj = deepClone(this.yearObj)
          if (res.data) {
            res.data.forEach((v) => {
              yearObj[v.text] = v.value
            })
            this.yearList.forEach(v => {
              series.push(yearObj[v])
            })
          }
          this.series = series
          this.initEcharts()
        }
      })
    },
    initEcharts() {
      const title = this.value + '年 活跃用户数'
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: { text: title },
        tooltip: {
          // show: true,
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        // tooltip: {},
        xAxis: {
          data: this.yearList
        },
        yAxis: {
          type: 'value',
          // min: 0
        },
        series: [{
          // "name": "销量",
          "type": "bar",
          "data": this.series,
          itemStyle: {
            normal: {
              label: {
                show: true,  //开启显示
                position: 'top',  //在上方显示
                textStyle: {  //数值样式
                  color: '#5471c6',
                  fontSize: 16
                }
              }
            }
          }
        }]
      })
    },
    submit() {
      console.log(this.value)
      this.getData()
    },
    resetData() {
      this.value = new Date().getFullYear()+''
      this.getData()
    }
  }
}
</script>

<style scoped>
.app-container{
  background: #ffffff;
}
</style>
