import { defineConfig, mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig as UserConfig,
  defineConfig({
    test: {
      // 测试环境
      environment: 'happy-dom',
      // 全局导入 Vitest API (describe, it, expect 等)
      globals: true,
      // 包含的测试文件
      include: ['**/*.spec.ts', '**/*.test.ts'],
      // 排除的目录
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
      // 覆盖率配置
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*'],
        exclude: ['src/**/*.d.ts', 'src/main.ts', 'src/router/**', 'src/store/**'],
      },
      // 测试报告器
      reporters: ['verbose'],
      // 设置 UI 测试超时时间
      testTimeout: 5000,
      // 钩子超时时间
      hookTimeout: 10000,
      // 启用 DOM 快照序列化
      snapshotSerializers: [],
      // 全局设置文件路径
      setupFiles: ['./src/test-setup.ts'],
    },
    // SSR 配置：确保 Element Plus 被打包处理
    ssr: {
      noExternal: ['element-plus'],
    },
  })
);
