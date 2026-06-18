<template>
  <el-container class="min-h-screen bg-gray-100 dark:bg-slate-900">
    <!-- 桌面端侧边栏 -->
    <sidebar
      v-if="!isMobile"
      :is-collapse="isCollapse"
      :active-menu="activeMenu"
      :menus="sidebarMenus"
      :is-mobile="false"
    />

    <!-- 移动端抽屉侧边栏 -->
    <el-drawer
      v-else
      v-model="showDrawer"
      direction="ltr"
      size="70%"
      :with-header="false"
      class="mobile-sidebar-drawer"
      @close="closeDrawer"
    >
      <sidebar
        :is-collapse="false"
        :active-menu="activeMenu"
        :menus="sidebarMenus"
        :is-mobile="true"
        @menu-select="closeDrawer"
      />
    </el-drawer>

    <el-container class="bg-gray-100 dark:bg-slate-900 h-screen overflow-y-auto flex-col!">
      <!-- 顶部导航栏 -->
      <layout-header
        :is-collapse="isCollapse"
        :is-dark="themeStore.isDark"
        :theme-text="themeStore.themeText"
        :display-name="displayName"
        :avatar="userStore.userInfo?.avatar"
        :is-refreshing="isRefreshing"
        @toggle-collapse="toggleCollapse"
        @toggle-theme="themeStore.toggleTheme"
        @toggle-fullscreen="toggleFullscreen"
        @open-menu="openDrawer"
        @refresh-permission="refreshPermission"
        @command="handleCommand"
      />

      <!-- 主内容区 -->
      <main-content />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  // 布局组件
  import Sidebar from './components/Sidebar.vue';
  import LayoutHeader from './components/Header.vue';
  import MainContent from './components/MainContent.vue';

  // 统一入口 composable
  import { useAdminLayout } from './composables/useAdminLayout';

  // 解构所有需要的响应式数据和方法
  const {
    // Theme
    themeStore,

    // Sidebar
    isCollapse,
    isMobile,
    showDrawer,
    isRefreshing,
    activeMenu,
    sidebarMenus,
    toggleCollapse,
    openDrawer,
    closeDrawer,
    refreshPermission,

    // User
    userStore,
    displayName,
    handleCommand,

    // Fullscreen
    toggleFullscreen,
  } = useAdminLayout();
</script>

<style>
  /* 移动端抽屉样式优化 */
  .mobile-sidebar-drawer .el-drawer__body {
    padding: 0 !important;
    overflow: hidden !important;
  }

  .mobile-sidebar-drawer .el-drawer {
    background-color: rgb(30 41 59) !important;
  }
</style>
