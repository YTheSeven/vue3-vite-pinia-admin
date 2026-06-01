import type { GenericObject } from '@/types/utils';
import { request } from '../alova';
import type {
  CartItem,
  CartListParams,
  AddCartParams,
  DeleteCartParams,
  UpdateCartParams,
  SelectAllCartParams,
} from '@/types/modules/cart';

/**
 * 购物车 API 模块
 */
export const cartApi = {
  /**
   * 获取购物车列表
   * @param params 查询参数
   */
  getCartList: (params?: CartListParams & GenericObject) =>
    request.get<{
      page_size: number;
      page_num: number;
      total: number;
      list: CartItem[];
    }>('/cart/carts', { params }),

  /**
   * 添加商品到购物车
   * @param data 添加参数
   */
  addToCart: (data: AddCartParams) => request.post('/cart', data),

  /**
   * 删除购物车商品
   * @param data 删除参数
   */
  deleteCartItems: (data: DeleteCartParams) => request.delete('/cart', { data }),

  /**
   * 更新购物车商品
   * @param id 购物车项ID
   * @param data 更新参数
   */
  updateCartItem: (id: string, data: UpdateCartParams) => request.patch(`/cart/${id}`, data),

  /**
   * 全选/取消全选购物车
   * @param data 选择参数
   */
  selectAll: (data: SelectAllCartParams) => request.patch('/cart/selectAll', data),
};
