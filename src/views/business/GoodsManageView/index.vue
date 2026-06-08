<script setup lang="ts">
  import GoodsFormDialog from './components/GoodsFormDialog.vue';
  import { useGoodsManageView } from './useGoodsManageView';
  import { useDevice } from '@/composables/useDevice';

  const { isMobile } = useDevice();

  const {
    // 加载状态
    isLoading,
    submitLoading,

    // 分页
    pageNum,
    pageSize,
    total,

    // 数据
    searchKeyword,
    filteredGoodsList,

    // 弹窗
    dialogVisible,
    isEdit,
    form,
    formRules,

    // 详情
    detailDrawerVisible,
    goodsDetail,

    // 操作
    handleAdd,
    handleEdit,
    handleView,
    handleToggleShelf,
    handleSizeChange,
    handleCurrentChange,
    handleSearch,
    handleSubmit,

    // SKU
    addSku,
    removeSku,

    // 图片
    handleCoverSuccess,
    handleCoverRemove,
    handleImageSuccess,
    handleImageRemove,
  } = useGoodsManageView();
</script>

<template>
  <div
    class="min-h-screen p-4 transition-colors duration-300 bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-6"
  >
    <div class="mx-auto max-w-7xl">
      <!-- 页面标题 -->
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">商品管理</h1>

      <!-- 卡片容器 -->
      <el-card class="shadow-sm dark:bg-gray-800! dark:border-gray-700!">
        <template #header>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span class="text-lg font-medium text-gray-900 dark:text-gray-100">商品列表</span>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <!-- 搜索栏 -->
              <el-input
                v-model="searchKeyword"
                placeholder="搜索商品名称"
                clearable
                class="w-full sm:w-72"
                @keyup.enter="handleSearch"
              >
                <template #suffix>
                  <i-ep-search class="cursor-pointer" @click="handleSearch" />
                </template>
              </el-input>
              <el-button type="primary" @click="handleAdd">
                <i-ep-plus class="mr-1" />
                新增商品
              </el-button>
            </div>
          </div>
        </template>

        <!-- 商品列表表格 -->
        <el-table
          v-loading="isLoading"
          :data="filteredGoodsList"
          border
          class="w-full dark:bg-gray-800 dark:text-gray-100"
        >
          <el-table-column prop="id" label="商品ID" width="80" align="center" />
          <el-table-column label="商品封面" width="100" align="center">
            <template #default="{ row }">
              <el-image
                :src="row.goods_cover"
                :preview-src-list="[row.goods_cover]"
                fit="cover"
                class="w-16 h-16 rounded"
                hide-on-click-modal
                preview-teleported
              >
                <template #error>
                  <div
                    class="flex items-center justify-center w-16 h-16 bg-gray-200 rounded dark:bg-gray-700"
                  >
                    <i-ep-picture class="text-xl text-gray-400" />
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="goods_price" label="商品价格" width="120" align="center">
            <template #default="{ row }">
              <span class="font-medium text-red-500">¥{{ row.goods_price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_number" label="库存" width="100" align="center" />
          <el-table-column label="操作" :width="isMobile ? 80 : 200" fixed="right" align="center">
            <template #default="{ row }">
              <div class="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <el-button type="primary" link size="small" @click="handleView(row)">
                  <i-ep-view class="mr-1" />
                  查看
                </el-button>
                <el-button type="primary" link size="small" @click="handleEdit(row)">
                  <i-ep-edit class="mr-1" />
                  编辑
                </el-button>
                <el-button
                  v-if="false"
                  type="success"
                  link
                  size="small"
                  @click="handleToggleShelf(row, true)"
                >
                  <i-ep-top class="mr-1" />
                  上架
                </el-button>
                <el-button
                  v-else
                  type="warning"
                  link
                  size="small"
                  @click="handleToggleShelf(row, false)"
                >
                  <i-ep-bottom class="mr-1" />
                  下架
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="flex flex-col sm:flex-row sm:justify-end mt-4 gap-2">
          <!-- 桌面端分页 -->
          <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            class="hidden! sm:flex!"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <!-- 移动端分页 - 简化布局 -->
          <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20]"
            layout="prev, pager, next, sizes"
            :pager-count="3"
            class="flex sm:hidden! justify-center"
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- 商品表单弹窗（新增/编辑共用） -->
      <GoodsFormDialog
        v-model:visible="dialogVisible"
        :is-edit="isEdit"
        :form="form"
        :form-rules="formRules"
        :submit-loading="submitLoading"
        @submit="handleSubmit"
        @add-sku="addSku"
        @remove-sku="removeSku"
        @cover-success="handleCoverSuccess"
        @cover-remove="handleCoverRemove"
        @image-success="handleImageSuccess"
        @image-remove="handleImageRemove"
      />

      <!-- 商品详情抽屉 -->
      <el-drawer
        v-model="detailDrawerVisible"
        title="商品详情"
        :size="isMobile ? '100%' : '500px'"
        destroy-on-close
      >
        <div v-if="goodsDetail" class="p-4">
          <div class="mb-6 text-center">
            <el-image
              :src="goodsDetail.goods_cover"
              fit="cover"
              class="w-48 h-48 rounded-lg"
              :preview-src-list="[goodsDetail.goods_cover]"
            />
          </div>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="商品ID">{{ goodsDetail.id }}</el-descriptions-item>
            <el-descriptions-item label="商品名称">{{
              goodsDetail.goods_name
            }}</el-descriptions-item>
          </el-descriptions>

          <div class="mt-6">
            <h3 class="mb-3 text-lg font-medium">商品图片</h3>
            <div class="flex flex-wrap gap-2">
              <el-image
                v-for="(img, index) in goodsDetail.goods_images"
                :key="index"
                :src="img"
                fit="cover"
                class="w-20 h-20 rounded"
                :preview-src-list="goodsDetail.goods_images"
                :initial-index="index"
              />
            </div>
          </div>

          <div class="mt-6">
            <h3 class="mb-3 text-lg font-medium">SKU 信息</h3>
            <el-table :data="goodsDetail.sku_info" border size="small">
              <el-table-column prop="name" label="SKU名称" />
              <el-table-column prop="price" label="价格" width="100">
                <template #default="{ row }">
                  <span class="text-red-500">¥{{ row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="reserve" label="库存" width="100" />
            </el-table>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
