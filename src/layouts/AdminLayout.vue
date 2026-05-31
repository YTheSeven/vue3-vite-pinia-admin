<template>
  <el-container class="min-h-screen bg-gray-100 dark:bg-slate-900">
    <!-- 侧边栏 -->
    <el-aside
      :width="isCollapse ? '64px' : '200px'"
      class="bg-slate-800 dark:bg-slate-950 transition-all duration-300 h-screen overflow-y-auto"
    >
      <div
        class="h-15 flex items-center justify-center px-4 border-b border-slate-900 dark:border-slate-800"
      >
        <el-icon :size="32" color="#409EFF"><ElementPlus /></el-icon>
        <span
          v-show="!isCollapse"
          class="ml-3 text-base font-semibold text-white whitespace-nowrap"
        >
          管理系统
        </span>
      </div>

      <el-scrollbar class="h-[calc(100vh-60px)]!">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          class="border-r-0! bg-slate-800! dark:bg-slate-950!"
          background-color="transparent"
          text-color="#94a3b8"
          active-text-color="#60a5fa"
        >
          <!-- 动态菜单 -->
          <sidebar-menu :menus="sidebarMenus" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="bg-gray-100 dark:bg-slate-900 h-screen overflow-y-auto">
      <!-- 顶部导航栏 -->
      <el-header
        class="h-15 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-700/50 flex items-center justify-between px-5"
      >
        <div class="flex items-center gap-4">
          <el-icon
            class="text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            @click="toggleCollapse"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <breadcrumb />
        </div>

        <div class="flex items-center gap-5">
          <el-tooltip :content="themeStore.themeText" placement="bottom">
            <el-icon
              class="text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              @click="themeStore.toggleTheme"
            >
              <Sunny v-if="!themeStore.isDark" />
              <Moon v-else />
            </el-icon>
          </el-tooltip>

          <el-tooltip content="全屏" placement="bottom">
            <el-icon
              class="text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              @click="toggleFullscreen"
            >
              <FullScreen />
            </el-icon>
          </el-tooltip>

          <el-dropdown @command="handleCommand">
            <div
              class="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
              <span class="text-sm text-gray-600 dark:text-gray-300 max-w-25 truncate">{{
                displayName
              }}</span>
              <el-icon class="text-gray-600 dark:text-gray-400"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="p-5 overflow-auto bg-gray-100 dark:bg-slate-900">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    ElementPlus,
    Fold,
    Expand,
    FullScreen,
    ArrowDown,
    User,
    Setting,
    SwitchButton,
    Sunny,
    Moon,
  } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useThemeStore } from '@/store/modules/theme';
  import Breadcrumb from './components/Breadcrumb.vue';
  import SidebarMenu from './components/SidebarMenu.vue';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const themeStore = useThemeStore();

  // 侧边栏折叠状态
  const isCollapse = ref(false);

  // 当前激活的菜单
  const activeMenu = computed(() => route.path);

  // 侧边栏菜单（从 permission store 获取）
  const sidebarMenus = computed(() => permissionStore.getSidebarMenus);

  // 显示的用户名（昵称优先，然后是用户名）
  const displayName = computed(() => {
    const info = userStore.userInfo;
    return info?.nickname || info?.username || '用户';
  });

  // 切换侧边栏
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      await userStore.logout();
      ElMessage.success('已退出登录');
      router.push('/login');
    } catch {
      // 取消退出
    }
  };

  // 处理下拉菜单命令
  const handleCommand = (command: string) => {
    switch (command) {
      case 'profile':
        router.push('/user/profile');
        break;
      case 'settings':
        router.push('/user/settings');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };
</script>

<style scoped>
  /* 页面切换动画 */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.3s;
  }

  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-20px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
</style>
