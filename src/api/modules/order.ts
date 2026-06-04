import type { GenericObject } from '@/types/utils';
import { request } from '../alova';
import type {
  CreateOrderParams,
  CreateOrderResult,
  OrderListParams,
  OrderListResult,
  OrderDetail,
} from '@/types/modules/order';

/**
 * 订单 API 模块
 */
export const orderApi = {
  /**
   * 获取订单列表
   * @param params 查询参数
   */
  getOrderList: (params?: OrderListParams & GenericObject) =>
    request.get<OrderListResult>('/orders', { params }),

  /**
   * 创建订单
   * @param data 订单数据
   */
  createOrder: (data: CreateOrderParams) => request.post<CreateOrderResult>('/orders', data),

  /**
   * 获取订单详情
   * @param id 订单ID
   */
  getOrderDetail: (id: string) => request.get<OrderDetail>(`/orders/${id}`),

  /**
   * 取消订单
   * @param id 订单ID
   */
  cancelOrder: (id: string) => request.post(`/orders/${id}/off`),
};
