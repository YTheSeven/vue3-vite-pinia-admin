/**
 * ============================================================================
 * 阶段一：基础工具函数测试
 * ============================================================================
 *
 * 学习目标：
 * 1. 理解 Vitest 的基础 API：describe, it, expect
 * 2. 掌握 AAA 测试模式（Arrange-Act-Assert）
 * 3. 学会使用常见的匹配器（matchers）
 * 4. 理解异步测试的处理方式
 *
 * 运行命令：
 *   pnpm test src/utils/__tests__/utils.spec.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay, createDebouncedFunction, deepClone } from '../utils';

// ============================================================================
// 第一部分：基础概念 - describe 和 it
// ============================================================================
// describe: 用来分组相关的测试用例，形成测试套件（test suite）
// it: 代表一个具体的测试用例（test case），it 是 "it should..." 的缩写
//
// 最佳实践：
// - describe 描述被测试的对象（模块/函数/类）
// - it 描述具体的行为期望（应该做什么）

describe('delay', () => {
  // --------------------------------------------------------------------------
  // 测试用例 1：基本功能测试
  // --------------------------------------------------------------------------
  // AAA 模式：
  // - Arrange（准备）：设置测试数据和环境
  // - Act（执行）：调用被测试的函数
  // - Assert（断言）：验证结果是否符合预期

  it('应该在指定时间后解析 Promise', async () => {
    // Arrange: 定义测试参数
    const ms = 50; // 使用较短的延迟避免测试运行太慢

    // Act: 记录开始时间，执行延迟，记录结束时间
    const startTime = Date.now();
    await delay(ms);
    const endTime = Date.now();

    // Assert: 验证实际延迟时间是否接近预期
    // 允许 20ms 的误差（由于 JavaScript 事件循环的不确定性）
    const actualDelay = endTime - startTime;
    expect(actualDelay).toBeGreaterThanOrEqual(ms - 5); // 至少接近 ms
    expect(actualDelay).toBeLessThan(ms + 20); // 但不能太长
  });

  // --------------------------------------------------------------------------
  // 测试用例 2：边界情况 - 零延迟
  // --------------------------------------------------------------------------
  // 边界测试是发现 bug 的重要手段
  // 思考：当输入是 0、负数、超大数时，函数会如何表现？

  it('应该处理 0 延迟的情况', async () => {
    // Act: 零延迟应该立即解析
    const startTime = Date.now();
    await delay(0);
    const endTime = Date.now();

    // Assert: 执行时间应该非常短（< 10ms）
    expect(endTime - startTime).toBeLessThan(10);
  });
});

// ============================================================================
// 第二部分：复杂函数测试 - 防抖函数
// ============================================================================
// 防抖（debounce）是常见的前端优化技术
// 测试难点：
// - 涉及时间控制
// - 需要验证函数是否被正确延迟
// - 需要验证取消功能

describe('createDebouncedFunction', () => {
  // 使用 fake timers 控制时间，让测试更快更稳定
  // vi.useFakeTimers() 会替代 setTimeout、setInterval 等时间函数
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // 每个测试后恢复真实时间函数，避免影响其他测试
  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该延迟执行函数直到防抖时间结束', async () => {
    // Arrange: 创建一个 mock 函数
    const mockFn = vi.fn().mockResolvedValue('result');
    const debounced = createDebouncedFunction(mockFn, 1000);

    // Act: 多次快速调用，但只等待最后一次
    // 注意：前两次会被取消，我们使用 try/catch 处理 rejection 避免未处理的 Promise 警告
    const [p1, p2, finalPromise] = [
      debounced.execute('arg1'),
      debounced.execute('arg2'),
      debounced.execute('arg3'),
    ];
    await Promise.all([
      (async () => {
        try {
          await p1;
        } catch {
          // 预期的取消错误，忽略
        }
      })(),
      (async () => {
        try {
          await p2;
        } catch {
          // 预期的取消错误，忽略
        }
      })(),
    ]);

    // Assert: 立即检查时，函数不应该被调用
    expect(mockFn).not.toHaveBeenCalled();

    // Act: 快进时间到防抖延迟后
    // advanceTimersByTimeAsync 用于异步等待 Promise
    await vi.advanceTimersByTimeAsync(1000);

    // Assert: 只执行最后一次调用
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg3');

    // 等待最后的 Promise 完成
    await finalPromise;
  });

  it('应该返回 Promise 并在执行后解析', async () => {
    // Arrange
    const mockFn = vi.fn().mockResolvedValue('success');
    const debounced = createDebouncedFunction(mockFn, 500);

    // Act: 执行并等待结果
    const promise = debounced.execute('test');

    // 快进时间
    vi.advanceTimersByTime(500);

    // Assert: Promise 应该解析为 mock 的返回值
    const result = await promise;
    expect(result).toBe('success');
  });

  it('应该在取消时拒绝 Promise', async () => {
    // Arrange
    const mockFn = vi.fn().mockResolvedValue('never');
    const debounced = createDebouncedFunction(mockFn, 1000);

    // Act: 开始执行，然后立即取消
    const promise = debounced.execute('test');
    debounced.cancel();

    // Assert: Promise 应该被拒绝
    await expect(promise).rejects.toThrow('Debounced call cancelled');
  });

  it('取消后不应该再执行函数', async () => {
    // Arrange
    const mockFn = vi.fn().mockResolvedValue('result');
    const debounced = createDebouncedFunction(mockFn, 500);

    // Act: 执行后立即取消，然后等待
    // 使用 try/catch 处理预期的 rejection（fire-and-forget 方式）
    void (async () => {
      try {
        await debounced.execute('test');
      } catch {
        // 预期的取消错误，忽略
      }
    })();
    debounced.cancel();
    await vi.advanceTimersByTimeAsync(500);

    // Assert: 函数不应该被调用
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('应该支持多次独立调用', async () => {
    // Arrange
    const mockFn = vi.fn().mockImplementation((x: number) => Promise.resolve(x * 2));
    const debounced = createDebouncedFunction(mockFn, 100);

    // Act & Assert: 第一次调用
    const promise1 = debounced.execute(5);
    await vi.advanceTimersByTimeAsync(100);
    expect(await promise1).toBe(10);

    // 第二次调用（独立的防抖周期）
    const promise2 = debounced.execute(3);
    await vi.advanceTimersByTimeAsync(100);
    expect(await promise2).toBe(6);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// 第三部分：复杂数据结构测试 - 深拷贝
// ============================================================================
// 深拷贝测试需要覆盖多种数据类型
// 测试策略：使用等价性断言（toEqual）而非同一性断言（toBe）

describe('deepClone', () => {
  it('应该正确克隆基本类型值', () => {
    // 基本类型按值传递，克隆应该返回相同的值
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
    expect(deepClone(true)).toBe(true);
  });

  it('应该正确克隆普通对象', () => {
    // Arrange
    const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };

    // Act
    const cloned = deepClone(original);

    // Assert: 值相等
    expect(cloned).toEqual(original);
    // 但不是同一个引用
    expect(cloned).not.toBe(original);
    // 嵌套对象也是新引用
    expect(cloned.b).not.toBe(original.b);
    // 数组也是新引用
    expect(cloned.d).not.toBe(original.d);
  });

  it('应该正确克隆数组', () => {
    const original = [1, [2, 3], { a: 4 }];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
    expect(cloned[2]).not.toBe(original[2]);
  });

  it('应该正确处理 Date 对象', () => {
    const original = new Date('2024-01-15');
    const cloned = deepClone(original);

    // 时间戳相等
    expect(cloned.getTime()).toBe(original.getTime());
    // 但不是同一个对象
    expect(cloned).not.toBe(original);
  });

  it('应该正确处理 RegExp 对象', () => {
    const original = /test\d+/gi;
    const cloned = deepClone(original);

    expect(cloned.source).toBe(original.source);
    expect(cloned.flags).toBe(original.flags);
    expect(cloned).not.toBe(original);
  });

  it('应该正确处理 Map', () => {
    const original = new Map<string, string | { nested: boolean }>([
      ['key1', 'value1'],
      ['key2', { nested: true }],
    ]);
    const cloned = deepClone(original);

    expect(cloned.get('key1')).toBe('value1');
    expect(cloned.get('key2')).toEqual({ nested: true });
    expect(cloned.get('key2')).not.toBe(original.get('key2'));
    expect(cloned).not.toBe(original);
  });

  it('应该正确处理 Set', () => {
    const original = new Set([1, 2, { a: 3 }]);
    const cloned = deepClone(original);

    expect(cloned.has(1)).toBe(true);
    expect(cloned.has(2)).toBe(true);
    // Set 中的对象也是深拷贝
    const originalObj = [...original].find((x) => typeof x === 'object') as { a: number };
    const clonedObj = [...cloned].find((x) => typeof x === 'object') as { a: number };
    expect(clonedObj).toEqual(originalObj);
    expect(clonedObj).not.toBe(originalObj);
  });

  it('应该正确处理循环引用', () => {
    // Arrange: 创建循环引用对象
    interface Node {
      name: string;
      parent?: Node;
      children: Node[];
    }

    const parent: Node = { name: 'parent', children: [] };
    const child: Node = { name: 'child', parent, children: [] };
    parent.children.push(child);

    // Act
    const cloned = deepClone(parent);

    // Assert: 循环引用被保留
    expect(cloned.children[0].parent).toBe(cloned);
    expect(cloned).not.toBe(parent);
  });

  it('应该保留对象的原型链', () => {
    // Arrange: 创建一个有原型的对象
    class Person {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
      greet() {
        return `Hello, I'm ${this.name}`;
      }
    }

    const original = new Person('Alice');

    // Act
    const cloned = deepClone(original);

    // Assert: 原型方法仍然可用
    expect(cloned).toBeInstanceOf(Person);
    expect(cloned.greet()).toBe("Hello, I'm Alice");
    expect(cloned).not.toBe(original);
  });
});

// ============================================================================
// 总结：编写单元测试的核心原则
// ============================================================================
//
// 1. **单一职责**：每个测试只验证一个概念
// 2. **独立性**：测试之间不应该相互依赖
// 3. **可重复性**：无论何时运行，结果都应该一致
// 4. **快速反馈**：测试应该快速执行（使用 fake timers）
// 5. **可读性**：测试代码应该像文档一样清晰
//
// 常用 Vitest 匹配器：
// - toBe(value)           : 严格相等（===）
// - toEqual(value)        : 深度相等（对象/数组内容相同）
// - toBeNull()            : 是否为 null
// - toBeUndefined()       : 是否为 undefined
// - toBeTruthy()          : 是否为真值
// - toBeFalsy()           : 是否为假值
// - toContain(item)       : 数组/字符串是否包含
// - toHaveLength(n)       : 长度是否为 n
// - toThrow(error)        : 是否抛出错误
// - toHaveBeenCalled()    : mock 函数是否被调用
// - toHaveBeenCalledTimes(n): 被调用次数
// - toHaveBeenCalledWith(...args): 被调用时的参数
//
// 下一节我们将学习如何测试 Pinia Store（包含 localStorage mock）
