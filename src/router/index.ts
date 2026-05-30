import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';

// 常量路由（不需要权限）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: {
      public: true,
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: {
      title: '页面不存在',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

// 标记是否已初始化
let hasInitAuth = false;

// 动态路由是否已添加
let hasAddedRoutes = false;

// 白名单路由
const whiteList = ['/login', '/404', '/403', '/'];

/**
 * 添加动态路由
 */
export async function addDynamicRoutes() {
  const permissionStore = usePermissionStore();

  // 如果已经添加过，不再重复添加
  if (hasAddedRoutes) {
    return permissionStore.getDynamicRoutes;
  }

  // 生成动态路由
  const dynamicRoutes = await permissionStore.generateRoutes();

  // 添加到路由器
  dynamicRoutes.forEach((route) => {
    // 找到 Layout 路由，将动态路由添加为其子路由
    if (!route.path.includes('/:')) {
      router.addRoute('Layout', route);
    } else {
      // 带有参数的路由直接添加
      router.addRoute(route);
    }
  });

  hasAddedRoutes = true;
  return dynamicRoutes;
}

/**
 * 重置路由
 */
export function resetRouter() {
  const permissionStore = usePermissionStore();

  // 移除动态添加的路由
  permissionStore.getDynamicRoutes.forEach((route) => {
    if (route.name) {
      router.removeRoute(route.name);
    }
  });

  permissionStore.resetRoutes();
  hasAddedRoutes = false;
}

/**
 * 重置动态路由添加标记（用于退出登录后重新登录）
 */
export function resetHasAddedRoutes() {
  hasAddedRoutes = false;
}

// 路由守卫
router.beforeEach(async (to) => {
  const userStore = useUserStore();

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title as string} - 管理系统` : '管理系统';

  // 应用首次加载时初始化认证状态
  if (!hasInitAuth) {
    userStore.initAuth();
    hasInitAuth = true;
  }
  // 如果是白名单路由，直接放行
  if (whiteList.includes(to.path)) {
    // 未登录用户访问根路径，重定向到登录页
    if (to.path === '/' && !userStore.isLoggedIn) {
      return '/login';
    }
    // 已登录用户访问根路径，重定向到首页
    if (to.path === '/' && userStore.isLoggedIn) {
      return '/dashboard';
    }
    return;
  }

  // 如果是公开页面，直接放行
  if (to.meta.public) {
    // 已登录用户访问登录页，重定向到首页
    if (to.path === '/login' && userStore.isLoggedIn) {
      return '/dashboard';
    }
    return;
  }

  // 检查是否已登录
  if (!userStore.isLoggedIn) {
    return '/login';
  }

  // 动态添加路由（只在登录后执行一次）
  if (!hasAddedRoutes) {
    try {
      await addDynamicRoutes();

      // 动态添加路由后，需要重新导航到目标路由
      // 使用 replace: true 避免历史记录问题
      return { ...to, replace: true };
    } catch (error) {
      console.error('添加动态路由失败:', error);
      // 重置 token 并跳转到登录页
      userStore.clearUserInfo();
      return '/login';
    }
  }

  // 权限检查（如果有配置）
  const requiredRoles = to.meta.roles as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some((role) => userStore.hasRole(role));
    if (!hasRole) {
      return '/403';
    }
  }
});

// 路由后置守卫
router.afterEach(() => {
  // console.log('路由跳转:', to.path);
});

export default router;
