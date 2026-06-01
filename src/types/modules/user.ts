// ============================================
// 用户模块类型
// ============================================

/**
 * 用户信息
 */
export interface UserInfo {
  user_id: number;
  name: string;
  avatar: string;
}

/**
 * 用户注册参数
 */
export interface RegisterParams {
  user_name: string;
  password: string;
}

/**
 * 登录参数
 */
export interface LoginParams {
  user_name: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  token: string;
  user_info: UserInfo;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  user_name: string;
  password: string;
}

/**
 * 删除用户参数
 */
export interface DeleteUserParams {
  id: string;
}
