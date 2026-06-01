import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark' | 'auto';

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const theme = ref<Theme>('auto');
  // 是否暗黑模式（计算后的实际状态）
  const isDark = ref(false);

  // 获取系统偏好 - 增强兼容性版本
  const getSystemPreference = (): boolean => {
    try {
      // 方法1: 标准 prefers-color-scheme 媒体查询（现代浏览器都支持）
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }

      // 方法2: 检查是否支持媒体查询但不匹配（可能是浅色模式）
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return false;
      }

      // 方法3: 针对 Win11/Edge 的特殊处理
      // Win11 使用 Windows 颜色设置，有时浏览器返回不准确的值
      // 通过检查多个媒体查询来提高准确性
      if (window.matchMedia) {
        // 检查颜色方案是否为深色
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme)');
        if (colorSchemeQuery.media !== 'not all') {
          // 浏览器支持 prefers-color-scheme，但前面已经检查过了
          // 如果没匹配到 dark，则认为是 light
          return false;
        }
      }

      // 方法4: 基于时间的后备方案
      // 如果浏览器不支持 prefers-color-scheme，默认根据时间判断
      const hour = new Date().getHours();
      // 晚上 6 点到早上 6 点视为深色模式
      return hour >= 18 || hour < 6;
    } catch (e) {
      // 任何错误情况下，默认返回浅色模式
      console.warn('无法检测系统主题偏好，使用默认浅色模式', e);
      return false;
    }
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

    // 监听系统主题变化（如果浏览器支持）
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      // 使用 addEventListener 并检查浏览器支持
      const addChangeListener = () => {
        try {
          mediaQuery.addEventListener('change', () => {
            if (theme.value === 'auto') {
              updateDarkState();
              applyTheme();
            }
          });
        } catch (err) {
          console.warn('浏览器不支持 addEventListener，尝试使用 addListener', err);
          // 旧版浏览器可能只支持 addListener
          try {
            (
              mediaQuery as MediaQueryList & { addListener: (callback: () => void) => void }
            ).addListener(() => {
              if (theme.value === 'auto') {
                updateDarkState();
                applyTheme();
              }
            });
          } catch (err) {
            console.warn('浏览器不支持主题变化监听', err);
          }
        }
      };
      addChangeListener();
    }

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
