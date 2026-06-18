import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePermissionStore } from './permission';
import { useMockPermissionStore } from './mockPermission';
import { resetRouter, resetHasAddedRoutes } from '@/router';
import { userApi } from '@/api/modules/user';
import type { LoginParams, UserDetail } from '@/types/modules';

export interface UserInfo {
  /** 用户ID */
  id: number;
  /** 登录用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 头像URL */
  avatar: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone: string;
  /** 个人简介 */
  bio: string;
  /** 性别：0-未知，1-男，2-女 */
  gender: 0 | 1 | 2;
  /** 生日 */
  birthday: string;
  /** 角色列表 */
  roles: string[];
  /** 权限列表 */
  permissions: string[];
}

export const useUserStore = defineStore(
  'user',
  () => {
    // ========== State ==========
    const token = ref<string>('');
    const userInfo = ref<UserInfo | null>(null);
    const isLoggedIn = ref<boolean>(false);

    // ========== Getters ==========
    const getToken = computed(() => token.value);
    const getUserInfo = computed(() => userInfo.value);
    const getIsLoggedIn = computed(() => isLoggedIn.value);
    const getUserRoles = computed(() => userInfo.value?.roles ?? []);
    const getUserPermissions = computed(() => userInfo.value?.permissions ?? []);

    // ========== Actions ==========

    /**
     * 设置 token
     */
    function setToken(newToken: string) {
      token.value = newToken;
    }

    /**
     * 设置用户信息
     */
    function setUserInfo(info: UserInfo) {
      userInfo.value = info;
      isLoggedIn.value = true;
    }

    /**
     * 清除用户信息和登录状态
     */
    function clearUserInfo() {
      token.value = '';
      userInfo.value = null;
      isLoggedIn.value = false;
    }

    /**
     * 登录
     * @param loginForm 登录表单
     */
    async function login(loginForm: LoginParams) {
      try {
        // 调用登录 API
        const loginResult = await userApi.login(loginForm);

        // 从 mockPermissionStore 获取角色和权限配置
        const mockPermissionStore = useMockPermissionStore();
        const roles = mockPermissionStore.getUserRoleCodes(loginForm.user_name);
        const permissions = mockPermissionStore.getUserPermissions(loginForm.user_name);

        // 根据角色获取昵称
        const roleNicknameMap: Record<string, string> = {
          admin: '管理员',
          operator: '运营人员',
          user: '普通用户',
        };
        const nickname = roleNicknameMap[roles[0]] || loginForm.user_name;

        // 先保存 token
        setToken(loginResult.token);

        // 获取完整的用户详情（包含 email, phone, bio 等）
        let userDetail: UserDetail | null = null;
        try {
          // 尝试获取用户详情
          const detailRes = await userApi.getUserDetail(loginForm.user_name);
          userDetail = detailRes;
        } catch {
          // 如果获取失败，使用登录返回的基本信息
          console.warn('获取用户详情失败，使用登录返回的基本信息');
        }

        // 构建完整的用户信息
        const fullUserInfo: UserInfo = {
          id: userDetail?.id ?? 0,
          username: loginForm.user_name,
          nickname: userDetail?.nickname ?? loginResult.user_info.name ?? nickname,
          avatar: userDetail?.avatar ?? loginResult.user_info.avatar ?? '',
          email: userDetail?.email ?? '',
          phone: userDetail?.phone ?? '',
          bio: userDetail?.bio ?? '',
          gender: (userDetail?.gender as 0 | 1 | 2) ?? 0,
          birthday: userDetail?.birthday ?? '',
          roles,
          permissions,
        };

        // 保存到 store
        setUserInfo(fullUserInfo);

        // 记住用户名
        if (loginForm.remember) {
          localStorage.setItem('remember_username', loginForm.user_name);
        } else {
          localStorage.removeItem('remember_username');
        }

        return Promise.resolve();
      } catch (error) {
        // 登录失败，清除可能已保存的 token
        clearUserInfo();
        return Promise.reject(error);
      }
    }

    /**
     * 登出
     */
    async function logout() {
      try {
        // TODO: 调用登出 API
        // await logoutApi()

        // 重置路由状态（确保重新登录时能重新获取动态路由）
        const permissionStore = usePermissionStore();
        permissionStore.resetRoutes();
        resetRouter();
        resetHasAddedRoutes();

        // 清除用户信息
        clearUserInfo();

        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }

    /**
     * 获取用户信息（从 API 刷新）
     */
    async function fetchUserInfo() {
      try {
        if (!userInfo.value) {
          return Promise.reject(new Error('用户未登录'));
        }

        const userId = userInfo.value.id.toString();
        const detail = await userApi.getUserDetail(userId);

        // 更新 store 中的用户信息（保留 roles 和 permissions）
        setUserInfo({
          ...userInfo.value,
          nickname: detail.nickname,
          avatar: detail.avatar,
          email: detail.email,
          phone: detail.phone,
          bio: detail.bio,
          gender: detail.gender,
          birthday: detail.birthday,
        });

        return Promise.resolve();
      } catch (error) {
        // 获取失败，可能是 token 过期
        clearUserInfo();
        return Promise.reject(error);
      }
    }

    /**
     * 检查并恢复登录状态
     * 用于应用初始化时调用
     */
    function initAuth() {
      if (token.value && userInfo.value) {
        // 可以在这里调用 API 验证 token 是否有效
        // fetchUserInfo()
        console.log('已恢复登录状态');
        return true;
      }
      return false;
    }

    /**
     * 检查是否有某个权限
     */
    function hasPermission(permission: string): boolean {
      const permissions = getUserPermissions.value;
      if (permissions.includes('*')) return true;
      return permissions.includes(permission);
    }

    /**
     * 检查是否有某个角色
     */
    function hasRole(role: string): boolean {
      return getUserRoles.value.includes(role);
    }

    return {
      // State (可用于解构)
      token,
      userInfo,
      isLoggedIn,
      // Getters
      getToken,
      getUserInfo,
      getIsLoggedIn,
      getUserRoles,
      getUserPermissions,
      // Actions
      setToken,
      setUserInfo,
      clearUserInfo,
      login,
      logout,
      fetchUserInfo,
      initAuth,
      hasPermission,
      hasRole,
    };
  },
  {
    // Pinia 持久化配置
    persist: {
      // 使用 localStorage 存储
      storage: localStorage,
      // 持久化指定的状态
      pick: ['token', 'userInfo', 'isLoggedIn'],
    },
  }
);
