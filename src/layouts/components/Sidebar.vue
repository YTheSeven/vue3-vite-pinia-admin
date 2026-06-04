<template>
  <!-- 桌面端：使用 el-aside -->
  <el-aside
    v-if="!isMobile"
    :width="isCollapse ? '64px' : '200px'"
    class="bg-slate-800 dark:bg-slate-950 transition-all duration-300 h-screen overflow-y-auto"
  >
    <sidebar-content
      :is-collapse="isCollapse"
      :active-menu="activeMenu"
      :menus="menus"
      @menu-select="emit('menu-select')"
    />
  </el-aside>

  <!-- 移动端：使用普通 div（在抽屉内部） -->
  <sidebar-content
    v-else
    :is-collapse="false"
    :active-menu="activeMenu"
    :menus="menus"
    class="h-full"
    @menu-select="emit('menu-select')"
  />
</template>

<script setup lang="ts">
  import SidebarContent from './SidebarContent.vue';

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

  withDefaults(
    defineProps<{
      isCollapse: boolean;
      activeMenu: string;
      menus: MenuItem[];
      isMobile?: boolean;
    }>(),
    {
      isMobile: false,
    }
  );

  const emit = defineEmits<{
    'menu-select': [];
  }>();
</script>
