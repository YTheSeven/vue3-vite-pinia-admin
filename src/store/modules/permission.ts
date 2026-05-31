import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from './user';
import { delay } from '@/utils/utils';

// 动态路由配置项
export interface DynamicRoute {
  path: string;
  name: string;
  component: string;
  meta: {
    title: string;
    icon?: string;
    roles?: string[];
    permissions?: string[];
    keepAlive?: boolean;
    hidden?: boolean;
    group?: string;
    groupTitle?: string;
    groupIcon?: string;
  };
  children?: DynamicRoute[];
}

// 组件映射表（后端返回的组件名 -> 实际组件）
const componentMap: Record<string, () => Promise<Component>> = {
  Layout: () => import('@/layouts/AdminLayout.vue'),
  Dashboard: () => import('@/views/dashboard/DashboardView.vue'),
  UserManage: () => import('@/views/system/UserManageView.vue'),
  RoleManage: () => import('@/views/system/RoleManageView.vue'),
  PermissionManage: () => import('@/views/system/PermissionManageView.vue'),
  OrderList: () => import('@/views/business/OrderListView.vue'),
  OrderDetail: () => import('@/views/business/OrderDetailView.vue'),
  Profile: () => import('@/views/user/ProfileView.vue'),
  Settings: () => import('@/views/user/SettingsView.vue'),
  UseRequestDemo: () => import('@/views/demo/UseRequestDemo.vue'),
};

export const usePermissionStore = defineStore('permission', () => {
  // ========== State ==========
  const dynamicRoutes = ref<RouteRecordRaw[]>([]);
  const sidebarMenus = ref<DynamicRoute[]>([]);
  const isRoutesLoaded = ref(false);

  // ========== Getters ==========
  const getDynamicRoutes = computed(() => dynamicRoutes.value);
  const getSidebarMenus = computed(() => sidebarMenus.value);
  const getIsRoutesLoaded = computed(() => isRoutesLoaded.value);

  // ========== Actions ==========

  /**
   * 根据角色生成动态路由和菜单
   */
  async function generateRoutes() {
    const userStore = useUserStore();
    const roles = userStore.getUserRoles;
    const permissions = userStore.getUserPermissions;

    // 模拟从后端获取路由配置
    const routeData = await fetchRoutesFromServer(roles);

    // 生成动态路由
    const routes = filterAndConvertRoutes(routeData, roles, permissions);
    dynamicRoutes.value = routes;

    // 生成侧边栏菜单（过滤掉隐藏的路由）
    sidebarMenus.value = generateSidebarMenus(routeData, roles, permissions);

    isRoutesLoaded.value = true;

    return routes;
  }

  /**
   * 模拟从服务器获取路由配置
   */
  async function fetchRoutesFromServer(roles: string[]): Promise<DynamicRoute[]> {
    // 模拟 API 调用延迟
    await delay(300);

    // 根据角色返回不同的菜单
    if (roles.includes('admin')) {
      // 管理员 - 拥有所有权限
      return getAdminRoutes();
    } else if (roles.includes('operator')) {
      // 运营人员 - 只能看订单相关
      return getOperatorRoutes();
    } else if (roles.includes('user')) {
      // 普通用户 - 只能看个人信息
      return getUserRoutes();
    }

    // 默认返回基础路由
    return getBasicRoutes();
  }

  /**
   * 管理员路由配置
   */
  function getAdminRoutes(): DynamicRoute[] {
    return [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
      {
        path: '/demo/use-request',
        name: 'UseRequestDemo',
        component: 'UseRequestDemo',
        meta: {
          title: 'useRequest演示',
          icon: 'Document',
          group: 'demo',
          groupTitle: '组件演示',
          groupIcon: 'Box',
        },
      },
      {
        path: '/business/orders',
        name: 'OrderList',
        component: 'OrderList',
        meta: {
          title: '订单列表',
          icon: 'List',
          group: 'business',
          groupTitle: '业务管理',
          groupIcon: 'GoodsFilled',
        },
      },
      {
        path: '/business/orders/:id',
        name: 'OrderDetail',
        component: 'OrderDetail',
        meta: {
          title: '订单详情',
          icon: 'Document',
          hidden: true,
          group: 'business',
          groupTitle: '业务管理',
          groupIcon: 'GoodsFilled',
        },
      },
      {
        path: '/system/users',
        name: 'UserManage',
        component: 'UserManage',
        meta: {
          title: '用户管理',
          icon: 'UserFilled',
          group: 'system',
          groupTitle: '系统管理',
          groupIcon: 'Setting',
        },
      },
      {
        path: '/system/roles',
        name: 'RoleManage',
        component: 'RoleManage',
        meta: {
          title: '角色管理',
          icon: 'User',
          group: 'system',
          groupTitle: '系统管理',
          groupIcon: 'Setting',
        },
      },
      {
        path: '/system/permissions',
        name: 'PermissionManage',
        component: 'PermissionManage',
        meta: {
          title: '权限管理',
          icon: 'Lock',
          group: 'system',
          groupTitle: '系统管理',
          groupIcon: 'Setting',
        },
      },
      {
        path: '/user/profile',
        name: 'Profile',
        component: 'Profile',
        meta: {
          title: '个人资料',
          icon: 'User',
          group: 'user',
          groupTitle: '个人中心',
          groupIcon: 'UserFilled',
        },
      },
      {
        path: '/user/settings',
        name: 'Settings',
        component: 'Settings',
        meta: {
          title: '系统设置',
          icon: 'Setting',
          group: 'user',
          groupTitle: '个人中心',
          groupIcon: 'UserFilled',
        },
      },
    ];
  }

  /**
   * 运营人员路由配置
   */
  function getOperatorRoutes(): DynamicRoute[] {
    return [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
      {
        path: '/business/orders',
        name: 'OrderList',
        component: 'OrderList',
        meta: {
          title: '订单列表',
          icon: 'List',
          group: 'business',
          groupTitle: '业务管理',
          groupIcon: 'GoodsFilled',
        },
      },
      {
        path: '/business/orders/:id',
        name: 'OrderDetail',
        component: 'OrderDetail',
        meta: {
          title: '订单详情',
          icon: 'Document',
          hidden: true,
          group: 'business',
          groupTitle: '业务管理',
          groupIcon: 'GoodsFilled',
        },
      },
      {
        path: '/user/profile',
        name: 'Profile',
        component: 'Profile',
        meta: {
          title: '个人资料',
          icon: 'User',
          group: 'user',
          groupTitle: '个人中心',
          groupIcon: 'UserFilled',
        },
      },
    ];
  }

  /**
   * 普通用户路由配置
   */
  function getUserRoutes(): DynamicRoute[] {
    return [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
      {
        path: '/user/profile',
        name: 'Profile',
        component: 'Profile',
        meta: {
          title: '个人资料',
          icon: 'User',
          group: 'user',
          groupTitle: '个人中心',
          groupIcon: 'UserFilled',
        },
      },
    ];
  }

  /**
   * 基础路由配置（访客）
   */
  function getBasicRoutes(): DynamicRoute[] {
    return [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
    ];
  }

  /**
   * 过滤并转换路由配置为 Vue Router 可用的格式
   */
  function filterAndConvertRoutes(
    routes: DynamicRoute[],
    roles: string[],
    permissions: string[]
  ): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = [];

    for (const route of routes) {
      // 检查角色权限
      if (route.meta.roles && !hasRequiredRole(route.meta.roles, roles)) {
        continue;
      }

      // 检查权限码
      if (route.meta.permissions && !hasRequiredPermission(route.meta.permissions, permissions)) {
        continue;
      }

      const routeRecord: RouteRecordRaw = {
        path: route.path,
        name: route.name,
        component:
          componentMap[route.component] || (() => import('@/views/error/NotFoundView.vue')),
        meta: route.meta,
        children: route.children
          ? filterAndConvertRoutes(route.children, roles, permissions)
          : undefined,
      };

      result.push(routeRecord);
    }

    return result;
  }

  /**
   * 生成侧边栏菜单（过滤隐藏的路由并分组）
   */
  function generateSidebarMenus(
    routes: DynamicRoute[],
    roles: string[],
    permissions: string[]
  ): DynamicRoute[] {
    // 按 group 分组
    const groupMap = new Map<string, DynamicRoute>();
    const standaloneRoutes: DynamicRoute[] = [];

    for (const route of routes) {
      // 检查权限
      if (route.meta.roles && !hasRequiredRole(route.meta.roles, roles)) {
        continue;
      }
      if (route.meta.permissions && !hasRequiredPermission(route.meta.permissions, permissions)) {
        continue;
      }

      // 跳过重定向和隐藏的路由
      if (route.path.includes('redirect') || route.meta.hidden) {
        continue;
      }

      // 如果有分组，添加到分组中
      const group = route.meta.group as string | undefined;
      if (group) {
        const groupTitle = route.meta.groupTitle as string;
        const groupIcon = route.meta.groupIcon as string;

        if (!groupMap.has(group)) {
          // 创建新分组
          groupMap.set(group, {
            path: `/${group}`,
            name: `${group}Group`,
            component: 'Layout',
            meta: {
              title: groupTitle,
              icon: groupIcon,
            },
            children: [],
          });
        }

        // 添加到分组的 children 中
        const groupRoute = groupMap.get(group)!;
        groupRoute.children!.push({
          ...route,
          children: route.children
            ? generateSidebarMenus(route.children, roles, permissions)
            : undefined,
        });
      } else {
        // 独立路由（如首页）
        standaloneRoutes.push({
          ...route,
          children: route.children
            ? generateSidebarMenus(route.children, roles, permissions)
            : undefined,
        });
      }
    }

    // 合并结果：独立路由在前，分组在后
    return [...standaloneRoutes, ...groupMap.values()];
  }

  /**
   * 检查是否有需要的角色
   */
  function hasRequiredRole(requiredRoles: string[], userRoles: string[]): boolean {
    if (userRoles.includes('admin')) return true;
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  /**
   * 检查是否有需要的权限
   */
  function hasRequiredPermission(
    requiredPermissions: string[],
    userPermissions: string[]
  ): boolean {
    if (userPermissions.includes('*')) return true;
    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }

  /**
   * 重置路由状态
   */
  function resetRoutes() {
    dynamicRoutes.value = [];
    sidebarMenus.value = [];
    isRoutesLoaded.value = false;
  }

  return {
    // State
    dynamicRoutes,
    sidebarMenus,
    isRoutesLoaded,
    // Getters
    getDynamicRoutes,
    getSidebarMenus,
    getIsRoutesLoaded,
    // Actions
    generateRoutes,
    resetRoutes,
  };
});
