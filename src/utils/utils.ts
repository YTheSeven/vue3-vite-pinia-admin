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

/**
 * 高性能深拷贝函数
 * 相比 JSON.parse(JSON.stringify()) 的优势：
 * 1. 性能更好，避免序列化/反序列化开销
 * 2. 支持 Date、RegExp、Map、Set 等特殊对象
 * 3. 支持循环引用检测
 * 4. 保留对象原型链
 * 5. 支持 Symbol 类型的键
 *
 * 注意：不拷贝函数（函数在 JavaScript 中通常不可序列化）
 *
 * @param obj 要拷贝的对象
 * @param hash 用于处理循环引用的 WeakMap（内部递归使用）
 * @returns 深拷贝后的新对象
 */
export function deepClone<T>(obj: T, hash = new WeakMap<object, unknown>()): T {
  // 处理 null 或基本类型（string, number, boolean, undefined, symbol, bigint）
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  // 处理 Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    hash.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(
        typeof key === 'object' && key !== null ? deepClone(key, hash) : key,
        deepClone(value, hash)
      );
    });
    return clonedMap as unknown as T;
  }

  // 处理 Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    hash.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, hash));
    });
    return clonedSet as unknown as T;
  }

  // 处理 ArrayBuffer
  if (obj instanceof ArrayBuffer) {
    const clonedBuffer = new ArrayBuffer(obj.byteLength);
    new Uint8Array(clonedBuffer).set(new Uint8Array(obj));
    return clonedBuffer as unknown as T;
  }

  // 处理 TypedArray
  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
    const typedArray = obj as unknown as {
      constructor: new (buffer: ArrayBuffer, byteOffset?: number, length?: number) => unknown;
      buffer: ArrayBuffer;
      byteOffset: number;
      length: number;
    };
    const Constructor = typedArray.constructor;
    const clonedBuffer = deepClone(typedArray.buffer, hash);
    return new Constructor(clonedBuffer, typedArray.byteOffset, typedArray.length) as T;
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj) as T;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray: unknown[] = [];
    hash.set(obj, clonedArray);
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], hash);
    }
    return clonedArray as T;
  }

  // 处理普通对象（包括类实例）
  // 使用 Object.create 保留原型链
  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, clonedObj);

  // 拷贝所有自有属性（包括不可枚举和 Symbol 键）
  const keys = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor) {
      const value = descriptor.value;
      const clonedValue = deepClone(value, hash);

      Object.defineProperty(clonedObj, key, {
        ...descriptor,
        value: clonedValue,
      });
    }
  }

  return clonedObj;
}
