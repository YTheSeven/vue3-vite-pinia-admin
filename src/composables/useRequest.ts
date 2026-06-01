import type { Method, AlovaGenerics } from 'alova';
import type { PageResult } from '@/types/request';
import { createDebouncedFunction } from '@/utils/utils';

/**
 * 通用请求 Hook - 手动封装版本
 * 适用于 Vue 组合式 API
 */
export function useRequest<T = unknown>(
  methodHandler: Method<AlovaGenerics<T>> | (() => Method<AlovaGenerics<T>>),
  options?: {
    /** 是否立即发送请求 */
    immediate?: boolean;
    /** 初始数据 */
    initialData?: T;
    /** 请求成功回调 */
    onSuccess?: (data: T) => void;
    /** 请求失败回调 */
    onError?: (error: Error) => void;
    /** 请求完成回调 */
    onComplete?: () => void;
    /** 防抖延迟（毫秒） */
    debounce?: number;
  }
) {
  const loading = shallowRef<boolean>(false);
  const data = shallowRef<T | undefined>(options?.initialData);
  const error = shallowRef<Error | undefined>(undefined);

  // 获取 method 实例
  const getMethod = (): Method<AlovaGenerics<T>> => {
    return typeof methodHandler === 'function' ? methodHandler() : methodHandler;
  };

  // 发送请求
  const send = async (): Promise<T | null> => {
    loading.value = true;
    error.value = undefined;

    try {
      const method = getMethod();
      const result = await method.send();
      data.value = result;
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      error.value = e;
      options?.onError?.(e);
      return null;
    } finally {
      loading.value = false;
      options?.onComplete?.();
    }
  };

  // 更新数据
  const update = (newData: T) => {
    data.value = newData;
  };

  // 防抖处理
  const debounceMs = options?.debounce ?? 300;
  const { execute: debouncedSend, cancel: cancelDebounce } = createDebouncedFunction<
    () => Promise<T | null>
  >(send, debounceMs);

  // 中止请求时同时取消防抖
  const abort = () => {
    cancelDebounce();
    const method = getMethod();
    void method.abort();
  };

  // 立即执行
  onMounted(() => {
    if (options?.immediate !== false) {
      if (options?.debounce) {
        void debouncedSend();
      } else {
        void send();
      }
    }
  });

  // 组件卸载时取消防抖
  onUnmounted(() => {
    cancelDebounce();
  });

  return {
    loading: readonly(loading),
    data: readonly(data),
    error: readonly(error),
    send: options?.debounce ? debouncedSend : send,
    abort,
    update,
  };
}

/**
 * 分页请求 Hook
 * 简化分页数据获取
 */
export function usePageRequest<T = unknown>(
  methodCreator: (page: number, size: number) => Method<AlovaGenerics<PageResult<T>>>,
  options?: {
    /** 初始页码 */
    initialPage?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 初始数据 */
    initialData?: PageResult<T>;
    /** 数据更新回调 */
    onSuccess?: (data: PageResult<T>) => void;
  }
) {
  const loading = shallowRef<boolean>(false);
  const data = shallowRef<PageResult<T> | undefined>(options?.initialData);
  const error = shallowRef<Error | undefined>(undefined);
  const page = shallowRef<number>(options?.initialPage ?? 1);
  const pageSize = shallowRef<number>(options?.pageSize ?? 10);
  const total = computed<number>(() => data.value?.total ?? 0);

  const list = computed<T[]>(() => data.value?.list ?? []);
  const isLastPage = computed<boolean>(() => {
    if (!data.value) return true;
    return page.value * pageSize.value >= total.value;
  });
  const isEmpty = computed<boolean>(() => list.value.length === 0 && !loading.value);

  // 发送请求
  const send = async (targetPage = page.value): Promise<PageResult<T> | null> => {
    loading.value = true;
    error.value = undefined;

    try {
      const method = methodCreator(targetPage, pageSize.value);
      const result = await method.send();
      data.value = result;
      page.value = targetPage;
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      error.value = e;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 刷新当前页
  const refresh = async (): Promise<void> => {
    await send(page.value);
  };

  // 加载更多（下一页）
  const loadMore = async (): Promise<void> => {
    if (isLastPage.value || loading.value) return;
    const nextPage = page.value + 1;
    const result = await send(nextPage);
    if (result && data.value) {
      data.value.list = [...data.value.list, ...result.list];
    }
  };

  // 重置分页
  const reset = () => {
    page.value = options?.initialPage ?? 1;
    data.value = options?.initialData;
    error.value = undefined;
    loading.value = false;
  };

  // 中止请求
  const abort = () => {
    const method = methodCreator(page.value, pageSize.value);
    void method.abort();
  };

  // 立即执行
  onMounted(() => {
    void send();
  });

  return {
    loading: readonly(loading),
    data: readonly(data),
    error: readonly(error),
    page: readonly(page),
    pageSize: readonly(pageSize),
    total,
    list,
    isLastPage,
    isEmpty,
    send,
    refresh,
    loadMore,
    reset,
    abort,
  };
}

/**
 * 表单提交 Hook
 * 适用于新增/编辑表单提交场景
 */
export function useFormSubmit<T = unknown, P = unknown>(
  submitMethod: (params: P) => Method<AlovaGenerics<T>>,
  options?: {
    /** 提交成功回调 */
    onSuccess?: (data: T, params: P) => void;
    /** 提交失败回调 */
    onError?: (error: Error, params: P) => void;
    /** 成功提示消息 */
    successMsg?: string;
    /** 是否显示加载状态 */
    showLoading?: boolean;
  }
) {
  const loading = shallowRef<boolean>(false);
  const error = shallowRef<Error | undefined>(undefined);

  const submit = async (params: P): Promise<T | null> => {
    loading.value = true;
    error.value = undefined;

    try {
      const method = submitMethod(params);
      const result = await method.send();

      // 成功提示
      if (options?.successMsg) {
        ElMessage.success(options.successMsg);
      }

      options?.onSuccess?.(result, params);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      error.value = e;
      options?.onError?.(e, params);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    submit,
  };
}

/**
 * 手动触发请求 Hook
 * 适用于需要手动控制请求时机的场景（如搜索）
 */
export function useManualRequest<T = unknown, P = unknown>(
  methodCreator: (params: P) => Method<AlovaGenerics<T>>,
  options?: {
    /** 初始数据 */
    initialData?: T;
    /** 成功回调 */
    onSuccess?: (data: T) => void;
  }
) {
  const loading = shallowRef<boolean>(false);
  const data = shallowRef<T | undefined>(options?.initialData);
  const error = shallowRef<Error | undefined>(undefined);

  const execute = async (params: P): Promise<T | null> => {
    loading.value = true;
    error.value = undefined;

    try {
      const method = methodCreator(params);
      const result = await method.send();
      data.value = result;
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      error.value = e;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = options?.initialData;
    error.value = undefined;
    loading.value = false;
  };

  return {
    loading: readonly(loading),
    data: readonly(data),
    error: readonly(error),
    execute,
    reset,
  };
}
