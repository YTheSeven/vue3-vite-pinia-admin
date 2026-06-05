import type { PageResult } from '@/types/request';
import { request } from '../alova';
import type {
  LoginParams,
  LoginResult,
  RegisterParams,
  ChangePasswordParams,
  ChangePasswordResult,
  DeleteUserParams,
  UserInfo,
} from '@/types/modules/user';

/**
 * 用户 API 模块
 */
export const userApi = {
  /**
   * 用户登录
   * @param data 登录参数
   */
  login: (data: LoginParams) => request.post<LoginResult>('/users/login', data),

  /**
   * 用户注册
   * @param data 注册参数
   */
  register: (data: RegisterParams) => request.post('/users/register', data),

  /**
   * 用户登出
   */
  logout: () => request.post('/users/logout'),

  /**
   * 获取用户列表
   */
  getUserList: () => request.get<PageResult<UserInfo>>('/users/list'),

  /**
   * 修改密码
   * @param data 修改密码参数
   */
  changePassword: (data: ChangePasswordParams) =>
    request.patch<ChangePasswordResult>('/users/password', data),

  /**
   * 删除用户
   * @param data 删除用户参数
   * @deprecated 该接口已废弃
   */
  deleteUser: (data: DeleteUserParams) => request.delete('/users/delete', { data }),
};
