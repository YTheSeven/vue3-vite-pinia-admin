import type { FormInstance } from 'element-plus';
import type { GoodsForm } from './useGoodsDialog';
import type { Ref } from 'vue';

/** useGoodsForm 返回类型 */
export interface UseGoodsFormReturn {
  // 表单引用
  formRef: Ref<FormInstance | undefined>;
  // 弹窗标题
  dialogTitle: Ref<string>;
  // 处理关闭
  handleClose: () => void;
  // 处理提交
  handleSubmit: () => Promise<void>;
  // 封面上传成功
  onCoverSuccess: (response: unknown) => void;
  // 图片上传成功
  onImageSuccess: (response: unknown) => void;
  // 上传前校验
  beforeUpload: (file: File) => boolean;
}

/**
 * 商品表单逻辑 Hook
 * @param isEdit 是否为编辑模式
 * @param form 表单数据
 * @param emit 事件发射函数
 * @returns 表单相关的状态和方法
 */
export function useGoodsForm(
  isEdit: Ref<boolean>,
  form: Ref<GoodsForm>,
  emit: {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit'): void;
    (e: 'cover-success', response: unknown): void;
    (e: 'image-success', response: unknown): void;
  }
): UseGoodsFormReturn {
  // 表单引用
  const formRef = ref<FormInstance>();

  // 弹窗标题
  const dialogTitle = computed(() => (isEdit.value ? '编辑商品' : '新增商品'));

  // 处理关闭
  const handleClose = (): void => {
    emit('update:visible', false);
  };

  // 处理提交
  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return;

    // 表单验证
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) return;

    // 验证 SKU
    const invalidSku = form.value.sku_info.some(
      (sku) => !sku.name || !sku.price || sku.reserve < 0
    );
    if (invalidSku) {
      ElMessage.error('请完善SKU信息');
      return;
    }

    emit('submit');
  };

  // 封面上传成功
  const onCoverSuccess = (response: unknown): void => {
    emit('cover-success', response);
  };

  // 图片上传成功
  const onImageSuccess = (response: unknown): void => {
    emit('image-success', response);
  };

  // 上传前校验
  const beforeUpload = (file: File): boolean => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      ElMessage.error('只能上传图片文件!');
      return false;
    }
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB!');
      return false;
    }
    return true;
  };

  // 暴露表单引用
  return {
    formRef,
    dialogTitle,
    handleClose,
    handleSubmit,
    onCoverSuccess,
    onImageSuccess,
    beforeUpload,
  };
}
