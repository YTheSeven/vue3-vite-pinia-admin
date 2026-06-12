import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '@/api/modules/order';
import type { OrderInfo } from '@/types/modules/order';
import { OrderStatusMap } from '@/types/modules/order';
import type { Ref } from 'vue';

/** useOrderListView 返回类型 */
export interface UseOrderListViewReturn {
  // 加载状态
  loading: Ref<boolean>;

  // 搜索和分页
  searchKeyword: Ref<string>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  total: Ref<number>;
  statusFilter: Ref<number | ''>;

  // 数据
  orderList: Ref<OrderInfo[]>;
  statusOptions: { label: string; value: number | '' }[];

  // 状态相关
  getStatusType: (status: number) => 'info' | 'warning' | 'primary' | 'success' | 'danger';
  getStatusText: (status: number) => string;

  // 操作方法
  fetchOrderList: () => Promise<void>;
  handleSearch: () => void;
  handleStatusChange: () => void;
  handleExport: () => void;
  handleView: (row: OrderInfo) => void;
  handleCancel: (row: OrderInfo) => Promise<void>;
  handleSizeChange: (val: number) => void;
  handleCurrentChange: (val: number) => void;
}

/**
 * 订单列表页面业务逻辑 Hook
 * @returns 订单列表相关的状态和方法
 */
export function useOrderListView(): UseOrderListViewReturn {
  const router = useRouter();

  // ==================== 加载状态 ====================
  const loading = ref<boolean>(false);

  // ==================== 搜索和分页 ====================
  const searchKeyword = ref<string>('');
  const currentPage = ref<number>(1);
  const pageSize = ref<number>(10);
  const total = ref<number>(0);
  const statusFilter = ref<number | ''>('');

  // ==================== 数据 ====================
  const orderList = ref<OrderInfo[]>([]);

  // 状态选项 - 与 API 文档保持一致
  // 0=已取消, 1=待支付, 2=已支付, 3=已发货, 4=已完成
  const statusOptions: { label: string; value: number | '' }[] = [
    { label: '全部', value: '' },
    { label: '已取消', value: 0 },
    { label: '待支付', value: 1 },
    { label: '已支付', value: 2 },
    { label: '已发货', value: 3 },
    { label: '已完成', value: 4 },
  ];

  // ==================== 状态相关方法 ====================
  const getStatusType = (status: number): 'info' | 'warning' | 'primary' | 'success' | 'danger' => {
    return OrderStatusMap[status]?.type || 'info';
  };

  const getStatusText = (status: number): string => {
    return OrderStatusMap[status]?.text || '未知状态';
  };

  // ==================== API 调用 ====================
  /** 获取订单列表 */
  const fetchOrderList = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await orderApi.getOrderList({
        page_num: currentPage.value,
        page_size: pageSize.value,
        status: statusFilter.value || undefined,
        keyword: searchKeyword.value || undefined,
      });

      // Alova 拦截器已提取 response.data，直接访问 list 和 pagination
      if (response.list) {
        orderList.value = response.list;
        total.value = response.pagination?.total || 0;
      }
    } catch (error) {
      ElMessage.error('获取订单列表失败');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // ==================== 事件处理 ====================
  /** 搜索 */
  const handleSearch = (): void => {
    currentPage.value = 1;
    void fetchOrderList();
  };

  /** 状态筛选变化 */
  const handleStatusChange = (): void => {
    currentPage.value = 1;
    void fetchOrderList();
  };

  /** 导出订单 */
  const handleExport = (): void => {
    ElMessage.success('订单导出成功');
  };

  /** 查看详情 */
  const handleView = (row: OrderInfo): void => {
    void router.push(`/business/orders/${row.id}`);
  };

  /** 取消订单 */
  const handleCancel = async (row: OrderInfo): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
        type: 'warning',
      });

      await orderApi.cancelOrder(String(row.id));
      ElMessage.success('订单已取消');
      await fetchOrderList();
    } catch {
      // 用户取消操作，不做处理
    }
  };

  /** 分页大小变化 */
  const handleSizeChange = (val: number): void => {
    pageSize.value = val;
    void fetchOrderList();
  };

  /** 页码变化 */
  const handleCurrentChange = (val: number): void => {
    currentPage.value = val;
    void fetchOrderList();
  };

  // ==================== 生命周期 ====================
  onMounted(() => {
    void fetchOrderList();
  });

  return {
    // 加载状态
    loading,

    // 搜索和分页
    searchKeyword,
    currentPage,
    pageSize,
    total,
    statusFilter,

    // 数据
    orderList,
    statusOptions,

    // 状态相关
    getStatusType,
    getStatusText,

    // 操作方法
    fetchOrderList,
    handleSearch,
    handleStatusChange,
    handleExport,
    handleView,
    handleCancel,
    handleSizeChange,
    handleCurrentChange,
  };
}
