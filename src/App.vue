<template>
  <div id="app" class="app-theme">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="header-content">
          <div class="header-left">
            <h1>智能待办清单</h1>
          </div>
          <div class="header-center">
            <div class="stats">
              <el-statistic title="总任务" :value="totalTasks" />
              <el-statistic title="已完成" :value="completedTasks" />
              <el-statistic title="待完成" :value="pendingTasks" />
              <el-statistic title="完成率" :value="completionRate" suffix="%" />
            </div>
          </div>
          <div class="header-right">
            <ThemeSwitcher />
          </div>
        </div>
      </el-header>
      
      <el-container class="main-layout">
        <!-- 紧凑侧边栏 -->
        <el-aside width="280px" class="compact-sidebar">
          <el-tabs v-model="activeTab" type="card" class="sidebar-tabs">
            <el-tab-pane label="添加任务" name="add">
              <TaskForm 
                :initial-data="editingTask"
                @submit="handleFormSubmit"
                @cancel="handleFormCancel"
                class="compact-form"
              />
            </el-tab-pane>
            <el-tab-pane label="筛选" name="filter">
              <TaskFilter class="compact-filter" />
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        
        <!-- 主内容区 -->
        <el-main class="compact-main">
          <el-row :gutter="16">
            <el-col :span="24">
              <!-- 任务列表 -->
              <TaskList 
                :tasks="tasks"
                @edit-task="handleEditTask"
                class="compact-list"
              />
            </el-col>
            <el-col :span="24">
              <!-- 新的数据统计面板 -->
              <TaskStats class="compact-stats" />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from './stores/taskStore'
import { initTheme } from './utils/theme.js'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import TaskFilter from './components/TaskFilter.vue'
import TaskStats from './components/TaskStats.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

export default {
  name: 'App',
  components: {
    TaskForm,
    TaskList,
    TaskFilter,
    TaskStats,
    ThemeSwitcher
  },
  setup() {
    const taskStore = useTaskStore()
    const editingTask = ref(null)
    const activeTab = ref('add')

    // 初始化主题
    onMounted(() => {
      initTheme()
      taskStore.initTasks()
    })

    // 从store获取计算属性
    const tasks = computed(() => taskStore.tasks)
    const filteredTasks = computed(() => taskStore.filteredTasks)
    const totalTasks = computed(() => taskStore.totalTasks)
    const completedTasks = computed(() => taskStore.completedTasks)
    const pendingTasks = computed(() => taskStore.pendingTasks)
    const completionRate = computed(() => taskStore.completionRate)

    // 处理表单提交
    const handleFormSubmit = (taskData) => {
      if (editingTask.value) {
        taskStore.updateTask(editingTask.value.id, taskData)
        editingTask.value = null
        activeTab.value = 'add' // 提交后回到添加标签页
      } else {
        taskStore.addTask(taskData)
      }
    }

    // 处理编辑任务
    const handleEditTask = (task) => {
      editingTask.value = { ...task }
      activeTab.value = 'add' // 切换到添加/编辑标签页
    }

    // 处理表单取消
    const handleFormCancel = () => {
      editingTask.value = null
    }

    return {
      editingTask,
      activeTab,
      tasks: filteredTasks,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      handleFormSubmit,
      handleEditTask,
      handleFormCancel
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 主题变量 - 默认值 */
  --primary-color: #409EFF;
  --primary-light: #79bbff;
  --primary-dark: #337ecc;
  --transition-duration: 0.3s;
  
  /* 浅色主题默认值 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border-color: #e2e8f0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --card-bg: rgba(255, 255, 255, 0.95);
}

.app-theme {
  font-family: 'Inter', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all var(--transition-duration) ease;
}

#app {
  height: 100vh;
}

.app-container {
  height: 100vh;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
}

.app-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  height: 80px !important;
  padding: 0 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  transition: all var(--transition-duration) ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 100%;
  gap: 20px;
}

.header-left {
  flex-shrink: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex-shrink: 0;
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.stats {
  display: flex;
  gap: 15px;
}

.stats .el-statistic {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 100px;
}

.stats .el-statistic__title {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 11px;
  margin-bottom: 2px;
}

.stats .el-statistic__content {
  color: white !important;
  font-weight: 600;
  font-size: 16px;
}

.main-layout {
  height: calc(100vh - 80px);
}

.compact-sidebar {
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-right: 1px solid var(--border-color);
  box-shadow: 1px 0 8px var(--shadow-color);
  transition: all var(--transition-duration) ease;
}

.compact-main {
  background: var(--bg-tertiary);
  padding: 16px;
  transition: all var(--transition-duration) ease;
}

/* 更新Element Plus组件样式以支持主题 */
:deep(.el-card) {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all var(--transition-duration) ease;
}

:deep(.el-tabs) {
  background: var(--bg-primary);
}

:deep(.el-tabs__item) {
  color: var(--text-secondary) !important;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color) !important;
}

:deep(.el-input) {
  --el-input-text-color: var(--text-primary);
  --el-input-bg-color: var(--bg-primary);
  --el-input-border-color: var(--border-color);
}

:deep(.el-button) {
  transition: all var(--transition-duration) ease;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    gap: 15px;
  }
  
  .app-header h1 {
    font-size: 20px;
  }
  
  .stats {
    gap: 10px;
  }
  
  .stats .el-statistic {
    min-width: 90px;
    padding: 6px 12px;
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 100px !important;
    padding: 0 15px;
  }
  
  .header-content {
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }
  
  .header-left, .header-center, .header-right {
    width: 100%;
    justify-content: center;
  }
  
  .app-header h1 {
    font-size: 18px;
    text-align: center;
  }
  
  .stats {
    justify-content: center;
    gap: 8px;
  }
  
  .stats .el-statistic {
    min-width: 70px;
    padding: 4px 8px;
  }
  
  .stats .el-statistic__title {
    font-size: 10px;
  }
  
  .stats .el-statistic__content {
    font-size: 14px;
  }
  
  .main-layout {
    height: calc(100vh - 100px);
  }
  
  .compact-sidebar {
    width: 100% !important;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
}

@media (max-width: 480px) {
  .app-header {
    height: 120px !important;
    padding: 0 10px;
  }
  
  .stats {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .stats .el-statistic {
    min-width: 60px;
    padding: 3px 6px;
  }
  
  .main-layout {
    height: calc(100vh - 120px);
  }
}
</style>