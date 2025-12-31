<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'TaskStatsChart',
  props: {
    categoryStats: {
      type: Object,
      required: true
    },
    chartType: {
      type: String,
      default: 'pie',
      validator: (value) => ['pie', 'bar', 'line'].includes(value)
    },
    title: {
      type: String,
      default: '任务统计'
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chartInstance = null

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value) return

      chartInstance = echarts.init(chartRef.value)
      updateChart()
    }

    // 更新图表数据
    const updateChart = () => {
      if (!chartInstance) return

      const chartData = Object.entries(props.categoryStats).map(([category, stats]) => ({
        name: category,
        value: stats.total,
        completed: stats.completed,
        pending: stats.total - stats.completed
      }))

      const option = getChartOption(chartData)
      chartInstance.setOption(option)
    }

    // 获取图表配置
    const getChartOption = (data) => {
      const baseOption = {
        title: {
          text: props.title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            const { name, value, data } = params
            return `
              <div style="text-align: left;">
                <div style="font-weight: bold;">${name}</div>
                <div>总任务数: ${value}</div>
                <div>已完成: ${data.completed}</div>
                <div>待完成: ${data.pending}</div>
                <div>完成率: ${data.completed > 0 ? Math.round((data.completed / value) * 100) : 0}%</div>
              </div>
            `
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        }
      }

      if (props.chartType === 'pie') {
        return {
          ...baseOption,
          series: [
            {
              name: '任务分布',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 18,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data.map(item => ({
                ...item,
                itemStyle: {
                  color: getCategoryColor(item.name)
                }
              }))
            }
          ]
        }
      } else if (props.chartType === 'bar') {
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: data.map(item => item.name)
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '总任务数',
              type: 'bar',
              data: data.map(item => ({
                value: item.value,
                itemStyle: {
                  color: getCategoryColor(item.name)
                }
              })),
              barWidth: '60%'
            }
          ]
        }
      }

      return baseOption
    }

    // 分类颜色映射
    const getCategoryColor = (category) => {
      const colors = {
        '工作': '#409eff',
        '学习': '#67c23a',
        '生活': '#e6a23c',
        '购物': '#f56c6c',
        '其他': '#909399'
      }
      return colors[category] || '#909399'
    }

    // 响应窗口大小变化
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
      window.removeEventListener('resize', handleResize)
    })

    // 监听props变化
    watch(() => props.categoryStats, () => {
      updateChart()
    }, { deep: true })

    watch(() => props.chartType, () => {
      updateChart()
    })

    return {
      chartRef
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  min-height: 300px;
}
</style>
