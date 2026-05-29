import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // 自动导入 Vue 和 Element Plus API
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入 Element Plus 图标
        IconsResolver({
          prefix: 'Icon',
          enabledCollections: ['ep'],
        }),
      ],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
      dts: 'src/components.d.ts',
      dirs: ['src/components'],
    }),
    // 图标插件
    Icons({
      autoInstall: true,
      compiler: 'vue3',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "element-plus/theme-chalk/src/index.scss" as *;`,
      },
    },
  },
  server: {
    port: 3000,
    // open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: 'hidden',
    minify: 'oxc',
    // 大文件告警阈值（KB）
    chunkSizeWarningLimit: 1000,
    // 资源内联阈值（小于4KB的资源转为base64内联）
    assetsInlineLimit: 4096,
    // 代码分割配置
    rolldownOptions: {
      output: {
        // 大公司级分包策略 - 基于依赖更新频率分层
        // 注意：判断顺序很重要，更具体的匹配应该在前
        manualChunks: (id) => {
          // 只处理 node_modules 中的依赖
          if (id.includes('node_modules')) {
            // 1. Element Plus UI 库 - 优先判断，避免被 vue 规则拦截
            if (id.includes('element-plus')) {
              // 排除图标子包
              if (id.includes('@element-plus/icons-vue')) {
                return 'icons';
              }
              return 'ui-element';
            }

            // 2. 图标库 - 相对独立
            if (id.includes('@element-plus/icons-vue') || id.includes('unplugin-icons')) {
              return 'icons';
            }

            // 3. Vue 核心生态 - 更新频率最低，缓存最稳定
            // 使用更精确的判断，避免匹配到其他包含 vue 的库
            if (
              id.includes('/vue/') ||
              id.includes('/vue-router/') ||
              id.includes('/pinia/') ||
              id.includes('vue-demi')
            ) {
              return 'vue-core';
            }

            // 4. 工具库 - 按需使用
            if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios')) {
              return 'vendor-utils';
            }

            // 5. 其他第三方依赖
            return 'vendor-common';
          }

          // 6. 业务代码按目录分割（可选）
          // if (id.includes('src/views/')) {
          //   const match = id.match(/src\/views\/([^/]+)/);
          //   if (match) {
          //     return `page-${match[1]}`;
          //   }
          // }
        },
        // 资源文件命名规范
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names?.[0] ?? '';
          if (info.endsWith('.css')) {
            return 'static/css/[name]-[hash][extname]';
          }
          if (/\.\(png|jpe?g|gif|svg|webp|ico\)$/i.test(info)) {
            return 'static/images/[name]-[hash][extname]';
          }
          if (/\.\(woff2?|eot|ttf|otf\)$/i.test(info)) {
            return 'static/fonts/[name]-[hash][extname]';
          }
          return 'static/assets/[name]-[hash][extname]';
        },
      },
    },
    // CSS 代码分割
    cssCodeSplit: true,
    // 清空输出目录
    emptyOutDir: true,
    // 压缩报告（用于分析）
    // reportCompressedSize: true,
  },
  // 依赖优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'element-plus', '@element-plus/icons-vue'],
  },
  // 路径解析
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
    },
  },
});
