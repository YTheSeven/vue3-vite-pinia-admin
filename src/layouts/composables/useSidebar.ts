import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '@/store/modules/permission';
import { useDevice } from '@/composables/useDevice';

/**
 * 侧边栏相关逻辑
 */
export function useSidebar() {
  const route = useRoute();
  const permissionStore = usePermissionStore();

  // 使用 useDevice 进行移动端检测，保持原有 768px 断点
  const { isMobile } = useDevice({ mobileBreakpoint: 768 });

  // 侧边栏折叠状态（桌面端）
  const isCollapse = ref(isMobile.value);

  // 移动端抽屉显示状态
  const showDrawer = ref(false);

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

  return {
    isCollapse,
    isMobile,
    showDrawer,
    activeMenu,
    sidebarMenus,
    toggleCollapse,
    openDrawer,
    closeDrawer,
  };
}
