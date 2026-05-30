<template>
  <div class="order-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单详情</span>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </template>

      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="订单号">{{ orderInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderInfo.status)">
            {{ getStatusText(orderInfo.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ orderInfo.customer }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额"
          >¥{{ orderInfo.amount.toFixed(2) }}</el-descriptions-item
        >
        <el-descriptions-item label="创建时间">{{ orderInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{
          orderInfo.address
        }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{
          orderInfo.remark || '无'
        }}</el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <h4>订单商品</h4>
      <el-table :data="orderItems" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="120">
          <template #default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="total" label="小计" width="120">
          <template #default="{ row }"> ¥{{ (row.price * row.quantity).toFixed(2) }} </template>
        </el-table-column>
      </el-table>

      <div class="order-actions">
        <el-button type="primary" @click="handlePrint">打印订单</el-button>
        <el-button type="success" @click="handleConfirm">确认发货</el-button>
        <el-button type="danger" @click="handleCancel">取消订单</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import type { TAGTYPE } from '@/types/elementTypes';

  const route = useRoute();
  const router = useRouter();

  interface OrderInfo {
    id: string;
    customer: string;
    phone: string;
    amount: number;
    status: string;
    createTime: string;
    address: string;
    remark: string;
  }

  interface OrderItem {
    name: string;
    price: number;
    quantity: number;
  }

  const orderInfo = ref<OrderInfo>({
    id: '',
    customer: '',
    phone: '',
    amount: 0,
    status: '',
    createTime: '',
    address: '',
    remark: '',
  });

  const orderItems = ref<OrderItem[]>([]);

  const fetchOrderDetail = (id: string) => {
    // 模拟数据
    orderInfo.value = {
      id: id,
      customer: '张三',
      phone: '13800138000',
      amount: 299.0,
      status: 'paid',
      createTime: '2024-01-15 10:30:00',
      address: '北京市朝阳区xxx街道xxx号',
      remark: '请尽快发货',
    };

    orderItems.value = [
      { name: '商品A', price: 99.0, quantity: 2 },
      { name: '商品B', price: 101.0, quantity: 1 },
    ];
  };

  const getStatusType = (status: string) => {
    const types: Record<string, TAGTYPE> = {
      pending: 'info',
      paid: 'warning',
      shipped: 'primary',
      completed: 'success',
      cancelled: 'danger',
    };
    return types[status] || 'info';
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

  const goBack = () => {
    router.push('/business/orders');
  };

  const handlePrint = () => {
    ElMessage.info('打印订单');
  };

  const handleConfirm = () => {
    ElMessage.success('确认发货成功');
  };

  const handleCancel = () => {
    ElMessage.warning('订单已取消');
  };

  onMounted(() => {
    const orderId = route.params.id as string;
    // 模拟获取订单详情
    fetchOrderDetail(orderId);
  });
</script>

<style scoped>
  .order-detail {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h4 {
      margin: 0;
      font-size: 16px;
      color: #303133;
    }

    .order-actions {
      margin-top: 30px;
      text-align: center;
    }
  }
</style>
