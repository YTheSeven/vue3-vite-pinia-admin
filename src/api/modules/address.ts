import { request } from '../alova';
import type {
  AddressInfo,
  AddAddressParams,
  AddAddressResult,
  UpdateAddressParams,
  AddressListParams,
} from '@/types/modules/address';
import type { GenericObject } from '@/types/utils';

/**
 * 地址 API 模块
 */
export const addressApi = {
  /**
   * 获取地址列表
   * @param params 查询参数
   */
  getAddressList: (params?: AddressListParams & GenericObject) =>
    request.get<AddressInfo[]>('/address', { params }),

  /**
   * 添加地址
   * @param data 地址数据
   */
  addAddress: (data: AddAddressParams) => request.post<AddAddressResult>('/address', data),

  /**
   * 更新地址信息
   * @param id 地址ID
   * @param data 地址数据
   */
  updateAddress: (id: string, data: UpdateAddressParams) => request.put(`/address/${id}`, data),

  /**
   * 删除地址
   * @param id 地址ID
   */
  deleteAddress: (id: string) => request.delete(`/address/${id}`),

  /**
   * 设置默认地址
   * @param id 地址ID
   */
  setDefaultAddress: (id: string) => request.patch(`/address/${id}`),
};
