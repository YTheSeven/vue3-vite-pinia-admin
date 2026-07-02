<script setup lang="ts">
  interface ProjectItem {
    name: string;
    description: string;
    tags: string[];
    github?: string;
    demo?: string;
    image?: string;
  }

  interface Props {
    projects: ProjectItem[];
  }

  defineProps<Props>();

  /** 获取项目渐变背景 */
  const getProjectGradient = (index: number): string => {
    const gradients = [
      'from-blue-500/20 to-purple-500/20',
      'from-green-500/20 to-cyan-500/20',
      'from-orange-500/20 to-pink-500/20',
      'from-purple-500/20 to-pink-500/20',
    ];
    return gradients[index % gradients.length];
  };

  /** 获取标签颜色 */
  const getTagColor = (index: number): string => {
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-green-500/20 text-green-400 border-green-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    ];
    return colors[index % colors.length];
  };
</script>

<template>
  <section class="relative py-24 bg-slate-950 overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gradient-radial from-white/2 to-transparent rounded-full"
      ></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 区域标题 -->
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          作品<span class="text-green-400">展示</span>
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto">每一个项目都是一次冒险，记录着我的成长轨迹</p>
      </div>

      <!-- 项目网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(project, index) in projects"
          :key="project.name"
          class="group relative rounded-2xl overflow-hidden bg-white/2 border border-white/5 hover:border-white/10 transition-all duration-500"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 100"
        >
          <!-- 项目封面 -->
          <div
            class="h-48 bg-linear-to-br flex items-center justify-center relative overflow-hidden"
            :class="getProjectGradient(index)"
          >
            <!-- 装饰图案 -->
            <div class="absolute inset-0 opacity-30">
              <div
                class="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"
              ></div>
              <div
                class="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-lg rotate-45"
              ></div>
            </div>

            <!-- 项目图标 -->
            <div
              class="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20 group-hover:scale-110 transition-transform duration-300"
            >
              {{ ['🚀', '🎨', '📦', '📝'][index % 4] }}
            </div>

            <!-- 悬停遮罩 -->
            <div
              class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4"
            >
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="查看源码"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  ></path>
                </svg>
              </a>
              <a
                v-if="project.demo"
                :href="project.demo"
                class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="查看演示"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- 项目信息 -->
          <div class="p-6">
            <h3
              class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
            >
              {{ project.name }}
            </h3>
            <p class="text-sm text-gray-400 mb-4 leading-relaxed">
              {{ project.description }}
            </p>

            <!-- 技术标签 -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, tagIndex) in project.tags"
                :key="tag"
                class="px-2 py-1 rounded-md text-xs border"
                :class="getTagColor(tagIndex)"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 边框光效 -->
          <div
            class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            :class="`bg-linear-to-r ${getProjectGradient(index)}`"
            style="
              padding: 1px;
              -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
            "
          ></div>
        </div>
      </div>

      <!-- 查看更多 -->
      <div class="mt-12 text-center" data-aos="fade-up" data-aos-delay="400">
        <a
          href="https://github.com"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 group"
        >
          <span>在 GitHub 上查看更多</span>
          <svg
            class="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>
