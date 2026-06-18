import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/** 权限项 */
export interface PermissionItem {
  id: string;
  name: string;
  code: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
}

/** 角色配置 */
export interface RoleConfig {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[]; // 权限码列表
  menus: string[]; // 可访问的菜单路由name列表
}

/** 用户角色映射 */
export interface UserRoleMapping {
  username: string;
  roleCodes: string[];
}

/** 默认权限列表 */
const DEFAULT_PERMISSIONS: PermissionItem[] = [
  // 系统管理
  { id: '1', name: '系统管理', code: 'system', type: 'menu' },
  { id: '1-1', name: '用户管理', code: 'user:manage', type: 'menu', parentId: '1' },
  { id: '1-2', name: '角色管理', code: 'role:manage', type: 'menu', parentId: '1' },
  // 权限管理页面已隐藏（演示模式不需要）

  // 业务管理
  { id: '2', name: '业务管理', code: 'business', type: 'menu' },
  { id: '2-1', name: '订单列表', code: 'order:view', type: 'menu', parentId: '2' },
  { id: '2-2', name: '订单编辑', code: 'order:edit', type: 'button', parentId: '2' },
  { id: '2-3', name: '商品管理', code: 'goods:manage', type: 'menu', parentId: '2' },

  // 个人中心
  { id: '3', name: '个人中心', code: 'user', type: 'menu' },
  { id: '3-1', name: '个人资料', code: 'profile:view', type: 'menu', parentId: '3' },
  { id: '3-2', name: '系统设置', code: 'settings:manage', type: 'menu', parentId: '3' },
];

/** 默认角色配置 */
const DEFAULT_ROLES: RoleConfig[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有系统权限',
    permissions: ['*'],
    // 注：PermissionManage 已移除（演示模式不需要权限管理页面）
    menus: [
      'Dashboard',
      'OrderList',
      'OrderDetail',
      'GoodsManage',
      'UserManage',
      'RoleManage',
      'Profile',
    ],
  },
  {
    id: '2',
    name: '运营专员',
    code: 'operator',
    description: '负责订单和业务管理',
    permissions: ['order:view', 'order:edit', 'goods:manage', 'profile:view'],
    menus: ['Dashboard', 'OrderList', 'OrderDetail', 'GoodsManage', 'Profile'],
  },
  {
    id: '3',
    name: '普通用户',
    code: 'user',
    description: '普通用户权限',
    permissions: ['profile:view', 'profile:edit'],
    menus: ['Dashboard', 'Profile'],
  },
];

/** 默认用户角色映射 */
const DEFAULT_USER_ROLES: UserRoleMapping[] = [
  { username: 'admin', roleCodes: ['admin'] },
  { username: 'operator', roleCodes: ['operator'] },
  { username: 'user', roleCodes: ['user'] },
];

/** 存储键名 */
const STORAGE_KEY = 'mock_permission_config';

/** 完整配置结构 */
interface PermissionConfig {
  permissions: PermissionItem[];
  roles: RoleConfig[];
  userRoles: UserRoleMapping[];
  version: number;
}

const CURRENT_VERSION = 2; // 版本 2：移除 PermissionManage 页面

export const useMockPermissionStore = defineStore('mockPermission', () => {
  // ========== State ==========
  const permissions = ref<PermissionItem[]>([]);
  const roles = ref<RoleConfig[]>([]);
  const userRoles = ref<UserRoleMapping[]>([]);

  // ========== Getters ==========
  const getPermissions = computed(() => permissions.value);
  const getRoles = computed(() => roles.value);
  const getUserRoles = computed(() => userRoles.value);

  /** 获取所有菜单权限（用于角色配置） */
  const getMenuPermissions = computed(() => permissions.value.filter((p) => p.type === 'menu'));

  /** 获取权限树形结构 */
  const getPermissionTree = computed(() => {
    const buildTree = (parentId?: string): PermissionItem[] => {
      return permissions.value
        .filter((p) => p.parentId === parentId)
        .map((p) => ({
          ...p,
          children: buildTree(p.id),
        }));
    };
    return buildTree();
  });

  // ========== Actions ==========

  /** 初始化配置（从 LocalStorage 加载或创建默认） */
  function initConfig() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const config: PermissionConfig = JSON.parse(stored);
        // 版本检查，未来可用于数据迁移
        if (config.version === CURRENT_VERSION) {
          permissions.value = config.permissions;
          roles.value = config.roles;
          userRoles.value = config.userRoles;
          return;
        }
      } catch {
        console.warn('权限配置解析失败，使用默认配置');
      }
    }
    // 使用默认配置
    resetToDefault();
  }

  /** 保存到 LocalStorage */
  function saveConfig() {
    const config: PermissionConfig = {
      permissions: permissions.value,
      roles: roles.value,
      userRoles: userRoles.value,
      version: CURRENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  /** 重置为默认配置 */
  function resetToDefault() {
    permissions.value = JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS));
    roles.value = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    userRoles.value = JSON.parse(JSON.stringify(DEFAULT_USER_ROLES));
    saveConfig();
  }

  /** 获取用户的角色列表 */
  function getUserRoleCodes(username: string): string[] {
    const mapping = userRoles.value.find((u) => u.username === username);
    return mapping?.roleCodes ?? ['user']; // 默认普通用户
  }

  /** 获取用户的权限列表 */
  function getUserPermissions(username: string): string[] {
    const roleCodes = getUserRoleCodes(username);
    if (roleCodes.includes('admin')) {
      return ['*'];
    }
    const perms = new Set<string>();
    roleCodes.forEach((code) => {
      const role = roles.value.find((r) => r.code === code);
      if (role) {
        role.permissions.forEach((p) => perms.add(p));
      }
    });
    return Array.from(perms);
  }

  /** 获取用户的菜单列表 */
  function getUserMenus(username: string): string[] {
    const roleCodes = getUserRoleCodes(username);
    if (roleCodes.includes('admin')) {
      return roles.value.find((r) => r.code === 'admin')?.menus ?? [];
    }
    const menus = new Set<string>();
    roleCodes.forEach((code) => {
      const role = roles.value.find((r) => r.code === code);
      if (role) {
        role.menus.forEach((m) => menus.add(m));
      }
    });
    return Array.from(menus);
  }

  /** 更新角色权限 */
  function updateRolePermissions(roleId: string, menus: string[], permissions: string[]) {
    const role = roles.value.find((r) => r.id === roleId);
    if (role) {
      role.menus = menus;
      role.permissions = permissions;
      saveConfig();
    }
  }

  /** 更新用户角色 */
  function updateUserRoles(username: string, roleCodes: string[]) {
    const mapping = userRoles.value.find((u) => u.username === username);
    if (mapping) {
      mapping.roleCodes = roleCodes;
    } else {
      userRoles.value.push({ username, roleCodes });
    }
    saveConfig();
  }

  /** 添加角色 */
  function addRole(role: Omit<RoleConfig, 'id'>) {
    const id = (roles.value.length + 1).toString();
    roles.value.push({ ...role, id });
    saveConfig();
    return id;
  }

  /** 删除角色 */
  function deleteRole(roleId: string) {
    roles.value = roles.value.filter((r) => r.id !== roleId);
    // 清理用户角色映射
    userRoles.value.forEach((u) => {
      u.roleCodes = u.roleCodes.filter((code) => {
        const role = roles.value.find((r) => r.code === code);
        return role !== undefined;
      });
    });
    saveConfig();
  }

  return {
    // State
    permissions,
    roles,
    userRoles,
    // Getters
    getPermissions,
    getRoles,
    getUserRoles,
    getMenuPermissions,
    getPermissionTree,
    // Actions
    initConfig,
    saveConfig,
    resetToDefault,
    getUserRoleCodes,
    getUserPermissions,
    getUserMenus,
    updateRolePermissions,
    updateUserRoles,
    addRole,
    deleteRole,
  };
});
