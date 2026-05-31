<template>
  <div class="pb-5">
    <el-row :gutter="24">
      <!-- 左侧导航 -->
      <el-col :xs="24" :sm="8" :md="6" :lg="5">
        <el-card class="sticky top-5" shadow="hover">
          <div class="flex items-center gap-4 p-2">
            <el-avatar :size="64" :src="userStore.userInfo?.avatar" />
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ displayName }}</h3>
              <p class="text-sm text-gray-500 truncate">
                {{ userStore.userInfo?.email || 'user@example.com' }}
              </p>
            </div>
          </div>

          <el-divider />

          <div>
            <div
              v-for="item in menuItems"
              :key="item.key"
              class="flex items-center gap-3 px-4 py-3 my-1 rounded-lg cursor-pointer transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:text-blue-500"
              :class="{ 'bg-blue-50 text-blue-500 font-medium': activeTab === item.key }"
              @click="activeTab = item.key"
            >
              <el-icon :size="18"><component :is="item.icon" /></el-icon>
              <span class="flex-1">{{ item.label }}</span>
              <el-icon v-if="item.badge" class="text-red-500" :size="12"><WarningFilled /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :sm="16" :md="18" :lg="19">
        <!-- 账户安全 -->
        <el-card v-show="activeTab === 'security'" class="min-h-150" shadow="hover">
          <template #header>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">账户安全</h3>
              <p class="text-sm text-gray-500 mt-1">管理您的账户安全设置和登录方式</p>
            </div>
          </template>

          <div>
            <div class="flex items-center justify-between py-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600"
                >
                  <el-icon :size="20"><Lock /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">登录密码</h4>
                  <p class="text-sm text-gray-500">
                    上次修改：{{ securityInfo.lastPasswordChange }}
                  </p>
                </div>
              </div>
              <el-button type="primary" plain @click="showPasswordDialog = true">修改</el-button>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600"
                >
                  <el-icon :size="20"><Message /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">手机绑定</h4>
                  <p class="text-sm text-gray-500">{{ securityInfo.phone || '未绑定' }}</p>
                </div>
              </div>
              <el-button type="primary" plain @click="handleBindPhone">
                {{ securityInfo.phone ? '更换' : '绑定' }}
              </el-button>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600"
                >
                  <el-icon :size="20"><MessageBox /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">邮箱绑定</h4>
                  <p class="text-sm text-gray-500">{{ securityInfo.email }}</p>
                </div>
              </div>
              <el-tag type="success">已验证</el-tag>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600"
                >
                  <el-icon :size="20"><Lock /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">两步验证</h4>
                  <p class="text-sm text-gray-500">开启后登录时需要输入动态验证码</p>
                </div>
              </div>
              <el-switch
                v-model="securityInfo.twoFactorEnabled"
                active-text="已开启"
                inactive-text="未开启"
                @change="handleTwoFactorChange"
              />
            </div>
          </div>

          <!-- 登录设备 -->
          <div class="mt-6">
            <h4 class="text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
              登录设备
            </h4>
            <div>
              <div
                v-for="(device, index) in deviceList"
                :key="index"
                class="flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50"
                :class="{ 'bg-blue-50': device.isCurrent }"
              >
                <div
                  class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600"
                >
                  <el-icon :size="24"><component :is="device.icon" /></el-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{ device.name }}</span>
                    <el-tag v-if="device.isCurrent" type="success" size="small">当前设备</el-tag>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ device.location }} · {{ device.time }}
                  </p>
                </div>
                <el-button
                  v-if="!device.isCurrent"
                  type="danger"
                  link
                  @click="handleLogoutDevice(device)"
                >
                  退出登录
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 通知设置 -->
        <el-card v-show="activeTab === 'notifications'" class="min-h-150" shadow="hover">
          <template #header>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">通知设置</h3>
              <p class="text-sm text-gray-500 mt-1">自定义您接收通知的方式和频率</p>
            </div>
          </template>

          <div>
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                通知渠道
              </h4>
              <div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">邮件通知</h5>
                    <p class="text-sm text-gray-500">接收重要更新的邮件通知</p>
                  </div>
                  <el-switch v-model="notificationSettings.email" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">短信通知</h5>
                    <p class="text-sm text-gray-500">接收安全相关的短信提醒</p>
                  </div>
                  <el-switch v-model="notificationSettings.sms" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">站内消息</h5>
                    <p class="text-sm text-gray-500">在系统内接收消息通知</p>
                  </div>
                  <el-switch v-model="notificationSettings.internal" />
                </div>
              </div>
            </div>

            <el-divider />

            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                通知类型
              </h4>
              <div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">系统公告</h5>
                    <p class="text-sm text-gray-500">系统更新和维护通知</p>
                  </div>
                  <el-checkbox v-model="notificationSettings.types.announcement" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">安全提醒</h5>
                    <p class="text-sm text-gray-500">登录异常和密码修改提醒</p>
                  </div>
                  <el-checkbox v-model="notificationSettings.types.security" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">业务通知</h5>
                    <p class="text-sm text-gray-500">订单状态和工作流提醒</p>
                  </div>
                  <el-checkbox v-model="notificationSettings.types.business" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">营销信息</h5>
                    <p class="text-sm text-gray-500">产品更新和优惠活动</p>
                  </div>
                  <el-checkbox v-model="notificationSettings.types.marketing" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
            <el-button @click="resetNotificationSettings">重置</el-button>
          </div>
        </el-card>

        <!-- 界面偏好 -->
        <el-card v-show="activeTab === 'preferences'" class="min-h-150" shadow="hover">
          <template #header>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">界面偏好</h3>
              <p class="text-sm text-gray-500 mt-1">自定义您的界面显示和操作习惯</p>
            </div>
          </template>

          <div>
            <div class="flex items-center justify-between py-4">
              <div>
                <h4 class="font-medium text-gray-800">界面主题</h4>
                <p class="text-sm text-gray-500">选择您喜欢的界面配色方案</p>
              </div>
              <el-radio-group v-model="preferences.theme">
                <el-radio-button value="light">
                  <el-icon class="mr-1"><Sunny /></el-icon>浅色
                </el-radio-button>
                <el-radio-button value="dark">
                  <el-icon class="mr-1"><Moon /></el-icon>深色
                </el-radio-button>
                <el-radio-button value="auto">
                  <el-icon class="mr-1"><Refresh /></el-icon>跟随系统
                </el-radio-button>
              </el-radio-group>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div>
                <h4 class="font-medium text-gray-800">语言设置</h4>
                <p class="text-sm text-gray-500">选择系统显示语言</p>
              </div>
              <el-select v-model="preferences.language" style="width: 160px">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="繁體中文" value="zh-TW" />
                <el-option label="English" value="en" />
                <el-option label="日本語" value="ja" />
              </el-select>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div>
                <h4 class="font-medium text-gray-800">侧边栏状态</h4>
                <p class="text-sm text-gray-500">默认展开或收起侧边栏</p>
              </div>
              <el-radio-group v-model="preferences.sidebar">
                <el-radio-button value="expanded">展开</el-radio-button>
                <el-radio-button value="collapsed">收起</el-radio-button>
              </el-radio-group>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div>
                <h4 class="font-medium text-gray-800">页面动画</h4>
                <p class="text-sm text-gray-500">启用页面切换动画效果</p>
              </div>
              <el-switch v-model="preferences.animation" />
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div>
                <h4 class="font-medium text-gray-800">表格密度</h4>
                <p class="text-sm text-gray-500">调整表格行高和间距</p>
              </div>
              <el-radio-group v-model="preferences.tableDensity">
                <el-radio-button value="compact">紧凑</el-radio-button>
                <el-radio-button value="default">默认</el-radio-button>
                <el-radio-button value="loose">宽松</el-radio-button>
              </el-radio-group>
            </div>

            <el-divider />

            <div class="flex items-center justify-between py-4">
              <div>
                <h4 class="font-medium text-gray-800">每页显示条数</h4>
                <p class="text-sm text-gray-500">分页列表默认显示的数据条数</p>
              </div>
              <div class="flex items-center">
                <el-slider
                  v-model="preferences.pageSize"
                  :min="10"
                  :max="100"
                  :step="10"
                  show-stops
                  style="width: 200px"
                />
                <span class="text-gray-600 ml-3">{{ preferences.pageSize }} 条</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <el-button type="primary" @click="savePreferences">保存设置</el-button>
            <el-button @click="resetPreferences">恢复默认</el-button>
          </div>
        </el-card>

        <!-- 隐私设置 -->
        <el-card v-show="activeTab === 'privacy'" class="min-h-150" shadow="hover">
          <template #header>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">隐私设置</h3>
              <p class="text-sm text-gray-500 mt-1">管理您的个人数据和隐私选项</p>
            </div>
          </template>

          <div>
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                个人资料可见性
              </h4>
              <div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">头像</h5>
                    <p class="text-sm text-gray-500">谁可以看到您的头像</p>
                  </div>
                  <el-select v-model="privacySettings.avatarVisibility" style="width: 140px">
                    <el-option label="所有人" value="public" />
                    <el-option label="仅登录用户" value="users" />
                    <el-option label="仅自己" value="private" />
                  </el-select>
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">邮箱地址</h5>
                    <p class="text-sm text-gray-500">谁可以看到您的邮箱</p>
                  </div>
                  <el-select v-model="privacySettings.emailVisibility" style="width: 140px">
                    <el-option label="所有人" value="public" />
                    <el-option label="仅登录用户" value="users" />
                    <el-option label="仅自己" value="private" />
                  </el-select>
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">在线状态</h5>
                    <p class="text-sm text-gray-500">显示您的在线/离线状态</p>
                  </div>
                  <el-switch v-model="privacySettings.showOnlineStatus" />
                </div>
              </div>
            </div>

            <el-divider />

            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                数据与隐私
              </h4>
              <div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">个性化推荐</h5>
                    <p class="text-sm text-gray-500">基于您的使用习惯推荐内容</p>
                  </div>
                  <el-switch v-model="privacySettings.personalization" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">使用数据分析</h5>
                    <p class="text-sm text-gray-500">允许收集匿名使用数据以改进产品</p>
                  </div>
                  <el-switch v-model="privacySettings.analytics" />
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-gray-800">操作日志记录</h5>
                    <p class="text-sm text-gray-500">记录您的系统操作以便审计</p>
                  </div>
                  <el-switch v-model="privacySettings.activityLog" />
                </div>
              </div>
            </div>

            <el-divider />

            <div class="mb-6">
              <h4 class="text-sm font-medium text-red-500 uppercase tracking-wider mb-3">
                危险区域
              </h4>
              <div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-red-600">清除所有数据</h5>
                    <p class="text-sm text-gray-500">删除所有个人设置和缓存数据</p>
                  </div>
                  <el-button type="danger" plain @click="handleClearData">清除数据</el-button>
                </div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <h5 class="font-medium text-red-600">导出个人数据</h5>
                    <p class="text-sm text-gray-500">下载您的所有个人数据副本</p>
                  </div>
                  <el-button type="primary" plain @click="handleExportData">导出数据</el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <el-button type="primary" @click="savePrivacySettings">保存设置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px" destroy-on-close>
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import type { FormInstance, FormRules } from 'element-plus';
  import {
    Lock,
    Message,
    MessageBox,
    WarningFilled,
    Sunny,
    Moon,
    Refresh,
  } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  // 当前激活的标签
  const activeTab = ref('security');

  // 菜单项
  const menuItems = [
    { key: 'security', label: '账户安全', icon: 'Lock', badge: false },
    { key: 'notifications', label: '通知设置', icon: 'BellFilled', badge: false },
    { key: 'preferences', label: '界面偏好', icon: 'BrushFilled', badge: false },
    { key: 'privacy', label: '隐私设置', icon: 'UserFilled', badge: false },
  ];

  // 显示的用户名
  const displayName = computed(() => {
    const info = userStore.userInfo;
    return info?.nickname || info?.username || '用户';
  });

  // 安全信息
  const securityInfo = reactive({
    lastPasswordChange: '2024-01-15',
    phone: '138****8888',
    email: userStore.userInfo?.email || 'user@example.com',
    twoFactorEnabled: false,
  });

  // 设备列表
  const deviceList = reactive([
    {
      name: 'Windows Chrome',
      location: '北京',
      time: '当前在线',
      icon: 'Monitor' as const,
      isCurrent: true,
    },
    {
      name: 'iPhone Safari',
      location: '上海',
      time: '2小时前',
      icon: 'Iphone' as const,
      isCurrent: false,
    },
    {
      name: 'Mac Safari',
      location: '深圳',
      time: '3天前',
      icon: 'Monitor',
      isCurrent: false,
    },
  ]);

  // 通知设置
  const notificationSettings = reactive({
    email: true,
    sms: false,
    internal: true,
    types: {
      announcement: true,
      security: true,
      business: true,
      marketing: false,
    },
  });

  // 界面偏好
  const preferences = reactive({
    theme: 'light',
    language: 'zh-CN',
    sidebar: 'expanded',
    animation: true,
    tableDensity: 'default',
    pageSize: 20,
  });

  // 隐私设置
  const privacySettings = reactive({
    avatarVisibility: 'public',
    emailVisibility: 'users',
    showOnlineStatus: true,
    personalization: true,
    analytics: true,
    activityLog: true,
  });

  // 密码对话框
  const showPasswordDialog = ref(false);
  const passwordFormRef = ref<FormInstance>();
  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 密码验证规则
  const passwordRules: FormRules = {
    oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (_rule, value) => {
          if (value !== passwordForm.newPassword) {
            return Promise.reject(new Error('两次输入的密码不一致'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  };

  // 处理两步验证切换
  const handleTwoFactorChange = async (val: string | number | boolean) => {
    if (val) {
      try {
        await ElMessageBox.confirm(
          '开启两步验证后，登录时需要输入手机验证码，是否继续？',
          '确认开启',
          {
            confirmButtonText: '开启',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
        ElMessage.success('两步验证已开启');
      } catch {
        securityInfo.twoFactorEnabled = false;
      }
    } else {
      ElMessage.success('两步验证已关闭');
    }
  };

  // 处理绑定手机
  const handleBindPhone = () => {
    ElMessage.info('绑定手机功能开发中');
  };

  // 处理退出设备登录
  const handleLogoutDevice = async (device: (typeof deviceList)[0]) => {
    try {
      await ElMessageBox.confirm(`确定要退出 ${device.name} 的登录状态吗？`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const index = deviceList.indexOf(device);
      if (index > -1) {
        deviceList.splice(index, 1);
      }
      ElMessage.success('已退出该设备');
    } catch {
      // 用户取消操作
    }
  };

  // 保存通知设置
  const saveNotificationSettings = () => {
    ElMessage.success('通知设置已保存');
  };

  // 重置通知设置
  const resetNotificationSettings = () => {
    notificationSettings.email = true;
    notificationSettings.sms = false;
    notificationSettings.internal = true;
    notificationSettings.types = {
      announcement: true,
      security: true,
      business: true,
      marketing: false,
    };
    ElMessage.success('已重置为默认设置');
  };

  // 保存界面偏好
  const savePreferences = () => {
    ElMessage.success('界面偏好已保存');
  };

  // 重置界面偏好
  const resetPreferences = () => {
    preferences.theme = 'light';
    preferences.language = 'zh-CN';
    preferences.sidebar = 'expanded';
    preferences.animation = true;
    preferences.tableDensity = 'default';
    preferences.pageSize = 20;
    ElMessage.success('已恢复默认设置');
  };

  // 保存隐私设置
  const savePrivacySettings = () => {
    ElMessage.success('隐私设置已保存');
  };

  // 处理修改密码
  const handleChangePassword = async () => {
    if (!passwordFormRef.value) return;
    await passwordFormRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success('密码修改成功');
        showPasswordDialog.value = false;
        passwordForm.oldPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
      }
    });
  };

  // 处理清除数据
  const handleClearData = async () => {
    try {
      await ElMessageBox.confirm('确定要清除所有个人数据吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'error',
      });
      ElMessage.success('数据已清除');
    } catch {
      // ElMessage.info('已取消清除数据');
    }
  };

  // 处理导出数据
  const handleExportData = () => {
    ElMessage.success('数据导出中，请稍候...');
    setTimeout(() => {
      ElMessage.success('数据导出完成');
    }, 1500);
  };
</script>

<style scoped>
  /* 响应式调整 */
  @media (max-width: 768px) {
    :deep(.el-card) {
      position: static;
      margin-bottom: 20px;
    }
  }
</style>
