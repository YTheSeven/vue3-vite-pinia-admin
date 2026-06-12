import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '@/api/modules/order';
import type { OrderDetail, OrderGoodsItem } from '@/types/modules/order';
import { OrderStatusMap } from '@/types/modules/order';
import type { Ref, ComputedRef } from 'vue';

/** useOrderDetailView 返回类型 */
export interface UseOrderDetailViewReturn {
  // 加载状态
  loading: Ref<boolean>;

  // 数据
  orderInfo: Ref<OrderDetail>;
  orderItems: Ref<OrderGoodsItem[]>;

  // 计算属性
  calculateSubtotal: ComputedRef<number>;

  // 状态相关
  getStatusType: (status: number) => 'info' | 'warning' | 'primary' | 'success' | 'danger';
  getStatusText: (status: number) => string;

  // 操作方法
  fetchOrderDetail: (id: string) => Promise<void>;
  goBack: () => void;
  handlePrint: () => void;
  handleShip: () => void;
  handleCancel: () => Promise<void>;
}

/**
 * 订单详情页面业务逻辑 Hook
 * @returns 订单详情相关的状态和方法
 */
export function useOrderDetailView(): UseOrderDetailViewReturn {
  const route = useRoute();
  const router = useRouter();

  // ==================== 加载状态 ====================
  const loading = ref<boolean>(false);

  // ==================== 数据 ====================
  const orderInfo = ref<OrderDetail>({
    id: '',
    address_id: 0,
    amount: '0',
    remark: '',
    customer: '',
    phone: '',
    address: '',
    create_time: '',
    status: 1,
    goods_info: [],
  });

  const orderItems = ref<OrderGoodsItem[]>([]);

  // ==================== 计算属性 ====================
  /** 计算商品总价 */
  const calculateSubtotal = computed<number>(() => {
    return orderItems.value.reduce((sum, item) => sum + item.goods_price * item.quantity, 0);
  });

  // ==================== 状态相关方法 ====================
  const getStatusType = (status: number): 'info' | 'warning' | 'primary' | 'success' | 'danger' => {
    return OrderStatusMap[status]?.type || 'info';
  };

  const getStatusText = (status: number): string => {
    return OrderStatusMap[status]?.text || '未知状态';
  };

  // ==================== API 调用 ====================
  /** 获取订单详情 */
  const fetchOrderDetail = async (id: string): Promise<void> => {
    loading.value = true;
    try {
      const response = await orderApi.getOrderDetail(id);
      // Alova 拦截器已提取 response.data
      if (response) {
        orderInfo.value = response as OrderDetail;
        orderItems.value = (response.goods_info as OrderGoodsItem[]) || [];
      }
    } catch (error) {
      ElMessage.error('获取订单详情失败');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // ==================== 事件处理 ====================
  /** 返回列表 */
  const goBack = (): void => {
    void router.push('/business/orders');
  };

  /** 打印订单 */
  const handlePrint = (): void => {
    window.print();
  };

  /** 确认发货 */
  const handleShip = async (): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要发货该订单吗？', '确认发货', {
        type: 'info',
      });

      await orderApi.shipOrder(orderInfo.value.id);
      ElMessage.success('订单已发货');
      void fetchOrderDetail(orderInfo.value.id);
    } catch {
      // 用户取消或API错误，不做处理
    }
  };

  /** 取消订单 */
  const handleCancel = async (): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要取消该订单吗？取消后无法恢复', '警告', {
        type: 'warning',
      });

      await orderApi.cancelOrder(orderInfo.value.id);
      ElMessage.success('订单已取消');
      void fetchOrderDetail(orderInfo.value.id);
    } catch {
      // 用户取消或API错误，不做处理
    }
  };

  // ==================== 生命周期 ====================
  onMounted(() => {
    const orderId = route.params.id as string;
    if (orderId) {
      void fetchOrderDetail(orderId);
    }
  });

  return {
    // 加载状态
    loading,

    // 数据
    orderInfo,
    orderItems,

    // 计算属性
    calculateSubtotal,

    // 状态相关
    getStatusType,
    getStatusText,

    // 操作方法
    fetchOrderDetail,
    goBack,
    handlePrint,
    handleShip,
    handleCancel,
  };
}
