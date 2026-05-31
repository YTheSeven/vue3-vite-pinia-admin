import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark' | 'auto';

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const theme = ref<Theme>('auto');
  // 是否暗黑模式（计算后的实际状态）
  const isDark = ref(false);

  // 获取系统偏好
  const getSystemPreference = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 更新实际暗黑状态
  const updateDarkState = () => {
    if (theme.value === 'auto') {
      isDark.value = getSystemPreference();
    } else {
      isDark.value = theme.value === 'dark';
    }
  };

  // 应用主题到 DOM
  const applyTheme = () => {
    const html = document.documentElement;
    if (isDark.value) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    updateDarkState();
    applyTheme();
  };

  // 切换主题（light -> dark -> auto -> light）
  const toggleTheme = () => {
    const cycle: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = cycle.indexOf(theme.value);
    const nextTheme = cycle[(currentIndex + 1) % cycle.length];
    setTheme(nextTheme);
  };

  // 初始化主题
  const initTheme = () => {
    // 读取本地存储
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      theme.value = savedTheme;
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'auto') {
        updateDarkState();
        applyTheme();
      }
    });

    updateDarkState();
    applyTheme();
  };

  // 主题图标
  const themeIcon = computed(() => {
    switch (theme.value) {
      case 'light':
        return 'Sunny';
      case 'dark':
        return 'Moon';
      case 'auto':
        return 'SemiSelect';
      default:
        return 'Sunny';
    }
  });

  // 主题提示文本
  const themeText = computed(() => {
    switch (theme.value) {
      case 'light':
        return '浅色模式';
      case 'dark':
        return '深色模式';
      case 'auto':
        return '跟随系统';
      default:
        return '浅色模式';
    }
  });

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
    themeIcon,
    themeText,
  };
});
