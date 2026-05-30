<template>
  <div class="user-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="roles" label="角色" width="150">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role" size="small" style="margin-right: 5px">
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  interface User {
    id: number;
    username: string;
    nickname: string;
    email: string;
    roles: string[];
    status: 'active' | 'inactive';
  }

  const userList = ref<User[]>([
    {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      roles: ['admin'],
      status: 'active',
    },
    {
      id: 2,
      username: 'operator',
      nickname: '运营',
      email: 'operator@example.com',
      roles: ['operator'],
      status: 'active',
    },
    {
      id: 3,
      username: 'user',
      nickname: '用户',
      email: 'user@example.com',
      roles: ['user'],
      status: 'active',
    },
  ]);

  const handleAdd = () => {
    ElMessage.info('点击了新增用户');
  };

  const handleEdit = (row: User) => {
    ElMessage.info(`编辑用户: ${row.username}`);
  };

  const handleDelete = async (row: User) => {
    await ElMessageBox.confirm(`确定删除用户 ${row.username} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('删除成功');
  };
</script>

<style scoped>
  .user-manage {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
