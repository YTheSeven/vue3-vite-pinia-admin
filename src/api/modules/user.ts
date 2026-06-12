import { request } from '../alova';
import type {
  LoginParams,
  LoginResult,
  RegisterParams,
  ChangePasswordParams,
  ChangePasswordResult,
  DeleteUserParams,
  UserListParams,
  UserListData,
  UserDetail,
  UpdateUserParams,
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
   * @param params 查询参数
   */
  getUserList: (params: UserListParams) => request.get<UserListData>('/users/list', { params }),

  /**
   * 获取用户详情
   * @param id 用户ID
   */
  getUserDetail: (id: string) => request.get<UserDetail>(`/users/${id}`),

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param data 更新参数
   */
  updateUser: (id: string, data: UpdateUserParams) => request.put(`/users/${id}`, data),

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
