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
 * 添加地址参数
 */
export interface AddAddressParams {
  consignee: string;
  phone: string;
  address: string;
}

/**
 * 更新地址参数
 */
export interface UpdateAddressParams {
  consignee: string;
  phone: string;
  address: string;
}
