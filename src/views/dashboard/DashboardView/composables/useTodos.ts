import { ref, computed } from 'vue';
import type { TodoItem, UseTodosReturn } from '../types';

/**
 * 待办事项逻辑
 * 包含：待办列表、统计、增删改操作
 */
export function useTodos(): UseTodosReturn {
  const todos = ref<TodoItem[]>([
    { id: 1, text: '完成项目需求文档', done: false, priority: 'high' },
    { id: 2, text: '代码审查', done: false, priority: 'medium' },
    { id: 3, text: '更新数据库', done: true, priority: 'low' },
    { id: 4, text: '团队周会', done: false, priority: 'medium' },
    { id: 5, text: '修复线上 Bug', done: true, priority: 'high' },
  ]);

  /** 已完成待办数量 */
  const completedTodosCount = computed<number>(() => todos.value.filter((t) => t.done).length);

  /** 总待办数量 */
  const totalTodosCount = computed<number>(() => todos.value.length);

  /** 完成率百分比 */
  const completionRate = computed<number>(() => {
    if (totalTodosCount.value === 0) return 0;
    return Math.round((completedTodosCount.value / totalTodosCount.value) * 100);
  });

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

  return {
    todos,
    completedTodosCount,
    totalTodosCount,
    completionRate,
    toggleTodo,
    addTodo,
    deleteTodo,
  };
}
