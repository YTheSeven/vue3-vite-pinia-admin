<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { useSettingsView } from './useSettingsView';

  // ==========================================
  // 组件逻辑 - 严格遵守逻辑分离原则
  // ==========================================

  const userStore = useUserStore();
  const {
    // State
    activeTab,
    isLoading,
    isChangingPassword,
    securityInfo,
    deviceList,
    notificationSettings,
    preferences,
    privacySettings,
    showPasswordDialog,
    passwordForm,

    // Getters
    displayName,
    avatarUrl,
    menuItems,

    // Actions
    fetchUserDetail,
    handleTwoFactorChange,
    handleBindPhone,
    handleLogoutDevice,
    saveNotificationSettings,
    resetNotificationSettings,
    savePreferences,
    resetPreferences,
    savePrivacySettings,
    handleChangePassword,
    handleClearData,
    handleExportData,
    closePasswordDialog,
  } = useSettingsView();

  // 用户ID
  const userId = userStore.userInfo?.id?.toString() || '1';

  onMounted(() => {
    fetchUserDetail(userId);
  });
</script>

<template>
  <div
    class="min-h-screen p-4 transition-colors duration-300 bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-6"
  >
    <!-- 加载状态 -->
    <div v-if="isLoading" class="space-y-4 max-w-7xl mx-auto">
      <div class="h-32 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
      <div class="h-96 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
    </div>

    <el-row v-else :gutter="24" class="max-w-7xl mx-auto">
      <!-- 左侧导航 -->
      <el-col :xs="24" :sm="8" :md="6" :lg="5" class="mb-4 sm:mb-0">
        <div class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden sticky top-6">
          <!-- 用户信息 -->
          <div class="p-6 border-b border-gray-100 dark:border-slate-700">
            <div class="flex items-center gap-4">
              <el-avatar :size="64" :src="avatarUrl" />
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold truncate">{{ displayName }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ securityInfo.email || 'user@example.com' }}
                </p>
              </div>
            </div>
          </div>

          <!-- 菜单 -->
          <div class="p-2">
            <div
              v-for="item in menuItems"
              :key="item.key"
              class="flex items-center gap-3 px-4 py-3 my-1 rounded-lg cursor-pointer transition-all duration-200"
              :class="[
                activeTab === item.key
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-500',
              ]"
              @click="activeTab = item.key"
            >
              <el-icon :size="18">
                <component :is="item.icon" />
              </el-icon>
              <span class="flex-1">{{ item.label }}</span>
              <el-icon v-if="item.badge" class="text-red-500" :size="12">
                <i-ep-warning-filled />
              </el-icon>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :sm="16" :md="18" :lg="19">
        <!-- 账户安全 -->
        <div
          v-show="activeTab === 'security'"
          class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden min-h-150"
        >
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 class="text-lg font-semibold">账户安全</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              管理您的账户安全设置和登录方式
            </p>
          </div>

          <div class="p-6 space-y-4">
            <!-- 登录密码 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  <el-icon :size="20"><i-ep-lock /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium">登录密码</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    上次修改：{{ securityInfo.lastPasswordChange }}
                  </p>
                </div>
              </div>
              <el-button type="primary" plain @click="showPasswordDialog = true"> 修改 </el-button>
            </div>

            <el-divider class="my-2!" />

            <!-- 手机绑定 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                >
                  <el-icon :size="20"><i-ep-message /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium">手机绑定</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ securityInfo.phone || '未绑定' }}
                  </p>
                </div>
              </div>
              <el-button type="primary" plain @click="handleBindPhone">
                {{ securityInfo.phone && securityInfo.phone !== '未绑定' ? '更换' : '绑定' }}
              </el-button>
            </div>

            <el-divider class="my-2!" />

            <!-- 邮箱绑定 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                >
                  <el-icon :size="20"><i-ep-message-box /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium">邮箱绑定</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ securityInfo.email }}
                  </p>
                </div>
              </div>
              <el-tag type="success">已验证</el-tag>
            </div>

            <el-divider class="my-2!" />

            <!-- 两步验证 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                >
                  <el-icon :size="20"><i-ep-key /></el-icon>
                </div>
                <div>
                  <h4 class="font-medium">两步验证</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    开启后登录时需要输入动态验证码
                  </p>
                </div>
              </div>
              <el-switch v-model="securityInfo.twoFactorEnabled" @change="handleTwoFactorChange" />
            </div>
          </div>

          <!-- 登录设备 -->
          <div class="px-6 pb-6">
            <h4
              class="text-base font-medium mb-4 pb-2 border-b border-gray-100 dark:border-slate-700"
            >
              登录设备
            </h4>
            <div class="space-y-3">
              <div
                v-for="(device, index) in deviceList"
                :key="index"
                class="flex items-center gap-4 p-4 rounded-lg transition-colors"
                :class="[
                  device.isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50',
                ]"
              >
                <div
                  class="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400"
                >
                  <el-icon :size="24">
                    <component :is="device.icon" />
                  </el-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ device.name }}</span>
                    <el-tag v-if="device.isCurrent" type="success" size="small"> 当前设备 </el-tag>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
        </div>

        <!-- 通知设置 -->
        <div
          v-show="activeTab === 'notifications'"
          class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden min-h-150"
        >
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 class="text-lg font-semibold">通知设置</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              自定义您接收通知的方式和频率
            </p>
          </div>

          <div class="p-6">
            <!-- 通知渠道 -->
            <div class="mb-8">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                通知渠道
              </h4>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">邮件通知</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">接收重要更新的邮件通知</p>
                  </div>
                  <el-switch v-model="notificationSettings.email" />
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">短信通知</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">接收安全相关的短信提醒</p>
                  </div>
                  <el-switch v-model="notificationSettings.sms" />
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">站内消息</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">在系统内接收消息通知</p>
                  </div>
                  <el-switch v-model="notificationSettings.internal" />
                </div>
              </div>
            </div>

            <el-divider />

            <!-- 通知类型 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                通知类型
              </h4>
              <div class="space-y-4">
                <div
                  v-for="(label, key) in {
                    announcement: '系统公告',
                    security: '安全提醒',
                    business: '业务通知',
                    marketing: '营销信息',
                  }"
                  :key="key"
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">{{ label }}</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{
                        key === 'announcement'
                          ? '系统更新和维护通知'
                          : key === 'security'
                            ? '登录异常和密码修改提醒'
                            : key === 'business'
                              ? '订单状态和工作流提醒'
                              : '产品更新和优惠活动'
                      }}
                    </p>
                  </div>
                  <el-checkbox v-model="notificationSettings.types[key]" />
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
              <el-button type="primary" @click="saveNotificationSettings">
                <i-ep-check class="mr-1" />
                保存设置
              </el-button>
              <el-button @click="resetNotificationSettings">
                <i-ep-refresh-right class="mr-1" />
                重置
              </el-button>
            </div>
          </div>
        </div>

        <!-- 界面偏好 -->
        <div
          v-show="activeTab === 'preferences'"
          class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden min-h-150"
        >
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 class="text-lg font-semibold">界面偏好</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              自定义您的界面显示和操作习惯
            </p>
          </div>

          <div class="p-6 space-y-6">
            <!-- 主题 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <h4 class="font-medium">界面主题</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">选择您喜欢的界面配色方案</p>
              </div>
              <el-radio-group v-model="preferences.theme">
                <el-radio-button label="light">
                  <el-icon class="mr-1"><i-ep-sunny /></el-icon>
                  浅色
                </el-radio-button>
                <el-radio-button label="dark">
                  <el-icon class="mr-1"><i-ep-moon /></el-icon>
                  深色
                </el-radio-button>
                <el-radio-button label="auto">
                  <el-icon class="mr-1"><i-ep-refresh /></el-icon>
                  跟随系统
                </el-radio-button>
              </el-radio-group>
            </div>

            <el-divider />

            <!-- 语言 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <h4 class="font-medium">语言设置</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">选择系统显示语言</p>
              </div>
              <el-select v-model="preferences.language" style="width: 160px">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="繁體中文" value="zh-TW" />
                <el-option label="English" value="en" />
              </el-select>
            </div>

            <el-divider />

            <!-- 侧边栏 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <h4 class="font-medium">侧边栏状态</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">默认展开或收起侧边栏</p>
              </div>
              <el-radio-group v-model="preferences.sidebar">
                <el-radio-button label="expanded">展开</el-radio-button>
                <el-radio-button label="collapsed">收起</el-radio-button>
              </el-radio-group>
            </div>

            <el-divider />

            <!-- 动画 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <h4 class="font-medium">页面动画</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">启用页面切换动画效果</p>
              </div>
              <el-switch v-model="preferences.animation" />
            </div>

            <el-divider />

            <!-- 表格密度 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <h4 class="font-medium">表格密度</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">调整表格行高和间距</p>
              </div>
              <el-radio-group v-model="preferences.tableDensity">
                <el-radio-button label="compact">紧凑</el-radio-button>
                <el-radio-button label="default">默认</el-radio-button>
                <el-radio-button label="loose">宽松</el-radio-button>
              </el-radio-group>
            </div>

            <el-divider />

            <!-- 分页 -->
            <div
              class="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <h4 class="font-medium">每页显示条数</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">分页列表默认显示的数据条数</p>
              </div>
              <div class="flex items-center gap-3">
                <el-slider
                  v-model="preferences.pageSize"
                  :min="10"
                  :max="100"
                  :step="10"
                  show-stops
                  style="width: 200px"
                />
                <span class="text-gray-600 dark:text-gray-400 w-16"
                  >{{ preferences.pageSize }} 条</span
                >
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
              <el-button type="primary" @click="savePreferences">
                <i-ep-check class="mr-1" />
                保存设置
              </el-button>
              <el-button @click="resetPreferences">
                <i-ep-refresh-right class="mr-1" />
                恢复默认
              </el-button>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div
          v-show="activeTab === 'privacy'"
          class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden min-h-150"
        >
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 class="text-lg font-semibold">隐私设置</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">管理您的个人数据和隐私选项</p>
          </div>

          <div class="p-6">
            <!-- 个人资料可见性 -->
            <div class="mb-8">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                个人资料可见性
              </h4>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">头像</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">谁可以看到您的头像</p>
                  </div>
                  <el-select v-model="privacySettings.avatarVisibility" style="width: 140px">
                    <el-option label="所有人" value="public" />
                    <el-option label="仅登录用户" value="users" />
                    <el-option label="仅自己" value="private" />
                  </el-select>
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">邮箱地址</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">谁可以看到您的邮箱</p>
                  </div>
                  <el-select v-model="privacySettings.emailVisibility" style="width: 140px">
                    <el-option label="所有人" value="public" />
                    <el-option label="仅登录用户" value="users" />
                    <el-option label="仅自己" value="private" />
                  </el-select>
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">在线状态</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">显示您的在线/离线状态</p>
                  </div>
                  <el-switch v-model="privacySettings.showOnlineStatus" />
                </div>
              </div>
            </div>

            <el-divider />

            <!-- 数据与隐私 -->
            <div class="mb-8">
              <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                数据与隐私
              </h4>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">个性化推荐</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">基于您的使用习惯推荐内容</p>
                  </div>
                  <el-switch v-model="privacySettings.personalization" />
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">使用数据分析</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      允许收集匿名使用数据以改进产品
                    </p>
                  </div>
                  <el-switch v-model="privacySettings.analytics" />
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">操作日志记录</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">记录您的系统操作以便审计</p>
                  </div>
                  <el-switch v-model="privacySettings.activityLog" />
                </div>
              </div>
            </div>

            <el-divider />

            <!-- 危险区域 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-red-500 uppercase tracking-wider mb-4">
                危险区域
              </h4>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg bg-red-50 dark:bg-red-900/10"
                >
                  <div>
                    <h5 class="font-medium text-red-600">清除所有数据</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      删除所有个人设置和缓存数据
                    </p>
                  </div>
                  <el-button type="danger" plain @click="handleClearData"> 清除数据 </el-button>
                </div>
                <div
                  class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <h5 class="font-medium">导出个人数据</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400">下载您的所有个人数据副本</p>
                  </div>
                  <el-button type="primary" plain @click="handleExportData"> 导出数据 </el-button>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
              <el-button type="primary" @click="savePrivacySettings">
                <i-ep-check class="mr-1" />
                保存设置
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="400px"
      destroy-on-close
      class="dark:bg-slate-800"
    >
      <el-form ref="passwordFormRef" :model="passwordForm" label-position="top" class="space-y-4">
        <el-form-item
          label="用户名"
          prop="user_name"
          :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
        >
          <el-input v-model="passwordForm.user_name" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><i-ep-user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="password"
          :rules="[
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="passwordForm.password"
            type="password"
            show-password
            placeholder="请输入新密码"
          >
            <template #prefix>
              <el-icon><i-ep-lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          :rules="[
            { required: true, message: '请确认新密码', trigger: 'blur' },
            {
              validator: (_rule, value, callback) => {
                if (value !== passwordForm.password) {
                  callback(new Error('两次输入的密码不一致'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          >
            <template #prefix>
              <el-icon><i-ep-key /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closePasswordDialog">取消</el-button>
        <el-button type="primary" :loading="isChangingPassword" @click="handleChangePassword">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
  /* 样式通过 Tailwind CSS 实现，保持此处简洁 */
</style>
