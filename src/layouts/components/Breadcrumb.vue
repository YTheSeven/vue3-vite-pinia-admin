<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">
      <el-icon><HomeFilled /></el-icon>
      <span class="breadcrumb-text">首页</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { HomeFilled } from '@element-plus/icons-vue';

  interface BreadcrumbItem {
    path: string;
    title: string;
  }

  const route = useRoute();
  const breadcrumbs = ref<BreadcrumbItem[]>([]);

  const getBreadcrumbs = () => {
    const matched = route.matched.filter((item) => item.meta && item.meta.title);

    const items: BreadcrumbItem[] = [];

    matched.forEach((item) => {
      if (item.meta.title && item.path !== '/') {
        items.push({
          path: item.path,
          title: item.meta.title as string,
        });
      }
    });

    breadcrumbs.value = items;
  };

  // 监听路由变化
  watch(
    () => route.path,
    () => {
      getBreadcrumbs();
    },
    { immediate: true }
  );
</script>

<style scoped>
  .el-breadcrumb {
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  :deep(.el-breadcrumb__item) {
    display: flex;
    align-items: center;
  }

  :deep(.el-breadcrumb__inner) {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .breadcrumb-text {
    margin-left: 4px;
  }
</style>
