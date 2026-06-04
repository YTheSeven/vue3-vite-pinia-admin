// ============================================
// 订单模块类型
// ============================================

/**
 * 订单商品快照
 */
export interface OrderGoodsSnapshot {
  goods_name: string;
  goods_price: number;
  quantity: number;
  goods_img: string;
}

/**
 * 订单分页信息
 */
export interface OrderPagination {
  current: number;
  page_size: number;
  total: number;
  total_pages: number;
}

/**
 * 订单信息
 */
export interface OrderInfo {
  id: number;
  remake: string;
  status: number;
  status_text: string;
  total_amount: number;
  pay_amount: number;
  create_time: string;
  payment_time?: string;
  item_count: number;
  goods_snapshot: OrderGoodsSnapshot[];
}

/**
 * 创建订单商品项
 */
export interface CreateOrderGoodsItem {
  goods_name: string;
  goods_price: number;
  quantity: number;
  goods_cover: string;
}

/**
 * 创建订单参数
 */
export interface CreateOrderParams {
  address_id: number;
  total: string;
  remake: string;
  goods_info: CreateOrderGoodsItem[];
}

/**
 * 创建订单响应
 */
export interface CreateOrderResult {
  id: string;
}

/**
 * 订单列表查询参数
 */
export interface OrderListParams {
  page_num?: number;
  page_size?: number;
  status?: number;
  keyword?: string;
}

/**
 * 订单列表响应
 */
export interface OrderListResult {
  code: number;
  message: string;
  data: {
    list: OrderInfo[];
    pagination: OrderPagination;
  };
}

/**
 * 订单详情
 */
export interface OrderDetail {
  id: string;
  address_id: number;
  total: string;
  remake: string;
  goods_info: CreateOrderGoodsItem[];
}

/**
 * 订单商品信息（旧版兼容）
 * @deprecated 使用 OrderGoodsSnapshot 替代
 */
export interface OrderGoodsInfo {
  goods_id: number;
  goods_name: string;
  goods_price: string;
  goods_img: string;
  number: number;
}
