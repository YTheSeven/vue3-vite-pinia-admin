/**
 * 图标映射工具
 * 将字符串图标名映射到 Element Plus 图标组件
 */

import type { Component } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

/**
 * 获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件或 null
 */
export function getIcon(iconName: string): Component | null {
  // 首字母大写转换（如 'home' -> 'Home'）
  const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

  // 尝试获取图标组件
  const iconComponent = (ElementPlusIconsVue as Record<string, Component>)[normalizedName];

  return iconComponent || null;
}

/**
 * 检查图标是否存在
 * @param iconName 图标名称
 */
export function hasIcon(iconName: string): boolean {
  return !!getIcon(iconName);
}

/**
 * 图标名称列表（用于调试）
 */
export function getAvailableIcons(): string[] {
  return Object.keys(ElementPlusIconsVue).filter(
    (key) => typeof (ElementPlusIconsVue as Record<string, unknown>)[key] === 'object'
  );
}
