// 延迟工具函数
export function delay(ms: number): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new
  return new Promise((resolve) => setTimeout(resolve, ms));
}
