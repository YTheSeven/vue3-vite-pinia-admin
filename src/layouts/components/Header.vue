<script setup lang="ts">
  import {
    Fold,
    Expand,
    FullScreen,
    ArrowDown,
    User,
    Setting,
    SwitchButton,
    Sunny,
    Moon,
    Menu,
  } from '@element-plus/icons-vue';
  import Breadcrumb from './Breadcrumb.vue';

  defineProps<{
    isCollapse: boolean;
    isDark: boolean;
    themeText: string;
    displayName: string;
    avatar?: string;
  }>();

  const emit = defineEmits<{
    'toggle-collapse': [];
    'toggle-theme': [];
    'toggle-fullscreen': [];
    'open-menu': [];
    command: [string];
  }>();

  const handleCommand = (command: string) => {
    emit('command', command);
  };
</script>

<template>
  <el-header
    class="h-15 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-700/50 flex items-center justify-between px-4 md:px-5"
  >
    <!-- 左侧区域 -->
    <div class="flex items-center gap-3 md:gap-4">
      <!-- 桌面端：侧边栏折叠按钮 -->
      <el-icon
        class="hidden! md:block! text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        @click="emit('toggle-collapse')"
      >
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>

      <!-- 手机端：汉堡菜单按钮 -->
      <el-icon
        class="md:hidden! text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        @click="emit('open-menu')"
      >
        <Menu />
      </el-icon>

      <!-- 面包屑 -->
      <breadcrumb />
    </div>

    <!-- 右侧区域：工具栏 -->
    <div class="flex items-center gap-3 md:gap-5">
      <!-- 主题切换（手机端和桌面端都显示） -->
      <el-tooltip :content="themeText" placement="bottom">
        <el-icon
          class="text-lg md:text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          @click="emit('toggle-theme')"
        >
          <Sunny v-if="!isDark" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>

      <!-- 全屏按钮（仅桌面端显示） -->
      <el-tooltip content="全屏" placement="bottom">
        <el-icon
          class="hidden! md:block! text-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          @click="emit('toggle-fullscreen')"
        >
          <FullScreen />
        </el-icon>
      </el-tooltip>

      <!-- 用户菜单 -->
      <el-dropdown @command="handleCommand" placement="bottom-end">
        <div
          class="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <el-avatar :size="28" :src="avatar" class="md:w-8 md:h-8" />
          <!-- 用户名（仅桌面端显示） -->
          <span class="hidden md:block text-sm text-gray-600 dark:text-gray-300 max-w-25 truncate">
            {{ displayName }}
          </span>
          <el-icon class="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- 手机端显示用户信息（在菜单顶部） -->
            <div class="md:hidden px-4 py-2 border-b border-gray-200 dark:border-gray-700 mb-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ displayName }}</p>
            </div>
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
</template>
