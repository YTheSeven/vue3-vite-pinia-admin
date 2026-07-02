<script setup lang="ts">
  import { useRouter } from 'vue-router';

  interface Props {
    typewriterText: string;
    currentSubtitle: string;
  }

  defineProps<Props>();

  const router = useRouter();

  /** 跳转到演示系统 */
  const goToDemo = (): void => {
    router.push('/login');
  };

  /** 滚动到下一区域 */
  const scrollToNext = (): void => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
</script>

<template>
  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
  >
    <!-- 动态背景 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 渐变网格 -->
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      ></div>
      <!-- 光晕效果 -->
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-cyan-500/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 内容区域 -->
    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <!-- 角色标签 -->
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        data-aos="fade-down"
        data-aos-delay="200"
      >
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm text-gray-300">在线中 • 接受新挑战</span>
      </div>

      <!-- 主标题 - 打字机效果 -->
      <h1
        class="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        data-aos="zoom-in"
        data-aos-delay="400"
      >
        <span
          class="bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {{ typewriterText }}
        </span>
        <span class="inline-block w-1 h-12 sm:h-16 lg:h-20 bg-cyan-400 ml-2 animate-pulse"></span>
      </h1>

      <!-- 副标题 -->
      <p
        v-if="currentSubtitle"
        class="text-xl sm:text-2xl text-gray-400 mb-4 font-light"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        {{ currentSubtitle }}
      </p>

      <!-- 简介 -->
      <p
        class="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        data-aos="fade-up"
        data-aos-delay="700"
      >
        热爱 Vue 生态的前端开发者，专注于构建优雅且高性能的用户界面。
        相信代码是艺术，也是与机器对话的方式。
      </p>

      <!-- 角色属性面板 - 游戏风格 -->
      <div
        class="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12"
        data-aos="fade-up"
        data-aos-delay="800"
      >
        <div class="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div class="text-xs text-gray-500 mb-1">等级</div>
          <div class="text-xl font-bold text-yellow-400">Lv.24</div>
        </div>
        <div class="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div class="text-xs text-gray-500 mb-1">职业</div>
          <div class="text-xl font-bold text-blue-400">Frontend</div>
        </div>
        <div class="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div class="text-xs text-gray-500 mb-1">阵营</div>
          <div class="text-xl font-bold text-green-400">Vue.js</div>
        </div>
      </div>

      <!-- CTA 按钮 -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4"
        data-aos="fade-up"
        data-aos-delay="900"
      >
        <button
          class="group relative px-8 py-4 rounded-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
          @click="goToDemo"
        >
          <span class="flex items-center gap-2">
            <span>查看演示系统</span>
            <svg
              class="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </span>
        </button>
        <button
          class="px-8 py-4 rounded-full border border-white/20 text-gray-300 font-medium transition-all duration-300 hover:bg-white/5 hover:border-white/30"
          @click="scrollToNext"
        >
          了解更多
        </button>
      </div>
    </div>

    <!-- 向下滚动提示 -->
    <div
      class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      data-aos="fade-in"
      data-aos-delay="1200"
    >
      <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        ></path>
      </svg>
    </div>
  </section>
</template>

<style scoped>
  /* 额外的动画效果 */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
</style>
