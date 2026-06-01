// ============================================
// 商品模块类型
// ============================================

/**
 * 商品信息
 */
export interface GoodsInfo {
  id: number;
  goods_name: string;
  goods_price: string;
  goods_number: number;
  goods_img: string;
}

/**
 * 商品列表查询参数
 */
export interface GoodsListParams {
  page_num?: number;
  page_size?: number;
}

/**
 * 商品列表响应
 */
export interface GoodsListResult {
  page_size: number;
  page_num: number;
  total: number;
  list: GoodsInfo[];
}

/**
 * 发布商品参数
 */
export interface PublishGoodsParams {
  goods_name: string;
  goods_price: number;
  goods_number: number;
  goods_img: string;
}

/**
 * 更新商品参数
 */
export interface UpdateGoodsParams {
  goods_name?: string;
  goods_price?: number;
  goods_number?: number;
  goods_img?: string;
}
