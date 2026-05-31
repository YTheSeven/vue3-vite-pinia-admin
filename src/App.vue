<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
  import { useTheme } from '@/composables/useTheme';

  // 初始化主题
  useTheme();
</script>

<style>
  /* 全局样式 */
</style>
