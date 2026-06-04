// ============================================
// 商品模块类型
// ============================================

/**
 * SKU 信息
 */
export interface SkuInfo {
  id: number;
  name: string;
  price: string;
  reserve: number;
}

/**
 * 商品信息
 */
export interface GoodsInfo {
  id: number;
  goods_name: string;
  goods_price: string;
  goods_number: number;
  goods_cover: string;
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
  goods_cover: string;
  goods_images: string[];
  description: string;
  sku_info: SkuInfo[];
}

/**
 * 更新商品参数
 */
export interface UpdateGoodsParams {
  goods_name?: string;
  goods_cover?: string;
  goods_images?: string[];
  description?: string;
  sku_info?: SkuInfo[];
}

/**
 * 发布商品响应
 */
export interface PublishGoodsResult {
  status: string;
}

/**
 * 商品详情
 */
export interface GoodsDetail {
  id: string;
  goods_name: string;
  goods_cover: string;
  goods_images: string[];
  sku_info: SkuInfo[];
}

/**
 * 上传文件响应
 */
export interface UploadFileResult {
  url: string;
}
