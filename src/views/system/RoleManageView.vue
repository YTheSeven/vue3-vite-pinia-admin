<template>
  <div class="role-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table :data="roleList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="userCount" label="用户数" width="100" />
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

  interface Role {
    id: number;
    name: string;
    code: string;
    description: string;
    userCount: number;
  }

  const roleList = ref<Role[]>([
    { id: 1, name: '超级管理员', code: 'admin', description: '拥有所有系统权限', userCount: 2 },
    { id: 2, name: '运营专员', code: 'operator', description: '负责订单和业务管理', userCount: 5 },
    { id: 3, name: '普通用户', code: 'user', description: '普通用户权限', userCount: 100 },
  ]);

  const handleAdd = () => {
    ElMessage.info('点击了新增角色');
  };

  const handleEdit = (row: Role) => {
    ElMessage.info(`编辑角色: ${row.name}`);
  };

  const handleDelete = async (row: Role) => {
    await ElMessageBox.confirm(`确定删除角色 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('删除成功');
  };
</script>

<style scoped>
  .role-manage {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
