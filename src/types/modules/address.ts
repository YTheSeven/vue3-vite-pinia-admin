// ============================================
// 地址模块类型
// ============================================

/**
 * 地址信息
 */
export interface AddressInfo {
  id: number;
  consignee: string;
  phone: string;
  address: string;
  is_default?: boolean;
}

/**
 * 地址列表查询参数
 */
export interface AddressListParams {
  page?: string;
  page_size?: string;
}

/**
 * 添加地址参数
 */
export interface AddAddressParams {
  consignee: string;
  phone: string;
  address: string;
}

/**
 * 添加地址响应
 */
export interface AddAddressResult {
  id: string;
}

/**
 * 更新地址参数
 */
export interface UpdateAddressParams {
  consignee?: string;
  phone?: string;
  address?: string;
}
