import type { GenericObject } from '@/types/utils';
import { request } from '../alova';
import type { CreateOrderParams, OrderListParams, OrderListResult } from '@/types/modules/order';

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
  createOrder: (data: CreateOrderParams) => request.post('/orders', data),
};
