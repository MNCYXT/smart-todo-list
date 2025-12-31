<template>
  <el-card class="task-filter" shadow="never">
    <template #header>
      <div class="card-header">
        <span>任务筛选</span>
      </div>
    </template>
    
    <div class="filter-options">
      <div class="filter-group">
        <h4>按分类筛选</h4>
        <el-radio-group v-model="taskStore.filterCategory" @change="handleFilterChange">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button 
            v-for="category in categories" 
            :key="category" 
            :value="category"
          >
            {{ category }}
          </el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="filter-group">
        <h4>按状态筛选</h4>
        <el-radio-group v-model="taskStore.filterStatus" @change="handleStatusChange">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="pending">待完成</el-radio-button>
          <el-radio-button value="completed">已完成</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 新增时间筛选 -->
      <div class="filter-group">
        <h4>按时间筛选</h4>
        <el-radio-group v-model="timeFilter" @change="handleTimeFilterChange">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="overdue">逾期任务</el-radio-button>
          <el-radio-button value="today">今日任务</el-radio-button>
          <el-radio-button value="upcoming">即将到期</el-radio-button>
          <el-radio-button value="noDueDate">无截止时间</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="filter-group">
        <h4>排序方式</h4>
        <el-select v-model="sortBy" placeholder="排序方式" @change="handleSortChange">
          <el-option label="创建时间" value="createdAt" />
          <el-option label="截止时间" value="dueDate" />
          <el-option label="优先级" value="priority" />
          <el-option label="标题" value="title" />
        </el-select>
        <el-select v-model="sortOrder" placeholder="排序顺序" @change="handleSortOrderChange" style="margin-left: 10px;">
          <el-option label="升序" value="asc" />
          <el-option label="降序" value="desc" />
        </el-select>
      </div>
    </div>
  </el-card>
</template>

<script>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

export default {
  name: 'TaskFilter',
  setup() {
    const taskStore = useTaskStore()
    const timeFilter = ref('all')
    const sortBy = ref('createdAt')
    const sortOrder = ref('desc')

    const categories = computed(() => {
      if (!taskStore.tasks || taskStore.tasks.length === 0) {
        return []
      }
      const uniqueCategories = [...new Set(taskStore.tasks.map(task => task.category))]
      return uniqueCategories.sort()
    })

    const handleFilterChange = (category) => {
      taskStore.setFilter(category, undefined)
    }

    const handleStatusChange = (status) => {
      taskStore.setFilter(undefined, status)
    }

    const handleTimeFilterChange = (filter) => {
      // 这里可以添加时间筛选逻辑
      timeFilter.value = filter
    }

    const handleSortChange = (by) => {
      taskStore.setSort(by, sortOrder.value)
    }

    const handleSortOrderChange = (order) => {
      taskStore.setSort(sortBy.value, order)
    }

    return {
      taskStore,
      categories,
      timeFilter,
      sortBy,
      sortOrder,
      handleFilterChange,
      handleStatusChange,
      handleTimeFilterChange,
      handleSortChange,
      handleSortOrderChange
    }
  }
}
</script>

<style scoped>
.task-filter {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all var(--transition-duration) ease;
}

.task-filter:hover {
  box-shadow: 0 8px 30px var(--shadow-color);
  transform: translateY(-2px);
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

/* 更新Element Plus组件样式 */
:deep(.el-radio__label) {
  color: var(--text-primary);
}

:deep(.el-checkbox__label) {
  color: var(--text-primary);
}

:deep(.el-button) {
  transition: all var(--transition-duration) ease;
}

:deep(.el-button--primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.el-button--primary:hover) {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

:deep(.el-button--default) {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.el-button--default:hover) {
  background-color: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-filter {
    padding: 16px;
  }
  
  .filter-options {
    gap: 6px;
  }
  
  .filter-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>