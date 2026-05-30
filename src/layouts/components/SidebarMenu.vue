<template>
  <template v-for="menu in menus" :key="menu.path">
    <!-- 有子菜单的情况 -->
    <el-sub-menu v-if="hasChildren(menu)" :index="menu.path">
      <template #title>
        <el-icon v-if="menu.meta?.icon">
          <component :is="getIcon(menu.meta.icon)" />
        </el-icon>
        <span>{{ menu.meta?.title }}</span>
      </template>
      <!-- 递归渲染子菜单 -->
      <template v-if="menu.children">
        <sidebar-menu :menus="menu.children" :item-class="itemClass" />
      </template>
    </el-sub-menu>

    <!-- 无子菜单的情况 -->
    <el-menu-item v-else :index="menu.path" :class="itemClass">
      <el-icon v-if="menu.meta?.icon">
        <component :is="getIcon(menu.meta.icon)" />
      </el-icon>
      <template #title>{{ menu.meta?.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
  import * as ElementPlusIconsVue from '@element-plus/icons-vue';
  import type { Component } from 'vue';

  // 动态路由菜单项接口
  interface MenuItem {
    path: string;
    name?: string;
    component?: string;
    meta?: {
      title: string;
      icon?: string;
      roles?: string[];
      permissions?: string[];
      keepAlive?: boolean;
      hidden?: boolean;
    };
    children?: MenuItem[];
  }

  // 图标组件缓存
  const iconCache = new Map<string, Component>();

  // 获取图标组件
  const getIconComponent = (iconName: string): Component => {
    if (iconCache.has(iconName)) {
      return iconCache.get(iconName)!;
    }

    const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const iconComponent = (ElementPlusIconsVue as Record<string, Component>)[normalizedName];

    if (iconComponent) {
      iconCache.set(iconName, iconComponent);
      return iconComponent;
    }

    return ElementPlusIconsVue.Menu;
  };

  // Props 定义
  withDefaults(
    defineProps<{
      menus: MenuItem[];
      itemClass?: string;
    }>(),
    {
      itemClass: '!h-[50px] !leading-[50px] hover:!bg-slate-700',
    }
  );

  // 判断菜单是否有子菜单
  const hasChildren = (menu: MenuItem): boolean => {
    return !!(menu.children && menu.children.length > 0);
  };

  // 获取图标组件
  const getIcon = (iconName: string): Component => {
    return getIconComponent(iconName);
  };
</script>

<style scoped>
  :deep(.el-sub-menu__title) {
    height: 50px !important;
    line-height: 50px !important;
  }

  :deep(.el-sub-menu__title:hover) {
    background-color: rgb(51 65 85) !important;
  }

  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
  }

  :deep(.el-menu-item.is-active) {
    background-color: rgb(59 130 246 / 0.1) !important;
    border-right: 3px solid #60a5fa;
  }

  :deep(.el-sub-menu .el-menu-item) {
    padding-left: 50px !important;
  }

  :deep(.el-sub-menu .el-sub-menu .el-sub-menu__title) {
    padding-left: 50px !important;
  }
</style>
