<template>
  <el-card class="task-form" shadow="never">
    <template #header>
      <div class="card-header">
        <span>{{ isEditMode ? '编辑任务' : '添加新任务' }}</span>
        <el-tag v-if="isEditMode" type="warning">编辑模式</el-tag>
      </div>
    </template>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="任务标题" prop="title">
        <el-input 
          v-model="form.title" 
          placeholder="请输入任务标题"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="选择分类">
          <el-option 
            v-for="category in categories" 
            :key="category" 
            :label="category" 
            :value="category"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="优先级" prop="priority">
        <el-radio-group v-model="form.priority">
          <el-radio-button label="low">低</el-radio-button>
          <el-radio-button label="medium">中</el-radio-button>
          <el-radio-button label="high">高</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <!-- 新增时间相关字段 -->
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="form.dueDate"
          type="datetime"
          placeholder="选择截止时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
          :disabled-date="disabledDate"
        />
      </el-form-item>
      
      <el-form-item label="提醒时间">
        <el-date-picker
          v-model="form.reminderTime"
          type="datetime"
          placeholder="选择提醒时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
          :disabled-date="disabledDate"
        />
      </el-form-item>
      
      <el-form-item label="预计耗时">
        <el-input-number
          v-model="form.estimatedTime"
          :min="0"
          :max="480"
          :step="15"
          placeholder="预计耗时（分钟）"
        />
        <span style="margin-left: 8px; color: #666;">分钟</span>
      </el-form-item>
      
      <el-form-item label="描述">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :rows="3"
          placeholder="任务描述（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">
          <el-icon><Plus /></el-icon>
          {{ isEditMode ? '更新任务' : '添加任务' }}
        </el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button v-if="isEditMode" @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'TaskForm',
  props: {
    initialData: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const categories = ['工作', '学习', '生活', '购物', '其他']
    const formRef = ref(null)
    const loading = ref(false)
    
    const form = ref({
      title: '',
      category: '工作',
      priority: 'medium',
      description: '',
      // 新增时间字段
      dueDate: null,
      reminderTime: null,
      estimatedTime: 0
    })

    const rules = {
      title: [
        { required: true, message: '请输入任务标题', trigger: 'blur' },
        { min: 1, max: 50, message: '标题长度在 1 到 50 个字符', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择分类', trigger: 'change' }
      ]
    }

    const isEditMode = ref(false)

    // 禁止选择过去的日期
    const disabledDate = (time) => {
      return time.getTime() < Date.now() - 8.64e7 // 减去一天，允许选择今天
    }

    // 先定义resetForm函数
    const resetForm = () => {
      form.value = {
        title: '',
        category: '工作',
        priority: 'medium',
        description: '',
        dueDate: null,
        reminderTime: null,
        estimatedTime: 0
      }
      nextTick(() => {
        if (formRef.value) {
          formRef.value.clearValidate()
        }
      })
    }

    // 监听initialData变化，切换到编辑模式
    watch(() => props.initialData, (newData) => {
      if (newData) {
        isEditMode.value = true
        form.value = { 
          ...form.value, // 保留默认值
          ...newData 
        }
      } else {
        isEditMode.value = false
        resetForm()
      }
    }, { immediate: true })

    const submitForm = async () => {
      if (!formRef.value) return

      try {
        const valid = await formRef.value.validate()
        if (valid) {
          loading.value = true
          emit('submit', { 
            ...form.value,
            // 编辑模式下保留id
            ...(isEditMode.value && props.initialData ? { id: props.initialData.id } : {})
          })
          // 重置表单（添加模式）或保持表单（编辑模式）
          if (!isEditMode.value) {
            resetForm()
          }
        }
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        loading.value = false
      }
    }

    const cancelEdit = () => {
      resetForm()
      isEditMode.value = false
      emit('cancel')
    }

    return {
      form,
      formRef,
      loading,
      categories,
      rules,
      isEditMode,
      disabledDate,
      submitForm,
      resetForm,
      cancelEdit,
      Plus
    }
  }
}
</script>

<style scoped>
.task-form {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all var(--transition-duration) ease;
}

.task-form:hover {
  box-shadow: 0 8px 30px var(--shadow-color);
  transform: translateY(-2px);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

/* 更新Element Plus组件样式 */
:deep(.el-form-item__label) {
  color: var(--text-primary);
  font-weight: 500;
}

:deep(.el-input__inner) {
  background: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.el-input__inner:focus) {
  border-color: var(--primary-color);
}

:deep(.el-textarea__inner) {
  background: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
  resize: vertical;
  min-height: 80px;
}

:deep(.el-select .el-input__inner) {
  background: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

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
  .task-form {
    padding: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>