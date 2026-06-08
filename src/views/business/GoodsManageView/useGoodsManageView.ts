import type { GoodsInfo, GoodsDetail } from '@/types/modules/goods';
import type { Ref, ComputedRef } from 'vue';

import { goodsApi } from '@/api/modules/goods';
import { useGoodsDialog } from './composables/useGoodsDialog';
import type { GoodsForm } from './composables/useGoodsDialog';
import type { FormRules } from 'element-plus';

/** useGoodsManageView 返回类型 */
export interface UseGoodsManageViewReturn {
  // 加载状态
  isLoading: Ref<boolean>;
  submitLoading: Ref<boolean>;

  // 分页数据
  pageNum: Ref<number>;
  pageSize: Ref<number>;
  total: Ref<number>;

  // 数据
  goodsList: Ref<GoodsInfo[]>;
  searchKeyword: Ref<string>;
  filteredGoodsList: ComputedRef<GoodsInfo[]>;

  // 弹窗（来自 useGoodsDialog）
  dialogVisible: Ref<boolean>;
  isEdit: Ref<boolean>;
  form: Ref<GoodsForm>;
  formRules: FormRules;
  handleAdd: () => void;
  handleEdit: (row: GoodsInfo) => Promise<void>;
  handleSubmit: () => Promise<void>;
  addSku: () => void;
  removeSku: (index: number) => void;
  handleCoverSuccess: (response: unknown) => void;
  handleCoverRemove: () => void;
  handleImageSuccess: (response: unknown) => void;
  handleImageRemove: (url: string) => void;

  // 查看详情相关
  detailDrawerVisible: Ref<boolean>;
  goodsDetail: Ref<GoodsDetail | null>;
  handleView: (row: GoodsInfo) => Promise<void>;

  // 上下架相关
  handleToggleShelf: (row: GoodsInfo, isOnShelf: boolean) => Promise<void>;

  // 分页相关
  handleSizeChange: (val: number) => void;
  handleCurrentChange: (val: number) => void;

  // 其他
  fetchGoodsList: () => Promise<void>;
  handleSearch: () => void;
}

/**
 * 商品管理页面业务逻辑 Hook
 * @returns 商品管理相关的状态和方法
 */
export function useGoodsManageView(): UseGoodsManageViewReturn {
  // ==================== 加载状态 ====================
  const isLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);

  // ==================== 分页数据 ====================
  const pageNum = ref<number>(1);
  const pageSize = ref<number>(10);
  const total = ref<number>(0);

  // ==================== 数据管理 ====================
  const goodsList = ref<GoodsInfo[]>([]);
  const searchKeyword = ref<string>('');

  // 过滤后的商品列表
  const filteredGoodsList = computed<GoodsInfo[]>(() => {
    if (!searchKeyword.value) return goodsList.value;
    const keyword = searchKeyword.value.toLowerCase();
    return goodsList.value.filter((goods) => goods.goods_name.toLowerCase().includes(keyword));
  });

  // ==================== API 调用 ====================
  /** 获取商品列表 */
  const fetchGoodsList = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const res = await goodsApi.getGoodsList({
        page_num: pageNum.value,
        page_size: pageSize.value,
      });
      goodsList.value = res.list ?? [];
      total.value = res.total ?? 0;
    } catch (error) {
      ElMessage.error('获取商品列表失败');
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  /** 搜索处理 */
  const handleSearch = (): void => {
    pageNum.value = 1;
    void fetchGoodsList();
  };

  // ==================== 使用弹窗 Hook ====================
  const goodsDialog = useGoodsDialog(fetchGoodsList);

  // 包装提交方法以添加 loading 状态
  const handleSubmit = async (): Promise<void> => {
    submitLoading.value = true;
    try {
      await goodsDialog.submitForm();
    } finally {
      submitLoading.value = false;
    }
  };

  // ==================== 查看详情 ====================
  const detailDrawerVisible = ref<boolean>(false);
  const goodsDetail = ref<GoodsDetail | null>(null);

  /** 查看商品详情 */
  const handleView = async (row: GoodsInfo): Promise<void> => {
    try {
      const detail = await goodsApi.getGoodsDetail(String(row.id));
      goodsDetail.value = detail;
      detailDrawerVisible.value = true;
    } catch {
      ElMessage.error('获取商品详情失败');
    }
  };

  // ==================== 上下架 ====================
  /** 切换商品上下架状态 */
  const handleToggleShelf = async (row: GoodsInfo, isOnShelf: boolean): Promise<void> => {
    try {
      await ElMessageBox.confirm(
        `确定${isOnShelf ? '上架' : '下架'}商品 "${row.goods_name}" 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );

      submitLoading.value = true;
      try {
        if (isOnShelf) {
          await goodsApi.onShelfGoods(String(row.id));
        } else {
          await goodsApi.offShelfGoods(String(row.id));
        }
        ElMessage.success(`${isOnShelf ? '上架' : '下架'}成功`);
        await fetchGoodsList();
      } catch {
        ElMessage.error(`${isOnShelf ? '上架' : '下架'}失败`);
      } finally {
        submitLoading.value = false;
      }
    } catch {
      // 用户取消操作
    }
  };

  // ==================== 分页 ====================
  const handleSizeChange = (val: number): void => {
    pageSize.value = val;
    pageNum.value = 1;
    void fetchGoodsList();
  };

  const handleCurrentChange = (val: number): void => {
    pageNum.value = val;
    void fetchGoodsList();
  };

  // ==================== 生命周期 ====================
  onMounted(async () => {
    await fetchGoodsList();
  });

  return {
    // 加载状态
    isLoading,
    submitLoading,

    // 分页
    pageNum,
    pageSize,
    total,

    // 数据
    goodsList,
    searchKeyword,
    filteredGoodsList,

    // 弹窗（来自 useGoodsDialog）
    dialogVisible: goodsDialog.dialogVisible,
    isEdit: goodsDialog.isEdit,
    form: goodsDialog.form,
    formRules: goodsDialog.formRules,
    handleAdd: goodsDialog.openAddDialog,
    handleEdit: goodsDialog.openEditDialog,
    handleSubmit,
    addSku: goodsDialog.addSku,
    removeSku: goodsDialog.removeSku,
    handleCoverSuccess: goodsDialog.handleCoverSuccess,
    handleCoverRemove: goodsDialog.handleCoverRemove,
    handleImageSuccess: goodsDialog.handleImageSuccess,
    handleImageRemove: goodsDialog.handleImageRemove,

    // 查看详情
    detailDrawerVisible,
    goodsDetail,
    handleView,

    // 上下架
    handleToggleShelf,

    // 分页
    handleSizeChange,
    handleCurrentChange,

    // 其他
    fetchGoodsList,
    handleSearch,
  };
}
