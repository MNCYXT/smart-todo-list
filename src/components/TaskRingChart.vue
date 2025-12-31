<template>
  <div ref="chartRef" :style="{ height: height }"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'TaskRingChart',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#409eff'
    },
    height: {
      type: String,
      default: '180px'
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
        series: [
          {
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center',
              formatter: '{c}%',
              fontSize: 20,
              fontWeight: 'bold',
              color: props.color
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 24,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: props.percentage,
                name: '完成率',
                itemStyle: {
                  color: props.color
                }
              },
              {
                value: 100 - props.percentage,
                name: '剩余',
                itemStyle: {
                  color: '#f0f2f5'
                }
              }
            ]
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

    watch(() => props.percentage, updateChart)
    watch(() => props.color, updateChart)

    return {
      chartRef
    }
  }
}
</script>

<style scoped>
.ring-chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 确保图表也能响应主题变化 */
:deep(.echarts-for-vue) {
  transition: all var(--transition-duration) ease;
}
</style>