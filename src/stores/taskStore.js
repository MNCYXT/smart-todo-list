import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadTasks, saveTasks } from '../utils/storage'

export const useTaskStore = defineStore('task', () => {
    // 状态
    const tasks = ref([])
    const filterCategory = ref('all')
    const filterStatus = ref('all')
    const sortBy = ref('createdAt')
    const sortOrder = ref('desc')

    // 初始化任务
    const initTasks = () => {
        tasks.value = loadTasks()
    }

    // Getters（计算属性）
    const totalTasks = computed(() => tasks.value.length)
    const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)
    const pendingTasks = computed(() => tasks.value.filter(task => !task.completed).length)
    const completionRate = computed(() => {
        if (tasks.value.length === 0) return 0
        return Math.round((completedTasks.value / tasks.value.length) * 100)
    })

    // 筛选后的任务
    const filteredTasks = computed(() => {
        let filtered = tasks.value

        // 按分类筛选
        if (filterCategory.value !== 'all') {
            filtered = filtered.filter(task => task.category === filterCategory.value)
        }

        // 按状态筛选
        if (filterStatus.value !== 'all') {
            if (filterStatus.value === 'completed') {
                filtered = filtered.filter(task => task.completed)
            } else if (filterStatus.value === 'pending') {
                filtered = filtered.filter(task => !task.completed)
            }
        }

        // 排序
        filtered = [...filtered].sort((a, b) => {
            let aValue = a[sortBy.value]
            let bValue = b[sortBy.value]

            if (sortBy.value === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                aValue = priorityOrder[aValue] || 0
                bValue = priorityOrder[bValue] || 0
            }

            if (sortOrder.value === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return filtered
    })

    // 分类统计
    const categoryStats = computed(() => {
        const categories = {}
        tasks.value.forEach(task => {
            if (!categories[task.category]) {
                categories[task.category] = { total: 0, completed: 0 }
            }
            categories[task.category].total++
            if (task.completed) {
                categories[task.category].completed++
            }
        })
        return categories
    })

    // Actions
    const addTask = (taskData) => {
        const task = {
            id: Date.now(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // 添加时间相关字段
            dueDate: taskData.dueDate || null, // 截止时间
            reminderTime: taskData.reminderTime || null, // 提醒时间
            estimatedTime: taskData.estimatedTime || 0, // 预计耗时（分钟）
            startTime: taskData.startTime || null, // 开始时间
            completedAt: null // 完成时间
        }
        tasks.value.push(task)
        saveTasks(tasks.value)
        return task
    }

    const updateTask = (taskId, updates) => {
        const index = tasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
            const updatedTask = {
                ...tasks.value[index],
                ...updates,
                updatedAt: new Date().toISOString()
            }
            
            // 如果任务状态改变，更新完成时间
            if (updates.completed !== undefined) {
                updatedTask.completedAt = updates.completed ? new Date().toISOString() : null
            }
            
            tasks.value[index] = updatedTask
            saveTasks(tasks.value)
            return tasks.value[index]
        }
        return null
    }
    
    // 添加新的计算属性
    const overdueTasks = computed(() => {
        const now = new Date()
        return tasks.value.filter(task => {
            if (task.completed || !task.dueDate) return false
            return new Date(task.dueDate) < now
        })
    })
    
    const todayTasks = computed(() => {
        const today = new Date().toDateString()
        return tasks.value.filter(task => {
            if (task.completed || !task.dueDate) return false
            return new Date(task.dueDate).toDateString() === today
        })
    })
    
    const upcomingTasks = computed(() => {
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        return tasks.value.filter(task => {
            if (task.completed || !task.dueDate) return false
            const dueDate = new Date(task.dueDate)
            return dueDate > now && dueDate <= nextWeek
        })
    })
    
    // 添加缺失的函数定义
    const deleteTask = (taskId) => {
        const index = tasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
            tasks.value.splice(index, 1)
            saveTasks(tasks.value)
        }
    }
    
    const toggleTaskCompletion = (taskId) => {
        const task = tasks.value.find(task => task.id === taskId)
        if (task) {
            task.completed = !task.completed
            task.completedAt = task.completed ? new Date().toISOString() : null
            task.updatedAt = new Date().toISOString()
            saveTasks(tasks.value)
        }
    }
    
    const setFilter = (category, status) => {
        if (category !== undefined) {
            filterCategory.value = category
        }
        if (status !== undefined) {
            filterStatus.value = status
        }
    }
    
    const setSort = (by, order) => {
        if (by !== undefined) {
            sortBy.value = by
        }
        if (order !== undefined) {
            sortOrder.value = order
        }
    }
    
    // 添加更新任务状态的方法
    const updateTaskStatus = (taskId, status) => {
        const task = tasks.value.find(task => task.id === taskId)
        if (task) {
            const wasCompleted = task.completed
            const isCompleted = status === 'completed'
            
            task.completed = isCompleted
            task.completedAt = isCompleted ? new Date().toISOString() : null
            task.updatedAt = new Date().toISOString()
            
            // 如果状态从pending/in-progress变为completed，或者从completed变为pending
            if (wasCompleted !== isCompleted) {
                saveTasks(tasks.value)
            }
        }
    }
    
    // 在return语句中添加updateTaskStatus方法
    return {
        // 状态
        tasks,
        filterCategory,
        filterStatus,
        sortBy,
        sortOrder,
    
        // Getters
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        filteredTasks,
        categoryStats,
        overdueTasks,
        todayTasks,
        upcomingTasks,
    
        // Actions
        initTasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        toggleTaskCompletion,
        setFilter,
        setSort
    }
})