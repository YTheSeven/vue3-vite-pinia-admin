/**
 * ============================================================================
 * 阶段四：Vue 组件测试
 * ============================================================================
 *
 * 学习目标：
 * 1. 理解 @vue/test-utils 的基本用法
 * 2. 学会挂载组件并传递 props
 * 3. 掌握 DOM 查询和断言
 * 4. 理解如何测试组件渲染和样式
 *
 * 运行命令：
 *   pnpm test src/components/__tests__/Iconify.spec.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
// import type { VueWrapper } from '@vue/test-utils';
// import { nextTick } from 'vue';
import Iconify from '../Iconify.vue';

// ============================================================================
// 第一部分：组件测试基础
// ============================================================================
// @vue/test-utils 提供了多种挂载方式：
// - mount(): 完全挂载（推荐用于大多数测试）
// - shallowMount(): 浅挂载（不渲染子组件）
//
// 本例中使用 mount，因为我们的组件没有复杂的子组件

describe('Iconify', () => {
  // 存储 console.warn 的 spy，用于验证警告输出
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // 每个测试前设置 spy
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // 每个测试后恢复
    consoleWarnSpy.mockRestore();
  });

  // --------------------------------------------------------------------------
  // 4.1 基础渲染测试
  // --------------------------------------------------------------------------

  describe('基础渲染', () => {
    it('应该渲染有效的图标', () => {
      // Arrange & Act: 挂载组件并传递 props
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
        },
      });

      // Assert: 组件已渲染
      expect(wrapper.exists()).toBe(true);

      // Assert: 渲染了图标容器
      const iconSpan = wrapper.find('.iconify');
      expect(iconSpan.exists()).toBe(true);

      // Assert: 没有渲染占位符
      const placeholder = wrapper.find('.iconify-placeholder');
      expect(placeholder.exists()).toBe(false);
    });

    it('应该对无效图标显示占位符', () => {
      // Arrange & Act: 使用不存在的图标名
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-nonexistent',
        },
      });

      // Assert: 渲染占位符
      const placeholder = wrapper.find('.iconify-placeholder');
      expect(placeholder.exists()).toBe(true);
      expect(placeholder.text()).toBe('?');

      // Assert: 没有渲染图标容器
      const iconSpan = wrapper.find('.iconify');
      expect(iconSpan.exists()).toBe(false);

      // Assert: 输出警告
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('未找到图标'));
    });

    it('应该支持所有预定义的图标', () => {
      // Arrange: 定义所有支持的图标
      const validIcons = [
        'i-ep-user',
        'i-ep-user-filled',
        'i-ep-shopping-cart',
        'i-ep-document',
        'i-ep-goods',
        'i-ep-setting',
        'i-ep-data-line',
        'i-ep-trend-charts',
        'i-ep-grid',
        'i-ep-tickets',
        'i-ep-timer',
        'i-ep-message',
        'i-ep-money',
        'i-ep-arrow-up',
        'i-ep-arrow-down',
        'i-ep-delete',
        'i-ep-plus',
        'i-ep-edit',
        'i-ep-view',
        'i-ep-search',
        'i-ep-refresh-right',
        'i-ep-check',
        'i-ep-close',
        'i-ep-lock',
        'i-ep-key',
        'i-ep-phone',
        'i-ep-picture',
        'i-ep-camera',
        'i-ep-bottom',
        'i-ep-top',
        'i-ep-loading',
      ];

      // Act & Assert: 每个图标都能正确渲染
      validIcons.forEach((iconName) => {
        const wrapper = mount(Iconify, {
          props: { name: iconName },
        });

        expect(wrapper.find('.iconify').exists()).toBe(true);
        expect(wrapper.find('.iconify-placeholder').exists()).toBe(false);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4.2 Props 测试
  // --------------------------------------------------------------------------

  describe('Props 处理', () => {
    it('应该正确应用 size 为数字的样式', () => {
      // Arrange & Act
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
          size: 24,
        },
      });

      // Assert: 检查内联样式
      const iconSpan = wrapper.find('.iconify');
      const style = iconSpan.attributes('style');

      // 样式应该包含 px 单位
      expect(style).toContain('width: 24px');
      expect(style).toContain('height: 24px');
    });

    it('应该正确应用 size 为字符串的样式', () => {
      // Arrange & Act
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
          size: '2rem',
        },
      });

      // Assert
      const iconSpan = wrapper.find('.iconify');
      const style = iconSpan.attributes('style');

      expect(style).toContain('width: 2rem');
      expect(style).toContain('height: 2rem');
    });

    it('应该使用默认大小（1em）当 size 未提供', () => {
      // Arrange & Act
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
          // size 未提供
        },
      });

      // Assert
      const iconSpan = wrapper.find('.iconify');
      const style = iconSpan.attributes('style');

      expect(style).toContain('width: 1em');
      expect(style).toContain('height: 1em');
    });

    it('应该传递 color 属性到组件', () => {
      // Arrange & Act
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
          color: 'red',
        },
      });

      // Assert: 组件应该被正确挂载
      // 注意：实际的颜色应用可能在子组件中，这里验证组件能接收 prop
      expect(wrapper.find('.iconify').exists()).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 4.3 响应式更新测试
  // --------------------------------------------------------------------------

  describe('响应式更新', () => {
    it('应该在 props 变化时更新图标', async () => {
      // Arrange: 初始挂载
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
        },
      });

      // 验证初始状态
      expect(wrapper.find('.iconify').exists()).toBe(true);

      // Act: 更新 props
      await wrapper.setProps({
        name: 'i-ep-setting',
      });

      // Assert: 组件仍然渲染（说明成功切换图标）
      expect(wrapper.find('.iconify').exists()).toBe(true);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('应该在 size 变化时更新样式', async () => {
      // Arrange
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
          size: 16,
        },
      });

      // 验证初始样式
      let style = wrapper.find('.iconify').attributes('style');
      expect(style).toContain('width: 16px');

      // Act: 更新 size
      await wrapper.setProps({
        size: 32,
      });

      // Assert: 样式已更新
      style = wrapper.find('.iconify').attributes('style');
      expect(style).toContain('width: 32px');
    });

    it('应该在无效图标名变化后显示占位符', async () => {
      // Arrange: 初始是有效图标
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
        },
      });

      expect(wrapper.find('.iconify').exists()).toBe(true);
      expect(wrapper.find('.iconify-placeholder').exists()).toBe(false);

      // Act: 改为无效图标名
      await wrapper.setProps({
        name: 'i-ep-invalid',
      });

      // Assert: 现在显示占位符
      expect(wrapper.find('.iconify').exists()).toBe(false);
      expect(wrapper.find('.iconify-placeholder').exists()).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 4.4 HTML 结构测试
  // --------------------------------------------------------------------------

  describe('HTML 结构', () => {
    it('应该渲染正确的 DOM 结构', () => {
      // Arrange & Act
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
        },
      });

      // Assert: 检查 HTML 结构
      const html = wrapper.html();

      // 应该包含 iconify 类的 span
      expect(html).toContain('class="iconify"');

      // 应该包含 iconify-svg 类的 SVG 元素（Element Plus 图标是 SVG）
      // 注意：具体的 SVG 标记可能因版本而异
      expect(wrapper.find('.iconify-svg').exists()).toBe(true);
    });

    it('占位符应该有正确的结构', () => {
      // Arrange & Act
      const wrapper = mount(Iconify, {
        props: {
          name: 'unknown-icon',
        },
      });

      // Assert
      const placeholder = wrapper.find('.iconify-placeholder');

      expect(placeholder.exists()).toBe(true);
      expect(placeholder.text()).toBe('?');
      expect(placeholder.element.tagName.toLowerCase()).toBe('span');
    });
  });

  // --------------------------------------------------------------------------
  // 4.5 快照测试（Snapshot Testing）
  // --------------------------------------------------------------------------
  // 快照测试用于捕获组件的 HTML 输出，并在后续测试中进行比较
  // 适用于：UI 结构稳定的组件，可以及时发现意外的 UI 变更

  describe('快照测试', () => {
    it('用户图标的快照', () => {
      const wrapper = mount(Iconify, {
        props: {
          name: 'i-ep-user',
          size: 24,
        },
      });

      // 生成或比对快照
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('占位符的快照', () => {
      const wrapper = mount(Iconify, {
        props: {
          name: 'invalid-icon',
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});

// ============================================================================
// 总结：Vue 组件测试要点
// ============================================================================
//
// 1. **挂载组件**：
//    - 使用 mount() 完全挂载组件
//    - 通过 props 选项传递属性
//
// 2. **DOM 查询**：
//    - find(selector): 查找单个元素
//    - findAll(selector): 查找所有匹配元素
//    - exists(): 检查元素是否存在
//
// 3. **属性和样式断言**：
//    - attributes(): 获取 HTML 属性
//    - classes(): 获取 CSS 类
//    - html(): 获取完整 HTML
//    - text(): 获取文本内容
//
// 4. **响应式更新**：
//    - setProps(): 更新组件 props
//    - await nextTick(): 等待 DOM 更新
//
// 5. **Mock**：
//    - 使用 vi.spyOn 监控 console 输出
//    - 验证副作用（如警告信息）
//
// 6. **快照测试**：
//    - toMatchSnapshot(): 捕获和比对 HTML 结构
//    - 首次运行会创建快照文件，后续进行比对
//
// 进阶技巧（本例未覆盖）：
// - trigger(): 触发事件（如 click, input）
// - emitted(): 获取组件触发的事件
// - slots: 测试插槽内容
// - stubs: 模拟子组件
