<template>
  <div class="p-4">
    <el-card v-loading="loading" class="dark:border-gray-700 dark:bg-gray-800">
      <template #header>
        <div
          class="print-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <div class="flex items-center gap-3">
            <span class="text-base font-medium text-gray-800 dark:text-gray-100">订单详情</span>
            <el-tag :type="getStatusType(orderInfo.status)" class="text-xs">
              {{ getStatusText(orderInfo.status) }}
            </el-tag>
          </div>
          <el-button class="no-print" @click="goBack">返回列表</el-button>
        </div>
      </template>

      <!-- 订单信息 - 桌面端 -->
      <el-descriptions
        title="基本信息"
        :column="2"
        border
        class="hidden sm:block dark:border-gray-700"
      >
        <el-descriptions-item label="订单号">{{ orderInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderInfo.create_time }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ orderInfo.customer }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">
          <span class="text-red-500 dark:text-red-400 font-medium text-base">
            ¥{{ Number(orderInfo.amount || 0).toFixed(2) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="实付金额">
          <span class="text-red-500 dark:text-red-400 font-medium text-base">
            ¥{{ Number(orderInfo.amount || 0).toFixed(2) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{
          orderInfo.address
        }}</el-descriptions-item>
        <el-descriptions-item label="订单备注" :span="2">
          <span class="text-gray-600 dark:text-gray-400">{{ orderInfo.remark || '无' }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 订单信息 - 移动端卡片 -->
      <div class="sm:hidden space-y-4">
        <div class="text-base font-medium text-gray-800 dark:text-gray-100 mb-3">基本信息</div>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
          <div
            class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">订单号</span>
            <span class="text-gray-800 dark:text-gray-200 text-sm font-mono">{{
              orderInfo.id
            }}</span>
          </div>
          <div
            class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">创建时间</span>
            <span class="text-gray-800 dark:text-gray-200 text-sm">{{
              orderInfo.create_time
            }}</span>
          </div>
          <div
            class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">客户名称</span>
            <span class="text-gray-800 dark:text-gray-200 text-sm">{{ orderInfo.customer }}</span>
          </div>
          <div
            class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">联系电话</span>
            <span class="text-gray-800 dark:text-gray-200 text-sm">{{ orderInfo.phone }}</span>
          </div>
          <div
            class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">订单金额</span>
            <span class="text-red-500 dark:text-red-400 font-medium"
              >¥{{ Number(orderInfo.amount || 0).toFixed(2) }}</span
            >
          </div>
          <div
            class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">实付金额</span>
            <span class="text-red-500 dark:text-red-400 font-medium"
              >¥{{ Number(orderInfo.amount || 0).toFixed(2) }}</span
            >
          </div>
          <div class="pt-1">
            <span class="text-gray-500 dark:text-gray-400 text-sm block mb-1">收货地址</span>
            <span class="text-gray-800 dark:text-gray-200 text-sm">{{ orderInfo.address }}</span>
          </div>
          <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-gray-500 dark:text-gray-400 text-sm block mb-1">订单备注</span>
            <span class="text-gray-600 dark:text-gray-400 text-sm">{{
              orderInfo.remark || '无'
            }}</span>
          </div>
        </div>
      </div>

      <el-divider class="dark:border-gray-700" />

      <!-- 商品列表 - 桌面端 -->
      <div class="hidden sm:block">
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-base font-medium text-gray-800 dark:text-gray-100 m-0">订单商品</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >共 {{ orderItems.length }} 件商品</span
          >
        </div>
        <el-table :data="orderItems" border class="w-full mt-4 dark:border-gray-700">
          <el-table-column label="商品" min-width="300">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <el-image :src="row.goods_cover" class="w-15 h-15 rounded shrink-0" fit="cover" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {{ row.goods_name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goods_price" label="单价" width="120">
            <template #default="{ row }"> ¥{{ row.goods_price.toFixed(2) }} </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              ¥{{ (row.goods_price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 商品列表 - 移动端卡片 -->
      <div class="sm:hidden">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-base font-medium text-gray-800 dark:text-gray-100">订单商品</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >共 {{ orderItems.length }} 件</span
          >
        </div>
        <div class="space-y-3">
          <div
            v-for="(item, index) in orderItems"
            :key="index"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
          >
            <div class="flex gap-3 mb-3">
              <el-image :src="item.goods_cover" class="w-16 h-16 rounded shrink-0" fit="cover" />
              <div class="flex-1 min-w-0">
                <div
                  class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed mb-1"
                >
                  {{ item.goods_name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  单价：¥{{ item.goods_price.toFixed(2) }}
                </div>
              </div>
            </div>
            <div
              class="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >数量：{{ item.quantity }}</span
              >
              <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
                小计：<span class="text-red-500 dark:text-red-400"
                  >¥{{ (item.goods_price * item.quantity).toFixed(2) }}</span
                >
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单金额汇总 -->
      <div class="mt-6 p-4 sm:px-6 bg-gray-100 dark:bg-gray-700/50 rounded">
        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>商品总价：</span>
            <span class="font-mono">¥{{ calculateSubtotal.toFixed(2) }}</span>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <span class="text-gray-600 dark:text-gray-400">实付金额：</span>
            <span class="text-red-500 dark:text-red-400 text-xl font-semibold font-mono">
              ¥{{ Number(orderInfo.amount || 0).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <!-- 状态: 0=已取消, 1=待支付, 2=已支付, 3=已发货, 4=已完成 -->
      <div class="mt-8 flex justify-center gap-4 no-print">
        <el-button type="primary" @click="handlePrint">打印订单</el-button>
        <!-- 已支付状态(status=2)可以发货 -->
        <el-button v-if="orderInfo.status === 2" type="success" @click="handleShip"
          >确认发货</el-button
        >
        <!-- 待支付(1)和已支付(2)状态可以取消订单 -->
        <el-button
          v-if="orderInfo.status === 1 || orderInfo.status === 2"
          type="danger"
          @click="handleCancel"
        >
          取消订单
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { useOrderDetailView } from './useOrderDetailView';

  const {
    loading,
    orderInfo,
    orderItems,
    calculateSubtotal,
    getStatusType,
    getStatusText,
    goBack,
    handlePrint,
    handleShip,
    handleCancel,
  } = useOrderDetailView();
</script>

<style scoped>
  @media print {
    /* 隐藏非打印元素 */
    .no-print {
      display: none !important;
    }

    /* 打印时隐藏卡片头部操作按钮区域 */
    :deep(.el-card__header) {
      border-bottom: 1px solid #e4e7ed;
    }

    /* 确保打印区域有适当边距 */
    .p-4 {
      padding: 0;
    }

    /* 打印时移除阴影和边框 */
    :deep(.el-card) {
      box-shadow: none;
      border: none;
    }

    /* 确保背景色打印出来 */
    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
