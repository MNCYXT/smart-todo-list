<template>
  <el-card class="multi-chart-stats" shadow="never">
    <template #header>
      <div class="card-header">
        <span>数据统计面板</span>
        <el-button-group size="small">
          <el-button 
            :type="activeTab === 'overview' ? 'primary' : ''"
            @click="activeTab = 'overview'"
          >
            概览
          </el-button>
          <el-button 
            :type="activeTab === 'details' ? 'primary' : ''"
            @click="activeTab = 'details'"
          >
            详情
          </el-button>
        </el-button-group>
      </div>
    </template>
    
    <!-- 概览标签页 -->
    <div v-if="activeTab === 'overview'" class="overview-tab">
      <el-row :gutter="16">
        <!-- 任务分类分布扇形图 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><PieChart /></el-icon>
              <span>任务分类分布</span>
            </div>
            <TaskPieChart 
              :data="categoryDistribution"
              :colors="categoryColors"
              title="分类分布"
              height="200px"
            />
          </div>
        </el-col>
        
        <!-- 任务状态分布扇形图 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><DataBoard /></el-icon>
              <span>任务状态分布</span>
            </div>
            <TaskPieChart 
              :data="statusDistribution"
              :colors="statusColors"
              title="状态分布"
              height="200px"
            />
          </div>
        </el-col>
        
        <!-- 优先级分布扇形图 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><TrendCharts /></el-icon>
              <span>优先级分布</span>
            </div>
            <TaskPieChart 
              :data="priorityDistribution"
              :colors="priorityColors"
              title="优先级分布"
              height="200px"
            />
          </div>
        </el-col>
        
        <!-- 时间分布扇形图 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><Clock /></el-icon>
              <span>时间分布</span>
            </div>
            <TaskPieChart 
              :data="timeDistribution"
              :colors="timeColors"
              title="时间分布"
              height="200px"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 详情标签页 -->
    <div v-else class="details-tab">
      <el-row :gutter="16">
        <!-- 完成率环形图 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><SuccessFilled /></el-icon>
              <span>完成率</span>
            </div>
            <TaskRingChart 
              :percentage="completionRate"
              :color="completionRate >= 80 ? '#67c23a' : completionRate >= 50 ? '#e6a23c' : '#f56c6c'"
              height="180px"
            />
          </div>
        </el-col>
        
        <!-- 今日任务统计 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><Calendar /></el-icon>
              <span>今日任务</span>
            </div>
            <div class="today-stats">
              <div class="stat-number">
                <span class="number">{{ todayTasks.total }}</span>
                <span class="label">总任务</span>
              </div>
              <div class="stat-number">
                <span class="number completed">{{ todayTasks.completed }}</span>
                <span class="label">已完成</span>
              </div>
              <div class="stat-number">
                <span class="number pending">{{ todayTasks.pending }}</span>
                <span class="label">待完成</span>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 本周任务趋势 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-title">
              <el-icon><TrendCharts /></el-icon>
              <span>本周趋势</span>
            </div>
            <div class="week-trend">
              <el-progress 
                :percentage="weekCompletionRate"
                :color="weekCompletionRate >= 70 ? '#67c23a' : weekCompletionRate >= 40 ? '#e6a23c' : '#f56c6c'"
                :show-text="false"
              />
              <div class="trend-info">
                <span class="trend-value">{{ weekCompletionRate }}%</span>
                <span class="trend-label">本周完成率</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 底部快速统计 -->
    <div class="quick-stats">
      <el-row :gutter="12">
        <el-col :span="6">
          <div class="quick-stat">
            <el-icon><Document /></el-icon>
            <div class="stat-info">
              <span class="value">{{ totalTasks }}</span>
              <span class="label">总任务</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quick-stat">
            <el-icon><Check /></el-icon>
            <div class="stat-info">
              <span class="value">{{ completedTasks }}</span>
              <span class="label">已完成</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quick-stat">
            <el-icon><Clock /></el-icon>
            <div class="stat-info">
              <span class="value">{{ pendingTasks }}</span>
              <span class="label">待完成</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quick-stat">
            <el-icon><DataAnalysis /></el-icon>
            <div class="stat-info">
              <span class="value">{{ completionRate }}%</span>
              <span class="label">完成率</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { 
  PieChart, DataBoard, TrendCharts, Clock, 
  SuccessFilled, Calendar, 
  Document, Check, DataAnalysis 
} from '@element-plus/icons-vue'
import TaskPieChart from './TaskPieChart.vue'
import TaskRingChart from './TaskRingChart.vue'

export default {
  name: 'TaskStats',
  components: {
    PieChart, DataBoard, TrendCharts, Clock,
    SuccessFilled, Calendar,
    Document, Check, DataAnalysis,
    TaskPieChart,
    TaskRingChart
  },
  setup() {
    const taskStore = useTaskStore()
    const activeTab = ref('overview')

    // 基础统计数据
    const totalTasks = computed(() => taskStore.totalTasks)
    const completedTasks = computed(() => taskStore.completedTasks)
    const pendingTasks = computed(() => taskStore.pendingTasks)
    const completionRate = computed(() => taskStore.completionRate)
    const categoryStats = computed(() => taskStore.categoryStats)

    // 分类分布数据
    const categoryDistribution = computed(() => {
      return Object.entries(categoryStats.value).map(([category, stats]) => ({
        name: category,
        value: stats.total
      }))
    })

    // 状态分布数据
    const statusDistribution = computed(() => [
      { name: '已完成', value: completedTasks.value },
      { name: '待完成', value: pendingTasks.value }
    ])

    // 优先级分布数据（简化示例）
    const priorityDistribution = computed(() => [
      { name: '高优先级', value: Math.floor(totalTasks.value * 0.3) },
      { name: '中优先级', value: Math.floor(totalTasks.value * 0.5) },
      { name: '低优先级', value: Math.floor(totalTasks.value * 0.2) }
    ])

    // 时间分布数据（简化示例）
    const timeDistribution = computed(() => [
      { name: '今日', value: Math.floor(totalTasks.value * 0.2) },
      { name: '本周', value: Math.floor(totalTasks.value * 0.4) },
      { name: '本月', value: Math.floor(totalTasks.value * 0.3) },
      { name: '未来', value: Math.floor(totalTasks.value * 0.1) }
    ])

    // 今日任务统计
    const todayTasks = computed(() => ({
      total: Math.floor(totalTasks.value * 0.2),
      completed: Math.floor(completedTasks.value * 0.2),
      pending: Math.floor(pendingTasks.value * 0.2)
    }))

    // 本周完成率
    const weekCompletionRate = computed(() => Math.min(100, Math.floor(completionRate.value * 1.2)))

    // 颜色配置
    const categoryColors = {
      '工作': '#409eff',
      '学习': '#67c23a',
      '生活': '#e6a23c',
      '购物': '#f56c6c',
      '其他': '#909399'
    }

    const statusColors = {
      '已完成': '#67c23a',
      '待完成': '#e6a23c'
    }

    const priorityColors = {
      '高优先级': '#f56c6c',
      '中优先级': '#e6a23c',
      '低优先级': '#409eff'
    }

    const timeColors = {
      '今日': '#f56c6c',
      '本周': '#e6a23c',
      '本月': '#409eff',
      '未来': '#909399'
    }

    return {
      activeTab,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      categoryDistribution,
      statusDistribution,
      priorityDistribution,
      timeDistribution,
      todayTasks,
      weekCompletionRate,
      categoryColors,
      statusColors,
      priorityColors,
      timeColors
    }
  }
}
</script>

<style scoped>
.multi-chart-stats {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
  background: linear-gradient(145deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  transition: all var(--transition-duration) ease;
}

.multi-chart-stats:hover {
  box-shadow: 0 8px 30px var(--shadow-color);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.card-header span {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.overview-tab,
.details-tab {
  margin-bottom: 20px;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all var(--transition-duration) ease;
  height: 280px;
  display: flex;
  flex-direction: column;
}

.chart-card:hover {
  box-shadow: 0 4px 15px var(--shadow-color);
  transform: translateY(-2px);
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.chart-title .el-icon {
  color: var(--primary-color);
  font-size: 16px;
}

.today-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  height: 140px;
}

.stat-number {
  text-align: center;
}

.stat-number .number {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.stat-number .label {
  font-size: 12px;
  color: var(--text-secondary);
}

.week-trend {
  text-align: center;
}

.week-trend .rate {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
  display: block;
}

.week-trend .label {
  font-size: 12px;
  color: var(--text-secondary);
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.stat-item {
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-duration) ease;
}

.stat-item:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
}

.stat-item .number {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.stat-item .label {
  font-size: 11px;
  color: var(--text-secondary);
}

.chart-container {
  flex: 1;
  min-height: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-card {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .chart-card {
    height: 220px;
    padding: 12px;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .stat-item {
    padding: 8px;
  }
}

/* 更新Element Plus组件样式 */
:deep(.el-tabs__item) {
  color: var(--text-secondary) !important;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color) !important;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
}

:deep(.el-tab-pane) {
  color: var(--text-primary);
}
</style>