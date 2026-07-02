import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from './user';
import { useMockPermissionStore } from './mockPermission';
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
  Dashboard: () => import('@/views/dashboard/DashboardView/index.vue'),
  UserManage: () => import('@/views/system/UserManageView/index.vue'),
  RoleManage: () => import('@/views/system/RoleManageView/index.vue'),
  PermissionManage: () => import('@/views/system/PermissionManageView.vue'),
  OrderList: () => import('@/views/business/OrderListView/index.vue'),
  OrderDetail: () => import('@/views/business/OrderDetailView/index.vue'),
  GoodsManage: () => import('@/views/business/GoodsManageView/index.vue'),
  Profile: () => import('@/views/user/ProfileView/index.vue'),
  // Settings: () => import('@/views/user/SettingsView/index.vue'),
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
    const routeData = await fetchRoutesFromServer();

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
   * 现在从 mockPermissionStore 读取配置，支持动态修改
   */
  async function fetchRoutesFromServer(): Promise<DynamicRoute[]> {
    // 模拟 API 调用延迟
    await delay(300);

    const mockStore = useMockPermissionStore();
    const userStore = useUserStore();
    const username = userStore.getUserInfo?.username;

    if (!username) {
      return getBasicRoutes();
    }

    // 从 mockPermissionStore 获取该用户可访问的菜单列表
    const allowedMenus = mockStore.getUserMenus(username);

    // 根据允许的菜单过滤路由
    return filterRoutesByMenus(getAllRoutes(), allowedMenus);
  }

  /**
   * 获取所有可用路由配置
   */
  function getAllRoutes(): DynamicRoute[] {
    return [
      {
        path: '/admin/dashboard',
        name: 'Dashboard',
        component: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
      {
        path: '/admin/business/orders',
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
        path: '/admin/business/orders/:id',
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
        path: '/admin/business/goods',
        name: 'GoodsManage',
        component: 'GoodsManage',
        meta: {
          title: '商品管理',
          icon: 'Goods',
          group: 'business',
          groupTitle: '业务管理',
          groupIcon: 'GoodsFilled',
        },
      },
      {
        path: '/admin/system/users',
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
        path: '/admin/system/roles',
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
      // 注：PermissionManage 路由已移除（演示模式不需要权限管理页面）
      {
        path: '/admin/user/profile',
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
   * 根据允许的菜单列表过滤路由
   */
  function filterRoutesByMenus(routes: DynamicRoute[], allowedMenus: string[]): DynamicRoute[] {
    return routes.filter((route) => {
      // 首页始终允许
      if (route.name === 'Dashboard') {
        return true;
      }
      // 检查是否在允许的菜单列表中
      return allowedMenus.includes(route.name);
    });
  }

  /**
   * 基础路由配置（访客）
   */
  function getBasicRoutes(): DynamicRoute[] {
    return [
      {
        path: '/admin/dashboard',
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
      // 检查角色权限，如果路由需要特定角色但用户没有，则跳过
      if (route.meta.roles && !hasRequiredRole(route.meta.roles, roles)) {
        continue;
      }

      // 检查权限码，如果路由需要特定权限但用户没有，则跳过
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
