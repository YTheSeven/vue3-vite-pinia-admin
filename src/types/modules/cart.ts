// ============================================
// 购物车模块类型
// ============================================

/**
 * 购物车项
 */
export interface CartItem {
  id: number;
  goods_id: number;
  goods_name: string;
  goods_price: string;
  goods_img: string;
  number: number;
  selected: boolean;
}

/**
 * 购物车列表查询参数
 */
export interface CartListParams {
  page_num?: number;
  page_size?: number;
}

/**
 * 添加购物车参数
 */
export interface AddCartParams {
  goods_id: string;
  number: string;
}

/**
 * 删除购物车参数
 */
export interface DeleteCartParams {
  ids: number[];
}

/**
 * 更新购物车参数
 */
export interface UpdateCartParams {
  number?: number;
  selected?: boolean;
}

/**
 * 全选切换参数
 */
export interface SelectAllCartParams {
  selected: boolean;
}
