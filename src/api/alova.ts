import { createAlova } from 'alova';
import type { RequestBody } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';
import { ElMessage, ElNotification } from 'element-plus';
import type { ResponseType, RequestConfig } from '@/types/request';
import { useUserStore } from '@/store/modules/user';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 业务错误处理
// const handleBusinessError = (data: ResponseType) => {
//   const { code, message } = data;

//   switch (code) {
//     case 401: {
//       // 未授权，清除登录状态
//       const userStore = useUserStore();
//       void userStore.logout();
//       ElNotification.error({
//         title: '登录过期',
//         message: '请重新登录',
//         duration: 3000,
//       });
//       // 跳转登录页
//       window.location.href = '/login';
//       break;
//     }
//     case 403:
//       ElMessage.error('没有权限访问该资源');
//       break;
//     case 404:
//       ElMessage.error('请求的资源不存在');
//       break;
//     case 500:
//       ElMessage.error('服务器内部错误');
//       break;
//     default:
//       ElMessage.error(message || '请求失败');
//   }
// };

// 创建 alova 实例
export const alovaInstance = createAlova({
  // Vue 组合式 API 钩子
  statesHook: VueHook,

  // 请求适配器 - 使用 fetch
  requestAdapter: adapterFetch(),

  // 基础配置
  baseURL,

  // 请求超时设置 (毫秒)
  timeout: 30000,

  // 请求前置拦截器
  beforeRequest: (method) => {
    const userStore = useUserStore();

    // 添加请求头
    method.config.headers = {
      ...method.config.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // 添加认证 token
    const token = userStore.token;
    if (token) {
      (method.config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    // 如果是mock环境，添加apifox的token
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      (method.config.headers as Record<string, string>).apifoxToken =
        import.meta.env.VITE_MOCK_TOKEN ?? '';
    }

    // 请求日志（开发环境）
    if (import.meta.env.DEV) {
      console.log(`[Alova] ${method.type} ${method.url}`, {
        params: method.config.params,
        // data: method.config.data,
        headers: method.config.headers,
      });
    }
  },

  // 响应后置拦截器
  responded: {
    // 请求成功时的处理
    onSuccess: async (response, method) => {
      // fetch 适配器返回的是 Response 对象
      if (!(response instanceof Response)) {
        return response;
      }

      const { status, statusText } = response;

      // HTTP 错误状态处理
      if (status >= 400) {
        // 根据状态码显示对应的错误提示
        switch (status) {
          case 400:
            ElMessage.error('请求参数错误');
            break;
          case 401:
            ElNotification.error({
              title: '未授权',
              message: '请先登录',
              duration: 3000,
            });
            break;
          case 403:
            ElMessage.error('没有权限访问该资源');
            break;
          case 404:
            ElMessage.error('请求的资源不存在');
            break;
          case 405:
            ElMessage.error('请求方法不允许');
            break;
          case 408:
            ElMessage.error('请求超时，请稍后重试');
            break;
          case 409:
            ElMessage.error('资源冲突，请稍后重试');
            break;
          case 422:
            ElMessage.error('请求数据验证失败');
            break;
          case 429:
            ElMessage.error('请求过于频繁，请稍后重试');
            break;
          case 500:
            ElMessage.error('服务器内部错误');
            break;
          case 502:
            ElMessage.error('网关错误');
            break;
          case 503:
            ElMessage.error('服务暂时不可用');
            break;
          case 504:
            ElMessage.error('网关超时');
            break;
          default:
            ElMessage.error(`${statusText || '请求失败'}`);
        }

        const error = new Error(`HTTP ${status}: ${statusText}`);
        throw error;
      }

      // 解析响应数据
      const data = (await response.json()) as ResponseType;

      // 开发环境日志
      if (import.meta.env.DEV) {
        console.log(`[Alova Response] ${method.type} ${method.url}`, data);
      }

      // // 业务状态码处理
      // if (data.code !== 200) {
      //   await handleBusinessError(data);
      //   throw new Error(data.message || '请求失败');
      // }

      return data.data;
    },

    // 请求失败时的处理
    onError: async (error, method) => {
      console.error(`[Alova Error] ${method.type} ${method.url}`, error);

      // 网络错误处理
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        ElMessage.error('网络连接失败，请检查网络');
        return;
      }

      // 超时处理
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试');
        return;
      }

      // 其他错误
      if (!error.message.includes('请求失败')) {
        ElMessage.error(error.message ?? '请求失败');
      }

      throw error;
    },

    // 请求完成时的处理（无论成功失败）
    onComplete: (method) => {
      // 可以在这里添加 loading 状态处理等
      if (import.meta.env.DEV) {
        console.log(`[Alova Complete] ${method.type} ${method.url}`);
      }
    },
  },

  // 共享请求配置
  shareRequest: true,

  // 缓存配置
  // cacheLogger: import.meta.env.DEV,

  // 错误重试配置
  // retry: 2,
  // retryDelay: 1000,
});

// 便捷请求方法封装
export const request = {
  /**
   * GET 请求
   */
  get<T>(url: string, config: RequestConfig = {}) {
    return alovaInstance.Get<T>(url, {
      ...config,
      params: config.params,
    });
  },

  /**
   * POST 请求
   */
  post<T = unknown>(url: string, data?: RequestBody, config: RequestConfig = {}) {
    return alovaInstance.Post<T>(url, data, config);
  },

  /**
   * PUT 请求
   */
  put<T = unknown>(url: string, data?: RequestBody, config: RequestConfig = {}) {
    return alovaInstance.Put<T>(url, data, config);
  },

  /**
   * DELETE 请求
   */
  delete<T = unknown>(url: string, config: RequestConfig = {}) {
    return alovaInstance.Delete<T>(url, config);
  },

  /**
   * PATCH 请求
   */
  patch<T = unknown>(url: string, data?: RequestBody, config: RequestConfig = {}) {
    return alovaInstance.Patch<T>(url, data, config);
  },
};
