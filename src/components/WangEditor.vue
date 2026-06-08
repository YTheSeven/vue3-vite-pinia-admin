<script setup lang="ts">
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';

  // 定义 emits
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
  }>();

  // 定义 props
  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      placeholder?: string;
      height?: number;
      disabled?: boolean;
    }>(),
    {
      modelValue: '',
      placeholder: '请输入内容...',
      height: 300,
      disabled: false,
    }
  );

  // 编辑器实例
  const editorRef = shallowRef<IDomEditor>();

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [],
  };

  // 获取上传图片的header（例如添加 token）
  const getUploadHeaders = () => {
    const headers: Record<string, string> = {
      authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    };
    // 如果是mock环境，添加apifox的token
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      headers.apifoxToken = import.meta.env.VITE_MOCK_TOKEN ?? '';
    }
    return headers;
  };

  // 获取上传图片的api地址
  const getUploadUrl = () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return '/api/goods/upload';
    }
    return `${import.meta.env.VITE_API_BASE_URL}/goods/upload`;
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    readOnly: props.disabled,
    MENU_CONF: {
      // 上传图片配置
      uploadImage: {
        server: getUploadUrl(),
        fieldName: 'file',
        maxFileSize: 2 * 1024 * 1024, // 2MB
        maxNumberOfFiles: 10,
        allowedFileTypes: ['image/*'],
        headers: getUploadHeaders(),
        // 自定义上传逻辑也可以使用 customUpload，例如：
        // customUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
        //   // 这里可以使用任何方式上传图片，例如使用 axios 或 fetch
        //   goodsApi.uploadFile(file).then((response) => {
        //     insertFn(response.url);
        //   });
        // },
        // 如果需要自定义上传回调逻辑，可以使用 customInsert，例如：
        // customInsert(res: unknown, insertFn: (url: string, alt?: string, href?: string) => void) {
        //   const response = res as { url: string };
        //   insertFn(response.url);
        // },
      },
    },
  };

  // 处理创建
  const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
  };

  // 处理改变
  const handleChange = (editor: IDomEditor) => {
    const html = editor.getHtml();
    emit('update:modelValue', html);
    emit('change', html);
  };

  // 监听 modelValue 变化
  watch(
    () => props.modelValue,
    (newVal) => {
      const editor = editorRef.value;
      if (editor && editor.getHtml() !== newVal) {
        editor.setHtml(newVal);
      }
    }
  );

  // 组件销毁时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor) {
      editor.destroy();
    }
  });
</script>

<template>
  <div class="w-full border rounded-lg border-gray-300 dark:border-gray-600 overflow-hidden">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="default"
      class="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
    />
    <Editor
      :model-value="modelValue"
      :default-config="editorConfig"
      mode="default"
      :style="{ height: `${height}px` }"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<style>
  /* 引入 wangEditor 样式 */
  @import '@wangeditor/editor/dist/css/style.css';
</style>

<style scoped>
  :deep(.w-e-text-container) {
    background-color: transparent !important;
  }

  :deep(.w-e-toolbar) {
    border-bottom: 1px solid #e5e7eb;
  }

  :deep(.dark .w-e-toolbar) {
    border-bottom-color: #4b5563;
  }

  :deep(.dark .w-e-toolbar) {
    background-color: #1f2937 !important;
  }

  :deep(.dark .w-e-menu-title) {
    color: #e5e7eb !important;
  }

  :deep(.dark .w-e-text-container) {
    background-color: #111827 !important;
  }

  :deep(.dark .w-e-text-container [data-slate-editor]) {
    color: #e5e7eb !important;
  }
</style>
