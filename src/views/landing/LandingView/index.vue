<script setup lang="ts">
  import { useLandingView } from './useLandingView';
  import HeroSection from './modules/HeroSection.vue';
  import StatsSection from './modules/StatsSection.vue';
  import TimelineSection from './modules/TimelineSection.vue';
  import TechStackSection from './modules/TechStackSection.vue';
  import ProjectsSection from './modules/ProjectsSection.vue';
  import FooterSection from './modules/FooterSection.vue';

  // ==========================================
  // 页面逻辑
  // ==========================================

  const { typewriterText, currentSubtitle, animatedStats, timeline, techStack, projects } =
    useLandingView();
</script>

<template>
  <div
    class="landing-page min-h-screen w-full bg-slate-50 text-gray-900 dark:bg-slate-950 dark:text-white sm:px-0 md:px-0 lg:px-0"
  >
    <!-- Hero 区域 -->
    <HeroSection :typewriter-text="typewriterText" :current-subtitle="currentSubtitle" />

    <!-- 统计数据 -->
    <StatsSection :stats="animatedStats" />

    <!-- 技能树时间轴 -->
    <TimelineSection :timeline="timeline" />

    <!-- 技术栈 -->
    <TechStackSection :tech-stack="techStack" />

    <!-- 项目展示 -->
    <ProjectsSection :projects="projects" />

    <!-- 页脚 -->
    <FooterSection />
  </div>
</template>

<style scoped>
  /* 页面级样式 */
  .landing-page {
    /* 确保平滑滚动 */
    scroll-behavior: smooth;
  }

  /* 选中文本样式 - 适配暗黑模式 */
  ::selection {
    background: rgba(59, 130, 246, 0.3);
    color: white;
  }

  /* 深色模式选中文本 */
  :deep(.dark) ::selection {
    background: rgba(96, 165, 250, 0.4);
    color: white;
  }
</style>
