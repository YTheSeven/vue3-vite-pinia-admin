import { ref } from 'vue';
import { delay } from '@/utils/utils';
import { useDashboardStats } from './composables/useDashboardStats';
import { useTodos } from './composables/useTodos';
import { useCharts } from './composables/useCharts';
import type { UseDashboardViewReturn } from './types';

/**
 * 仪表盘页面主逻辑
 * 组合各子模块：统计数据、待办事项、图表展示
 */
export function useDashboardView(): UseDashboardViewReturn {
  // 加载状态
  const isLoading = ref<boolean>(false);

  // 组合子模块
  const statsModule = useDashboardStats();
  const todosModule = useTodos();
  const chartsModule = useCharts();

  /** 刷新数据 */
  const refreshData = async (): Promise<void> => {
    isLoading.value = true;
    await delay(1000);
    isLoading.value = false;
  };

  return {
    // 加载状态
    isLoading,

    // 统计数据模块
    ...statsModule,

    // 待办事项模块
    ...todosModule,

    // 图表模块
    ...chartsModule,

    // 全局操作
    refreshData,
  };
}
