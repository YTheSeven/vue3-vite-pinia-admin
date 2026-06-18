<script setup lang="ts">
  import type { FormInstance } from 'element-plus';

  import { useUserManageView } from './useUserManageView';

  // 表单引用
  const addFormRef = ref<FormInstance>();
  const editPasswordFormRef = ref<FormInstance>();
  const editRoleFormRef = ref<FormInstance>();

  // 使用用户管理 Hook - 逻辑分离
  const {
    // State
    isLoading,
    submitLoading,
    searchKeyword,
    // Dialogs
    addDialogVisible,
    editPasswordDialogVisible,
    editRoleDialogVisible,
    // Forms
    addForm,
    editPasswordForm,
    editRoleForm,
    // Rules
    addFormRules,
    editPasswordFormRules,
    editRoleFormRules,
    // Computed
    filteredUserList,
    availableRoles,
    // Actions
    handleSearch,
    handleAdd,
    handleAddSubmit,
    handleEditPassword,
    handleEditPasswordSubmit,
    handleEditRole,
    handleEditRoleSubmit,
    handleDelete,
  } = useUserManageView();
</script>

<template>
  <div
    class="min-h-screen p-4 transition-colors duration-300 bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-6"
  >
    <div class="mx-auto max-w-7xl">
      <!-- 页面标题 -->
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">用户管理</h1>

      <!-- 提示信息 -->
      <el-alert
        title="演示模式说明"
        description="在此页面可以修改用户的角色分配。修改后需要点击顶部的'刷新权限'按钮才能立即生效，或重新登录。"
        type="info"
        show-icon
        :closable="false"
        class="mb-4 dark:bg-blue-900/30!"
      />

      <!-- 卡片容器 -->
      <el-card class="shadow-sm dark:bg-gray-800! dark:border-gray-700!">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium text-gray-900 dark:text-gray-100">用户列表</span>
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
          <el-table-column prop="name" label="用户名" min-width="120" />
          <el-table-column label="角色" min-width="200">
            <template #default="{ row }">
              <el-tag
                v-for="roleCode in row.roles"
                :key="roleCode"
                size="small"
                class="mr-1 mb-1"
                :type="
                  roleCode === 'admin' ? 'danger' : roleCode === 'operator' ? 'warning' : undefined
                "
              >
                {{ availableRoles.find((r) => r.code === roleCode)?.name || roleCode }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" fixed="right" align="center">
            <template #default="{ row }">
              <div class="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <el-button type="primary" link size="small" @click="handleEditRole(row)">
                  <i-ep-user class="mr-1" />
                  修改角色
                </el-button>
                <el-button type="warning" link size="small" @click="handleEditPassword(row)">
                  <i-ep-lock class="mr-1" />
                  修改密码
                </el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row)">
                  <i-ep-delete class="mr-1" />
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新增用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增用户"
      width="500px"
      destroy-on-close
      class="user-dialog"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
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
        <el-form-item label="角色" prop="roleCodes">
          <el-checkbox-group v-model="addForm.roleCodes" class="flex flex-wrap gap-4">
            <el-checkbox
              v-for="role in availableRoles"
              :key="role.code"
              :label="role.code"
              class="!mr-0"
            >
              {{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <el-button class="w-full sm:w-auto" @click="addDialogVisible = false">取消</el-button>
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
      v-model="editPasswordDialogVisible"
      title="修改密码"
      width="500px"
      destroy-on-close
      class="user-dialog"
    >
      <el-form
        ref="editPasswordFormRef"
        :model="editPasswordForm"
        :rules="editPasswordFormRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名">
          <el-input v-model="editPasswordForm.user_name" disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="editPasswordForm.password"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="editPasswordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <el-button class="w-full sm:w-auto" @click="editPasswordDialogVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            class="w-full sm:w-auto"
            :loading="submitLoading"
            @click="handleEditPasswordSubmit(editPasswordFormRef)"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog
      v-model="editRoleDialogVisible"
      title="修改角色"
      width="500px"
      destroy-on-close
      class="user-dialog"
    >
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        :rules="editRoleFormRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名">
          <el-input v-model="editRoleForm.user_name" disabled />
        </el-form-item>
        <el-form-item label="角色" prop="roleCodes">
          <el-checkbox-group v-model="editRoleForm.roleCodes" class="flex flex-col gap-2">
            <el-checkbox
              v-for="role in availableRoles"
              :key="role.code"
              :label="role.code"
              class="!mr-0"
            >
              <div class="flex flex-col">
                <span class="font-medium">{{ role.name }}</span>
                <span class="text-xs text-gray-500">{{ role.description }}</span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <el-button class="w-full sm:w-auto" @click="editRoleDialogVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            class="w-full sm:w-auto"
            :loading="submitLoading"
            @click="handleEditRoleSubmit(editRoleFormRef)"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
  /* 样式通过 Tailwind 实现，保持此处空白 */
</style>
