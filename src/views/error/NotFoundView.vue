<template>
  <div
    class="not-found min-h-screen flex items-center justify-center relative overflow-hidden p-10 bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
  >
    <div class="not-found-content text-center text-white z-10 max-w-lg">
      <div
        class="error-code text-[180px] font-bold leading-none mb-5 bg-linear-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent animate-float"
      >
        404
      </div>
      <div class="error-title text-4xl font-semibold mb-4">页面不存在</div>
      <div class="error-desc text-base text-white/70 mb-10">抱歉，您访问的页面已经失效或被移除</div>
      <div class="error-actions flex gap-4 justify-center flex-wrap">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>
    <div class="not-found-illustration absolute w-full h-full pointer-events-none">
      <div class="astronaut absolute top-1/2 right-[15%] -translate-y-1/2 animate-float-astronaut">
        <div
          class="astronaut-body w-20 h-25 bg-white rounded-t-[40px] rounded-b-[30px] relative"
        ></div>
        <div
          class="astronaut-head absolute -top-7.5 left-1/2 -translate-x-1/2 w-15 h-15 bg-white rounded-full after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-10 after:h-7.5 after:bg-[#1a1a2e] after:rounded-full"
        ></div>
        <div
          class="astronaut-arm left absolute w-6.25 h-15 bg-white rounded-xl top-7.5 -left-3.75 rotate-[-30deg] animate-wave-left"
        ></div>
        <div
          class="astronaut-arm right absolute w-6.25 h-15 bg-white rounded-xl top-7.5 -right-3.75 rotate-30 animate-wave-right"
        ></div>
      </div>
      <div
        class="planet absolute -bottom-25 -right-25 w-100 h-100 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-full opacity-30 animate-rotate before:content-[''] before:absolute before:top-[20%] before:left-[20%] before:w-[60%] before:h-[20%] before:bg-white/10 before:rounded-full before:rotate-[-20deg]"
      ></div>
      <div class="stars absolute w-full h-full top-0 left-0">
        <div
          v-for="i in 20"
          :key="i"
          class="star absolute w-0.75 h-0.75 bg-white rounded-full animate-twinkle"
          :style="getStarStyle()"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { HomeFilled } from '@element-plus/icons-vue';

  const router = useRouter();

  const goHome = () => {
    router.push('/admin/dashboard');
  };

  const getStarStyle = () => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = 2 + Math.random() * 2;
    return {
      top: `${top}%`,
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    };
  };
</script>

<style scoped>
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes float-astronaut {
    0%,
    100% {
      transform: translateY(-50%) rotate(0deg);
    }
    50% {
      transform: translateY(-60%) rotate(5deg);
    }
  }

  @keyframes wave-left {
    0%,
    100% {
      transform: rotate(-30deg);
    }
    50% {
      transform: rotate(-50deg);
    }
  }

  @keyframes wave-right {
    0%,
    100% {
      transform: rotate(30deg);
    }
    50% {
      transform: rotate(50deg);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-float-astronaut {
    animation: float-astronaut 6s ease-in-out infinite;
  }

  .animate-wave-left {
    animation: wave-left 2s ease-in-out infinite;
  }

  .animate-wave-right {
    animation: wave-right 2s ease-in-out infinite;
  }

  .animate-rotate {
    animation: rotate 60s linear infinite;
  }

  .animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .error-code {
      font-size: 120px;
    }

    .error-title {
      font-size: 28px;
    }

    .astronaut {
      display: none;
    }

    .planet {
      width: 200px;
      height: 200px;
      bottom: -50px;
      right: -50px;
    }
  }
</style>
