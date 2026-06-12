import type { Ref, ComputedRef } from 'vue';
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { delay } from '@/utils/utils';

// ==========================================
// 类型定义
// ==========================================

interface StatItem {
  icon: string;
  value: string;
  label: string;
  trend: number;
  color: string;
}

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface QuickLink {
  name: string;
  icon: string;
  path: string;
  color: string;
}

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar?: string;
}

interface UseDashboardViewReturn {
  // State
  chartType: Ref<'week' | 'month' | 'year'>;
  todos: Ref<TodoItem[]>;
  isLoading: Ref<boolean>;

  // Getters
  displayName: ComputedRef<string>;
  currentDate: ComputedRef<string>;
  greeting: ComputedRef<string>;
  stats: ComputedRef<StatItem[]>;
  quickLinks: ComputedRef<QuickLink[]>;
  activities: ComputedRef<ActivityItem[]>;
  completedTodosCount: ComputedRef<number>;
  totalTodosCount: ComputedRef<number>;
  completionRate: ComputedRef<number>;

  // Actions
  toggleTodo: (id: number) => void;
  addTodo: (text: string) => void;
  deleteTodo: (id: number) => void;
  refreshData: () => Promise<void>;
}

// ==========================================
// 逻辑实现
// ==========================================

export function useDashboardView(): UseDashboardViewReturn {
  const userStore = useUserStore();

  // ========== State ==========
  const chartType = ref<'week' | 'month' | 'year'>('week');
  const isLoading = ref<boolean>(false);

  const todos = ref<TodoItem[]>([
    { id: 1, text: '完成项目需求文档', done: false, priority: 'high' },
    { id: 2, text: '代码审查', done: false, priority: 'medium' },
    { id: 3, text: '更新数据库', done: true, priority: 'low' },
    { id: 4, text: '团队周会', done: false, priority: 'medium' },
    { id: 5, text: '修复线上 Bug', done: true, priority: 'high' },
  ]);

  // ========== Getters ==========

  /** 显示的用户名 */
  const displayName = computed<string>(() => {
    const info = userStore.userInfo;
    return info?.nickname || info?.username || '用户';
  });

  /** 当前日期 */
  const currentDate = computed<string>(() => {
    const date = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
  });

  /** 问候语 */
  const greeting = computed<string>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  });

  /** 统计数据 */
  const stats = computed<StatItem[]>(() => [
    {
      icon: 'i-ep-user',
      value: '1,234',
      label: '总用户数',
      trend: 12.5,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: 'i-ep-shopping-cart',
      value: '856',
      label: '今日订单',
      trend: 8.2,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: 'i-ep-money',
      value: '¥12,580',
      label: '今日收入',
      trend: -3.4,
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: 'i-ep-message',
      value: '42',
      label: '未读消息',
      trend: 0,
      color: 'from-purple-500 to-pink-600',
    },
  ]);

  /** 快捷入口 */
  const quickLinks = computed<QuickLink[]>(() => [
    { name: '用户管理', icon: 'i-ep-user-filled', path: '/system/users', color: '#3B82F6' },
    { name: '订单管理', icon: 'i-ep-document', path: '/business/orders', color: '#10B981' },
    { name: '商品管理', icon: 'i-ep-goods', path: '/business/goods', color: '#F59E0B' },
    { name: '系统设置', icon: 'i-ep-setting', path: '/user/settings', color: '#8B5CF6' },
    { name: '个人中心', icon: 'i-ep-user', path: '/user/profile', color: '#EC4899' },
    { name: '数据报表', icon: 'i-ep-data-line', path: '/dashboard', color: '#06B6D4' },
  ]);

  /** 最近活动 */
  const activities = computed<ActivityItem[]>(() => [
    {
      id: 1,
      user: '张三',
      action: '创建了订单',
      target: '#ORD-2024001',
      time: '2分钟前',
    },
    {
      id: 2,
      user: '李四',
      action: '更新了商品',
      target: 'iPhone 15 Pro',
      time: '15分钟前',
    },
    {
      id: 3,
      user: '王五',
      action: '完成了任务',
      target: '代码审查',
      time: '1小时前',
    },
    {
      id: 4,
      user: '赵六',
      action: '登录了系统',
      target: '',
      time: '2小时前',
    },
    {
      id: 5,
      user: '钱七',
      action: '发布了公告',
      target: '系统维护通知',
      time: '3小时前',
    },
  ]);

  /** 待办统计 */
  const completedTodosCount = computed<number>(() => todos.value.filter((t) => t.done).length);

  const totalTodosCount = computed<number>(() => todos.value.length);

  const completionRate = computed<number>(() => {
    if (totalTodosCount.value === 0) return 0;
    return Math.round((completedTodosCount.value / totalTodosCount.value) * 100);
  });

  // ========== Actions ==========

  /** 切换待办状态 */
  const toggleTodo = (id: number): void => {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.done = !todo.done;
    }
  };

  /** 添加待办 */
  const addTodo = (text: string): void => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text,
      done: false,
      priority: 'medium',
    };
    todos.value.unshift(newTodo);
  };

  /** 删除待办 */
  const deleteTodo = (id: number): void => {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index > -1) {
      todos.value.splice(index, 1);
    }
  };

  /** 刷新数据 */
  const refreshData = async (): Promise<void> => {
    isLoading.value = true;
    // 模拟异步加载
    await delay(1000);
    isLoading.value = false;
  };

  return {
    // State
    chartType,
    todos,
    isLoading,

    // Getters
    displayName,
    currentDate,
    greeting,
    stats,
    quickLinks,
    activities,
    completedTodosCount,
    totalTodosCount,
    completionRate,

    // Actions
    toggleTodo,
    addTodo,
    deleteTodo,
    refreshData,
  };
}
