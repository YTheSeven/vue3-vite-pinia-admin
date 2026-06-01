// ============================================
// 请求相关类型定义
// ============================================

import type { Ref, ComputedRef } from 'vue';

/**
 * 标准 API 响应结构
 */
export interface ResponseType<T = unknown> {
  /** 业务状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp?: number;
  /** 请求路径 */
  path?: string;
}

/**
 * 分页查询参数
 */
export interface PageParams {
  /** 当前页码 */
  page?: number;
  /** 每页条数 */
  size?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方式 */
  order?: 'asc' | 'desc';
  /** 搜索关键词 */
  keyword?: string;
  [key: string]: unknown;
}

/**
 * 分页响应结果
 */
export interface PageResult<T = unknown> {
  /** 数据列表 */
  list: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  size: number;
  /** 总页数 */
  totalPages?: number;
  /** 是否有下一页 */
  hasNext?: boolean;
  /** 是否有上一页 */
  hasPrev?: boolean;
}

/**
 * 请求配置选项
 */
export interface RequestConfig {
  /** URL 参数 */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 是否启用缓存 */
  cacheConfig?:
    | boolean
    | {
        /** 缓存过期时间（毫秒） */
        expire?: number;
        /** 缓存模式 */
        mode?: 'memory' | 'restore';
      };
  /** 重试次数 */
  retry?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
  /** 自定义配置 */
  [key: string]: unknown;
}

/**
 * 上传文件配置
 */
export interface UploadConfig extends RequestConfig {
  /** 文件字段名 */
  fieldName?: string;
  /** 额外参数 */
  extraData?: Record<string, unknown>;
  /** 上传进度回调 */
  onProgress?: (progress: number) => void;
}

/**
 * 请求状态
 */
export interface RequestState<T = unknown> {
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 响应数据 */
  data: Ref<T | undefined>;
  /** 错误信息 */
  error: Ref<Error | undefined>;
  /** 发送请求 */
  send: (...args: unknown[]) => Promise<T> | void;
  /** 中止请求 */
  abort: () => void;
  /** 更新状态 */
  update: (newData: T) => void;
}

/**
 * 分页请求状态
 */
export interface PaginationState<T = unknown> extends Omit<RequestState<PageResult<T>>, 'send'> {
  /** 当前页码 */
  page: Ref<number>;
  /** 每页条数 */
  pageSize: Ref<number>;
  /** 总条数 */
  total: ComputedRef<number>;
  /** 数据列表 */
  list: ComputedRef<T[]>;
  /** 是否为最后一页 */
  isLastPage: ComputedRef<boolean>;
  /** 是否为空 */
  isEmpty: ComputedRef<boolean>;
  /** 发送请求 */
  send: (targetPage?: number) => Promise<PageResult<T> | null>;
  /** 加载更多 */
  loadMore: () => Promise<void>;
  /** 刷新 */
  refresh: () => Promise<void>;
  /** 重置分页 */
  reset: () => void;
}
