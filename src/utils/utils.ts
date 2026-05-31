// 延迟工具函数
export function delay(ms: number): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 创建防抖函数
 * @param fn 要防抖的函数
 * @param waitMs 防抖等待时间（毫秒）
 * @returns 包含防抖执行函数和取消函数的对象
 */
export function createDebouncedFunction<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  waitMs: number
): { execute: T; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let rejectPending: (() => void) | null = null;

  const execute = (async (...args: unknown[]) => {
    // 取消之前的调用
    if (timer !== null) {
      clearTimeout(timer);
      rejectPending?.();
    }

    // 创建新的防抖延迟
    // oxlint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      rejectPending = () => {
        reject(new Error('Debounced call cancelled'));
      };

      timer = setTimeout(async () => {
        timer = null;
        rejectPending = null;
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, waitMs);
    });
  }) as T;

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
      rejectPending?.();
      rejectPending = null;
    }
  };

  return { execute, cancel };
}
