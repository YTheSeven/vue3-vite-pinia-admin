<script setup lang="ts">
  import type { FormInstance } from 'element-plus';

  import { useRoleManageView } from './useRoleManageView';

  // 表单引用
  const formRef = ref<FormInstance>();

  // 使用角色管理 Hook - 逻辑分离
  const {
    // State
    dialogVisible,
    dialogTitle,
    isEdit,
    submitLoading,
    // Form
    form,
    formRules,
    // Computed
    roleList,
    availableMenus,
    availablePermissions,
    // Actions
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleDialogClose,
  } = useRoleManageView();
</script>

<template>
  <div
    class="min-h-screen p-4 transition-colors duration-300 bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-6"
  >
    <div class="mx-auto max-w-7xl">
      <!-- 页面标题 -->
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">角色管理</h1>

      <!-- 提示信息 -->
      <el-alert
        title="演示模式说明"
        description="在此页面修改的角色权限会保存到本地存储。修改后需要点击顶部的'刷新权限'按钮才能立即生效，或重新登录。"
        type="info"
        show-icon
        :closable="false"
        class="mb-4 dark:bg-blue-900/30!"
      />

      <!-- 卡片容器 -->
      <el-card class="shadow-sm dark:bg-gray-800! dark:border-gray-700!">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium text-gray-900 dark:text-gray-100">角色列表</span>
            <el-button type="primary" @click="handleAdd">
              <i-ep-plus class="mr-1" />
              新增角色
            </el-button>
          </div>
        </template>

        <!-- 角色列表表格 -->
        <el-table :data="roleList" border class="w-full dark:bg-gray-800 dark:text-gray-100">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="name" label="角色名称" width="150" />
          <el-table-column prop="code" label="角色编码" width="150" />
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column label="菜单权限" min-width="200">
            <template #default="{ row }">
              <el-tag
                v-for="menu in row.menus.slice(0, 3)"
                :key="menu"
                size="small"
                class="mr-1 mb-1"
              >
                {{ availableMenus.find((m) => m.name === menu)?.title || menu }}
              </el-tag>
              <el-tag v-if="row.menus.length > 3" size="small" type="info">
                +{{ row.menus.length - 3 }}
              </el-tag>
              <span v-if="row.menus.length === 0" class="text-gray-400">无</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit(row)">
                <i-ep-edit class="mr-1" />
                编辑
              </el-button>
              <el-button
                v-if="row.code !== 'admin'"
                type="danger"
                link
                size="small"
                @click="handleDelete(row)"
              >
                <i-ep-delete class="mr-1" />
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      destroy-on-close
      class="role-dialog"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
        status-icon
        class="max-h-[70vh] overflow-y-auto pr-4"
      >
        <!-- 基本信息 -->
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入角色名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入角色编码，如：operator"
            maxlength="30"
            :disabled="isEdit"
          >
            <template #append>
              <el-tooltip content="角色编码唯一标识，创建后不可修改" placement="top">
                <i-ep-info-filled />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="请输入角色描述"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-divider content-position="left">菜单权限配置</el-divider>

        <!-- 菜单权限 -->
        <el-form-item label="可访问菜单">
          <el-checkbox-group v-model="form.menus" class="flex flex-wrap gap-4">
            <el-checkbox
              v-for="menu in availableMenus"
              :key="menu.name"
              :label="menu.name"
              class="!mr-0"
            >
              <div class="flex items-center gap-1">
                <i-ep-element-plus class="text-base" />
                <span>{{ menu.title }}</span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            选中后，该角色的用户将在侧边栏看到对应的菜单
          </p>
        </el-form-item>

        <el-divider content-position="left">功能权限配置</el-divider>

        <!-- 功能权限 -->
        <el-form-item label="功能权限">
          <el-checkbox-group v-model="form.permissions" class="flex flex-wrap gap-4">
            <el-checkbox
              v-for="perm in availablePermissions"
              :key="perm.code"
              :label="perm.code"
              class="!mr-0"
            >
              {{ perm.name }}
            </el-checkbox>
          </el-checkbox-group>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            选中后，该角色的用户将拥有对应的操作权限（如编辑、删除等）
          </p>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <el-button class="w-full sm:w-auto" @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            class="w-full sm:w-auto"
            :loading="submitLoading"
            @click="handleSubmit(formRef)"
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
