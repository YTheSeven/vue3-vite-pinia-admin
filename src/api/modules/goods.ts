import type { GenericObject } from '@/types/utils';
import { request } from '../alova';
import type {
  GoodsListParams,
  GoodsListResult,
  PublishGoodsParams,
  UpdateGoodsParams,
} from '@/types/modules/goods';

/**
 * 商品 API 模块
 */
export const goodsApi = {
  /**
   * 获取商品列表
   * @param params 查询参数
   */
  getGoodsList: (params?: GoodsListParams & GenericObject) =>
    request.get<GoodsListResult>('/goods/', { params }),

  /**
   * 发布商品
   * @param data 商品数据
   */
  publishGoods: (data: PublishGoodsParams) => request.post('/goods/publish', data),

  /**
   * 更新商品信息
   * @param id 商品ID
   * @param data 更新的商品数据
   */
  updateGoods: (id: string, data: UpdateGoodsParams) => request.put(`/goods/${id}`, data),

  /**
   * 删除商品
   * @param id 商品ID
   * @deprecated 该接口已废弃
   */
  deleteGoods: (id: string) => request.delete(`/goods/${id}`),

  /**
   * 上架商品
   * @param id 商品ID
   */
  onShelfGoods: (id: string) => request.post(`/goods/${id}/on`),

  /**
   * 下架商品
   * @param id 商品ID
   */
  offShelfGoods: (id: string) => request.post(`/goods/${id}/off`),

  /**
   * 上传文件
   * @param file 文件对象
   */
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post<{ url: string }>('/goods/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
