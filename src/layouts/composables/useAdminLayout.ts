import { useSidebar } from './useSidebar';
import { useUser } from './useUser';
import { useFullscreen } from './useFullscreen';
import { useThemeStore } from '@/store/modules/theme';

/**
 * AdminLayout 统一入口
 *
 * 整合所有布局相关的逻辑，为 AdminLayout.vue 提供单一的数据源
 */
export function useAdminLayout() {
  // Store
  const themeStore = useThemeStore();

  // 侧边栏逻辑（包含移动端响应式）
  const {
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
  } = useSidebar();

  // 用户相关逻辑
  const { userStore, displayName, handleCommand } = useUser();

  // 全屏逻辑
  const { toggleFullscreen } = useFullscreen();

  return {
    // Theme
    themeStore,

    // Sidebar
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

    // User
    userStore,
    displayName,
    handleCommand,

    // Fullscreen
    toggleFullscreen,
  };
}
