import type { ComputedRef, Ref } from 'vue';
import type { EChartsOption, ECElementEvent } from 'echarts';

// ==========================================
// 基础类型
// ==========================================

export interface StatItem {
  icon: string;
  value: string;
  label: string;
  trend: number;
  color: string;
}

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface QuickLink {
  name: string;
  icon: string;
  path: string;
  color: string;
}

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar?: string;
}

// ==========================================
// 图表相关类型
// ==========================================

export type ChartType = 'week' | 'month' | 'year';

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface ChartDataMap {
  week: ChartData;
  month: ChartData;
  year: ChartData;
}

export interface ProductShareItem {
  name: string;
  value: number;
  color: string;
}

export type QuarterSalesMap = Record<string, number[]>;

export interface BarFormatterParams {
  name: string;
  value: number;
  dataIndex: number;
}

// ==========================================
// Composable 返回类型
// ==========================================

export interface UseDashboardStatsReturn {
  displayName: ComputedRef<string>;
  currentDate: ComputedRef<string>;
  greeting: ComputedRef<string>;
  stats: ComputedRef<StatItem[]>;
  quickLinks: ComputedRef<QuickLink[]>;
  activities: ComputedRef<ActivityItem[]>;
}

export interface UseTodosReturn {
  todos: Ref<TodoItem[]>;
  completedTodosCount: ComputedRef<number>;
  totalTodosCount: ComputedRef<number>;
  completionRate: ComputedRef<number>;
  toggleTodo: (id: number) => void;
  addTodo: (text: string) => void;
  deleteTodo: (id: number) => void;
}

export interface UseChartsReturn {
  chartType: Ref<ChartType>;
  chartOption: ComputedRef<EChartsOption>;
  cpuChartOption: ComputedRef<EChartsOption>;
  pieChartOption: ComputedRef<EChartsOption>;
  barChartOption: ComputedRef<EChartsOption>;
  selectedProduct: Ref<string>;
  handlePieClick: (params: ECElementEvent) => void;
}

export interface UseDashboardViewReturn
  extends UseDashboardStatsReturn, UseTodosReturn, UseChartsReturn {
  isLoading: Ref<boolean>;
  refreshData: () => Promise<void>;
}
