/**
 * ============================================================================
 * 阶段二：Pinia Store 测试
 * ============================================================================
 *
 * 学习目标：
 * 1. 理解如何创建 Pinia 测试环境
 * 2. 学会 mock 浏览器 API（localStorage）
 * 3. 掌握 Vue 响应式状态的测试方法
 * 4. 理解测试生命周期和数据隔离
 *
 * 运行命令：
 *   pnpm test src/store/__tests__/mockPermission.spec.ts
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useMockPermissionStore } from '../modules/mockPermission';
import type { RoleConfig } from '../modules/mockPermission';

// ============================================================================
// 第一部分：Mock 浏览器 API
// ============================================================================
// 在测试环境中，浏览器 API（如 localStorage）不存在
// 我们需要使用 vi.fn() 创建 mock 实现

// 创建 localStorage 的 mock 实现
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    // 获取数据
    getItem: vi.fn((key: string) => store[key] ?? null),
    // 存储数据
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    // 删除数据
    removeItem: vi.fn((key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete store[key];
    }),
    // 清空所有数据
    clear: vi.fn(() => {
      store = {};
    }),
    // 获取所有键的数量
    get length() {
      return Object.keys(store).length;
    },
    // 通过索引获取键名
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
};

// ============================================================================
// 第二部分：测试套件设置
// ============================================================================
// beforeAll: 在所有测试开始前执行一次
// beforeEach: 在每个测试开始前执行
// afterEach: 在每个测试结束后执行

describe('useMockPermissionStore', () => {
  // 存储原始 localStorage，用于测试后恢复
  let originalLocalStorage: Storage;
  // 存储 mock 实例，用于每个测试前重置
  let mockLocalStorage: ReturnType<typeof createLocalStorageMock>;

  // 在所有测试开始前：mock localStorage
  beforeAll(() => {
    originalLocalStorage = window.localStorage;
    mockLocalStorage = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  // 在每个测试开始前：重置 Pinia 和 localStorage
  beforeEach(() => {
    // 创建新的 Pinia 实例，确保每个测试都有干净的状态
    setActivePinia(createPinia());
    // 重置 localStorage 的 mock 调用记录
    vi.clearAllMocks();
  });

  // 在所有测试结束后：恢复原始 localStorage
  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  // --------------------------------------------------------------------------
  // 2.1 初始化相关测试
  // --------------------------------------------------------------------------

  describe('初始化', () => {
    it('应该从 localStorage 加载配置（如果存在有效数据）', () => {
      // Arrange: 预存配置到 localStorage
      const storedConfig = {
        permissions: [{ id: '1', name: '测试权限', code: 'test:perm', type: 'menu' as const }],
        roles: [
          {
            id: '1',
            name: '测试角色',
            code: 'test',
            description: 'test',
            permissions: [],
            menus: [],
          },
        ],
        userRoles: [{ username: 'testuser', roleCodes: ['test'] }],
        version: 2,
      };

      // 使用 mockImplementationOnce 确保只影响这个测试
      const getItemSpy = vi.spyOn(window.localStorage, 'getItem');
      getItemSpy.mockImplementation((key: string) => {
        if (key === 'mock_permission_config') {
          return JSON.stringify(storedConfig);
        }
        return null;
      });

      // Act: 初始化 store
      const store = useMockPermissionStore();
      store.initConfig();

      // Assert: 验证从 localStorage 加载的数据
      expect(store.getPermissions).toHaveLength(1);
      expect(store.getPermissions[0].name).toBe('测试权限');
      expect(store.getUserRoles[0].username).toBe('testuser');

      // 恢复 spy
      getItemSpy.mockRestore();
    });

    it('应该使用默认配置（如果 localStorage 为空）', () => {
      // Act: 初始化 store（localStorage 为空）
      const store = useMockPermissionStore();
      store.initConfig();

      // Assert: 验证使用了默认配置
      expect(store.getPermissions.length).toBeGreaterThan(0);
      expect(store.getRoles.length).toBeGreaterThan(0);
      expect(store.getUserRoles.length).toBeGreaterThanOrEqual(3); // 默认有 admin, operator, user
    });

    it('应该使用默认配置（如果版本不匹配）', () => {
      // Arrange: 模拟返回旧版本配置
      const oldConfig = {
        permissions: [],
        roles: [],
        userRoles: [],
        version: 1, // 旧版本
      };

      const getItemSpy = vi.spyOn(window.localStorage, 'getItem');
      getItemSpy.mockReturnValue(JSON.stringify(oldConfig));

      // Act: 初始化 store
      const store = useMockPermissionStore();
      store.initConfig();

      // Assert: 使用默认配置（而不是空配置）
      expect(store.getPermissions.length).toBeGreaterThan(0);

      getItemSpy.mockRestore();
    });

    it('应该使用默认配置（如果 localStorage 数据损坏）', () => {
      // Arrange: 模拟返回无效 JSON
      const getItemSpy = vi.spyOn(window.localStorage, 'getItem');
      getItemSpy.mockReturnValue('invalid json');

      // Act & Assert: 不应该抛出错误，而是使用默认配置
      const store = useMockPermissionStore();
      expect(() => store.initConfig()).not.toThrow();
      expect(store.getRoles.length).toBeGreaterThan(0);

      getItemSpy.mockRestore();
    });
  });

  // --------------------------------------------------------------------------
  // 2.2 权限查询相关测试
  // --------------------------------------------------------------------------

  describe('权限查询', () => {
    beforeEach(() => {
      // 每个测试前初始化默认配置
      const store = useMockPermissionStore();
      store.initConfig();
    });

    it('应该正确获取用户的角色代码列表', () => {
      // Arrange
      const store = useMockPermissionStore();

      // Act & Assert: 测试已知用户
      expect(store.getUserRoleCodes('admin')).toEqual(['admin']);
      expect(store.getUserRoleCodes('operator')).toEqual(['operator']);
      expect(store.getUserRoleCodes('user')).toEqual(['user']);

      // 测试未知用户：应该返回默认角色 ['user']
      expect(store.getUserRoleCodes('unknown')).toEqual(['user']);
    });

    it('admin 用户应该拥有所有权限', () => {
      // Arrange
      const store = useMockPermissionStore();

      // Act
      const adminPerms = store.getUserPermissions('admin');

      // Assert: admin 有通配符权限
      expect(adminPerms).toContain('*');
    });

    it('普通用户应该只有分配的权限', () => {
      // Arrange
      const store = useMockPermissionStore();

      // Act
      const userPerms = store.getUserPermissions('user');

      // Assert: user 角色只有 profile:view 和 profile:edit
      expect(userPerms).toContain('profile:view');
      expect(userPerms).not.toContain('system');
      expect(userPerms).not.toContain('*');
    });

    it('多角色用户应该拥有合并的权限', () => {
      // Arrange: 创建一个多角色用户
      const store = useMockPermissionStore();
      store.updateUserRoles('multirole', ['operator', 'user']);

      // Act
      const perms = store.getUserPermissions('multirole');

      // Assert: 合并了 operator 和 user 的权限
      expect(perms).toContain('order:view'); // operator 的权限
      expect(perms).toContain('profile:view'); // user 的权限
    });

    it('应该正确获取用户的菜单列表', () => {
      // Arrange
      const store = useMockPermissionStore();

      // Act & Assert
      const adminMenus = store.getUserMenus('admin');
      expect(adminMenus).toContain('Dashboard');
      expect(adminMenus).toContain('UserManage');
      expect(adminMenus).toContain('OrderList');

      const userMenus = store.getUserMenus('user');
      expect(userMenus).toContain('Dashboard');
      expect(userMenus).toContain('Profile');
      expect(userMenus).not.toContain('UserManage');
    });
  });

  // --------------------------------------------------------------------------
  // 2.3 权限树形结构测试
  // --------------------------------------------------------------------------

  describe('权限树形结构', () => {
    it('应该正确构建权限树', () => {
      // Arrange
      const store = useMockPermissionStore();
      store.initConfig();

      // Act
      const tree = store.getPermissionTree;

      // Assert: 顶层应该有系统管理、业务管理、个人中心
      const rootNodes = tree.map((n) => n.code);
      expect(rootNodes).toContain('system');
      expect(rootNodes).toContain('business');
      expect(rootNodes).toContain('user');

      // Assert: 子权限应该嵌套在父权限下
      const systemNode = tree.find((n) => n.code === 'system');
      expect(systemNode?.children).toBeDefined();
      expect(systemNode?.children?.length).toBeGreaterThan(0);
    });

    it('应该只返回菜单类型的权限', () => {
      // Arrange
      const store = useMockPermissionStore();
      store.initConfig();

      // Act
      const menuPerms = store.getMenuPermissions;

      // Assert: 所有返回的权限都是菜单类型
      expect(menuPerms.every((p) => p.type === 'menu')).toBe(true);
      // 不包含按钮类型
      expect(menuPerms.some((p) => p.code === 'order:edit')).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 2.4 数据修改相关测试
  // --------------------------------------------------------------------------

  describe('数据修改', () => {
    beforeEach(() => {
      const store = useMockPermissionStore();
      store.initConfig();
    });

    it('应该更新用户角色并保存到 localStorage', () => {
      // Arrange
      const store = useMockPermissionStore();
      const setItemSpy = vi.spyOn(window.localStorage, 'setItem');

      // Act: 更新用户角色
      store.updateUserRoles('newuser', ['operator', 'user']);

      // Assert: 内存中的数据已更新
      const userRoles = store.getUserRoles;
      const newUser = userRoles.find((u) => u.username === 'newuser');
      expect(newUser?.roleCodes).toEqual(['operator', 'user']);

      // Assert: 保存到 localStorage
      expect(setItemSpy).toHaveBeenCalled();
      const savedData = JSON.parse(setItemSpy.mock.calls[0][1]);
      expect(savedData.userRoles).toContainEqual({
        username: 'newuser',
        roleCodes: ['operator', 'user'],
      });
    });

    it('应该更新已有用户的角色（而不是添加新记录）', () => {
      // Arrange
      const store = useMockPermissionStore();

      // Act: 更新已存在的 user
      const originalCount = store.getUserRoles.length;
      store.updateUserRoles('user', ['admin']); // 将 user 改为 admin

      // Assert: 用户角色已更新
      const user = store.getUserRoles.find((u) => u.username === 'user');
      expect(user?.roleCodes).toEqual(['admin']);

      // Assert: 没有添加新记录
      expect(store.getUserRoles.length).toBe(originalCount);
    });

    it('应该添加新角色', () => {
      // Arrange
      const store = useMockPermissionStore();
      const newRole: Omit<RoleConfig, 'id'> = {
        name: '测试角色',
        code: 'testrole',
        description: '用于测试的角色',
        permissions: ['profile:view'],
        menus: ['Dashboard'],
      };

      // Act
      const roleId = store.addRole(newRole);

      // Assert: 角色已添加
      const addedRole = store.getRoles.find((r) => r.code === 'testrole');
      expect(addedRole).toBeDefined();
      expect(addedRole?.name).toBe('测试角色');
      expect(addedRole?.id).toBe(roleId);
    });

    it('应该删除角色并清理用户角色映射', () => {
      // Arrange: 先创建一个角色并分配给用户
      const store = useMockPermissionStore();
      const roleId = store.addRole({
        name: '临时角色',
        code: 'temp',
        description: '将被删除',
        permissions: [],
        menus: [],
      });
      store.updateUserRoles('testuser', ['temp']);

      // 验证初始状态
      expect(store.getRoles.some((r) => r.id === roleId)).toBe(true);
      expect(store.getUserRoles.some((u) => u.roleCodes.includes('temp'))).toBe(true);

      // Act: 删除角色
      store.deleteRole(roleId);

      // Assert: 角色已删除
      expect(store.getRoles.some((r) => r.id === roleId)).toBe(false);

      // Assert: 用户不再拥有该角色
      const user = store.getUserRoles.find((u) => u.username === 'testuser');
      expect(user?.roleCodes).not.toContain('temp');
    });

    it('应该更新角色权限', () => {
      // Arrange
      const store = useMockPermissionStore();

      // Act: 更新 operator 角色的权限
      store.updateRolePermissions('2', ['OrderList', 'OrderDetail'], ['order:view']);

      // Assert
      const operatorRole = store.getRoles.find((r) => r.id === '2');
      expect(operatorRole?.menus).toEqual(['OrderList', 'OrderDetail']);
      expect(operatorRole?.permissions).toEqual(['order:view']);
    });

    it('应该重置为默认配置', () => {
      // Arrange: 修改一些数据
      const store = useMockPermissionStore();
      store.updateUserRoles('admin', ['user']); // 降低 admin 权限

      // Act: 重置
      store.resetToDefault();

      // Assert: 恢复默认状态
      expect(store.getUserRoleCodes('admin')).toEqual(['admin']);
    });
  });

  // --------------------------------------------------------------------------
  // 2.5 响应式特性测试
  // --------------------------------------------------------------------------

  describe('响应式特性', () => {
    it('修改 state 后 getter 应该自动更新', () => {
      // Arrange
      const store = useMockPermissionStore();
      store.initConfig();

      // 获取初始值
      const initialRoles = store.getUserRoles.length;

      // Act: 添加新用户角色映射
      store.updateUserRoles('reactive_test', ['user']);

      // Assert: getter 返回新值（证明是响应式的）
      expect(store.getUserRoles.length).toBe(initialRoles + 1);
    });
  });
});

// ============================================================================
// 总结：Pinia Store 测试要点
// ============================================================================
//
// 1. **测试环境设置**：
//    - 使用 createPinia() 创建隔离的 Pinia 实例
//    - 使用 setActivePinia() 激活实例
//    - 在每个测试前重置状态
//
// 2. **Mock 浏览器 API**：
//    - 使用 vi.fn() 创建模拟函数
//    - 在 beforeAll 中替换全局对象
//    - 在 afterAll 中恢复原对象
//
// 3. **测试 Pinia Store 的方法**：
//    - 测试 state：直接访问 store.xxx
//    - 测试 getter：访问 store.getXxx
//    - 测试 action：调用 store.xxx()
//    - 验证副作用：检查 localStorage 是否被调用
//
// 4. **数据隔离**：
//    - 每个测试都应该从干净状态开始
//    - 使用 beforeEach 重置所有共享状态
//
// 下一节我们将学习如何测试 Composable（Vue 组合式函数）
