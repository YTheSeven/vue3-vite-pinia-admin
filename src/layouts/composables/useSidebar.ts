import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore } from '@/store/modules/user';
import { useDevice } from '@/composables/useDevice';
import { resetRouter, addDynamicRoutes } from '@/router';

/**
 * 侧边栏相关逻辑
 */
export function useSidebar() {
  const route = useRoute();
  const router = useRouter();
  const permissionStore = usePermissionStore();
  const userStore = useUserStore();

  // 使用 useDevice 进行移动端检测，保持原有 768px 断点
  const { isMobile } = useDevice({ mobileBreakpoint: 768 });

  // 侧边栏折叠状态（桌面端）
  const isCollapse = ref(isMobile.value);

  // 移动端抽屉显示状态
  const showDrawer = ref(false);

  // 刷新权限加载状态
  const isRefreshing = ref(false);

  // 当前激活的菜单
  const activeMenu = computed(() => route.path);

  // 侧边栏菜单（从 permission store 获取）
  const sidebarMenus = computed(() => permissionStore.getSidebarMenus);

  // 切换侧边栏（桌面端）
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  // 打开抽屉（移动端）
  const openDrawer = () => {
    showDrawer.value = true;
  };

  // 关闭抽屉（移动端）
  const closeDrawer = () => {
    showDrawer.value = false;
  };

  // 监听到移动端时自动折叠侧边栏
  watch(isMobile, (mobile) => {
    if (mobile) {
      isCollapse.value = true;
    }
  });

  // 刷新权限（重新生成路由和菜单）
  const refreshPermission = async () => {
    if (isRefreshing.value) return;

    isRefreshing.value = true;

    try {
      // 1. 重置路由
      resetRouter();

      // 2. 重置 permission store 状态
      permissionStore.resetRoutes();

      // 3. 更新用户权限信息（从 mockPermissionStore 重新获取）
      const username = userStore.getUserInfo?.username;
      if (username) {
        const mockPermissionStore = (
          await import('@/store/modules/mockPermission')
        ).useMockPermissionStore();
        const newRoles = mockPermissionStore.getUserRoleCodes(username);
        const newPermissions = mockPermissionStore.getUserPermissions(username);

        // 更新用户信息中的角色和权限
        if (userStore.userInfo) {
          userStore.userInfo.roles = newRoles;
          userStore.userInfo.permissions = newPermissions;
        }
      }

      // 4. 重新生成并添加路由
      await addDynamicRoutes();

      ElMessage.success('权限已刷新');

      // 5. 如果当前页面不再可访问，跳转到首页
      const currentRouteName = route.name as string;
      if (currentRouteName && currentRouteName !== 'Dashboard') {
        const hasAccess = permissionStore.getDynamicRoutes.some((r) => r.name === currentRouteName);
        if (!hasAccess) {
          void router.push('/dashboard');
          ElMessage.warning('当前页面已无权访问，已跳转至首页');
        }
      }
    } catch (error) {
      console.error('刷新权限失败:', error);
      ElMessage.error('刷新权限失败，请重新登录');
    } finally {
      isRefreshing.value = false;
    }
  };

  return {
    isCollapse,
    isMobile,
    showDrawer,
    isRefreshing,
    activeMenu,
    sidebarMenus,
    toggleCollapse,
    openDrawer,
    closeDrawer,
    refreshPermission,
  };
}
