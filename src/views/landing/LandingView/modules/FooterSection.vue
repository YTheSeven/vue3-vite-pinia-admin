<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  /** 跳转到演示系统 */
  const goToDemo = (): void => {
    router.push('/login');
  };

  /** 返回顶部 */
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** 社交链接 */
  const socialLinks = [
    {
      name: 'GitHub',
      icon: '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>',
      url: 'https://github.com',
    },
    {
      name: 'Twitter',
      icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>',
      url: 'https://twitter.com',
    },
    {
      name: 'Email',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>',
      url: 'mailto:hello@ytheseven.dev',
    },
  ];
</script>

<template>
  <footer class="relative py-20 bg-slate-950 overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      ></div>
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- CTA 区域 -->
      <div class="mb-16" data-aos="fade-up">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">准备好开始了吗？</h2>
        <p class="text-gray-400 mb-8 max-w-xl mx-auto">
          这里展示了一个完整的管理系统演示，包含权限管理、数据可视化等实用功能。 欢迎体验！
        </p>

        <button
          class="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
          @click="goToDemo"
        >
          <span>进入演示系统</span>
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
        </button>

        <p class="mt-4 text-sm text-gray-500">演示账号: admin / 123456</p>
      </div>

      <!-- 社交链接 -->
      <div class="flex justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="100">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          :title="social.name"
        >
          <svg
            class="w-5 h-5"
            :fill="social.name === 'Email' ? 'none' : 'currentColor'"
            stroke="social.name === 'Email' ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            v-html="social.icon"
          ></svg>
        </a>
      </div>

      <!-- 版权信息 -->
      <div class="text-center" data-aos="fade-up" data-aos-delay="200">
        <p class="text-gray-600 text-sm mb-2">
          Built with
          <span class="text-red-400">♥</span>
          using Vue 3 & Tailwind CSS
        </p>
        <p class="text-gray-700 text-xs">
          © {{ new Date().getFullYear() }} YTheSeven. All rights reserved.
        </p>
      </div>

      <!-- 返回顶部 -->
      <button
        class="mt-12 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-300 mx-auto"
        @click="scrollToTop"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          ></path>
        </svg>
      </button>
    </div>
  </footer>
</template>
