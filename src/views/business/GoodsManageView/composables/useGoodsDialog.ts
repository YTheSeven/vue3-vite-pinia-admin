import type { FormInstance, FormRules } from 'element-plus';
import type {
  GoodsInfo,
  // SkuInfo,
  PublishGoodsParams,
  UpdateGoodsParams,
} from '@/types/modules/goods';
import type { Ref } from 'vue';

import { goodsApi } from '@/api/modules/goods';

/** SKU 表单 */
export interface SkuForm {
  id?: number;
  name: string;
  price: string;
  reserve: number;
}

/** 商品表单 */
export interface GoodsForm {
  goods_name: string;
  goods_cover: string;
  goods_images: string[];
  description: string;
  sku_info: SkuForm[];
}

/** useGoodsDialog 返回类型 */
export interface UseGoodsDialogReturn {
  // 表单数据
  form: Ref<GoodsForm>;
  formRules: FormRules;
  currentEditId: Ref<number>;
  isEdit: Ref<boolean>;

  // 弹窗控制
  dialogVisible: Ref<boolean>;
  openAddDialog: () => void;
  openEditDialog: (row: GoodsInfo) => Promise<void>;
  closeDialog: () => void;

  // 表单操作
  resetForm: () => void;
  validateForm: (formRef: FormInstance | undefined) => Promise<boolean>;
  submitForm: () => Promise<void>;

  // SKU 操作
  addSku: () => void;
  removeSku: (index: number) => void;

  // 图片操作
  handleCoverSuccess: (response: unknown) => void;
  handleCoverRemove: () => void;
  handleImageSuccess: (response: unknown) => void;
  handleImageRemove: (url: string) => void;
  beforeUpload: (file: File) => boolean;
}

/**
 * 商品弹窗逻辑 Hook
 * @param fetchList 刷新列表的回调函数
 * @returns 弹窗相关的状态和方法
 */
export function useGoodsDialog(fetchList: () => Promise<void>): UseGoodsDialogReturn {
  // ==================== 弹窗状态 ====================
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const currentEditId = ref(0);

  // ==================== 表单数据 ====================
  const form = ref<GoodsForm>({
    goods_name: '',
    goods_cover: '',
    goods_images: [],
    description: '',
    sku_info: [{ name: '', price: '', reserve: 0 }],
  });

  // ==================== 表单验证规则 ====================
  const formRules: FormRules = {
    goods_name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
    ],
    goods_cover: [{ required: true, message: '请上传商品封面', trigger: 'change' }],
    description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
    sku_info: [{ required: true, message: '请至少添加一个SKU', trigger: 'change' }],
  };

  // ==================== 表单操作 ====================
  /** 重置表单 */
  const resetForm = (): void => {
    form.value = {
      goods_name: '',
      goods_cover: '',
      goods_images: [],
      description: '',
      sku_info: [{ name: '', price: '', reserve: 0 }],
    };
  };

  /** 打开新增弹窗 */
  const openAddDialog = (): void => {
    isEdit.value = false;
    currentEditId.value = 0;
    resetForm();
    dialogVisible.value = true;
  };

  /** 打开编辑弹窗 */
  const openEditDialog = async (row: GoodsInfo): Promise<void> => {
    try {
      const detail = await goodsApi.getGoodsDetail(String(row.id));
      currentEditId.value = row.id;
      isEdit.value = true;
      form.value = {
        goods_name: detail.goods_name,
        goods_cover: detail.goods_cover,
        goods_images: detail.goods_images || [],
        description: '', // API 返回中可能没有 description，需要根据实际情况调整
        sku_info: detail.sku_info.map((sku) => ({
          id: sku.id,
          name: sku.name,
          price: sku.price,
          reserve: sku.reserve,
        })),
      };
      dialogVisible.value = true;
    } catch {
      ElMessage.error('获取商品详情失败');
    }
  };

  /** 关闭弹窗 */
  const closeDialog = (): void => {
    dialogVisible.value = false;
    resetForm();
  };

  /** 验证表单 */
  const validateForm = async (formRef: FormInstance | undefined): Promise<boolean> => {
    if (!formRef) return false;

    let isValid = false;
    await formRef.validate((valid) => {
      isValid = valid;
    });

    if (!isValid) return false;

    // 验证 SKU
    const invalidSku = form.value.sku_info.some(
      (sku) => !sku.name || !sku.price || sku.reserve < 0
    );
    if (invalidSku) {
      ElMessage.error('请完善SKU信息');
      return false;
    }

    return true;
  };

  /** 提交表单 */
  const submitForm = async (): Promise<void> => {
    if (isEdit.value) {
      // 编辑
      const params: UpdateGoodsParams = {
        goods_name: form.value.goods_name,
        goods_cover: form.value.goods_cover,
        goods_images: form.value.goods_images,
        description: form.value.description,
        sku_info: form.value.sku_info.map((sku) => ({
          id: sku.id ?? 0,
          name: sku.name,
          price: sku.price,
          reserve: sku.reserve,
        })),
      };
      await goodsApi.updateGoods(String(currentEditId.value), params);
      ElMessage.success('更新商品成功');
    } else {
      // 新增
      const params: PublishGoodsParams = {
        goods_name: form.value.goods_name,
        goods_cover: form.value.goods_cover,
        goods_images: form.value.goods_images,
        description: form.value.description,
        sku_info: form.value.sku_info.map((sku) => ({
          id: sku.id ?? 0,
          name: sku.name,
          price: sku.price,
          reserve: sku.reserve,
        })),
      };
      await goodsApi.publishGoods(params);
      ElMessage.success('新增商品成功');
    }

    dialogVisible.value = false;
    await fetchList();
  };

  // ==================== SKU 操作 ====================
  /** 添加 SKU */
  const addSku = (): void => {
    form.value.sku_info.push({ name: '', price: '', reserve: 0 });
  };

  /** 删除 SKU */
  const removeSku = (index: number): void => {
    if (form.value.sku_info.length <= 1) {
      ElMessage.warning('至少需要保留一个SKU');
      return;
    }
    form.value.sku_info.splice(index, 1);
  };

  // ==================== 图片操作 ====================
  /** 封面上传成功 */
  const handleCoverSuccess = (response: unknown): void => {
    const res = response as { url: string };
    form.value.goods_cover = res.url;
    ElMessage.success('封面上传成功');
  };

  /** 封面删除 */
  const handleCoverRemove = (): void => {
    form.value.goods_cover = '';
  };

  /** 图片集上传成功 */
  const handleImageSuccess = (response: unknown): void => {
    const res = response as { url: string };
    if (res.url) {
      form.value.goods_images.push(res.url);
    }
    ElMessage.success('图片上传成功');
  };

  /** 图片集删除 */
  const handleImageRemove = (url: string): void => {
    const index = form.value.goods_images.indexOf(url);
    if (index > -1) {
      form.value.goods_images.splice(index, 1);
    }
  };

  /** 上传前校验 */
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

  return {
    // 表单
    form,
    formRules,
    currentEditId,
    isEdit,

    // 弹窗控制
    dialogVisible,
    openAddDialog,
    openEditDialog,
    closeDialog,

    // 表单操作
    resetForm,
    validateForm,
    submitForm,

    // SKU
    addSku,
    removeSku,

    // 图片
    handleCoverSuccess,
    handleCoverRemove,
    handleImageSuccess,
    handleImageRemove,
    beforeUpload,
  };
}
