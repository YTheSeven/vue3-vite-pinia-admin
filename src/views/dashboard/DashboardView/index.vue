<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { useUserStore } from '@/store/modules/user';
  import { useDashboardView } from './useDashboardView';
  import { deepClone } from '@/utils/utils';
  import Iconify from '@/components/Iconify.vue';
  import ECharts from '@/components/ECharts.vue';

  import type { ECElementEvent, EChartsOption } from 'echarts';

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
    chartOption,
    cpuChartOption,
    pieChartOption,
    barChartOption,
    deleteTodo,
    handlePieClick,
  } = useDashboardView();

  /** 处理饼图点击事件 */
  const onPieChartClick = (params: ECElementEvent): void => {
    handlePieClick(params);
  };

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

  /** 图表配置 getter 函数，确保响应式更新 */
  const getChartOption = (): EChartsOption => chartOption.value;
  // CPU 图表需要深拷贝确保 watch 检测到数据变化
  const getCpuChartOption = (): EChartsOption => deepClone(cpuChartOption.value);
  const getPieChartOption = (): EChartsOption => pieChartOption.value;
  const getBarChartOption = (): EChartsOption => barChartOption.value;
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 欢迎区域 -->
      <div
        class="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 text-white p-6 sm:p-8 shadow-lg"
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
          <div class="shrink-0">
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
                class="w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center text-white text-xl"
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
            <!-- ECharts 图表 -->
            <div class="h-64">
              <ECharts :option="getChartOption" :auto-resize="true" />
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

      <!-- 第二行：实时 CPU 监控 -->
      <el-row :gutter="20">
        <el-col :xs="24" :lg="12" class="mb-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full"
          >
            <div class="flex items-center justify-between mb-4">
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2"
              >
                <el-icon class="text-green-500"><i-ep-cpu /></el-icon>
                页面性能
              </h3>
              <el-tag type="success" effect="plain" size="small">
                <span class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  实时监控中
                </span>
              </el-tag>
            </div>
            <div class="h-56">
              <ECharts :option="getCpuChartOption" :auto-resize="true" />
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :lg="12" class="mb-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full"
          >
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
            >
              <el-icon class="text-purple-500"><i-ep-pie-chart /></el-icon>
              产品份额分布
            </h3>
            <div class="h-56">
              <ECharts :option="getPieChartOption" :auto-resize="true" @click="onPieChartClick" />
            </div>
            <div class="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              点击饼图区域可联动查看季度销售数据
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 第三行：季度销售对比（联动饼图） -->
      <el-row :gutter="20">
        <el-col :xs="24" class="mb-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
          >
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
            >
              <el-icon class="text-orange-500"><i-ep-data-line /></el-icon>
              季度销售对比
            </h3>
            <div class="h-64">
              <ECharts :option="getBarChartOption" :auto-resize="true" />
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
              class="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium shrink-0"
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
