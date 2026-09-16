<script setup lang="ts">
  import type { OrderDetail } from '@/types/modules/order';
  import { OrderStatusMap } from '@/types/modules/order';
  import { useDevice } from '@/composables/useDevice';

  // Props
  const props = defineProps<{
    visible: boolean;
    order: OrderDetail | null;
    loading: boolean;
  }>();

  // Emits
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
  }>();

  // 设备检测
  const { isMobile } = useDevice();

  // 状态展示映射
  const getStatusType = (status: number): 'info' | 'warning' | 'primary' | 'success' | 'danger' => {
    return OrderStatusMap[status]?.type || 'info';
  };

  const getStatusText = (status: number): string => {
    return OrderStatusMap[status]?.text || '未知状态';
  };

  // 商品金额合计
  const totalAmount = computed(() => {
    if (!props.order) return '0.00';
    const total = props.order.goods_info.reduce(
      (sum, goods) => sum + goods.goods_price * goods.quantity,
      0
    );
    return total.toFixed(2);
  });
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="订单详情"
    :width="isMobile ? '95%' : '720px'"
    :fullscreen="isMobile"
    destroy-on-close
    class="order-detail-dialog"
    @update:model-value="(val) => emit('update:visible', val)"
  >
    <div v-loading="loading">
      <template v-if="order">
        <!-- 基本信息 -->
        <el-descriptions :column="isMobile ? 1 : 2" border class="mb-5 dark:border-gray-700">
          <el-descriptions-item label="订单号" :span="isMobile ? 1 : 2">
            <span class="font-mono">{{ order.id }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(order.status)" size="small">
              {{ getStatusText(order.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ order.create_time }}
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">
            {{ order.customer }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ order.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="isMobile ? 1 : 2">
            {{ order.address }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            <span class="text-red-500 dark:text-red-400 font-medium"> ¥{{ order.amount }} </span>
          </el-descriptions-item>
          <el-descriptions-item label="订单备注">
            {{ order.remark || '无' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品明细 -->
        <div class="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">商品明细</div>
        <el-table :data="order.goods_info" border class="w-full dark:border-gray-700">
          <el-table-column label="商品" min-width="220">
            <template #default="{ row }">
              <div class="flex items-center">
                <el-image
                  :src="row.goods_cover"
                  class="w-12.5 h-12.5 rounded mr-2.5 shrink-0"
                  fit="cover"
                />
                <span class="text-[13px] text-gray-700 dark:text-gray-200">
                  {{ row.goods_name }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="110" align="center">
            <template #default="{ row }"> ¥{{ row.goods_price.toFixed(2) }} </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" align="center" />
          <el-table-column label="小计" width="110" align="center">
            <template #default="{ row }">
              <span class="text-red-500 dark:text-red-400">
                ¥{{ (row.goods_price * row.quantity).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-3 text-right text-sm text-gray-600 dark:text-gray-300">
          合计：
          <span class="text-red-500 dark:text-red-400 font-semibold text-base">
            ¥{{ totalAmount }}
          </span>
        </div>
      </template>
    </div>

    <template #footer>
      <el-button :class="isMobile ? 'w-full' : ''" @click="emit('update:visible', false)">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
  :deep(.order-detail-dialog .el-dialog__body) {
    max-height: 70vh;
    overflow-y: auto;
  }
</style>
