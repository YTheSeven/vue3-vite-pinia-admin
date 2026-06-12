// ============================================
// 订单模块类型
// ============================================

/**
 * 订单状态枚举（与接口一致）
 * 0=已取消, 1=待支付, 2=已支付, 3=已发货, 4=已完成
 */
export const OrderStatus = {
  /** 已取消 */
  CANCELLED: 0,
  /** 待支付 */
  PENDING: 1,
  /** 已支付 */
  PAID: 2,
  /** 已发货 */
  SHIPPED: 3,
  /** 已完成 */
  COMPLETED: 4,
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * 订单状态映射
 */
export const OrderStatusMap: Record<
  number,
  { text: string; type: 'info' | 'warning' | 'primary' | 'success' | 'danger' }
> = {
  [OrderStatus.CANCELLED]: { text: '已取消', type: 'danger' },
  [OrderStatus.PENDING]: { text: '待支付', type: 'info' },
  [OrderStatus.PAID]: { text: '已支付', type: 'warning' },
  [OrderStatus.SHIPPED]: { text: '已发货', type: 'primary' },
  [OrderStatus.COMPLETED]: { text: '已完成', type: 'success' },
};

/**
 * 订单商品项（详情页）
 */
export interface OrderGoodsItem {
  /** 商品ID */
  goods_id: string;
  /** 商品名称 */
  goods_name: string;
  /** 商品价格 */
  goods_price: number;
  /** 购买数量 */
  quantity: number;
  /** 商品图片 */
  goods_cover: string;
}

/**
 * 订单商品快照（列表页）
 */
export interface OrderGoodsSnapshot {
  goods_name: string;
  goods_price: number;
  quantity: number;
  goods_img: string;
  /** SKU名称（可选） */
  sku_name?: string;
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
 * 订单详情（接口返回）
 */
export interface OrderDetail {
  /** 订单ID */
  id: string;
  /** 地址ID */
  address_id: number;
  /** 订单金额 */
  amount: string;
  /** 订单备注 */
  remark: string;
  /** 客户名称 */
  customer: string;
  /** 联系电话 */
  phone: string;
  /** 收货地址 */
  address: string;
  /** 订单创建时间 */
  create_time: string;
  /** 状态（0=已取消,1=待支付,2=已支付,3=已发货,4=已完成） */
  status: OrderStatus;
  /** 商品信息列表 */
  goods_info: OrderGoodsItem[];
}

/**
 * 订单信息（列表项）
 */
export interface OrderInfo {
  /** 订单ID */
  id: number;
  /** 订单编号 */
  order_no: string;
  /** 备注 */
  remake: string;
  /** 状态码 */
  status: OrderStatus;
  /** 状态文本 */
  status_text: string;
  /** 总价 */
  total_amount: number;
  /** 实付价 */
  pay_amount: number;
  /** 创建时间 */
  create_time: string;
  /** 付款时间 */
  payment_time?: string;
  /** 商品种类数 */
  item_count: number;
  /** 前3个商品快照（列表页展示用） */
  goods_snapshot: OrderGoodsSnapshot[];
  /** 收货人姓名 */
  receiver_name: string;
  /** 收货人电话（脱敏） */
  receiver_phone: string;
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
 * 更新订单参数
 */
export interface UpdateOrderParams {
  address_id?: number | null;
  address_str?: string | null;
  id: string;
  total?: string | null;
  remark?: string | null;
  goods_info?: Array<{
    goods_name: string;
    goods_price: number;
    quantity: number;
    goods_cover: string;
  }> | null;
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
  list: OrderInfo[];
  pagination: OrderPagination;
}
