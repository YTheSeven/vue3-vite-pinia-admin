/**
 * 全屏功能
 */
export function useFullscreen() {
  // 切换全屏
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return {
    toggleFullscreen,
  };
}
