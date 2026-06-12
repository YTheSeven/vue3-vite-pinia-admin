<script setup lang="ts">
  import type { UploadFile, UploadRawFile } from 'element-plus';
  import { useUserStore } from '@/store/modules/user';
  import { useProfileView } from './useProfileView';

  // ==========================================
  // 组件逻辑 - 严格遵守逻辑分离原则
  // ==========================================

  const userStore = useUserStore();
  const {
    isLoading,
    isSaving,
    isChangingPassword,
    isUploadingAvatar,
    userForm,
    passwordForm,
    isFormDirty,
    avatarUrl,
    fetchUserDetail,
    updateUserInfo,
    changePassword,
    resetForm,
    uploadAvatar,
  } = useProfileView();

  // 用户ID - 从 store 获取（使用 username 作为 ID，因为登录接口不返回 user_id）
  const userId = userStore.userInfo?.username || '';

  /**
   * 处理头像上传前验证
   */
  const beforeAvatarUpload = (rawFile: UploadRawFile): boolean => {
    // 这里只做验证，实际上传由 handleAvatarChange 处理
    if (!rawFile.type.startsWith('image/')) {
      return false;
    }
    if (rawFile.size / 1024 / 1024 > 2) {
      return false;
    }
    return true;
  };

  /**
   * 处理文件选择变化
   */
  const handleAvatarChange = (uploadFile: UploadFile): void => {
    if (uploadFile.raw) {
      uploadAvatar(uploadFile.raw);
    }
  };
</script>

<template>
  <div
    class="min-h-screen p-4 transition-colors duration-300 bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-6"
  >
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="flex items-center gap-2 mb-6">
        <el-icon class="text-blue-500 text-2xl">
          <i-ep-user-filled />
        </el-icon>
        <h1 class="text-2xl font-bold">个人中心</h1>
      </div>

      <el-row :gutter="20">
        <!-- 左侧：头像卡片 -->
        <el-col :xs="24" :sm="24" :md="8" class="mb-4 md:mb-0">
          <div class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden">
            <!-- 头像区域 -->
            <div class="relative h-32 bg-linear-to-r from-blue-500 to-purple-600">
              <div class="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-change="handleAvatarChange"
                  accept="image/*"
                >
                  <div class="relative cursor-pointer group">
                    <el-avatar
                      :size="96"
                      :src="avatarUrl"
                      class="border-4 border-white dark:border-slate-800 transition-opacity duration-200 group-hover:opacity-70"
                    />
                    <!-- 桌面端：悬停显示相机图标 -->
                    <div
                      class="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <div class="bg-black/50 rounded-full p-2">
                        <el-icon class="text-white text-xl">
                          <i-ep-camera v-if="!isUploadingAvatar" />
                          <i-ep-loading v-else class="animate-spin" />
                        </el-icon>
                      </div>
                    </div>
                    <!-- 移动端：始终显示上传提示 -->
                    <div
                      class="sm:hidden absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full shadow-lg flex items-center justify-center"
                    >
                      <el-icon class="text-white text-sm">
                        <i-ep-camera v-if="!isUploadingAvatar" />
                        <i-ep-loading v-else class="animate-spin" />
                      </el-icon>
                    </div>
                  </div>
                </el-upload>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="pt-16 pb-6 px-6 text-center">
              <!-- 上传引导文字 -->
              <div class="mb-2">
                <span class="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                  点击头像更换
                </span>
              </div>
              <h2 class="text-xl font-semibold mb-1">
                {{ userForm.nickname || '未设置昵称' }}
              </h2>
              <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {{ userStore.userInfo?.username || 'user' }}
              </p>

              <!-- 角色标签 -->
              <div class="flex justify-center gap-2 flex-wrap">
                <el-tag
                  v-for="role in userStore.getUserRoles"
                  :key="role"
                  :type="role === 'admin' ? 'danger' : 'info'"
                  effect="light"
                  class="capitalize"
                >
                  {{ role }}
                </el-tag>
              </div>
            </div>

            <!-- 统计数据 -->
            <div
              class="border-t border-gray-100 dark:border-slate-700 px-6 py-4 grid grid-cols-3 gap-4 text-center"
            >
              <div>
                <div class="text-lg font-semibold text-blue-500">0</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">订单</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-green-500">0</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">收藏</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-purple-500">0</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">消息</div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：表单区域 -->
        <el-col :xs="24" :sm="24" :md="16">
          <!-- 基本资料卡片 -->
          <div class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden mb-4">
            <!-- 卡片头部 -->
            <div
              class="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
            >
              <div class="flex items-center gap-2">
                <el-icon class="text-blue-500">
                  <i-ep-edit />
                </el-icon>
                <span class="font-semibold">基本资料</span>
              </div>
              <div class="flex gap-2 flex-wrap">
                <el-button :loading="isLoading" size="small" @click="fetchUserDetail(userId)">
                  <i-ep-refresh class="mr-1" />
                  刷新
                </el-button>
                <el-button size="small" @click="resetForm">
                  <i-ep-refresh-right class="mr-1" />
                  重置
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  :loading="isSaving"
                  :disabled="!isFormDirty"
                  @click="updateUserInfo(userId)"
                >
                  <i-ep-check class="mr-1" />
                  保存修改
                </el-button>
              </div>
            </div>

            <!-- 表单内容 -->
            <div class="p-6">
              <el-form :model="userForm" label-position="top" class="space-y-4">
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="昵称">
                      <el-input
                        v-model="userForm.nickname"
                        placeholder="请输入昵称"
                        maxlength="50"
                        show-word-limit
                      >
                        <template #prefix>
                          <el-icon><i-ep-user /></el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="邮箱">
                      <el-input v-model="userForm.email" placeholder="请输入邮箱地址" type="email">
                        <template #prefix>
                          <el-icon><i-ep-message /></el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="手机号">
                      <el-input v-model="userForm.phone" placeholder="请输入手机号" maxlength="11">
                        <template #prefix>
                          <el-icon><i-ep-phone /></el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="生日">
                      <el-date-picker
                        v-model="userForm.birthday"
                        type="date"
                        placeholder="选择生日日期"
                        class="w-full"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="性别">
                      <el-radio-group v-model="userForm.gender">
                        <el-radio :value="0">未知</el-radio>
                        <el-radio :value="1">男</el-radio>
                        <el-radio :value="2">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="个人简介">
                  <el-input
                    v-model="userForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入个人简介"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 修改密码卡片 -->
          <div class="bg-white rounded-xl shadow-sm dark:bg-slate-800 overflow-hidden">
            <div
              class="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2"
            >
              <el-icon class="text-orange-500">
                <i-ep-lock />
              </el-icon>
              <span class="font-semibold">修改密码</span>
            </div>

            <div class="p-6">
              <el-form :model="passwordForm" label-position="top" class="max-w-md">
                <el-form-item label="用户名">
                  <el-input v-model="passwordForm.user_name" placeholder="请输入用户名">
                    <template #prefix>
                      <el-icon><i-ep-user /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="新密码">
                  <el-input
                    v-model="passwordForm.password"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  >
                    <template #prefix>
                      <el-icon><i-ep-lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="确认密码">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  >
                    <template #prefix>
                      <el-icon><i-ep-key /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="warning" :loading="isChangingPassword" @click="changePassword">
                    <i-ep-key class="mr-1" />
                    修改密码
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
  /* 样式通过 Tailwind CSS 实现，保持此处简洁 */
</style>
