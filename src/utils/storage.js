// 本地存储工具函数
const STORAGE_KEY = 'smart-todo-tasks'

export const loadTasks = () => {
    try {
        const tasks = localStorage.getItem(STORAGE_KEY)
        return tasks ? JSON.parse(tasks) : []
    } catch (error) {
        console.error('加载任务失败:', error)
        return []
    }
}

export const saveTasks = (tasks) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
        console.error('保存任务失败:', error)
    }
}

// 示例初始数据（可选）
export const getInitialTasks = () => [
    {
        id: 1,
        title: '学习Vue3组件通信',
        category: '学习',
        priority: 'high',
        description: '掌握props、emit、provide/inject等通信方式',
        completed: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: '完成项目文档',
        category: '工作',
        priority: 'medium',
        description: '编写项目使用说明和技术文档',
        completed: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: '购买生活用品',
        category: '生活',
        priority: 'low',
        description: '洗发水、牙膏、纸巾等日常用品',
        completed: false,
        createdAt: new Date(Date.now() - 172800000).toISOString()
    }
]