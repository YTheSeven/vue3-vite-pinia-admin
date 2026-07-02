<script setup lang="ts">
  interface TimelineItem {
    year: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }

  interface Props {
    timeline: TimelineItem[];
  }

  defineProps<Props>();

  /** 获取图标 */
  const getIconSvg = (icon: string): string => {
    const icons: Record<string, string> = {
      beginner:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>',
      vue: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>',
      project:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>',
      opensource:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>',
      fullstack:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
    };
    return icons[icon] || icons.beginner;
  };
</script>

<template>
  <section class="relative py-24 bg-slate-950 overflow-hidden">
    <!-- 背景光效 -->
    <div class="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 区域标题 -->
      <div class="text-center mb-16" data-aos="fade-up">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            ></path>
          </svg>
          <span class="text-sm text-gray-300">成就已解锁</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          技能<span class="text-purple-400">树</span>
        </h2>
        <p class="text-gray-400">一路走来，解锁的不仅是技能，还有成长的喜悦</p>
      </div>

      <!-- 时间轴 -->
      <div class="relative">
        <!-- 中心线 -->
        <div
          class="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent hidden md:block"
        ></div>

        <!-- 时间轴项目 -->
        <div class="space-y-12">
          <div
            v-for="(item, index) in timeline"
            :key="item.year"
            class="relative"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <div
              class="flex flex-col md:flex-row items-center gap-8"
              :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
            >
              <!-- 内容卡片 -->
              <div
                class="flex-1 w-full"
                :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'"
              >
                <div
                  class="inline-block p-6 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-sm hover:bg-white/6 transition-all duration-300 group"
                >
                  <!-- 年份标签 -->
                  <div
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r text-xs font-medium mb-3"
                    :class="
                      item.unlocked
                        ? 'from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'from-gray-500/20 to-gray-600/20 text-gray-500 border border-gray-500/30'
                    "
                  >
                    <svg
                      v-if="item.unlocked"
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span v-else class="w-3 h-3 rounded-full bg-gray-600"></span>
                    {{ item.year }}
                  </div>

                  <!-- 标题 -->
                  <h3
                    class="text-xl font-bold mb-2"
                    :class="item.unlocked ? 'text-white' : 'text-gray-500'"
                  >
                    {{ item.title }}
                  </h3>

                  <!-- 描述 -->
                  <p class="text-sm text-gray-400 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>

              <!-- 中心图标 -->
              <div class="relative z-10 shrink-0 hidden md:block">
                <div
                  class="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                  :class="
                    item.unlocked
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                  "
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    v-html="getIconSvg(item.icon)"
                  ></svg>
                </div>
                <!-- 解锁光效 -->
                <div
                  v-if="item.unlocked"
                  class="absolute inset-0 rounded-full bg-purple-500/30 blur-xl animate-pulse"
                ></div>
              </div>

              <!-- 空白占位 -->
              <div class="flex-1 hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 未来提示 -->
      <div class="mt-16 text-center" data-aos="fade-up" data-aos-delay="500">
        <div
          class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-dashed border-white/20"
        >
          <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <span class="text-gray-500 text-sm">更多成就待解锁...</span>
        </div>
      </div>
    </div>
  </section>
</template>
