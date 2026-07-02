<script setup lang="ts">
  import { ref } from 'vue';

  interface TechItem {
    name: string;
    icon: string;
    level: number;
    category: 'frontend' | 'backend' | 'tool';
  }

  interface Props {
    techStack: TechItem[];
  }

  defineProps<Props>();

  const activeCategory = ref<'all' | 'frontend' | 'backend' | 'tool'>('all');

  const categories = [
    { key: 'all', label: '全部', color: 'bg-gray-500' },
    { key: 'frontend', label: '前端', color: 'bg-blue-500' },
    { key: 'backend', label: '后端', color: 'bg-green-500' },
    { key: 'tool', label: '工具', color: 'bg-purple-500' },
  ] as const;

  /** 获取分类颜色 */
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      frontend: 'from-blue-500 to-cyan-500',
      backend: 'from-green-500 to-emerald-500',
      tool: 'from-purple-500 to-pink-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  /** 获取分类标签 */
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      frontend: '前端',
      backend: '后端',
      tool: '工具',
    };
    return labels[category] || category;
  };

  /** 获取技术图标（使用 emoji 作为占位） */
  const getTechIcon = (icon: string): string => {
    const icons: Record<string, string> = {
      vue: '⚡',
      typescript: '🔷',
      tailwind: '🎨',
      pinia: '🍍',
      nodejs: '🟢',
      vite: '⚡',
      git: '🌿',
      docker: '🐳',
    };
    return icons[icon] || '💻';
  };

  /** 获取熟练度标签 */
  const getLevelLabel = (level: number): string => {
    if (level >= 90) return '精通';
    if (level >= 80) return '熟练';
    if (level >= 70) return '掌握';
    return '了解';
  };
</script>

<template>
  <section class="relative py-24 bg-slate-950 overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 区域标题 -->
      <div class="text-center mb-12" data-aos="fade-up">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          技术<span class="text-cyan-400">装备</span>
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto">精心挑选的技术栈，每一件都是得心应手的利器</p>
      </div>

      <!-- 分类筛选 -->
      <div class="flex justify-center gap-2 mb-12" data-aos="fade-up" data-aos-delay="100">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="
            activeCategory === cat.key
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          "
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- 技术栈网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(tech, index) in techStack.filter(
            (t) => activeCategory === 'all' || t.category === activeCategory
          )"
          :key="tech.name"
          class="group relative p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 50"
        >
          <!-- 图标和名称 -->
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center text-lg"
              :class="getCategoryColor(tech.category)"
            >
              {{ getTechIcon(tech.icon) }}
            </div>
            <div>
              <h3 class="font-semibold text-white">{{ tech.name }}</h3>
              <span class="text-xs text-gray-500">{{ getCategoryLabel(tech.category) }}</span>
            </div>
          </div>

          <!-- 熟练度条 -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">熟练度</span>
              <span
                class="font-medium"
                :class="
                  tech.level >= 90
                    ? 'text-yellow-400'
                    : tech.level >= 80
                      ? 'text-blue-400'
                      : 'text-gray-400'
                "
              >
                {{ getLevelLabel(tech.level) }}
              </span>
            </div>
            <div class="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                class="h-full rounded-full bg-linear-to-r transition-all duration-1000 ease-out"
                :class="getCategoryColor(tech.category)"
                :style="{ width: `${tech.level}%` }"
              ></div>
            </div>
            <div class="text-right text-xs text-gray-600">{{ tech.level }}%</div>
          </div>

          <!-- 悬停光效 -->
          <div
            class="absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
            :class="getCategoryColor(tech.category)"
          ></div>
        </div>
      </div>

      <!-- 额外技能标签 -->
      <div class="mt-12 text-center" data-aos="fade-up" data-aos-delay="400">
        <p class="text-sm text-gray-500 mb-4">也在探索中的技术</p>
        <div class="flex flex-wrap justify-center gap-2">
          <span
            v-for="skill in ['React', 'Next.js', 'Go', 'PostgreSQL', 'Redis', 'Kubernetes']"
            :key="skill"
            class="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-gray-300 transition-colors cursor-default"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
