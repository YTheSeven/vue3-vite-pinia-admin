<script setup lang="ts">
  import { computed } from 'vue';
  import {
    User,
    UserFilled,
    ShoppingCart,
    Document,
    Goods,
    Setting,
    DataLine,
    TrendCharts,
    Grid,
    Tickets,
    Timer,
    Message,
    Money,
    ArrowUp,
    ArrowDown,
    Delete,
    Plus,
    Edit,
    View,
    Search,
    RefreshRight,
    Check,
    Close,
    Lock,
    Key,
    Phone,
    Picture,
    Camera,
    Bottom,
    Top,
    Loading,
  } from '@element-plus/icons-vue';

  /** 图标组件映射 */
  const iconComponents = {
    User,
    UserFilled,
    ShoppingCart,
    Document,
    Goods,
    Setting,
    DataLine,
    TrendCharts,
    Grid,
    Tickets,
    Timer,
    Message,
    Money,
    ArrowUp,
    ArrowDown,
    Delete,
    Plus,
    Edit,
    View,
    Search,
    RefreshRight,
    Check,
    Close,
    Lock,
    Key,
    Phone,
    Picture,
    Camera,
    Bottom,
    Top,
    Loading,
  };

  /** 字符串到组件名的映射 */
  const iconNameMap: Record<string, keyof typeof iconComponents> = {
    'i-ep-user': 'User',
    'i-ep-user-filled': 'UserFilled',
    'i-ep-shopping-cart': 'ShoppingCart',
    'i-ep-document': 'Document',
    'i-ep-goods': 'Goods',
    'i-ep-setting': 'Setting',
    'i-ep-data-line': 'DataLine',
    'i-ep-trend-charts': 'TrendCharts',
    'i-ep-grid': 'Grid',
    'i-ep-tickets': 'Tickets',
    'i-ep-timer': 'Timer',
    'i-ep-message': 'Message',
    'i-ep-money': 'Money',
    'i-ep-arrow-up': 'ArrowUp',
    'i-ep-arrow-down': 'ArrowDown',
    'i-ep-delete': 'Delete',
    'i-ep-plus': 'Plus',
    'i-ep-edit': 'Edit',
    'i-ep-view': 'View',
    'i-ep-search': 'Search',
    'i-ep-refresh-right': 'RefreshRight',
    'i-ep-check': 'Check',
    'i-ep-close': 'Close',
    'i-ep-lock': 'Lock',
    'i-ep-key': 'Key',
    'i-ep-phone': 'Phone',
    'i-ep-picture': 'Picture',
    'i-ep-camera': 'Camera',
    'i-ep-bottom': 'Bottom',
    'i-ep-top': 'Top',
    'i-ep-loading': 'Loading',
  };

  /** 组件属性 */
  interface Props {
    /** 图标名称，如 'i-ep-user' */
    name: string;
    /** 图标大小 */
    size?: string | number;
    /** 图标颜色类 */
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: undefined,
    color: 'currentColor',
  });

  /** 计算实际图标组件 */
  const IconComponent = computed(() => {
    const componentName = iconNameMap[props.name];
    if (!componentName) {
      console.warn(`[Iconify] 未找到图标: ${props.name}`);
      return null;
    }
    return iconComponents[componentName];
  });

  /** 计算样式 */
  const iconStyle = computed(() => {
    const sizeValue = props.size
      ? typeof props.size === 'number'
        ? `${props.size}px`
        : props.size
      : '1em';
    return {
      width: sizeValue,
      height: sizeValue,
    };
  });
</script>

<template>
  <span v-if="IconComponent" class="iconify" :style="iconStyle">
    <IconComponent class="iconify-svg" />
  </span>
  <span v-else class="iconify-placeholder">?</span>
</template>

<style scoped>
  .iconify {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 1;
  }

  .iconify :deep(.iconify-svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .iconify-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    color: #999;
    font-size: 0.8em;
  }
</style>
