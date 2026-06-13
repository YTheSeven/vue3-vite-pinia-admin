import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 性能指标数据
 */
export interface PerformanceMetrics {
  /** 当前 FPS */
  fps: number;
  /** 内存使用率 (%) */
  memoryUsagePercent: number;
  /** 上一次帧渲染时间 (ms) */
  frameTime: number;
  /** 时间标签 */
  timeLabel: string;
}

/** 内部使用的数据生成结果 */
interface GeneratedData {
  fps: number;
  memory: number;
  frameTime: number;
  score: number;
}

/**
 * 生成随机波动数据（让图表更活跃）
 */
function generateFluctuatingData(): GeneratedData {
  const baseFps = 45 + Math.random() * 15;
  const baseMemory = 30 + Math.random() * 40;
  const baseFrameTime = 10 + Math.random() * 25;
  const baseScore = 40 + Math.random() * 45;

  const hasSpike = Math.random() > 0.85;
  const spikeFactor = hasSpike ? 0.7 + Math.random() * 0.5 : 1;

  return {
    fps: Math.floor(Math.min(60, baseFps * spikeFactor)),
    memory: Math.floor(Math.min(95, baseMemory * (hasSpike ? 1.2 : 1))),
    frameTime: Math.floor(baseFrameTime * (hasSpike ? 1.5 : 1)),
    score: Math.floor(Math.max(20, Math.min(95, baseScore * spikeFactor))),
  };
}

/**
 * 获取当前时间标签
 */
function getTimeLabel(): string {
  return new Date().toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 页面性能监控（模拟数据）
 */
export function usePerformance() {
  const metrics = ref<PerformanceMetrics>({
    fps: 60,
    memoryUsagePercent: 50,
    frameTime: 16,
    timeLabel: getTimeLabel(),
  });

  // 历史数据（包含时间标签）
  const history = ref<number[]>([]);
  const fpsHistory = ref<number[]>([]);
  const memoryHistory = ref<number[]>([]);
  const frameTimeHistory = ref<number[]>([]);
  const timeLabels = ref<string[]>([]);

  // 初始化历史数据
  for (let i = 0; i < 20; i++) {
    const data = generateFluctuatingData();
    const time = new Date(Date.now() - (19 - i) * 2000).toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    history.value.push(data.score);
    fpsHistory.value.push(data.fps);
    memoryHistory.value.push(data.memory);
    frameTimeHistory.value.push(data.frameTime);
    timeLabels.value.push(time);
  }

  let intervalId: ReturnType<typeof setInterval> | null = null;

  // 更新历史数据
  const updateHistory = () => {
    const data = generateFluctuatingData();
    const time = getTimeLabel();

    metrics.value = {
      fps: data.fps,
      memoryUsagePercent: data.memory,
      frameTime: data.frameTime,
      timeLabel: time,
    };

    history.value.shift();
    history.value.push(data.score);

    fpsHistory.value.shift();
    fpsHistory.value.push(data.fps);

    memoryHistory.value.shift();
    memoryHistory.value.push(data.memory);

    frameTimeHistory.value.shift();
    frameTimeHistory.value.push(data.frameTime);

    timeLabels.value.shift();
    timeLabels.value.push(time);
  };

  onMounted(() => {
    intervalId = setInterval(updateHistory, 2000);
  });

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  return {
    metrics,
    history,
    fpsHistory,
    memoryHistory,
    frameTimeHistory,
    timeLabels,
  };
}
