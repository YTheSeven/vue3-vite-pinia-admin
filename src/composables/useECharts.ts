import { useElementSize } from '@vueuse/core';
import { useThemeStore } from '@/store/modules/theme';
import type { EChartsOption, ECharts, ECElementEvent } from 'echarts';

// ==========================================
// 类型定义
// ==========================================

/** ECharts 事件参数类型 */
export type EChartsEventParams = ECElementEvent;

/** ECharts 配置选项 */
export interface UseEChartsOptions {
  /** ECharts 配置项或 getter 函数 */
  option: EChartsOption | (() => EChartsOption);
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 自定义主题名称 */
  theme?: string;
  /** 是否自动调整大小 */
  autoResize?: boolean;
  /** 点击事件回调 */
  onClick?: (params: EChartsEventParams) => void;
  /** 双击事件回调 */
  onDblclick?: (params: EChartsEventParams) => void;
  /** 鼠标按下事件回调 */
  onMousedown?: (params: EChartsEventParams) => void;
  /** 鼠标松开事件回调 */
  onMouseup?: (params: EChartsEventParams) => void;
  /** 鼠标进入事件回调 */
  onMouseover?: (params: EChartsEventParams) => void;
  /** 鼠标离开事件回调 */
  onMouseout?: (params: EChartsEventParams) => void;
}

/** useECharts 返回值 */
export interface UseEChartsReturn {
  /** 图表容器 ref */
  chartRef: ReturnType<typeof ref<HTMLDivElement | null>>;
  /** 重新初始化图表 */
  reinitChart: () => Promise<void>;
}

// ==========================================
// Composable 实现
// ==========================================

/**
 * ECharts 图表组合式函数
 * 封装 ECharts 初始化、主题切换、事件绑定、自动 resize 等逻辑
 */
export function useECharts(options: UseEChartsOptions): UseEChartsReturn {
  const {
    option: optionOrGetter,
    loading = false,
    theme,
    autoResize = true,
    onClick,
    onDblclick,
    onMousedown,
    onMouseup,
    onMouseover,
    onMouseout,
  } = options;

  /** 获取当前配置项 */
  const getOption = (): EChartsOption => {
    return typeof optionOrGetter === 'function' ? optionOrGetter() : optionOrGetter;
  };

  const themeStore = useThemeStore();

  // ========== State ==========
  const chartRef = ref<HTMLDivElement | null>(null);
  const chartInstance = ref<ECharts | null>(null);

  // ========== Computed ==========
  const currentTheme = computed<string | undefined>(() => {
    if (theme) return theme;
    return themeStore.isDark ? 'dark' : undefined;
  });

  // ========== Methods ==========

  /** 注册暗黑主题 */
  const registerDarkTheme = (echarts: typeof import('echarts')): void => {
    const darkTheme: Record<string, unknown> = {
      backgroundColor: 'transparent',
      textStyle: { color: '#e2e8f0' },
      title: {
        textStyle: { color: '#f1f5f9' },
        subtextStyle: { color: '#94a3b8' },
      },
      legend: { textStyle: { color: '#cbd5e1' } },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        borderColor: '#334155',
        textStyle: { color: '#e2e8f0' },
      },
      xAxis: {
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155' } },
      },
      yAxis: {
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155' } },
      },
    };

    echarts.registerTheme('dark', darkTheme);
  };

  /** 更新加载状态 */
  const updateLoadingState = (): void => {
    if (!chartInstance.value) return;

    if (loading) {
      chartInstance.value.showLoading({
        text: '加载中...',
        color: '#3b82f6',
        textColor: themeStore.isDark ? '#e2e8f0' : '#374151',
        maskColor: themeStore.isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      });
    } else {
      chartInstance.value.hideLoading();
    }
  };

  /** 绑定图表事件 */
  const bindEvents = (instance: NonNullable<typeof chartInstance.value>): void => {
    if (onClick) {
      instance.on('click', (params: ECElementEvent) => onClick(params));
    }
    if (onDblclick) {
      instance.on('dblclick', (params: ECElementEvent) => onDblclick(params));
    }
    if (onMousedown) {
      instance.on('mousedown', (params: ECElementEvent) => onMousedown(params));
    }
    if (onMouseup) {
      instance.on('mouseup', (params: ECElementEvent) => onMouseup(params));
    }
    if (onMouseover) {
      instance.on('mouseover', (params: ECElementEvent) => onMouseover(params));
    }
    if (onMouseout) {
      instance.on('mouseout', (params: ECElementEvent) => onMouseout(params));
    }
  };

  /** 初始化图表 */
  const initChart = async (): Promise<void> => {
    if (!chartRef.value) return;

    const echarts = await import('echarts');

    // 注册暗黑主题
    registerDarkTheme(echarts);

    // 初始化图表
    chartInstance.value = echarts.init(chartRef.value, currentTheme.value);

    // 设置配置项
    const currentOption = getOption();
    if (currentOption) {
      chartInstance.value.setOption(currentOption, true);
    }

    // 绑定事件
    bindEvents(chartInstance.value);

    // 显示/隐藏加载状态
    updateLoadingState();
  };

  /** 重新初始化图表 */
  const reinitChart = async (): Promise<void> => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
      chartInstance.value = null;
    }
    await initChart();
  };

  // ========== Watchers ==========

  // 监听配置项变化（支持 getter 函数）
  // 注意：不使用 deep: true，避免频繁触发导致图表闪烁
  // 依赖变化时 getter 函数会重新执行，自然触发更新
  watch(
    () => getOption(),
    (newOption: EChartsOption) => {
      if (!chartInstance.value || !newOption) return;

      // 对于实时数据更新，使用 notMerge: false 合并配置，保持动画流畅
      chartInstance.value.setOption(newOption, {
        notMerge: false,
        lazyUpdate: false,
      });
    },
    { immediate: true }
  );

  // 监听加载状态
  watch(
    () => loading,
    () => {
      updateLoadingState();
    }
  );

  // 监听主题变化
  watch(
    () => themeStore.isDark,
    () => {
      void reinitChart();
    }
  );

  // 自动调整大小
  const { width, height } = useElementSize(chartRef);
  watch([width, height], () => {
    if (chartInstance.value && autoResize) {
      chartInstance.value.resize();
    }
  });

  // ========== Lifecycle ==========

  onMounted(() => {
    // 如果 ref 已经赋值，直接初始化；否则等待 watch 触发
    if (chartRef.value) {
      void initChart();
    }
  });

  // 监听 ref 变化（用于 :ref 函数绑定场景）
  watch(chartRef, (el) => {
    if (el && !chartInstance.value) {
      void initChart();
    }
  });

  onUnmounted(() => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
      chartInstance.value = null;
    }
  });

  // ========== Return ==========
  return {
    chartRef,
    reinitChart,
  };
}
