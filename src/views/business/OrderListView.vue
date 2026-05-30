<template>
  <div class="order-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号/客户名称"
              style="width: 250px; margin-right: 10px"
              clearable
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="id" label="订单号" width="150" />
        <el-table-column prop="customer" label="客户名称" width="150" />
        <el-table-column prop="amount" label="订单金额" width="120">
          <template #default="{ row }"> ¥{{ row.amount.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)"> 查看 </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)"> 编辑 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import type { TAGTYPE } from '@/types/elementTypes';

  const router = useRouter();

  interface Order {
    id: string;
    customer: string;
    amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    createTime: string;
  }

  const searchKeyword = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(100);

  const orderList = ref<Order[]>([
    {
      id: 'ORD2024001',
      customer: '张三',
      amount: 299.0,
      status: 'completed',
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: 'ORD2024002',
      customer: '李四',
      amount: 599.0,
      status: 'paid',
      createTime: '2024-01-15 11:20:00',
    },
    {
      id: 'ORD2024003',
      customer: '王五',
      amount: 1299.0,
      status: 'shipped',
      createTime: '2024-01-15 14:00:00',
    },
    {
      id: 'ORD2024004',
      customer: '赵六',
      amount: 99.0,
      status: 'pending',
      createTime: '2024-01-16 09:30:00',
    },
    {
      id: 'ORD2024005',
      customer: '钱七',
      amount: 899.0,
      status: 'cancelled',
      createTime: '2024-01-16 16:45:00',
    },
  ]);

  const getStatusType = (status: string) => {
    const types: Record<string, TAGTYPE> = {
      pending: 'info',
      paid: 'warning',
      shipped: 'primary',
      completed: 'success',
      cancelled: 'danger',
    };
    const statusType = types[status] || 'info';
    return statusType;
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待支付',
      paid: '已支付',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消',
    };
    return texts[status] || status;
  };

  const handleSearch = () => {
    ElMessage.info(`搜索: ${searchKeyword.value}`);
  };

  const handleExport = () => {
    ElMessage.success('导出成功');
  };

  const handleView = (row: Order) => {
    router.push(`/business/orders/${row.id}`);
  };

  const handleEdit = (row: Order) => {
    ElMessage.info(`编辑订单: ${row.id}`);
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    ElMessage.info(`每页 ${val} 条`);
  };

  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    ElMessage.info(`当前页: ${val}`);
  };
</script>

<style scoped>
  .order-list {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-actions {
      display: flex;
      align-items: center;
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
