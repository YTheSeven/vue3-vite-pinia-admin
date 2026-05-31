import { request, alovaInstance } from '../alova';
import type { LoginParams, LoginResult, UserInfo, PageResult } from '@/types/api';

/**
 * 用户相关 API 模块
 * 示例：实际使用时根据后端接口调整
 */
export const userApi = {
  /**
   * 用户登录
   */
  login: (params: LoginParams) => {
    return request.post<LoginResult>('/auth/login', params);
  },

  /**
   * 用户登出
   */
  logout: () => {
    return request.post('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo: () => {
    return request.get<UserInfo>('/user/info');
  },

  /**
   * 刷新 Token
   */
  refreshToken: (refreshToken: string) => {
    return request.post<LoginResult>('/auth/refresh', { refreshToken });
  },

  /**
   * 获取用户列表（分页）
   */
  getUserList: (params: { page?: number; size?: number; keyword?: string }) => {
    return request.get<PageResult<UserInfo>>('/user/list', { params });
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: (data: Partial<UserInfo>) => {
    return request.put<UserInfo>('/user/info', data);
  },

  /**
   * 修改密码
   */
  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return request.post('/user/password', data);
  },

  /**
   * 上传头像
   */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return alovaInstance.Post<string>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
