# Alova 请求库集成指南

## 项目结构

```
src/
├── api/                    # API 相关
│   ├── alova.ts           # 核心配置
│   ├── index.ts           # 统一导出
│   ├── modules/           # 业务模块
│   │   └── user.ts        # 用户模块示例
│   └── README.md          # 使用文档
├── types/
│   └── api.ts             # API 类型定义
├── composables/
│   └── useRequest.ts      # Vue Hook 封装
└── .env.*                 # 环境变量配置
```

## 快速开始

### 1. 基础请求

```typescript
import { request } from '@/api';

// GET 请求
const userInfo = await request.get<UserInfo>('/user/info');

// POST 请求
const result = await request.post<LoginResult>('/auth/login', {
  username: 'admin',
  password: '123456',
});

// PUT 请求
await request.put('/user/info', { nickname: '新昵称' });

// DELETE 请求
await request.delete('/user/123');
```

### 2. 使用 Hook（推荐）

```vue
<script setup>
  import { useRequest } from '@/composables/useRequest';
  import { userApi } from '@/api';

  // 自动请求 + 响应式状态
  const { loading, data, error, send } = useRequest(() => userApi.getUserInfo(), {
    immediate: true, // 组件挂载时自动请求
    onSuccess: (data) => {
      console.log('成功:', data);
    },
    onError: (err) => {
      console.error('失败:', err);
    },
  });
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">错误: {{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### 3. 分页请求

```typescript
import { usePageRequest } from '@/composables/useRequest';

const {
  loading,
  list, // 数据列表
  total, // 总条数
  page, // 当前页
  isLastPage, // 是否最后一页
  isEmpty, // 是否为空
  refresh, // 刷新
  loadMore, // 加载更多
} = usePageRequest<User>((page, size) => userApi.getUserList({ page, size }), { pageSize: 10 });
```

### 4. 表单提交

```typescript
import { useFormSubmit } from '@/composables/useRequest';

const { loading, submit } = useFormSubmit((params) => userApi.login(params), {
  successMsg: '登录成功',
  onSuccess: (data) => {
    // 处理成功
  },
});

// 提交
await submit({ username: 'admin', password: '123' });
```

## API 模块定义

### 创建新模块

```typescript
// src/api/modules/order.ts
import { request, alovaInstance } from '../alova';
import type { Order, PageResult } from '@/types/api';

export const orderApi = {
  // 列表
  getList: (params: { page?: number; size?: number }) =>
    request.get<PageResult<Order>>('/order/list', { params }),

  // 详情
  getDetail: (id: string) => request.get<Order>(`/order/${id}`),

  // 创建
  create: (data: Partial<Order>) => request.post<Order>('/order', data),

  // 更新
  update: (id: string, data: Partial<Order>) => request.put<Order>(`/order/${id}`, data),

  // 删除
  delete: (id: string) => request.delete(`/order/${id}`),

  // 上传文件（使用 FormData）
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return alovaInstance.Post('/order/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### 导出模块

```typescript
// src/api/index.ts
export { orderApi } from './modules/order';
```

## 配置说明

### 环境变量

```bash
# .env.development
VITE_API_BASE_URL=/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

### 请求配置选项

```typescript
interface RequestConfig {
  params?: Record<string, any>; // URL 参数
  headers?: Record<string, string>; // 请求头
  timeout?: number; // 超时时间（毫秒）
  cache?: boolean | CacheConfig; // 缓存配置
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟
}
```

### 缓存配置

```typescript
// 启用缓存
request.get('/data', {
  cache: true, // 使用默认缓存时间
});

// 自定义缓存
request.get('/data', {
  cache: {
    expire: 60000, // 缓存 60 秒
    mode: 'memory', // 内存缓存
  },
});
```

## 类型定义

### 扩展业务类型

```typescript
// src/types/api.ts

// 订单类型
export interface Order {
  id: string;
  orderNo: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  // ...
}

// 订单查询参数
export interface OrderQueryParams extends PageParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}
```

## 最佳实践

### 1. 统一管理 API

- 所有 API 按业务模块分文件管理
- 统一从 `@/api` 导入使用

### 2. 类型安全

- 为每个请求定义返回类型
- 复用类型定义减少重复

### 3. 错误处理

- 全局错误在 `alova.ts` 拦截器中统一处理
- 特殊错误可在 Hook 的 `onError` 中单独处理

### 4. 加载状态

- 使用 Hook 返回的 `loading` 状态
- 避免使用额外的 loading 变量

### 5. 请求取消

- 组件卸载时自动取消未完成的请求
- 手动取消：`abort()` 方法

## 常见问题

### Q: 如何添加新的请求拦截器？

A: 在 `src/api/alova.ts` 的 `createAlovaConfig` 函数中修改 `beforeRequest` 配置。

### Q: 如何修改响应处理逻辑？

A: 在 `createAlovaConfig` 的 `responded.onSuccess` 中自定义处理。

### Q: 如何添加全局 loading？

A: 在 `responded.onComplete` 中使用 Pinia store 管理全局 loading 状态。
