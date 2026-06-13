<script setup lang="ts">
  import { useECharts } from '@/composables/useECharts';
  import type { EChartsEventParams } from '@/composables/useECharts';
  import type { EChartsOption } from 'echarts';

  // ==========================================
  // 组件 Props 定义
  // ==========================================

  interface Props {
    /** ECharts 配置项或 getter 函数 */
    option: EChartsOption | (() => EChartsOption);
    /** 是否显示加载状态 */
    loading?: boolean;
    /** 自定义主题名称（可选） */
    theme?: string;
    /** 是否自动调整大小 */
    autoResize?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    theme: undefined,
    autoResize: true,
  });

  // ==========================================
  // 组件 Emits 定义
  // ==========================================

  interface Emits {
    click: [params: EChartsEventParams];
    dblclick: [params: EChartsEventParams];
    mousedown: [params: EChartsEventParams];
    mouseup: [params: EChartsEventParams];
    mouseover: [params: EChartsEventParams];
    mouseout: [params: EChartsEventParams];
  }

  const emit = defineEmits<Emits>();

  // ==========================================
  // 组件逻辑 - 使用 useECharts composable
  // ==========================================

  // 创建模板 ref，与 composable 的 ref 同步
  const elRef = ref<HTMLDivElement | null>(null);

  // 统一处理 option 为 getter 函数，确保响应式更新
  const getChartOption = (): EChartsOption => {
    return typeof props.option === 'function' ? props.option() : props.option;
  };

  // 使用 composable 管理 ECharts 逻辑
  const echartsApi = useECharts({
    option: getChartOption,
    loading: props.loading,
    theme: props.theme,
    autoResize: props.autoResize,
    onClick: (params) => emit('click', params),
    onDblclick: (params) => emit('dblclick', params),
    onMousedown: (params) => emit('mousedown', params),
    onMouseup: (params) => emit('mouseup', params),
    onMouseover: (params) => emit('mouseover', params),
    onMouseout: (params) => emit('mouseout', params),
  });

  // 同步 ref
  watch(elRef, (el) => {
    echartsApi.chartRef.value = el;
  });
</script>

<template>
  <div ref="elRef" class="w-full h-full min-h-50" />
</template>
