<template>
  <div ref="chartRef" :style="{ height: height }"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'TaskPieChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '扇形图'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chartInstance = null

    const initChart = () => {
      if (!chartRef.value) return

      chartInstance = echarts.init(chartRef.value)
      updateChart()
    }

    const updateChart = () => {
      if (!chartInstance) return

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          textStyle: {
            fontSize: 11
          }
        },
        series: [
          {
            name: props.title,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: props.data.map(item => ({
              ...item,
              itemStyle: {
                color: props.colors[item.name] || '#909399'
              }
            }))
          }
        ]
      }

      chartInstance.setOption(option)
    }

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

    watch(() => props.data, updateChart, { deep: true })

    return {
      chartRef
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 确保图表也能响应主题变化 */
:deep(.echarts-for-vue) {
  transition: all var(--transition-duration) ease;
}
</style>