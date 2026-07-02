import { ref, onMounted, onUnmounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ==========================================
// 类型定义
// ==========================================

/** 统计数据项 */
interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
}

/** 时间轴项 */
interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

/** 技术栈项 */
interface TechItem {
  name: string;
  icon: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'tool';
}

/** 项目项 */
interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
}

// ==========================================
// 组合式函数
// ==========================================

export function useLandingView() {
  // ========== 打字机效果 ==========
  const typewriterText = ref('');
  const fullText = 'YTheSeven';
  const subtitles = ['Vue 生态探险家', '前端魔法师', '代码炼金术士'];
  const currentSubtitle = ref('');
  let typeInterval: ReturnType<typeof setInterval> | null = null;

  // ========== 滚动动画初始化 ==========
  const initAOS = (): void => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 100,
    });
  };

  // ========== 打字机效果 ==========
  const startTypewriter = (): void => {
    let index = 0;
    typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        typewriterText.value = fullText.slice(0, index);
        index++;
      } else {
        // 主标题完成后显示副标题
        if (typeInterval) {
          clearInterval(typeInterval);
          currentSubtitle.value = subtitles[0];
        }
      }
    }, 150);
  };

  // ========== 统计数据 ==========
  const stats = ref<StatItem[]>([
    {
      label: '代码行数',
      value: 50000,
      suffix: '+',
      icon: 'code',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: '开源项目',
      value: 12,
      suffix: '',
      icon: 'github',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: '咖啡消耗',
      value: 999,
      suffix: '+',
      icon: 'coffee',
      color: 'from-orange-500 to-amber-500',
    },
    {
      label: 'Debug 时长',
      value: 365,
      suffix: '天',
      icon: 'bug',
      color: 'from-green-500 to-emerald-500',
    },
  ]);

  // ========== 时间轴数据 ==========
  const timeline = ref<TimelineItem[]>([
    {
      year: '2020',
      title: '初识编程',
      description: '写下了第一行 Hello World，从此踏上了不归路',
      icon: 'beginner',
      unlocked: true,
    },
    {
      year: '2021',
      title: 'Vue 入门',
      description: '被 Vue 的优雅所吸引，开始深入前端世界',
      icon: 'vue',
      unlocked: true,
    },
    {
      year: '2022',
      title: '项目实战',
      description: '参与了多个商业项目，积累了实战经验',
      icon: 'project',
      unlocked: true,
    },
    {
      year: '2023',
      title: '开源贡献',
      description: '开始向开源社区贡献代码，回馈社区',
      icon: 'opensource',
      unlocked: true,
    },
    {
      year: '2024',
      title: '全栈探索',
      description: '不满足于前端，开始探索后端与 DevOps',
      icon: 'fullstack',
      unlocked: true,
    },
  ]);

  // ========== 技术栈数据 ==========
  const techStack = ref<TechItem[]>([
    // 前端核心
    { name: 'Vue 3', icon: 'vue', level: 95, category: 'frontend' },
    { name: 'TypeScript', icon: 'typescript', level: 90, category: 'frontend' },
    { name: 'Tailwind CSS', icon: 'tailwind', level: 88, category: 'frontend' },
    { name: 'Pinia', icon: 'pinia', level: 85, category: 'frontend' },
    // 后端 & 工具
    { name: 'Node.js', icon: 'nodejs', level: 75, category: 'backend' },
    { name: 'Vite', icon: 'vite', level: 92, category: 'tool' },
    { name: 'Git', icon: 'git', level: 85, category: 'tool' },
    { name: 'Docker', icon: 'docker', level: 70, category: 'tool' },
  ]);

  // ========== 项目展示数据 ==========
  const projects = ref<ProjectItem[]>([
    {
      name: 'Vue Admin Pro',
      description: '基于 Vue 3 的现代化后台管理系统，集成多种实用功能',
      tags: ['Vue 3', 'TypeScript', 'Element Plus'],
      github: '#',
      demo: '/login',
    },
    {
      name: 'Mini UI',
      description: '轻量级 Vue 组件库，追求极致的简洁与易用',
      tags: ['Vue 3', 'Rollup', 'Sass'],
      github: '#',
    },
    {
      name: 'Code Snippets',
      description: '日常开发中积累的工具函数与代码片段集合',
      tags: ['TypeScript', 'Utils'],
      github: '#',
    },
    {
      name: 'Blog Theme',
      description: '专为开发者设计的极简博客主题，支持暗黑模式',
      tags: ['Vue 3', 'VitePress', 'Tailwind'],
      github: '#',
      demo: '#',
    },
  ]);

  // ========== 数字递增动画 ==========
  const animatedStats = ref<StatItem[]>(stats.value.map((s) => ({ ...s, value: 0 })));

  const startNumberAnimation = (): void => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    stats.value.forEach((stat, index) => {
      let current = 0;
      const increment = stat.value / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          animatedStats.value[index].value = stat.value;
          clearInterval(timer);
        } else {
          animatedStats.value[index].value = Math.floor(current);
        }
      }, interval);
    });
  };

  // ========== 生命周期 ==========
  onMounted(() => {
    initAOS();
    startTypewriter();
    // 延迟启动数字动画，等待 AOS 触发
    setTimeout(startNumberAnimation, 500);
  });

  onUnmounted(() => {
    if (typeInterval) {
      clearInterval(typeInterval);
    }
  });

  return {
    // 打字机
    typewriterText,
    currentSubtitle,
    subtitles,
    // 数据
    stats,
    animatedStats,
    timeline,
    techStack,
    projects,
    // 方法
    startNumberAnimation,
  };
}
