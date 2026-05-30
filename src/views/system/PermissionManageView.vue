<template>
  <div class="permission-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限管理</span>
          <el-button type="primary" @click="handleAdd">新增权限</el-button>
        </div>
      </template>

      <el-tree
        :data="permissionList"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ data }">
          <span class="custom-tree-node">
            <span>{{ data.name }} ({{ data.code }})</span>
            <span>
              <el-button type="primary" link size="small" @click="handleEdit(data)">
                编辑
              </el-button>
              <el-button type="danger" link size="small" @click="handleDelete(data)">
                删除
              </el-button>
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  interface Permission {
    id: number;
    name: string;
    code: string;
    children?: Permission[];
  }

  const permissionList = ref<Permission[]>([
    {
      id: 1,
      name: '系统管理',
      code: 'system',
      children: [
        { id: 11, name: '用户管理', code: 'user:manage' },
        { id: 12, name: '角色管理', code: 'role:manage' },
        { id: 13, name: '权限管理', code: 'permission:manage' },
      ],
    },
    {
      id: 2,
      name: '业务管理',
      code: 'business',
      children: [
        { id: 21, name: '订单查看', code: 'order:view' },
        { id: 22, name: '订单编辑', code: 'order:edit' },
        { id: 23, name: '订单删除', code: 'order:delete' },
      ],
    },
    {
      id: 3,
      name: '个人中心',
      code: 'user',
      children: [
        { id: 31, name: '个人资料', code: 'profile:view' },
        { id: 32, name: '系统设置', code: 'settings:manage' },
      ],
    },
  ]);

  const handleAdd = () => {
    ElMessage.info('点击了新增权限');
  };

  const handleEdit = (data: Permission) => {
    ElMessage.info(`编辑权限: ${data.name}`);
  };

  const handleDelete = async (data: Permission) => {
    await ElMessageBox.confirm(`确定删除权限 ${data.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('删除成功');
  };
</script>

<style scoped>
  .permission-manage {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
</style>
