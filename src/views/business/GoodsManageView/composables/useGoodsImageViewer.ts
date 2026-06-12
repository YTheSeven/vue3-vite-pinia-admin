import type { Ref } from 'vue';
import type { GoodsDetail } from '@/types/modules/goods';

/** useGoodsImageViewer 返回类型 */
export interface UseGoodsImageViewerReturn {
  // 图片预览状态
  showImageViewer: Ref<boolean>;
  imageViewerUrlList: Ref<string[]>;
  imageViewerInitialIndex: Ref<number>;

  // 方法
  extractImagesFromHtml: (html: string) => string[];
  handleIntroduceClick: (event: MouseEvent, goodsDetail: GoodsDetail | null) => void;
}

/**
 * 商品富文本图片预览逻辑 Hook
 * @returns 图片预览相关的状态和方法
 */
export function useGoodsImageViewer(): UseGoodsImageViewerReturn {
  // ==================== 图片预览状态 ====================
  const showImageViewer = ref(false);
  const imageViewerUrlList = ref<string[]>([]);
  const imageViewerInitialIndex = ref(0);

  // ==================== 图片提取 ====================
  /**
   * 提取富文本中的所有图片 URL
   * @param html 富文本 HTML 内容
   * @returns 图片 URL 数组
   */
  const extractImagesFromHtml = (html: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    return Array.from(images)
      .map((img) => img.src)
      .filter(Boolean);
  };

  // ==================== 事件处理 ====================
  /**
   * 处理富文本区域点击（图片预览）
   * @param event 鼠标事件
   * @param goodsDetail 商品详情
   */
  const handleIntroduceClick = (event: MouseEvent, goodsDetail: GoodsDetail | null): void => {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'IMG') return;

    const imgSrc = (target as HTMLImageElement).src;
    if (!goodsDetail?.goods_introduce) return;

    // 提取所有图片
    const allImages = extractImagesFromHtml(goodsDetail.goods_introduce);
    if (allImages.length === 0) return;

    // 找到当前图片的索引
    const index = allImages.findIndex((url) => url === imgSrc);
    if (index === -1) return;

    imageViewerUrlList.value = allImages;
    imageViewerInitialIndex.value = index;
    showImageViewer.value = true;
  };

  return {
    // 状态
    showImageViewer,
    imageViewerUrlList,
    imageViewerInitialIndex,

    // 方法
    extractImagesFromHtml,
    handleIntroduceClick,
  };
}
