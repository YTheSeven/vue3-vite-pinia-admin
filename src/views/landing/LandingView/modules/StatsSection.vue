<script setup lang="ts">
  interface StatItem {
    label: string;
    value: number;
    suffix: string;
    icon: string;
    color: string;
  }

  interface Props {
    stats: StatItem[];
  }

  defineProps<Props>();

  /** 获取图标 SVG */
  const getIconSvg = (icon: string): string => {
    const icons: Record<string, string> = {
      code: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
      github:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
      coffee:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>',
      bug: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    };
    return icons[icon] || icons.code;
  };
</script>

<template>
  <section id="stats-section" class="relative py-24 bg-slate-950">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      ></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 区域标题 -->
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          代码<span class="text-blue-400">人生</span>
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto">
          每一行代码都是一段旅程，每一个 Bug 都是一次成长
        </p>
      </div>

      <!-- 统计数据网格 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="group relative p-6 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-sm hover:bg-white/5 hover:border-white/10 transition-all duration-500"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 100"
        >
          <!-- 图标 -->
          <div
            class="w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            :class="stat.color"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              v-html="getIconSvg(stat.icon)"
            ></svg>
          </div>

          <!-- 数值 -->
          <div class="flex items-baseline gap-1 mb-2">
            <span class="text-3xl sm:text-4xl font-bold text-white tabular-nums">
              {{ stat.value.toLocaleString() }}
            </span>
            <span class="text-lg text-gray-400">{{ stat.suffix }}</span>
          </div>

          <!-- 标签 -->
          <div class="text-sm text-gray-500">{{ stat.label }}</div>

          <!-- 悬停光效 -->
          <div
            class="absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            :class="stat.color"
          ></div>
        </div>
      </div>

      <!-- 趣味提示 -->
      <div class="mt-12 text-center" data-aos="fade-up" data-aos-delay="400">
        <p class="text-sm text-gray-600 italic">
          * 数据统计自 2020 年开始的编程之旅，持续更新中...
        </p>
      </div>
    </div>
  </section>
</template>
