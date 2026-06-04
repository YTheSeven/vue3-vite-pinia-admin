<template>
  <el-main class="p-5 overflow-auto bg-gray-100 dark:bg-slate-900">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-main>
</template>

<script setup lang="ts"></script>

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
