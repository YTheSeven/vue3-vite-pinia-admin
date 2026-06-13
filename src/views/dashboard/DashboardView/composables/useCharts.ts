import { ref, computed } from 'vue';
import type { EChartsOption, ECElementEvent } from 'echarts';
import { usePerformance } from '@/composables/usePerformance';
import type {
  ChartType,
  ChartData,
  ChartDataMap,
  ProductShareItem,
  QuarterSalesMap,
  UseChartsReturn,
} from '../types';

/**
 * 图表逻辑
 * 包含：访问量图表、CPU监控图表、产品份额饼图、季度销售条形图
 */
export function useCharts(): UseChartsReturn {
  // ========== 访问量图表状态 ==========
  const chartType = ref<ChartType>('week');

  const chartDataMap = computed<ChartDataMap>(() => ({
    week: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      values: [820, 932, 901, 934, 1290, 1330, 1320],
    },
    month: {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
      values: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000 + 500)),
    },
    year: {
      labels: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月',
      ],
      values: [1500, 2300, 2240, 2180, 1350, 1470, 2600, 2800, 3200, 3100, 2900, 3500],
    },
  }));

  const chartData = computed<ChartData>(() => chartDataMap.value[chartType.value]);

  /** 访问量柱状图配置 */
  const chartOption = computed<EChartsOption>(() => {
    const data = chartData.value;
    const isWeek = chartType.value === 'week';

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: {c} 访问',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.labels,
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: '#94a3b8' } },
        axisLabel: {
          interval: isWeek ? 0 : 'auto',
          rotate: isWeek ? 0 : 45,
          color: '#64748b',
        },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
        axisLabel: { color: '#64748b' },
      },
      series: [
        {
          name: '访问量',
          type: 'bar',
          barWidth: isWeek ? '40%' : '60%',
          data: data.values,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#60a5fa' },
              ],
            },
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#2563eb' },
                  { offset: 1, color: '#3b82f6' },
                ],
              },
            },
          },
          animationDuration: 1000,
          animationEasing: 'elasticOut',
        },
      ],
    };
  });

  // ========== 页面性能监控（多维度） ==========
  const {
    metrics: perfMetrics,
    history: perfHistory,
    fpsHistory,
    memoryHistory,
    frameTimeHistory,
    timeLabels: perfTimeLabels,
  } = usePerformance();

  /** 页面性能多维度监控图表配置（模拟数据） */
  const cpuChartOption = computed<EChartsOption>(() => {
    const lastIndex = perfHistory.value.length - 1;
    const currentScore = perfHistory.value[lastIndex] ?? 0;
    const currentFps = fpsHistory.value[lastIndex] ?? 0;
    const currentMemory = memoryHistory.value[lastIndex] ?? 0;
    const currentFrameTime = frameTimeHistory.value[lastIndex] ?? 0;

    return {
      title: {
        text: `综合评分: ${currentScore} | FPS: ${currentFps} | 帧时间: ${currentFrameTime}ms | 内存: ${currentMemory}%`,
        left: 'center',
        top: 5,
        textStyle: {
          fontSize: 12,
          color: '#64748b',
          fontWeight: 'normal',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: unknown) => {
          const p = params as Array<{ seriesName: string; value: number; color: string }>;
          const time = p[0]?.seriesName ?? '';
          let html = `<div style="font-weight:bold;margin-bottom:5px">${time}</div>`;
          p.forEach((item) => {
            html += `<div style="display:flex;align-items:center;gap:5px">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color}"></span>
              <span>${item.seriesName}: ${item.value}${item.seriesName.includes('内存') ? '%' : item.seriesName.includes('帧') ? 'ms' : ''}</span>
            </div>`;
          });
          const fps = perfMetrics.value.fps;
          const mem = perfMetrics.value.memoryUsagePercent;
          html += `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #eee;font-size:11px;color:#999">
            实时: FPS ${fps}, 内存 ${mem}%
          </div>`;
          return html;
        },
      },
      legend: {
        data: ['综合分数', 'FPS', '内存使用率', '帧时间'],
        bottom: 0,
        textStyle: { fontSize: 11, color: '#64748b' },
        itemWidth: 15,
        itemHeight: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: perfTimeLabels.value,
        axisLine: { lineStyle: { color: '#94a3b8' } },
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      yAxis: [
        {
          type: 'value',
          name: '分数/FPS/%',
          max: 100,
          min: 0,
          position: 'left',
          splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
          axisLabel: { color: '#64748b', fontSize: 10 },
          axisLine: { show: false },
        },
        {
          type: 'value',
          name: 'ms',
          max: 50,
          min: 0,
          position: 'right',
          splitLine: { show: false },
          axisLabel: { color: '#64748b', fontSize: 10 },
          axisLine: { show: false },
        },
      ],
      series: [
        // 综合分数 - 面积图
        {
          name: '综合分数',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: '#3b82f6' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
              ],
            },
          },
          data: perfHistory.value,
          animationDuration: 300,
        },
        // FPS - 虚线
        {
          name: 'FPS',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#10b981', type: 'dashed' },
          itemStyle: { color: '#10b981' },
          data: fpsHistory.value,
          animationDuration: 300,
          markLine: {
            silent: true,
            symbol: 'none',
            data: [{ yAxis: 60, lineStyle: { color: '#10b981', type: 'dotted', width: 1 } }],
            label: { show: false },
          },
        },
        // 内存使用率
        {
          name: '内存使用率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: '#f59e0b' },
          itemStyle: { color: '#f59e0b' },
          data: memoryHistory.value,
          animationDuration: 300,
        },
        // 帧时间 - 使用右侧 Y 轴
        {
          name: '帧时间',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1.5, color: '#8b5cf6', opacity: 0.7 },
          itemStyle: { color: '#8b5cf6' },
          data: frameTimeHistory.value,
          animationDuration: 300,
        },
      ],
    };
  });

  // ========== 饼图和条形图联动状态 ==========
  const selectedProduct = ref<string>('全部');

  const productShareData = ref<ProductShareItem[]>([
    { name: '智能手机', value: 35, color: '#3b82f6' },
    { name: '笔记本电脑', value: 25, color: '#10b981' },
    { name: '平板电脑', value: 20, color: '#f59e0b' },
    { name: '智能手表', value: 12, color: '#8b5cf6' },
    { name: '耳机音响', value: 8, color: '#ec4899' },
  ]);

  const quarterSalesData: QuarterSalesMap = {
    全部: [320, 450, 580, 620],
    智能手机: [120, 150, 180, 200],
    笔记本电脑: [80, 100, 130, 140],
    平板电脑: [60, 90, 110, 120],
    智能手表: [30, 50, 80, 90],
    耳机音响: [30, 60, 80, 70],
  };

  /** 处理饼图点击事件 */
  const handlePieClick = (params: ECElementEvent): void => {
    selectedProduct.value = params.name || '全部';
  };

  /** 产品份额饼图配置 */
  const pieChartOption = computed<EChartsOption>(() => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemGap: 15,
      textStyle: { color: '#64748b' },
    },
    series: [
      {
        name: '产品份额',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#374151',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: { show: false },
        data: productShareData.value.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ],
  }));

  /** 季度销售条形图配置（联动饼图） */
  const barChartOption = computed<EChartsOption>(() => {
    const currentData = quarterSalesData[selectedProduct.value] ?? quarterSalesData['全部'];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const data = (params as [{ name: string; value: number }])[0];
          return `${data.name}<br/>${selectedProduct.value}销售额: ¥${data.value}万`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
        axisLine: { lineStyle: { color: '#94a3b8' } },
        axisLabel: { color: '#64748b' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
        axisLabel: { color: '#64748b', formatter: '¥{value}万' },
      },
      series: [
        {
          name: '销售额',
          type: 'bar',
          barWidth: '50%',
          data: currentData,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: (params: unknown) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
              return colors[(params as { dataIndex: number }).dataIndex] ?? '#3b82f6';
            },
          },
          animationDuration: 500,
        },
      ],
      title: {
        text:
          selectedProduct.value === '全部' ? '全品类季度销售' : `${selectedProduct.value}季度销售`,
        left: 'center',
        top: 5,
        textStyle: {
          fontSize: 14,
          color: '#374151',
          fontWeight: 'normal',
        },
      },
    };
  });

  return {
    chartType,
    chartOption,
    cpuChartOption,
    pieChartOption,
    barChartOption,
    selectedProduct,
    handlePieClick,
  };
}
