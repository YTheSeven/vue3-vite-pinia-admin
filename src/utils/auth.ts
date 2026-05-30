import type { UserInfo } from '@/store/modules/user';

const TOKEN_KEY = 'admin_token';
const USER_INFO_KEY = 'admin_user_info';

// 获取 token
export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? '';
}

// 设置 token
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// 清除 token
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// 获取用户信息
export function getUserInfo(): UserInfo | null {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  }
  return null;
}

// 设置用户信息
export function setUserInfo(userInfo: UserInfo): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

// 清除用户信息
export function removeUserInfo(): void {
  localStorage.removeItem(USER_INFO_KEY);
}

// 清除所有认证信息
export function clearAuth(): void {
  removeToken();
  removeUserInfo();
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!getToken();
}
