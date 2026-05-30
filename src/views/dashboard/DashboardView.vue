<template>
  <div class="pb-5">
    <!-- 欢迎区域 -->
    <el-card class="mb-5" shadow="hover">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-5">
        <div class="text-center sm:text-left">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">欢迎回来，{{ displayName }}！</h2>
          <p class="text-sm text-gray-500 mb-2">今天是 {{ currentDate }}，祝您工作愉快！</p>
          <div
            v-if="userStore.userInfo?.roles"
            class="flex flex-wrap justify-center sm:justify-start gap-2"
          >
            <el-tag
              v-for="(role, index) in userStore.userInfo.roles"
              :key="index"
              size="small"
              effect="plain"
            >
              {{ role }}
            </el-tag>
          </div>
        </div>
        <div>
          <el-avatar :size="80" :src="userStore.userInfo?.avatar" />
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.label">
        <el-card class="hover:shadow-lg transition-shadow duration-300 mb-5" shadow="hover">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              :class="stat.bgClass"
            >
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-800 mb-1">{{ stat.value }}</div>
              <div class="text-sm text-gray-500">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb-5">
      <el-col :xs="24" :lg="16">
        <el-card class="h-100 flex flex-col" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center font-semibold">
              <span>访问趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
                <el-radio-button value="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="flex-1 flex flex-col">
            <div class="flex-1 flex items-end justify-around py-5 border-b border-gray-200">
              <div
                v-for="i in 7"
                :key="i"
                class="w-10 bg-linear-to-t from-blue-500 to-green-500 rounded-t transition-all duration-500"
                :style="{ height: `${Math.random() * 200 + 50}px` }"
              ></div>
            </div>
            <div class="flex justify-around pt-3 text-xs text-gray-500">
              <span
                v-for="day in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
                :key="day"
                >{{ day }}</span
              >
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="h-100 flex flex-col" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center font-semibold">
              <span>待办事项</span>
              <el-button type="primary" link @click="addTodo">
                <el-icon><Plus /></el-icon>添加
              </el-button>
            </div>
          </template>
          <div class="flex-1 overflow-auto">
            <div class="flex flex-col gap-4">
              <div
                v-for="(todo, index) in todos"
                :key="index"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <el-checkbox v-model="todo.done">
                  <span :class="{ 'line-through text-gray-400': todo.done }">{{ todo.text }}</span>
                </el-checkbox>
                <el-tag :type="todo.priority as any" size="small">{{ todo.priorityText }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-card class="mb-5" shadow="hover">
      <template #header>
        <div class="font-semibold">快捷入口</div>
      </template>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div
          v-for="link in quickLinks"
          :key="link.name"
          class="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-gray-50 hover:-translate-y-1 transition-all"
          @click="handleLinkClick(link)"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-transform"
            :style="{ backgroundColor: link.color }"
          >
            <el-icon :size="24"><component :is="link.icon" /></el-icon>
          </div>
          <span class="text-sm text-gray-600">{{ link.name }}</span>
        </div>
      </div>
    </el-card>

    <!-- 用户信息展示（用于调试） -->
    <el-card shadow="hover">
      <template #header>
        <div class="font-semibold">当前登录信息（调试用）</div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userStore.userInfo?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">{{ userStore.userInfo?.nickname }}</el-descriptions-item>
        <el-descriptions-item label="登录状态">
          {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
        </el-descriptions-item>
        <el-descriptions-item label="Token">
          {{ userStore.token ? '已获取' : '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="角色">
          {{ userStore.userInfo?.roles?.join(', ') || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="权限">
          {{ userStore.userInfo?.permissions?.join(', ') || '无' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { User, ShoppingCart, Money, Message, Plus } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';

  const router = useRouter();
  const userStore = useUserStore();

  // 当前日期
  const currentDate = computed(() => {
    const date = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
  });

  // 显示的用户名
  const displayName = computed(() => {
    const info = userStore.userInfo;
    return info?.nickname || info?.username || '用户';
  });

  // 图表类型
  const chartType = ref('week');

  // 统计数据
  const stats = [
    {
      icon: User,
      value: '1,234',
      label: '总用户数',
      bgClass: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    },
    {
      icon: ShoppingCart,
      value: '856',
      label: '今日订单',
      bgClass: 'bg-gradient-to-br from-teal-500 to-emerald-500',
    },
    {
      icon: Money,
      value: '¥12,580',
      label: '今日收入',
      bgClass: 'bg-gradient-to-br from-orange-500 to-yellow-500',
    },
    {
      icon: Message,
      value: '42',
      label: '未读消息',
      bgClass: 'bg-gradient-to-br from-blue-400 to-cyan-400',
    },
  ];

  // 待办事项
  const todos = ref([
    { text: '完成项目需求文档', done: false, priority: 'danger', priorityText: '紧急' },
    { text: '代码审查', done: false, priority: 'warning', priorityText: '重要' },
    { text: '更新数据库', done: true, priority: 'info', priorityText: '普通' },
    { text: '团队周会', done: false, priority: 'warning', priorityText: '重要' },
    { text: '修复线上 Bug', done: true, priority: 'danger', priorityText: '紧急' },
  ]);

  // 快捷入口
  const quickLinks = [
    { name: '用户管理', icon: 'UserFilled', color: '#409EFF', path: '/users' },
    { name: '订单管理', icon: 'Document', color: '#67C23A', path: '/orders' },
    { name: '系统设置', icon: 'Setting', color: '#E6A23C', path: '/settings' },
    { name: '消息通知', icon: 'Bell', color: '#F56C6C', path: '/messages' },
    { name: '文件管理', icon: 'Picture', color: '#909399', path: '/files' },
    { name: '演示页面', icon: 'User', color: '#409EFF', path: '/demo' },
  ];

  // 添加待办
  const addTodo = () => {
    ElMessage.info('添加待办功能开发中');
  };

  // 点击快捷入口
  const handleLinkClick = (link: (typeof quickLinks)[0]) => {
    if (link.path === '/demo') {
      router.push(link.path);
    } else {
      ElMessage.info(`${link.name}功能开发中`);
    }
  };
</script>
