import { request } from '../alova';
import type { AddressInfo, AddAddressParams, UpdateAddressParams } from '@/types/modules/address';

/**
 * 地址 API 模块
 */
export const addressApi = {
  /**
   * 获取地址列表
   */
  getAddressList: () => request.get<AddressInfo[]>('/address'),

  /**
   * 添加地址
   * @param data 地址数据
   */
  addAddress: (data: AddAddressParams) => request.post('/address', data),

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
