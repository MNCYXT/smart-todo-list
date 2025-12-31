<template>
  <div class="task-list-container">
    <div v-if="tasks.length === 0" class="empty-state">
      <el-empty description="暂无任务" :image-size="100">
        <p>点击上方添加任务开始管理您的待办事项</p>
      </el-empty>
    </div>

    <div v-else class="tasks-grid">
      <el-card
          v-for="task in tasks"
          :key="task.id"
          class="task-card"
          :class="{
          'completed': task.completed,
          'pending': !task.completed
        }"
          shadow="hover"
      >
        <div class="task-header">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-actions">
            <el-button
                type="primary"
                size="small"
                @click="$emit('edit-task', task)"
                :icon="Edit"
            >
              编辑
            </el-button>
            <el-button
                type="danger"
                size="small"
                @click="handleDelete(task.id)"
                :icon="Delete"
            >
              删除
            </el-button>
          </div>
        </div>

        <div class="task-content">
          <p class="task-description">{{ task.description }}</p>

          <div class="task-meta">
            <span class="task-category">
              <el-tag :type="getCategoryType(task.category)" size="small">
                {{ task.category }}
              </el-tag>
            </span>

            <span class="task-priority">
              <el-tag
                  :type="getPriorityType(task.priority)"
                  size="small"
              >
                {{ getPriorityText(task.priority) }}
              </el-tag>
            </span>

            <span class="task-due-date">
              <el-icon><Clock /></el-icon>
              {{ formatDate(task.dueDate) }}
            </span>

            <span class="task-status">
              <el-tag
                  :type="getStatusType(task.completed)"
                  size="small"
              >
                {{ getStatusText(task.completed) }}
              </el-tag>
            </span>
          </div>
        </div>

        <div class="task-footer">
          <el-button
              v-if="!task.completed"
              type="success"
              size="small"
              @click="handleComplete(task.id)"
              :icon="Check"
          >
            完成
          </el-button>

          <el-button
              v-if="task.completed"
              type="warning"
              size="small"
              @click="handleReopen(task.id)"
              :icon="Refresh"
          >
            重新打开
          </el-button>

          <span class="task-created">
            创建于: {{ formatDate(task.createdAt) }}
          </span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Check, Refresh, Clock } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit-task'])

const taskStore = useTaskStore()

// 处理删除任务
const handleDelete = async (taskId) => {
  try {
    await ElMessageBox.confirm(
        '确定要删除这个任务吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )
    taskStore.deleteTask(taskId)
    ElMessage.success('任务删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

// 处理完成任务
const handleComplete = (taskId) => {
  taskStore.updateTaskStatus(taskId, 'completed')
  ElMessage.success('任务已完成')
}

// 处理重新打开任务
const handleReopen = (taskId) => {
  taskStore.updateTaskStatus(taskId, 'pending')
  ElMessage.success('任务已重新打开')
}

// 工具函数
const getCategoryType = (category) => {
  const types = {
    '工作': 'primary',
    '学习': 'success',
    '生活': 'info',
    '娱乐': 'warning',
    '其他': ''
  }
  return types[category] || ''
}

const getPriorityType = (priority) => {
  const types = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'info'
  }
  return types[priority] || ''
}

const getPriorityText = (priority) => {
  const texts = {
    'high': '高优先级',
    'medium': '中优先级',
    'low': '低优先级'
  }
  return texts[priority] || priority
}

const getStatusType = (completed) => {
  return completed ? 'success' : 'warning'
}

const getStatusText = (completed) => {
  return completed ? '已完成' : '待处理'
}

const formatDate = (dateString) => {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.task-list-container {
  padding: 16px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  text-align: center;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  padding: 8px;
}

.task-card {
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.task-card.completed {
  opacity: 0.8;
  border-left: 4px solid var(--el-color-success);
}

.task-card.pending {
  border-left: 4px solid var(--el-color-warning);
}

.task-card.in-progress {
  border-left: 4px solid var(--el-color-primary);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  margin-right: 12px;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.task-content {
  margin-bottom: 12px;
}

.task-description {
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.task-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.task-created {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tasks-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .task-header {
    flex-direction: column;
    gap: 8px;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .task-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>