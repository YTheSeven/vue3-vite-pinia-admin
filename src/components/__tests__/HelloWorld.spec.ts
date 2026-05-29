import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from '../HelloWorld.vue';

describe('HelloWorld', () => {
  it('正确渲染标题', () => {
    const wrapper = mount(HelloWorld);

    expect(wrapper.text()).toContain('Get started');
    expect(wrapper.text()).toContain('Edit src/App.vue and save to test HMR');
  });

  it('点击按钮增加计数', async () => {
    const wrapper = mount(HelloWorld);

    // 找到按钮并点击
    const button = wrapper.find('button.counter');
    expect(button.exists()).toBe(true);

    expect(button.text()).toContain('Count is 0');

    await button.trigger('click');
    await button.trigger('click');

    // 验证计数是否正确
    expect(button.text()).toContain('Count is 2');
  });

  it('初始计数为 0', () => {
    const wrapper = mount(HelloWorld);

    const button = wrapper.find('button.counter');
    expect(button.text()).toContain('Count is 0');
  });

  it('渲染文档链接', () => {
    const wrapper = mount(HelloWorld);

    expect(wrapper.text()).toContain('Documentation');
    expect(wrapper.text()).toContain('Explore Vite');
    expect(wrapper.text()).toContain('Learn more');
  });

  it('渲染社交链接', () => {
    const wrapper = mount(HelloWorld);

    expect(wrapper.text()).toContain('Connect with us');
    expect(wrapper.text()).toContain('GitHub');
    expect(wrapper.text()).toContain('Discord');
    expect(wrapper.text()).toContain('X.com');
    expect(wrapper.text()).toContain('Bluesky');
  });
});
