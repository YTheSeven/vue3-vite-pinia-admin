import { useWindowSize } from '@vueuse/core';
import type { Ref, ComputedRef } from 'vue';

export interface UseDeviceOptions {
  /** 移动端断点，默认 640px (Tailwind sm) */
  mobileBreakpoint?: number;
  /** 桌面端断点，默认 1024px (Tailwind lg) */
  desktopBreakpoint?: number;
}

export interface UseDeviceReturn {
  /** 是否为移动端 */
  isMobile: ComputedRef<boolean>;
  /** 是否为平板 */
  isTablet: ComputedRef<boolean>;
  /** 是否为桌面端 */
  isDesktop: ComputedRef<boolean>;
  /** 屏幕宽度 */
  width: Ref<number>;
  /** 屏幕高度 */
  height: Ref<number>;
}

/**
 * 设备响应式检测 Hook
 * @param options - 可选配置
 * @returns 设备类型和屏幕尺寸
 */
export function useDevice(options: UseDeviceOptions = {}): UseDeviceReturn {
  const { mobileBreakpoint = 640, desktopBreakpoint = 1024 } = options;
  const { width, height } = useWindowSize();

  // 断点定义
  const isMobile = computed(() => width.value < mobileBreakpoint);
  const isTablet = computed(
    () => width.value >= mobileBreakpoint && width.value < desktopBreakpoint
  );
  const isDesktop = computed(() => width.value >= desktopBreakpoint);

  return {
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
  };
}
