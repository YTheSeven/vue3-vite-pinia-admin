<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { useUserStore } from '@/store/modules/user';
  import { useDashboardView } from './useDashboardView';
  import Iconify from '@/components/Iconify.vue';

  // ==========================================
  // 组件逻辑 - 严格遵守逻辑分离原则
  // ==========================================

  const router = useRouter();
  const userStore = useUserStore();
  const {
    chartType,
    todos,
    displayName,
    currentDate,
    greeting,
    stats,
    quickLinks,
    activities,
    completedTodosCount,
    totalTodosCount,
    completionRate,
    deleteTodo,
  } = useDashboardView();

  /** 获取优先级标签类型 */
  const getPriorityType = (priority: string): string => {
    const map: Record<string, string> = {
      high: 'danger',
      medium: 'warning',
      low: 'info',
    };
    return map[priority] || 'info';
  };

  /** 获取优先级文本 */
  const getPriorityText = (priority: string): string => {
    const map: Record<string, string> = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return map[priority] || '中';
  };

  /** 处理快捷入口点击 */
  const handleLinkClick = (link: { name: string; path: string }): void => {
    if (link.path === '/dashboard') {
      ElMessage.info('当前已在首页');
    } else {
      router.push(link.path);
    }
  };

  /** 处理添加待办 */
  const handleAddTodo = (): void => {
    ElMessage.info('添加待办功能开发中');
  };
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 欢迎区域 -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 sm:p-8 shadow-lg"
      >
        <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">{{ greeting }}，{{ displayName }}！</h1>
            <p class="text-blue-100 mb-4">
              {{ currentDate }}
            </p>
            <div
              v-if="userStore.userInfo?.roles"
              class="flex flex-wrap justify-center sm:justify-start gap-2"
            >
              <el-tag
                v-for="role in userStore.userInfo.roles"
                :key="role"
                type="info"
                effect="dark"
                size="small"
                class="bg-white/20 border-0"
              >
                {{ role }}
              </el-tag>
            </div>
          </div>
          <div class="flex-shrink-0">
            <el-avatar
              :size="80"
              :src="userStore.userInfo?.avatar"
              class="border-4 border-white/30"
            />
          </div>
        </div>
        <!-- 装饰背景 -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"
        ></div>
      </div>

      <!-- 统计卡片 -->
      <el-row :gutter="20">
        <el-col v-for="stat in stats" :key="stat.label" :xs="24" :sm="12" :lg="6" class="mb-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl"
                :class="stat.color"
              >
                <Iconify :name="stat.icon" />
              </div>
              <div class="flex-1">
                <div class="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {{ stat.value }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
              </div>
              <div
                v-if="stat.trend !== 0"
                class="text-xs px-2 py-1 rounded-full"
                :class="
                  stat.trend > 0
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                "
              >
                <el-icon class="mr-1">
                  <i-ep-arrow-up v-if="stat.trend > 0" />
                  <i-ep-arrow-down v-else />
                </el-icon>
                {{ Math.abs(stat.trend) }}%
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 快捷入口 -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
      >
        <h3
          class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
        >
          <el-icon class="text-blue-500"><i-ep-grid /></el-icon>
          快捷入口
        </h3>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
          <div
            v-for="link in quickLinks"
            :key="link.name"
            class="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group"
            @click="handleLinkClick(link)"
          >
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110"
              :style="{ backgroundColor: link.color }"
            >
              <Iconify :name="link.icon" />
            </div>
            <span
              class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
            >
              {{ link.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <el-row :gutter="20">
        <!-- 左侧：访问趋势 -->
        <el-col :xs="24" :lg="16" class="mb-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
            >
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2"
              >
                <el-icon class="text-blue-500"><i-ep-trend-charts /></el-icon>
                访问趋势
              </h3>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
                <el-radio-button value="year">本年</el-radio-button>
              </el-radio-group>
            </div>
            <!-- 模拟图表 -->
            <div
              class="h-64 flex items-end justify-around gap-2 pb-6 border-b border-gray-200 dark:border-slate-700"
            >
              <div
                v-for="i in 7"
                :key="i"
                class="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-t transition-all duration-500 hover:opacity-80 relative group"
                :style="{ height: `${Math.random() * 60 + 20}%` }"
              >
                <div
                  class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {{ Math.floor(Math.random() * 1000 + 500) }} 访问
                </div>
              </div>
            </div>
            <div class="flex justify-around pt-4 text-sm text-gray-500 dark:text-gray-400">
              <span
                v-for="day in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
                :key="day"
              >
                {{ day }}
              </span>
            </div>
          </div>
        </el-col>

        <!-- 右侧：待办事项 -->
        <el-col :xs="24" :lg="8" class="mb-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full"
          >
            <div class="flex justify-between items-center mb-6">
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2"
              >
                <el-icon class="text-orange-500"><i-ep-tickets /></el-icon>
                待办事项
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ completedTodosCount }}/{{ totalTodosCount }}
                </span>
                <el-button type="primary" link size="small" @click="handleAddTodo">
                  <el-icon><i-ep-plus /></el-icon>
                </el-button>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="mb-4">
              <el-progress
                :percentage="completionRate"
                :stroke-width="8"
                :show-text="false"
                class="dark:opacity-80"
              />
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                已完成 {{ completionRate }}%
              </div>
            </div>

            <!-- 待办列表 -->
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="todo in todos"
                :key="todo.id"
                class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <el-checkbox v-model="todo.done" />
                <span
                  class="flex-1 text-sm"
                  :class="
                    todo.done
                      ? 'text-gray-400 dark:text-gray-500 line-through'
                      : 'text-gray-700 dark:text-gray-200'
                  "
                >
                  {{ todo.text }}
                </span>
                <el-tag :type="getPriorityType(todo.priority) as any" size="small" effect="plain">
                  {{ getPriorityText(todo.priority) }}
                </el-tag>
                <el-button
                  type="danger"
                  link
                  size="small"
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="deleteTodo(todo.id)"
                >
                  <el-icon><i-ep-delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 底部：最近活动 -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
      >
        <h3
          class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
        >
          <el-icon class="text-green-500"><i-ep-timer /></el-icon>
          最近活动
        </h3>
        <div class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
            >
              {{ activity.user.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span class="font-medium text-gray-800 dark:text-white">{{ activity.user }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{ activity.action }}</span>
                <span v-if="activity.target" class="text-blue-500 dark:text-blue-400 truncate">
                  {{ activity.target }}
                </span>
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ activity.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 样式通过 Tailwind CSS 实现，保持此处简洁 */
</style>
