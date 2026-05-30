<template>
  <div
    class="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
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

    <div class="w-105 p-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl relative z-10">
      <h2 class="text-center mb-8 text-2xl text-gray-800 font-semibold">管理系统登录</h2>
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

        <div class="mt-5 p-4 bg-gray-100 rounded text-sm text-gray-600">
          <p class="font-bold text-gray-700 mb-2">测试账号（密码任意）：</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-medium">admin</span>
              <span class="text-xs text-gray-500">管理员 - 所有权限</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium">operator</span>
              <span class="text-xs text-gray-500">运营 - 订单管理</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium">user</span>
              <span class="text-xs text-gray-500">普通用户 - 仅个人中心</span>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { User, Lock } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';
  import { addDynamicRoutes } from '@/router';

  const router = useRouter();
  const userStore = useUserStore();

  const loginFormRef = ref();
  const loading = ref(false);

  const loginForm = reactive({
    username: 'admin',
    password: '123456',
    remember: false,
  });

  const loginRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  };

  const handleLogin = async () => {
    if (!loginFormRef.value) return;

    try {
      await loginFormRef.value.validate();
      loading.value = true;

      // 根据输入的用户名登录
      // userStore.login 会根据用户名自动分配对应角色
      await userStore.login({
        username: loginForm.username,
        password: loginForm.password,
        remember: loginForm.remember,
      });

      // 加载动态路由
      await addDynamicRoutes();

      ElMessage.success('登录成功');
      router.push('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      ElMessage.error('登录失败，请检查用户名和密码');
    } finally {
      loading.value = false;
    }
  };
</script>

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
