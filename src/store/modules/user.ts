import { delay } from '@/utils/utils';
import { usePermissionStore } from './permission';
import { resetRouter, resetHasAddedRoutes } from '@/router';

const TOKEN_KEY = 'admin_token';
const USER_INFO_KEY = 'admin_user_info';

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
     * 设置 token 并持久化到 localStorage
     */
    function setToken(newToken: string) {
      token.value = newToken;
      localStorage.setItem(TOKEN_KEY, newToken);
    }

    /**
     * 设置用户信息并持久化到 localStorage
     */
    function setUserInfo(info: UserInfo) {
      userInfo.value = info;
      isLoggedIn.value = true;
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
    }

    /**
     * 从 localStorage 恢复登录状态
     */
    function restoreLoginState() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUserInfo = localStorage.getItem(USER_INFO_KEY);

      if (savedToken && savedUserInfo) {
        try {
          token.value = savedToken;
          userInfo.value = JSON.parse(savedUserInfo);
          isLoggedIn.value = true;
          return true;
        } catch {
          // 解析失败，清除存储
          clearUserInfo();
          return false;
        }
      }
      return false;
    }

    /**
     * 清除用户信息和登录状态
     */
    function clearUserInfo() {
      token.value = '';
      userInfo.value = null;
      isLoggedIn.value = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_INFO_KEY);
    }

    /**
     * 登录
     * @param loginForm 登录表单
     */
    async function login(loginForm: { username: string; password: string; remember?: boolean }) {
      try {
        // TODO: 调用登录 API
        // const res = await loginApi(loginForm)

        // 模拟登录成功
        await delay(800); // 模拟网络延迟

        const mockToken = `mock_token_${Date.now()}`;
        const mockUserInfo: UserInfo = {
          id: 1,
          username: loginForm.username,
          nickname: '管理员',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          roles: ['admin'],
          permissions: ['*'],
        };

        // 保存到 store 和 localStorage
        setToken(mockToken);
        setUserInfo(mockUserInfo);

        // 记住用户名
        if (loginForm.remember) {
          localStorage.setItem('remember_username', loginForm.username);
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
      const hasToken = restoreLoginState();
      if (hasToken) {
        // 可以在这里调用 API 验证 token 是否有效
        // fetchUserInfo()
        console.log('已恢复登录状态');
      }
      return hasToken;
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
      restoreLoginState,
      login,
      logout,
      fetchUserInfo,
      initAuth,
      hasPermission,
      hasRole,
    };
  },
  {
    // Pinia 持久化配置（可选，如果使用了 pinia-plugin-persistedstate）
    // persist: true,
  }
);
