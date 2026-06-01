// ============================================
// 订单模块类型
// ============================================

/**
 * 订单商品信息
 */
export interface OrderGoodsInfo {
  goods_id: number;
  goods_name: string;
  goods_price: string;
  goods_img: string;
  number: number;
}

/**
 * 订单信息
 */
export interface OrderInfo {
  id: number;
  order_no: string;
  total: string;
  status: number;
  address_id: number;
  goods_info: OrderGoodsInfo[];
  created_at: string;
}

/**
 * 创建订单参数
 */
export interface CreateOrderParams {
  address_id: number;
  total: string;
  goods_info: string;
}

/**
 * 订单列表查询参数
 */
export interface OrderListParams {
  page_num?: string;
  page_size?: string;
  status?: string;
}

/**
 * 订单列表响应
 */
export interface OrderListResult {
  page_size: number;
  page_num: number;
  total: number;
  list: OrderInfo[];
}
