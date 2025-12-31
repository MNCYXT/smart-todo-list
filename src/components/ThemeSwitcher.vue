<template>
  <div class="theme-switcher">
    <el-popover
        placement="top-end"
        :width="300"
        trigger="click"
    >
      <template #reference>
        <el-button
            class="theme-toggle-btn"
            type="primary"
            circle
            :icon="Setting"
            size="large"
        />
      </template>

      <div class="theme-panel">
        <h3>主题设置</h3>

        <!-- 主题模式选择 -->
        <div class="theme-section">
          <h4>主题模式</h4>
          <el-radio-group v-model="themeConfig.theme" @change="handleThemeChange">
            <el-radio label="light">浅色</el-radio>
            <el-radio label="dark">深色</el-radio>
            <el-radio label="system">跟随系统</el-radio>
          </el-radio-group>
        </div>

        <!-- 主色调选择 -->
        <div class="theme-section">
          <h4>主色调</h4>
          <div class="color-presets">
            <div
                v-for="color in COLOR_PRESETS"
                :key="color.value"
                class="color-option"
                :class="{ active: themeConfig.primaryColor === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="handleColorChange(color.value)"
            >
              <el-icon v-if="themeConfig.primaryColor === color.value" class="check-icon">
                <Check />
              </el-icon>
              <span class="color-name">{{ color.name }}</span>
            </div>
          </div>

          <div class="custom-color">
            <el-color-picker
                v-model="themeConfig.primaryColor"
                @change="handleColorChange"
                show-alpha
                :predefine="predefineColors"
            />
            <span class="custom-label">自定义颜色</span>
          </div>
        </div>

        <!-- 过渡动画设置 -->
        <div class="theme-section">
          <h4>过渡动画</h4>
          <el-slider
              v-model="transitionValue"
              :min="0.1"
              :max="1"
              :step="0.1"
              show-stops
              @change="handleTransitionChange"
          />
          <div class="transition-info">
            <span>时长: {{ themeConfig.transitionDuration }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="theme-actions">
          <el-button type="primary" @click="applyTheme" size="small">
            应用
          </el-button>
          <el-button @click="resetTheme" size="small">
            重置
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Setting, Check } from '@element-plus/icons-vue'
import { ThemeManager, COLOR_PRESETS } from '../utils/theme.js'

const themeConfig = ref({
  theme: 'system',
  primaryColor: '#409EFF',
  transitionDuration: '0.3s'
})

const transitionValue = computed({
  get: () => parseFloat(themeConfig.value.transitionDuration.replace('s', '')),
  set: (value) => {
    themeConfig.value.transitionDuration = `${value}s`
  }
})

const predefineColors = ref([
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#8E44AD',
  '#16A085',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])

// 初始化主题配置
onMounted(() => {
  const config = ThemeManager.getConfig()
  themeConfig.value = { ...config }
})

// 处理主题变化
const handleThemeChange = (theme) => {
  themeConfig.value.theme = theme
  applyTheme()
}

// 处理颜色变化
const handleColorChange = (color) => {
  if (color) {
    themeConfig.value.primaryColor = color
    applyTheme()
  }
}

// 处理过渡动画变化
const handleTransitionChange = (duration) => {
  themeConfig.value.transitionDuration = `${duration}s`
  applyTheme()
}

// 应用主题
const applyTheme = () => {
  ThemeManager.saveConfig(themeConfig.value)
}

// 重置主题
const resetTheme = () => {
  themeConfig.value = { ...ThemeManager.DEFAULT_CONFIG }
  applyTheme()
}
</script>

<style scoped>
.theme-switcher {
  display: inline-block;
}

.theme-toggle-btn {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  transition: all var(--transition-duration) ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.3);
}

.theme-panel {
  padding: 16px;
}

.theme-panel h3 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.theme-section {
  margin-bottom: 20px;
}

.theme-section h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.color-option {
  position: relative;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.color-option.active {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.color-option:hover {
  transform: scale(1.05);
}

.check-icon {
  color: white;
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.color-name {
  position: absolute;
  bottom: -20px;
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.transition-info {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.theme-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .color-presets {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .theme-panel {
    padding: 12px;
  }
}
</style>