import { delay } from '@/utils/utils';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePermissionStore } from './permission';
import { resetRouter, resetHasAddedRoutes } from '@/router';
import type { LoginParams } from '@/types/modules';

export interface UserInfo {
  id: number | string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  permissions?: string[];
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
        // TODO: 调用登录 API
        // const res = await loginApi(loginForm)

        // 模拟登录成功
        await delay(800); // 模拟网络延迟

        // 根据用户名分配不同角色
        let roles: string[];
        let permissions: string[];
        let nickname: string;

        switch (loginForm.user_name) {
          case 'admin':
            roles = ['admin'];
            permissions = ['*'];
            nickname = '管理员';
            break;
          case 'operator':
            roles = ['operator'];
            permissions = ['order:view', 'order:edit'];
            nickname = '运营人员';
            break;
          case 'user':
            roles = ['user'];
            permissions = ['profile:view'];
            nickname = '普通用户';
            break;
          default:
            roles = ['user'];
            permissions = ['profile:view'];
            nickname = '访客';
        }

        const mockToken = `mock_token_${Date.now()}`;
        const mockUserInfo: UserInfo = {
          id: 1,
          username: loginForm.user_name,
          nickname,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          roles,
          permissions,
        };

        // 保存到 store
        setToken(mockToken);
        setUserInfo(mockUserInfo);

        // 记住用户名
        if (loginForm.remember) {
          localStorage.setItem('remember_username', loginForm.user_name);
        } else {
          localStorage.removeItem('remember_username');
        }

        return Promise.resolve();
      } catch (error) {
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
        // TODO: 调用获取用户信息 API
        // const res = await getUserInfoApi()
        // setUserInfo(res)
        console.log('获取用户信息成功');
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
