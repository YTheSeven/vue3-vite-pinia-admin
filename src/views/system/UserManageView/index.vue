<script setup lang="ts">
  import type { FormInstance } from 'element-plus';

  import { useUserManageView } from './useUserManageView';
  import { useDevice } from '@/composables/useDevice';

  // 表单引用
  const addFormRef = ref<FormInstance>();
  const editFormRef = ref<FormInstance>();

  // 响应式设备检测
  const { isMobile } = useDevice();

  // 使用用户管理 Hook - 强制解构，严禁在 vue 内写复杂 ref 逻辑
  const {
    isLoading,
    submitLoading,
    searchKeyword,
    filteredUserList,
    addDialogVisible,
    addForm,
    addFormRules,
    handleAdd,
    handleAddSubmit,
    editDialogVisible,
    editForm,
    editFormRules,
    handleEdit,
    handleEditSubmit,
    handleDelete,
    handleAvatarError,
    handleSearch,
  } = useUserManageView();
</script>

<template>
  <div
    class="min-h-screen p-4 transition-colors duration-300 bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-6"
  >
    <div class="mx-auto max-w-7xl">
      <!-- 页面标题 -->
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">用户管理</h1>

      <!-- 卡片容器 -->
      <el-card class="shadow-sm dark:bg-gray-800! dark:border-gray-700!">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium text-gray-900 dark:text-gray-100"> 用户列表 </span>
            <el-button type="primary" @click="handleAdd">
              <i-ep-plus class="mr-1" />
              新增用户
            </el-button>
          </div>
        </template>

        <!-- 搜索栏 -->
        <div class="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-end">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名"
            clearable
            class="w-full sm:w-72"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <i-ep-search class="cursor-pointer" @click="handleSearch" />
            </template>
          </el-input>
        </div>

        <!-- 用户列表表格 -->
        <el-table
          v-loading="isLoading"
          :data="filteredUserList"
          border
          class="w-full dark:bg-gray-800 dark:text-gray-100"
        >
          <el-table-column prop="user_id" label="用户ID" width="100" align="center" />
          <el-table-column prop="name" label="用户名" min-width="150" />
          <el-table-column label="头像" width="120" align="center">
            <template #default="{ row }">
              <el-avatar :size="50" :src="row.avatar" @error="handleAvatarError">
                <i-ep-user />
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right" align="center">
            <template #default="{ row }">
              <div class="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <el-button type="primary" link size="small" @click="handleEdit(row)">
                  <i-ep-lock class="mr-1" />
                  <span class="hidden sm:inline">修改密码</span>
                  <span class="sm:hidden">密码</span>
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="handleDelete(row)"
                  class="ml-0! sm:ml-2!"
                >
                  <i-ep-delete class="mr-1" />
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 新增用户对话框 -->
      <el-dialog
        v-model="addDialogVisible"
        title="新增用户"
        :width="isMobile ? '90%' : '500px'"
        :fullscreen="isMobile"
        destroy-on-close
        class="user-dialog"
      >
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
          :label-width="isMobile ? '80px' : '100px'"
          :label-position="isMobile ? 'top' : 'right'"
          status-icon
        >
          <el-form-item label="用户名" prop="user_name">
            <el-input
              v-model="addForm.user_name"
              placeholder="请输入用户名"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="addForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="addForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <el-button class="w-full sm:w-auto" @click="addDialogVisible = false"> 取消 </el-button>
            <el-button
              type="primary"
              class="w-full sm:w-auto"
              :loading="submitLoading"
              @click="handleAddSubmit(addFormRef)"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 修改密码对话框 -->
      <el-dialog
        v-model="editDialogVisible"
        title="修改密码"
        :width="isMobile ? '90%' : '500px'"
        :fullscreen="isMobile"
        destroy-on-close
        class="user-dialog"
      >
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          :label-width="isMobile ? '80px' : '100px'"
          :label-position="isMobile ? 'top' : 'right'"
          status-icon
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.user_name" disabled />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="editForm.password"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="editForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <el-button class="w-full sm:w-auto" @click="editDialogVisible = false">
              取消
            </el-button>
            <el-button
              type="primary"
              class="w-full sm:w-auto"
              :loading="submitLoading"
              @click="handleEditSubmit(editFormRef)"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
  /* 样式通过 Tailwind 实现，保持此处空白 */
</style>
