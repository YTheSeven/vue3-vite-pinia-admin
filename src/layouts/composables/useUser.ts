import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

/**
 * 用户相关逻辑
 */
export function useUser() {
  const router = useRouter();
  const userStore = useUserStore();

  // 显示的用户名（昵称优先，然后是用户名）
  const displayName = computed(() => {
    const info = userStore.userInfo;
    return info?.nickname ?? info?.username ?? '用户';
  });

  // 退出登录
  const handleLogout = async () => {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      await userStore.logout();
      ElMessage.success('已退出登录');
      await router.push('/login');
    } catch {
      // 取消退出
    }
  };

  // 处理下拉菜单命令
  const handleCommand = async (command: string) => {
    switch (command) {
      case 'profile':
        await router.push('/user/profile');
        break;
      case 'settings':
        await router.push('/user/settings');
        break;
      case 'logout':
        await handleLogout();
        break;
    }
  };

  return {
    userStore,
    displayName,
    handleLogout,
    handleCommand,
  };
}
