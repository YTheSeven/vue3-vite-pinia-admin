import { useThemeStore } from '@/store/modules/theme';

/**
 * 主题管理组合式函数
 * 初始化主题并监听系统偏好变化
 */
export function useTheme() {
  const themeStore = useThemeStore();

  onMounted(() => {
    // 初始化主题
    themeStore.initTheme();
  });

  return {
    theme: themeStore.theme,
    isDark: themeStore.isDark,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
    themeIcon: themeStore.themeIcon,
    themeText: themeStore.themeText,
  };
}
