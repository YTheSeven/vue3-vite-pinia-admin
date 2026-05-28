import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('');
  const userInfo = ref<UserInfo | null>(null);
  const isLoggedIn = ref<boolean>(false);

  // Getters
  const getToken = computed(() => token.value);
  const getUserInfo = computed(() => userInfo.value);
  const getIsLoggedIn = computed(() => isLoggedIn.value);
  const getUserRoles = computed(() => userInfo.value?.roles ?? []);
  const getUserPermissions = computed(() => userInfo.value?.permissions ?? []);

  // Actions
  function setToken(newToken: string) {
    token.value = newToken;
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
    isLoggedIn.value = true;
  }

  function clearUserInfo() {
    token.value = '';
    userInfo.value = null;
    isLoggedIn.value = false;
  }

  // 登录
  async function login(loginForm: { username: string; password: string }) {
    try {
      // TODO: 调用登录 API
      // const res = await loginApi(loginForm)
      // setToken(res.token)
      // setUserInfo(res.userInfo)
      console.log('登录成功', loginForm);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 登出
  function logout() {
    clearUserInfo();
    // TODO: 调用登出 API
    console.log('登出成功');
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      // TODO: 调用获取用户信息 API
      // const res = await getUserInfoApi()
      // setUserInfo(res)
      console.log('获取用户信息成功');
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return {
    // State
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
  };
});
