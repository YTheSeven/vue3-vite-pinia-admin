<script setup lang="ts">
  import { useOrderListView } from './useOrderListView';

  const {
    loading,
    searchKeyword,
    currentPage,
    pageSize,
    total,
    statusFilter,
    orderList,
    statusOptions,
    getStatusType,
    getStatusText,
    handleSearch,
    handleStatusChange,
    handleExport,
    handleView,
    handleCancel,
    handleSizeChange,
    handleCurrentChange,
  } = useOrderListView();
</script>

<template>
  <div class="p-4">
    <el-card class="dark:border-gray-700 dark:bg-gray-800">
      <template #header>
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <span class="text-lg font-medium text-gray-800 dark:text-gray-100">订单列表</span>
          <div class="flex flex-wrap items-center gap-2">
            <el-select
              v-model="statusFilter"
              placeholder="订单状态"
              clearable
              class="w-30"
              @change="handleStatusChange"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号/客户名称/商品"
              class="w-30"
              clearable
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" class="hidden sm:inline-flex" @click="handleExport">
              导出
            </el-button>
          </div>
        </div>
      </template>

      <!-- 桌面端表格 -->
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        class="w-full hidden md:block dark:border-gray-700"
      >
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column label="商品信息" min-width="250">
          <template #default="{ row }">
            <div>
              <div
                v-for="(goods, index) in row.goods_snapshot.slice(0, 2)"
                :key="index"
                class="flex items-center mb-2 last:mb-0"
              >
                <el-image :src="goods.goods_img" class="w-12.5 h-12.5 rounded mr-2.5" fit="cover" />
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] text-gray-700 dark:text-gray-200 truncate max-w-50">
                    {{ goods.goods_name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ¥{{ goods.goods_price }} × {{ goods.quantity }}
                  </div>
                </div>
              </div>
              <div
                v-if="row.goods_snapshot.length > 2"
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                共 {{ row.item_count }} 件商品
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货人" width="150">
          <template #default="{ row }">
            <div class="dark:text-gray-200">{{ row.receiver_name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ row.receiver_phone }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="120">
          <template #default="{ row }">
            <div>
              <div class="font-medium text-red-500 dark:text-red-400">
                ¥{{ row.pay_amount.toFixed(2) }}
              </div>
              <div
                v-if="row.pay_amount < row.total_amount"
                class="text-xs text-gray-500 dark:text-gray-500 line-through mt-0.5"
              >
                ¥{{ row.total_amount.toFixed(2) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160" />
        <!-- 操作列：状态 0=已取消, 1=待支付, 2=已支付, 3=已发货, 4=已完成 -->
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)"> 查看 </el-button>
            <!-- 只有待支付(1)和已支付(2)可以取消 -->
            <el-button
              v-if="row.status === 1 || row.status === 2"
              type="danger"
              link
              size="small"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 移动端卡片列表 -->
      <div class="md:hidden space-y-3">
        <div
          v-for="order in orderList"
          :key="order.id"
          class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div
            class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100 dark:border-gray-700"
          >
            <span class="font-mono text-sm text-gray-600 dark:text-gray-300">#{{ order.id }}</span>
            <el-tag :type="getStatusType(order.status)" size="small">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>
          <div class="mb-3">
            <div
              v-for="(goods, index) in order.goods_snapshot.slice(0, 2)"
              :key="index"
              class="flex items-start mb-2 last:mb-0"
            >
              <el-image
                :src="goods.goods_img"
                class="w-14 h-14 rounded mr-3 shrink-0"
                fit="cover"
              />
              <div class="flex-1 min-w-0">
                <div class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                  {{ goods.goods_name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ¥{{ goods.goods_price }} × {{ goods.quantity }}
                </div>
              </div>
            </div>
            <div
              v-if="order.goods_snapshot.length > 2"
              class="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center"
            >
              共 {{ order.item_count }} 件商品
            </div>
          </div>
          <div
            class="text-xs text-gray-500 dark:text-gray-400 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="flex justify-between mb-1 last:mb-0">
              <span>收货人：{{ order.receiver_name }}</span>
              <span>{{ order.receiver_phone }}</span>
            </div>
            <div class="flex justify-between mb-1 last:mb-0">
              <span>创建时间：{{ order.create_time }}</span>
            </div>
          </div>
          <!-- 移动端操作按钮：状态 0=已取消, 1=待支付, 2=已支付, 3=已发货, 4=已完成 -->
          <div class="flex justify-between items-center">
            <div class="text-sm dark:text-gray-200">
              实付：<span class="text-red-500 dark:text-red-400 font-semibold"
                >¥{{ order.pay_amount.toFixed(2) }}</span
              >
            </div>
            <div class="flex gap-2">
              <el-button type="primary" link size="small" @click="handleView(order)">
                查看
              </el-button>
              <!-- 只有待支付(1)和已支付(2)可以取消 -->
              <el-button
                v-if="order.status === 1 || order.status === 2"
                type="danger"
                link
                size="small"
                @click="handleCancel(order)"
              >
                取消
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          size="small"
          class="dark:text-gray-300"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
