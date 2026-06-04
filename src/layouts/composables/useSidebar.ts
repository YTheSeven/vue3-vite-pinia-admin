import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '@/store/modules/permission';

// 移动端断点 (768px)
const MOBILE_BREAKPOINT = 768;

/**
 * 检测是否为移动端
 */
const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

/**
 * 侧边栏相关逻辑
 */
export function useSidebar() {
  const route = useRoute();
  const permissionStore = usePermissionStore();

  // 是否为移动端（初始值立即检测）
  const isMobile = ref(checkIsMobile());

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

  // 检测屏幕尺寸
  const checkMobile = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
    // 切换到移动端时自动折叠侧边栏
    if (isMobile.value) {
      isCollapse.value = true;
    }
  };

  // 监听窗口大小变化
  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
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
