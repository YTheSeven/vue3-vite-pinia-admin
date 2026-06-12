// ============================================
// 用户模块类型
// ============================================

/**
 * 用户基础信息
 */
export interface UserInfo {
  /** 用户id */
  user_id: number;
  /** 用户名 */
  name: string;
  /** 用户头像 */
  avatar: string;
}

/**
 * 用户列表项
 */
export interface UserListItem {
  /** 用户id */
  user_id: number;
  /** 用户名 */
  name: string;
  /** 用户头像 */
  avatar: string;
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  /** 页码 */
  page: number;
  /** 每页数量 */
  page_size?: number;
  /** 名称 */
  name?: string;
  /** 索引签名 */
  [key: string]: string | number | undefined;
}

/**
 * 用户列表响应数据（拦截器已提取 data.data）
 */
export interface UserListData {
  /** 每页数量 */
  size: number;
  /** 当前页码 */
  page: number;
  /** 总数量 */
  total: number;
  /** 用户列表 */
  list: UserListItem[];
}

/**
 * 用户详情信息（拦截器已提取 data.data）
 */
export interface UserDetail {
  /** 用户ID */
  id: number;
  /** 昵称 */
  nickname: string;
  /** 头像URL地址 */
  avatar: string;
  /** 邮箱地址 */
  email: string;
  /** 手机号码 */
  phone: string;
  /** 个人简介 */
  bio: string;
  /** 性别：0-未知，1-男，2-女 */
  gender: 0 | 1 | 2;
  /** 生日日期 */
  birthday: string;
}

/**
 * 用户注册参数
 */
export interface RegisterParams {
  /** 用户名 */
  user_name: string;
  /** 密码 */
  password: string;
}

/**
 * 登录参数
 */
export interface LoginParams {
  /** 用户名 */
  user_name: string;
  /** 密码 */
  password: string;
  /** 记住用户名 */
  remember?: boolean;
}

/**
 * 登录响应用户信息（拦截器已提取 data.data.user_info）
 * 注意：登录接口只返回 name 和 avatar，完整信息需要调用 getUserDetail
 */
export interface LoginUserInfo {
  /** 用户名称 */
  name: string;
  /** 用户头像地址 */
  avatar: string;
}

/**
 * 登录响应（拦截器已提取 data.data）
 */
export interface LoginResult {
  /** 登录凭证 */
  token: string;
  /** 用户信息 */
  user_info: LoginUserInfo;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  /** 用户名 */
  user_name: string;
  /** 新密码 */
  password: string;
}

/**
 * 修改密码响应（拦截器已提取 data.data）
 */
export interface ChangePasswordResult {
  /** 状态 */
  status: string;
}

/**
 * 删除用户参数
 * @deprecated 该接口已废弃
 */
export interface DeleteUserParams {
  /** ID 编号 */
  id: string;
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams {
  /** 用户昵称 */
  nickname?: string;
  /** 用户头像URL地址 */
  avatar?: string;
  /** 邮箱地址 */
  email?: string;
  /** 手机号码 */
  phone?: string;
  /** 个人简介或个性签名 */
  bio?: string;
  /** 性别：0-未知，1-男，2-女 */
  gender?: 0 | 1 | 2;
  /** 生日日期 */
  birthday?: string;
}
