<script setup lang="ts">
  import type { FormRules } from 'element-plus';
  import type { GoodsForm } from '../composables/useGoodsDialog';

  import WangEditor from '@/components/WangEditor.vue';

  import { useGoodsForm } from '../composables/useGoodsForm';
  import { useDevice } from '@/composables/useDevice';

  // Props
  const props = defineProps<{
    visible: boolean;
    isEdit: boolean;
    form: GoodsForm;
    formRules: FormRules;
    submitLoading: boolean;
  }>();

  // Emits
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'update:form', value: GoodsForm): void;
    (e: 'submit'): void;
    (e: 'add-sku'): void;
    (e: 'remove-sku', index: number): void;
    (e: 'cover-success', response: unknown): void;
    (e: 'cover-remove'): void;
    (e: 'image-success', response: unknown): void;
    (e: 'image-remove', url: string): void;
  }>();

  // 本地表单数据 - 使用 computed 避免直接修改 prop
  const form = computed<GoodsForm>({
    get: () => props.form,
    set: (val) => emit('update:form', val),
  });

  // 设备检测
  const { isMobile } = useDevice();

  // 使用表单逻辑 Hook
  const {
    formRef,
    dialogTitle,
    handleClose,
    handleSubmit,
    onCoverSuccess,
    onImageSuccess,
    beforeUpload,
  } = useGoodsForm(toRef(props, 'isEdit'), form, emit);

  // 暴露表单引用供父组件使用
  defineExpose({
    formRef,
  });
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    :width="isMobile ? '95%' : '800px'"
    :fullscreen="isMobile"
    destroy-on-close
    class="goods-dialog"
    @update:model-value="(val) => emit('update:visible', val)"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-width="isMobile ? '80px' : '100px'"
      :label-position="isMobile ? 'top' : 'right'"
      status-icon
    >
      <!-- 商品名称 -->
      <el-form-item label="商品名称" prop="goods_name">
        <el-input
          v-model="form.goods_name"
          placeholder="请输入商品名称"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <!-- 商品封面 -->
      <el-form-item label="商品封面" prop="goods_cover">
        <el-upload
          class="avatar-uploader"
          action="/api/goods/upload"
          :show-file-list="false"
          :on-success="onCoverSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="form.goods_cover" :src="form.goods_cover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
        </el-upload>
        <el-button
          v-if="form.goods_cover"
          type="danger"
          link
          size="small"
          class="ml-2"
          @click="emit('cover-remove')"
        >
          <i-ep-delete class="mr-1" />
          删除封面
        </el-button>
      </el-form-item>

      <!-- 商品图片集 -->
      <el-form-item label="商品图片" prop="goods_images">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(url, index) in form.goods_images"
            :key="index"
            class="relative w-20 h-20 group"
          >
            <el-image :src="url" fit="cover" class="w-full h-full rounded" />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <el-button type="danger" circle size="small" @click="emit('image-remove', url)">
                <i-ep-delete />
              </el-button>
            </div>
          </div>
          <el-upload
            action="/api/goods/upload"
            :show-file-list="false"
            :on-success="onImageSuccess"
            :before-upload="beforeUpload"
          >
            <div
              class="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-colors"
            >
              <el-icon class="text-2xl text-gray-400"><i-ep-plus /></el-icon>
            </div>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 商品描述 - 富文本编辑器 -->
      <el-form-item label="商品描述" prop="description">
        <WangEditor v-model="form.description" :height="250" placeholder="请输入商品描述..." />
      </el-form-item>

      <!-- SKU 信息 -->
      <el-form-item label="SKU 信息" prop="sku_info">
        <div class="w-full">
          <div
            v-for="(sku, index) in form.sku_info"
            :key="index"
            class="flex gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex-1 grid grid-cols-3 gap-2">
              <el-input v-model="sku.name" placeholder="SKU名称" />
              <el-input v-model="sku.price" placeholder="价格">
                <template #prefix>¥</template>
              </el-input>
              <el-input-number v-model="sku.reserve" :min="0" placeholder="库存" class="w-full" />
            </div>
            <el-button type="danger" circle @click="emit('remove-sku', index)">
              <i-ep-delete />
            </el-button>
          </div>
          <el-button type="primary" plain @click="emit('add-sku')">
            <i-ep-plus class="mr-1" />
            添加 SKU
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <el-button class="w-full sm:w-auto" @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          class="w-full sm:w-auto"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
  :deep(.avatar-uploader) {
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  :deep(.avatar-uploader:hover) {
    border-color: #3b82f6;
  }

  :deep(.avatar-uploader .avatar) {
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    border-radius: 0.5rem;
  }

  :deep(.avatar-uploader .avatar-uploader-icon) {
    width: 8rem;
    height: 8rem;
    font-size: 1.5rem;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.goods-dialog .el-dialog__body) {
    max-height: 70vh;
    overflow-y: auto;
  }
</style>
