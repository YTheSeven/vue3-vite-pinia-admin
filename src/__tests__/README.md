# Vue3 单元测试完整教程

> 本教程带你由浅入深学习 Vue3 单元测试，包含 4 个阶段的学习路径。

## 📚 教程结构

```
src/
├── utils/__tests__/utils.spec.ts                    # 阶段一：基础工具函数测试
├── store/__tests__/mockPermission.spec.ts           # 阶段二：Pinia Store 测试
├── views/system/UserManageView/__tests__/           # 阶段三：Composable 测试
│   └── useUserManageView.spec.ts
└── components/__tests__/Iconify.spec.ts             # 阶段四：Vue 组件测试
```

---

## 🎯 阶段一：基础工具函数测试

**文件**: `src/utils/__tests__/utils.spec.ts`

**学习目标**：

- Vitest 基础 API：describe, it, expect
- AAA 模式（Arrange-Act-Assert）
- 常用匹配器（matchers）
- 异步测试和时间控制

**运行命令**：

```bash
pnpm test src/utils/__tests__/utils.spec.ts
```

**核心概念**：

```typescript
// 1. AAA 模式
it('应该正确工作', () => {
  // Arrange（准备）
  const input = 42;

  // Act（执行）
  const result = double(input);

  // Assert（断言）
  expect(result).toBe(84);
});

// 2. 使用 fake timers 控制时间
beforeEach(() => {
  vi.useFakeTimers(); // 启用假时间
});

it('测试延迟函数', async () => {
  const promise = debouncedFn();
  await vi.advanceTimersByTimeAsync(1000); // 快进时间
  // ...
});
```

---

## 🎯 阶段二：Pinia Store 测试

**文件**: `src/store/__tests__/mockPermission.spec.ts`

**学习目标**：

- 创建 Pinia 测试环境
- Mock 浏览器 API（localStorage）
- 测试 Vue 响应式状态
- 验证副作用

**运行命令**：

```bash
pnpm test src/store/__tests__/mockPermission.spec.ts
```

**核心概念**：

```typescript
// 1. 测试环境设置
beforeEach(() => {
  // 创建新的 Pinia 实例，确保每个测试隔离
  setActivePinia(createPinia());
});

// 2. Mock localStorage
const createLocalStorageMock = () => ({
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => {
    store[key] = value;
  }),
  // ...
});

// 3. 测试 store
const store = useMockPermissionStore();
store.initConfig();
expect(store.getRoles.length).toBeGreaterThan(0);
```

---

## 🎯 阶段三：Composable 测试

**文件**: `src/views/system/UserManageView/__tests__/useUserManageView.spec.ts`

**学习目标**：

- 测试 Vue 组合式函数
- Mock Element Plus 组件
- 测试表单验证
- 测试复杂业务逻辑

**运行命令**：

```bash
pnpm test src/views/system/UserManageView/__tests__/useUserManageView.spec.ts
```

**核心概念**：

```typescript
// 1. Mock UI 组件
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus');
  return {
    ...actual,
    ElMessage: { success: vi.fn(), error: vi.fn() },
    ElMessageBox: { confirm: vi.fn() },
  };
});

// 2. 测试 composable
const vm = useUserManageView();
expect(vm.isLoading.value).toBe(false);

// 3. 测试表单验证
const confirmRule = vm.addFormRules.confirmPassword?.[1];
confirmRule?.validator({}, 'password', callback);
expect(callback).toHaveBeenCalledWith();
```

---

## 🎯 阶段四：Vue 组件测试

**文件**: `src/components/__tests__/Iconify.spec.ts`

**学习目标**：

- @vue/test-utils 基本用法
- 挂载组件和传递 props
- DOM 查询和断言
- 快照测试

**运行命令**：

```bash
pnpm test src/components/__tests__/Iconify.spec.ts
```

**核心概念**：

```typescript
// 1. 挂载组件
const wrapper = mount(Iconify, {
  props: { name: 'i-ep-user', size: 24 },
});

// 2. DOM 查询和断言
expect(wrapper.find('.iconify').exists()).toBe(true);
expect(wrapper.find('.iconify').attributes('style')).toContain('width: 24px');

// 3. 更新 props
await wrapper.setProps({ size: 32 });

// 4. 快照测试
expect(wrapper.html()).toMatchSnapshot();
```

---

## 🚀 运行所有测试

```bash
# 运行所有测试（一次性）
pnpm test

# 运行所有测试（监听模式，文件变化自动重跑）
pnpm test:watch

# 运行所有测试（UI 界面）
pnpm test:ui

# 生成测试覆盖率报告
pnpm coverage
```

---

## 📊 测试覆盖率配置

当前配置（`vitest.config.ts`）：

- **包含**: `src/**/*`（除 .d.ts 和入口文件）
- **排除**: 路由、Store（因为有复杂状态管理）
- **报告器**: text, html

查看覆盖率报告：

```bash
pnpm coverage
# 然后打开 coverage/index.html
```

---

## 🎓 测试最佳实践

### 1. 命名规范

```typescript
// ✅ 好的命名
describe('useUserManageView', () => {
  it('应该在验证失败时不提交表单', () => {});
  it('应该在提交成功后显示成功消息', () => {});
});

// ❌ 差的命名
describe('test', () => {
  it('test1', () => {});
  it('test2', () => {});
});
```

### 2. 测试独立性

- 每个测试应该独立运行，不依赖其他测试
- 使用 `beforeEach` 重置共享状态
- 使用 `vi.clearAllMocks()` 清除 mock 调用记录

### 3. 测试粒度

- 一个测试只验证一个概念
- 使用 describe 分组相关测试
- 测试用例之间保持独立

### 4. 可读性优先

```typescript
// ✅ 清晰的测试
it('搜索应该过滤用户列表', async () => {
  // Arrange
  const vm = useUserManageView();

  // Act
  vm.searchKeyword.value = 'admin';
  await nextTick();

  // Assert
  expect(vm.filteredUserList.value.every((u) => u.name.includes('admin'))).toBe(true);
});

// ❌ 难以理解的测试
it('test search', () => {
  const vm = useUserManageView();
  vm.searchKeyword.value = 'admin';
  // ... 缺少等待和清晰断言
});
```

### 5. 边界情况测试

- 空输入
- 最大值/最小值
- 无效格式
- 异步错误

---

## 🛠️ 常用 Vitest API 速查

### 基础 API

| API                               | 说明               |
| --------------------------------- | ------------------ |
| `describe(name, fn)`              | 定义测试套件       |
| `it(name, fn)` / `test(name, fn)` | 定义测试用例       |
| `expect(value)`                   | 创建断言           |
| `beforeAll(fn)`                   | 所有测试前执行一次 |
| `afterAll(fn)`                    | 所有测试后执行一次 |
| `beforeEach(fn)`                  | 每个测试前执行     |
| `afterEach(fn)`                   | 每个测试后执行     |

### 常用匹配器

| 匹配器              | 说明             |
| ------------------- | ---------------- |
| `toBe(value)`       | 严格相等（===）  |
| `toEqual(value)`    | 深度相等         |
| `toBeNull()`        | 是否为 null      |
| `toBeUndefined()`   | 是否为 undefined |
| `toBeTruthy()`      | 是否为真值       |
| `toBeFalsy()`       | 是否为假值       |
| `toContain(item)`   | 数组/字符串包含  |
| `toHaveLength(n)`   | 长度是否为 n     |
| `toThrow(error)`    | 是否抛出错误     |
| `toMatch(regex)`    | 是否匹配正则     |
| `toMatchSnapshot()` | 快照比对         |

### Mock API

| API                            | 说明                |
| ------------------------------ | ------------------- |
| `vi.fn()`                      | 创建 mock 函数      |
| `vi.fn().mockReturnValue(x)`   | 指定返回值          |
| `vi.fn().mockResolvedValue(x)` | 指定 Promise 返回值 |
| `vi.fn().mockRejectedValue(x)` | 指定 Promise 拒绝值 |
| `vi.mock(module)`              | Mock 整个模块       |
| `vi.spyOn(object, method)`     | 监听对象方法        |
| `vi.useFakeTimers()`           | 启用假时间          |
| `vi.advanceTimersByTime(ms)`   | 快进时间            |

### Vue Test Utils

| API                                | 说明           |
| ---------------------------------- | -------------- |
| `mount(Component, options)`        | 挂载组件       |
| `shallowMount(Component, options)` | 浅挂载         |
| `wrapper.find(selector)`           | 查找元素       |
| `wrapper.findAll(selector)`        | 查找所有元素   |
| `wrapper.exists()`                 | 检查是否存在   |
| `wrapper.html()`                   | 获取 HTML      |
| `wrapper.text()`                   | 获取文本       |
| `wrapper.attributes()`             | 获取属性       |
| `wrapper.classes()`                | 获取类名       |
| `wrapper.setProps(props)`          | 更新 props     |
| `wrapper.trigger(event)`           | 触发事件       |
| `wrapper.emitted()`                | 获取触发的事件 |

---

## ❓ 常见问题

### Q: 测试运行很慢怎么办？

A: 检查是否使用了真实时间，改用 `vi.useFakeTimers()`。

### Q: 测试之间状态相互影响？

A: 确保在 `beforeEach` 中重置 Pinia 和 mock 状态。

### Q: 如何调试测试？

A: 使用 `pnpm test:ui` 打开图形界面，或在代码中加 `console.log`。

### Q: 快照测试失败怎么办？

A: 如果变更是预期的，运行 `pnpm test -- -u` 更新快照。

### Q: 如何只运行特定测试？

A: 使用 `.only` 修饰符：

```typescript
it.only('只运行这个测试', () => {});
```

---

## 📖 学习路径建议

1. **第一周**：完成阶段一，理解基础概念
2. **第二周**：完成阶段二，学会 Store 测试
3. **第三周**：完成阶段三，掌握 Composable 测试
4. **第四周**：完成阶段四，学习组件测试
5. **持续**：为项目中的新功能编写测试

祝你测试之旅顺利！🎉
