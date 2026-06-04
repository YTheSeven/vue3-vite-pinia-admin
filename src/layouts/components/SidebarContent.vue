<template>
  <div class="bg-slate-800 dark:bg-slate-950 h-full flex flex-col">
    <!-- Logo区域 -->
    <div
      class="h-15 flex items-center justify-center px-4 border-b border-slate-900 dark:border-slate-800"
    >
      <el-icon :size="32" color="#409EFF"><ElementPlus /></el-icon>
      <span v-show="!isCollapse" class="ml-3 text-base font-semibold text-white whitespace-nowrap">
        管理系统
      </span>
    </div>

    <!-- 菜单区域 -->
    <el-scrollbar class="flex-1">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="border-r-0! bg-slate-800! dark:bg-slate-950!"
        background-color="transparent"
        text-color="#94a3b8"
        active-text-color="#60a5fa"
        @select="handleSelect"
      >
        <sidebar-menu :menus="menus" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { ElementPlus } from '@element-plus/icons-vue';
  import SidebarMenu from './SidebarMenu.vue';

  // 从SidebarMenu组件导入类型
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

  defineProps<{
    isCollapse: boolean;
    activeMenu: string;
    menus: MenuItem[];
  }>();

  const emit = defineEmits<{
    'menu-select': [];
  }>();

  // 处理菜单选择（移动端点击后关闭抽屉）
  const handleSelect = () => {
    emit('menu-select');
  };
</script>
