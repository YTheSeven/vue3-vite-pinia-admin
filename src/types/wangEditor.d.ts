// WangEditor 类型声明
declare module '@wangeditor/editor-for-vue' {
  import type { Component } from 'vue';
  // import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';

  export const Editor: Component;
  export const Toolbar: Component;
}

declare module '@wangeditor/editor' {
  export interface IDomEditor {
    getHtml: () => string;
    setHtml: (html: string) => void;
    destroy: () => void;
    // 其他需要的属性
    [key: string]: unknown;
  }

  export interface IEditorConfig {
    placeholder?: string;
    MENU_CONF?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface IToolbarConfig {
    excludeKeys?: string[];
    [key: string]: unknown;
  }
}