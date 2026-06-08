<script setup lang="ts">
  import { User, Lock } from '@element-plus/icons-vue';
  import { useLogin } from './composables/useLogin';

  // 使用登录 Hook
  // @ts-expect-error loginFormRef is used in template via ref binding
  const { loginFormRef, loading, loginForm, loginRules, handleLogin } = useLogin();
</script>

<template>
  <div
    class="min-h-screen flex justify-center items-center relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <!-- 动态光晕效果 -->
    <div
      class="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
    />
    <div
      class="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"
    />
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"
    />

    <div
      class="w-full max-w-105 sm:w-105 mx-4 sm:mx-0 p-8 sm:p-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl dark:shadow-slate-900/50 relative z-10"
    >
      <h2 class="text-center mb-8 text-2xl text-gray-800 dark:text-white font-semibold">
        管理系统登录
      </h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <div class="flex justify-between items-center w-full">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="w-full"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>

        <div
          class="mt-5 p-4 bg-gray-100 dark:bg-slate-700 rounded text-sm text-gray-600 dark:text-gray-300"
        >
          <p class="font-bold text-gray-700 dark:text-gray-200 mb-2">测试账号（密码任意）：</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-800 dark:text-gray-200">admin</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">管理员 - 所有权限</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-800 dark:text-gray-200">operator</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">运营 - 订单管理</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-800 dark:text-gray-200">user</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">普通用户 - 仅个人中心</span>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
  :deep(.el-radio-group) {
    .el-radio-button {
      flex: 1;

      .el-radio-button__inner {
        width: 100%;
      }
    }
  }

  /* 浮动动画 */
  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }

  /* 延迟浮动动画 */
  @keyframes float-delayed {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-30px, 30px) scale(1.1);
    }
    66% {
      transform: translate(20px, -20px) scale(0.9);
    }
  }

  /* 缓慢脉冲动画 */
  @keyframes pulse-slow {
    0%,
    100% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }

  .animate-float {
    animation: float 20s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 25s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 15s ease-in-out infinite;
  }
</style>
