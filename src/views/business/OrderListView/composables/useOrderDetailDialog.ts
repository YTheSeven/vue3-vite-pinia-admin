import { ref } from 'vue';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { orderApi } from '@/api/modules/order';
import type { OrderDetail, OrderInfo } from '@/types/modules/order';

/** useOrderDetailDialog 返回类型 */
export interface UseOrderDetailDialogReturn {
  /** 弹窗显示状态 */
  dialogVisible: Ref<boolean>;
  /** 详情加载状态 */
  detailLoading: Ref<boolean>;
  /** 订单详情数据 */
  orderDetail: Ref<OrderDetail | null>;
  /** 打开弹窗并加载详情 */
  openDetail: (row: OrderInfo) => Promise<void>;
  /** 关闭弹窗 */
  closeDetail: () => void;
}

/**
 * 订单详情弹窗逻辑 Hook
 * 优先调用订单详情接口，接口不可用时回退使用列表行数据组装详情
 */
export function useOrderDetailDialog(): UseOrderDetailDialogReturn {
  const dialogVisible = ref<boolean>(false);
  const detailLoading = ref<boolean>(false);
  const orderDetail = ref<OrderDetail | null>(null);

  /** 使用列表行数据组装详情（接口不可用时的兜底展示） */
  const buildDetailFromRow = (row: OrderInfo): OrderDetail => ({
    id: String(row.id),
    address_id: 0,
    amount: row.pay_amount.toFixed(2),
    remark: row.remake || '无',
    customer: row.receiver_name,
    phone: row.receiver_phone,
    address: '暂无收货地址信息',
    create_time: row.create_time,
    status: row.status,
    goods_info: row.goods_snapshot.map((goods) => ({
      goods_id: '',
      goods_name: goods.goods_name,
      goods_price: goods.goods_price,
      quantity: goods.quantity,
      goods_cover: goods.goods_img,
    })),
  });

  /** 打开弹窗并加载订单详情 */
  const openDetail = async (row: OrderInfo): Promise<void> => {
    dialogVisible.value = true;
    detailLoading.value = true;

    // 先用列表行数据兜底渲染，避免弹窗空白
    orderDetail.value = buildDetailFromRow(row);

    try {
      const response = await orderApi.getOrderDetail(String(row.id));
      if (response?.id) {
        orderDetail.value = response;
      }
    } catch (error) {
      // 详情接口不可用时保留兜底数据，静默降级
      ElMessage.warning('订单详情接口暂不可用，已展示本地数据');
      console.error(error);
    } finally {
      detailLoading.value = false;
    }
  };

  /** 关闭弹窗 */
  const closeDetail = (): void => {
    dialogVisible.value = false;
  };

  return {
    dialogVisible,
    detailLoading,
    orderDetail,
    openDetail,
    closeDetail,
  };
}
