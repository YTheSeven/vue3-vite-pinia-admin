<template>
  <div class="p-8 max-w-4xl mx-auto space-y-8">
    <!-- 标题区域 -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Element Plus + Tailwind CSS Demo</h1>
      <p class="text-gray-500">自动导入 + Skill 辅助设计</p>
    </div>

    <!-- 按钮展示 -->
    <el-card class="hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <span class="text-lg font-semibold">按钮组件 (ElButton)</span>
      </template>

      <div class="flex flex-wrap gap-4">
        <el-button type="primary" class="hover:scale-105 transition-transform duration-200">
          主要按钮
        </el-button>
        <el-button type="success" plain>成功按钮</el-button>
        <el-button type="warning" round>警告按钮</el-button>
        <el-button type="danger" circle>
          <el-icon>
            <Delete />
          </el-icon>
        </el-button>
        <el-button type="info" :loading="loading" @click="toggleLoading">
          {{ loading ? '加载中...' : '点击加载' }}
        </el-button>
      </div>
    </el-card>

    <!-- 表单展示 -->
    <el-card class="hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <span class="text-lg font-semibold">表单组件 (ElForm + ElInput)</span>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-4">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            clearable
            prefix-icon="User"
            class="w-full max-w-md"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            clearable
            class="w-full max-w-md"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" class="w-full max-w-md">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="访客" value="visitor" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" class="mr-4"> 提交 </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格展示 -->
    <el-card class="hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <span class="text-lg font-semibold">数据表格 (ElTable)</span>
      </template>

      <el-table :data="tableData" stripe border class="overflow-x-auto rounded-lg shadow">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" effect="dark">
              {{ row.status === 'active' ? '活跃' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="100"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </el-card>

    <!-- 弹窗演示 -->
    <el-card class="hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <span class="text-lg font-semibold">反馈组件 (ElDialog + ElMessage)</span>
      </template>

      <div class="flex flex-wrap gap-4">
        <el-button type="primary" @click="dialogVisible = true"> 打开弹窗 </el-button>
        <el-button type="success" @click="showMessage('success')"> 成功消息 </el-button>
        <el-button type="warning" @click="showMessage('warning')"> 警告消息 </el-button>
        <el-button type="danger" @click="showMessage('error')"> 错误消息 </el-button>
      </div>
    </el-card>

    <!-- 图标展示 -->
    <el-card class="hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <span class="text-lg font-semibold">图标自动导入 (unplugin-icons)</span>
      </template>

      <div class="space-y-4">
        <!-- 基础图标 -->
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">基础图标</h4>
          <div class="flex flex-wrap gap-4 text-2xl text-blue-500">
            <i-ep-edit />
            <i-ep-delete />
            <i-ep-search />
            <i-ep-setting />
            <i-ep-user />
            <i-ep-home-filled />
          </div>
        </div>

        <!-- 按钮中的图标 -->
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">按钮中的图标</h4>
          <div class="flex flex-wrap gap-4">
            <el-button type="primary">
              <i-ep-edit class="mr-1" />
              编辑
            </el-button>
            <el-button type="danger">
              <i-ep-delete class="mr-1" />
              删除
            </el-button>
            <el-button>
              <i-ep-search class="mr-1" />
              搜索
            </el-button>
            <el-button type="success">
              <i-ep-circle-check class="mr-1" />
              成功
            </el-button>
          </div>
        </div>

        <!-- 不同尺寸 -->
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">不同尺寸</h4>
          <div class="flex items-center gap-4">
            <i-ep-star class="text-base text-gray-400" />
            <i-ep-star class="text-xl text-gray-500" />
            <i-ep-star class="text-2xl text-gray-600" />
            <i-ep-star class="text-4xl text-yellow-400" />
          </div>
        </div>

        <!-- 不同颜色 -->
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">不同颜色</h4>
          <div class="flex gap-4 text-3xl">
            <i-ep-notification class="text-red-500" />
            <i-ep-circle-check-filled class="text-green-500" />
            <i-ep-warning class="text-yellow-500" />
            <i-ep-info-filled class="text-blue-500" />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="提示" width="30%" class="z-50">
      <span>这是一个 Element Plus 弹窗组件</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus';

  // 加载状态
  const loading = ref(false);
  const toggleLoading = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  };

  // 表单
  const formRef = ref<FormInstance>();
  const form = reactive({
    username: '',
    email: '',
    role: '',
  });

  const rules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  };

  const submitForm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success('提交成功！');
      } else {
        ElMessage.error('请检查表单');
      }
    });
  };

  const resetForm = () => {
    formRef.value?.resetFields();
  };

  // 表格数据
  const tableData = [
    {
      date: '2024-01-15',
      name: '张三',
      address: '上海市浦东新区',
      status: 'active',
    },
    {
      date: '2024-01-14',
      name: '李四',
      address: '北京市朝阳区',
      status: 'inactive',
    },
    {
      date: '2024-01-13',
      name: '王五',
      address: '广州市天河区',
      status: 'active',
    },
  ];

  const currentPage = ref(1);
  const pageSize = ref(10);

  // 弹窗
  const dialogVisible = ref(false);

  // 消息提示
  const showMessage = (type: 'success' | 'warning' | 'error') => {
    ElMessage[type](
      `这是一条${type === 'success' ? '成功' : type === 'warning' ? '警告' : '错误'}消息`
    );
  };
</script>

<style scoped>
  @reference "tailwindcss";
  /* 自定义 Element Plus 样式覆盖 */
  :deep(.el-card__header) {
    @apply bg-gray-50 border-b border-gray-200;
  }

  :deep(.el-form-item__label) {
    @apply font-medium text-gray-700;
  }
</style>
