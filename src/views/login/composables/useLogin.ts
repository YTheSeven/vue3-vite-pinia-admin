import type { FormInstance, FormRules } from 'element-plus';
import type { LoginParams } from '@/types/modules/user';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { addDynamicRoutes } from '@/router';

/** 登录表单 */
export interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

/** 登录 Hook 返回类型 */
export interface UseLoginReturn {
  // 表单引用
  loginFormRef: Ref<FormInstance | undefined>;
  // 加载状态
  loading: Ref<boolean>;
  // 表单数据
  loginForm: LoginForm;
  // 验证规则
  loginRules: FormRules;
  // 登录方法
  handleLogin: () => Promise<void>;
}

/**
 * 登录页面业务逻辑 Hook
 * @returns 登录相关的状态和方法
 */
export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const userStore = useUserStore();

  // 表单引用
  const loginFormRef = ref<FormInstance>();

  // 加载状态
  const loading = ref(false);

  // 登录表单数据
  const loginForm = reactive<LoginForm>({
    username: 'admin',
    password: '123456',
    remember: false,
  });

  // 表单验证规则
  const loginRules: FormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  };

  /**
   * 处理登录
   */
  const handleLogin = async (): Promise<void> => {
    if (!loginFormRef.value) return;

    try {
      await loginFormRef.value.validate();
      loading.value = true;

      // 构建登录参数
      const params: LoginParams = {
        user_name: loginForm.username,
        password: loginForm.password,
        remember: loginForm.remember,
      };

      // 执行登录
      await userStore.login(params);

      // 加载动态路由
      await addDynamicRoutes();

      ElMessage.success('登录成功');
      await router.push('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      ElMessage.error('登录失败，请检查用户名和密码');
    } finally {
      loading.value = false;
    }
  };

  return {
    loginFormRef,
    loading,
    loginForm,
    loginRules,
    handleLogin,
  };
}
