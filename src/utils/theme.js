// 主题管理工具
export const ThemeManager = {
  // 主题类型
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  },

  // 默认主题配置
  DEFAULT_CONFIG: {
    theme: 'system',
    primaryColor: '#409EFF',
    transitionDuration: '0.3s'
  },

  // 获取当前主题配置
  getConfig() {
    const saved = localStorage.getItem('app-theme-config')
    return saved ? JSON.parse(saved) : { ...this.DEFAULT_CONFIG }
  },

  // 保存主题配置
  saveConfig(config) {
    localStorage.setItem('app-theme-config', JSON.stringify(config))
    this.applyTheme(config)
  },

  // 应用主题
  applyTheme(config) {
    const { theme, primaryColor, transitionDuration } = config

    // 设置CSS变量
    const root = document.documentElement
    root.style.setProperty('--transition-duration', transitionDuration)

    // 应用主色调
    root.style.setProperty('--primary-color', primaryColor)
    root.style.setProperty('--primary-light', this.lightenColor(primaryColor, 20))
    root.style.setProperty('--primary-dark', this.darkenColor(primaryColor, 20))

    // 根据主题设置颜色变量
    if (theme === 'dark' || (theme === 'system' && this.isSystemDark())) {
      this.applyDarkTheme()
    } else {
      this.applyLightTheme()
    }

    // 添加过渡动画
    root.style.transition = `all ${transitionDuration} ease`
  },

  // 应用浅色主题
  applyLightTheme() {
    const root = document.documentElement
    root.style.setProperty('--bg-primary', '#ffffff')
    root.style.setProperty('--bg-secondary', '#f8fafc')
    root.style.setProperty('--bg-tertiary', '#f1f5f9')
    root.style.setProperty('--text-primary', '#1e293b')
    root.style.setProperty('--text-secondary', '#64748b')
    root.style.setProperty('--text-tertiary', '#94a3b8')
    root.style.setProperty('--border-color', '#e2e8f0')
    root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)')
    root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.95)')
  },

  // 应用深色主题
  applyDarkTheme() {
    const root = document.documentElement
    root.style.setProperty('--bg-primary', '#0f172a')
    root.style.setProperty('--bg-secondary', '#1e293b')
    root.style.setProperty('--bg-tertiary', '#334155')
    root.style.setProperty('--text-primary', '#f1f5f9')
    root.style.setProperty('--text-secondary', '#cbd5e1')
    root.style.setProperty('--text-tertiary', '#94a3b8')
    root.style.setProperty('--border-color', '#475569')
    root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)')
    root.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.95)')
  },

  // 检查系统是否启用深色模式
  isSystemDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  },

  // 颜色工具函数
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1)
  },

  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    return '#' + (
      0x1000000 +
      (R > 0 ? R : 0) * 0x10000 +
      (G > 0 ? G : 0) * 0x100 +
      (B > 0 ? B : 0)
    ).toString(16).slice(1)
  },

  // 监听系统主题变化
  watchSystemTheme(callback) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const config = this.getConfig()
      if (config.theme === 'system') {
        callback(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }
}

// 初始化主题
export function initTheme() {
  const config = ThemeManager.getConfig()
  ThemeManager.applyTheme(config)
}

// 预定义颜色选项
export const COLOR_PRESETS = [
  { name: '蓝色', value: '#409EFF' },
  { name: '绿色', value: '#67C23A' },
  { name: '橙色', value: '#E6A23C' },
  { name: '红色', value: '#F56C6C' },
  { name: '紫色', value: '#8E44AD' },
  { name: '青色', value: '#16A085' }
]
