import type { Ref, ComputedRef } from 'vue';
import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { userApi } from '@/api/modules/user';
import type { UserDetail, ChangePasswordParams } from '@/types/modules/user';
import { useUserStore } from '@/store/modules/user';

// ============================================
// 类型定义
// ============================================

/** 菜单项 */
export interface MenuItem {
  key: string;
  label: string;
  icon: string;
  badge?: boolean;
}

/** 安全信息 */
export interface SecurityInfo {
  lastPasswordChange: string;
  phone: string;
  email: string;
  twoFactorEnabled: boolean;
}

/** 设备信息 */
export interface DeviceInfo {
  name: string;
  location: string;
  time: string;
  icon: string;
  isCurrent: boolean;
}

/** 通知设置 */
export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  internal: boolean;
  types: {
    announcement: boolean;
    security: boolean;
    business: boolean;
    marketing: boolean;
  };
}

/** 界面偏好 */
export interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  sidebar: 'expanded' | 'collapsed';
  animation: boolean;
  tableDensity: 'compact' | 'default' | 'loose';
  pageSize: number;
}

/** 隐私设置 */
export interface PrivacySettings {
  avatarVisibility: 'public' | 'users' | 'private';
  emailVisibility: 'public' | 'users' | 'private';
  showOnlineStatus: boolean;
  personalization: boolean;
  analytics: boolean;
  activityLog: boolean;
}

/** 密码表单 */
export interface PasswordForm {
  user_name: string;
  password: string;
  confirmPassword: string;
}

/** useSettingsView 返回值 */
export interface UseSettingsViewReturn {
  // 状态
  activeTab: Ref<string>;
  isLoading: Ref<boolean>;
  isSaving: Ref<boolean>;
  isChangingPassword: Ref<boolean>;
  userDetail: Ref<UserDetail | null>;
  securityInfo: Ref<SecurityInfo>;
  deviceList: Ref<DeviceInfo[]>;
  notificationSettings: Ref<NotificationSettings>;
  preferences: Ref<Preferences>;
  privacySettings: Ref<PrivacySettings>;
  showPasswordDialog: Ref<boolean>;
  passwordForm: Ref<PasswordForm>;
  passwordFormRef: Ref<FormInstance | undefined>;

  // 计算属性
  displayName: ComputedRef<string>;
  avatarUrl: ComputedRef<string>;
  menuItems: MenuItem[];

  // 方法
  fetchUserDetail: (id: string) => Promise<void>;
  handleTwoFactorChange: (val: string | number | boolean) => Promise<void>;
  handleBindPhone: () => void;
  handleLogoutDevice: (device: DeviceInfo) => Promise<void>;
  saveNotificationSettings: () => void;
  resetNotificationSettings: () => void;
  savePreferences: () => void;
  resetPreferences: () => void;
  savePrivacySettings: () => void;
  handleChangePassword: () => Promise<void>;
  handleClearData: () => Promise<void>;
  handleExportData: () => void;
  closePasswordDialog: () => void;
}

// ============================================
// Hook 实现
// ============================================

const DEFAULT_AVATAR = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

export function useSettingsView(): UseSettingsViewReturn {
  const userStore = useUserStore();

  // ========== State ==========
  const activeTab = ref<string>('security');
  const isLoading = ref<boolean>(false);
  const isSaving = ref<boolean>(false);
  const isChangingPassword = ref<boolean>(false);
  const userDetail = ref<UserDetail | null>(null);
  const showPasswordDialog = ref<boolean>(false);
  const passwordFormRef = ref<FormInstance>();

  // 安全信息
  const securityInfo = ref<SecurityInfo>({
    lastPasswordChange: '2024-01-15',
    phone: '138****8888',
    email: '',
    twoFactorEnabled: false,
  });

  // 设备列表（模拟数据）
  const deviceList = ref<DeviceInfo[]>([
    {
      name: 'Windows Chrome',
      location: '北京',
      time: '当前在线',
      icon: 'Monitor',
      isCurrent: true,
    },
    {
      name: 'iPhone Safari',
      location: '上海',
      time: '2小时前',
      icon: 'Iphone',
      isCurrent: false,
    },
    {
      name: 'Mac Safari',
      location: '深圳',
      time: '3天前',
      icon: 'Monitor',
      isCurrent: false,
    },
  ]);

  // 通知设置
  const notificationSettings = ref<NotificationSettings>({
    email: true,
    sms: false,
    internal: true,
    types: {
      announcement: true,
      security: true,
      business: true,
      marketing: false,
    },
  });

  // 界面偏好
  const preferences = ref<Preferences>({
    theme: 'light',
    language: 'zh-CN',
    sidebar: 'expanded',
    animation: true,
    tableDensity: 'default',
    pageSize: 20,
  });

  // 隐私设置
  const privacySettings = ref<PrivacySettings>({
    avatarVisibility: 'public',
    emailVisibility: 'users',
    showOnlineStatus: true,
    personalization: true,
    analytics: true,
    activityLog: true,
  });

  // 密码表单
  const passwordForm = ref<PasswordForm>({
    user_name: '',
    password: '',
    confirmPassword: '',
  });

  // ========== Getters ==========
  const displayName = computed<string>(() => {
    const info = userStore.userInfo;
    return info?.nickname ?? info?.username ?? '用户';
  });

  const avatarUrl = computed<string>(() => userStore.userInfo?.avatar ?? DEFAULT_AVATAR);

  const menuItems: MenuItem[] = [
    { key: 'security', label: '账户安全', icon: 'Lock', badge: false },
    { key: 'notifications', label: '通知设置', icon: 'BellFilled', badge: false },
    { key: 'preferences', label: '界面偏好', icon: 'BrushFilled', badge: false },
    { key: 'privacy', label: '隐私设置', icon: 'UserFilled', badge: false },
  ];

  // ========== Actions ==========

  /**
   * 获取用户详情
   */
  const fetchUserDetail = async (id: string): Promise<void> => {
    isLoading.value = true;
    try {
      const data = await userApi.getUserDetail(id);
      userDetail.value = data;
      // 同步安全信息
      securityInfo.value.email = data.email;
      securityInfo.value.phone = data.phone
        ? data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        : '未绑定';
    } catch (error) {
      ElMessage.error('获取用户信息失败');
      console.error('获取用户详情失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 处理两步验证切换
   */
  const handleTwoFactorChange = async (val: string | number | boolean): Promise<void> => {
    if (val) {
      try {
        await ElMessageBox.confirm(
          '开启两步验证后，登录时需要输入手机验证码，是否继续？',
          '确认开启',
          {
            confirmButtonText: '开启',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
        securityInfo.value.twoFactorEnabled = true;
        ElMessage.success('两步验证已开启');
      } catch {
        securityInfo.value.twoFactorEnabled = false;
      }
    } else {
      securityInfo.value.twoFactorEnabled = false;
      ElMessage.success('两步验证已关闭');
    }
  };

  /**
   * 处理绑定手机
   */
  const handleBindPhone = (): void => {
    ElMessage.info('绑定手机功能开发中');
  };

  /**
   * 处理退出设备登录
   */
  const handleLogoutDevice = async (device: DeviceInfo): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要退出 ${device.name} 的登录状态吗？`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const index = deviceList.value.indexOf(device);
      if (index > -1) {
        deviceList.value.splice(index, 1);
      }
      ElMessage.success('已退出该设备');
    } catch {
      // 用户取消操作
    }
  };

  /**
   * 保存通知设置
   */
  const saveNotificationSettings = (): void => {
    // TODO: 调用API保存设置
    ElMessage.success('通知设置已保存');
  };

  /**
   * 重置通知设置
   */
  const resetNotificationSettings = (): void => {
    notificationSettings.value = {
      email: true,
      sms: false,
      internal: true,
      types: {
        announcement: true,
        security: true,
        business: true,
        marketing: false,
      },
    };
    ElMessage.success('已重置为默认设置');
  };

  /**
   * 保存界面偏好
   */
  const savePreferences = (): void => {
    // TODO: 调用API保存设置
    ElMessage.success('界面偏好已保存');
  };

  /**
   * 重置界面偏好
   */
  const resetPreferences = (): void => {
    preferences.value = {
      theme: 'light',
      language: 'zh-CN',
      sidebar: 'expanded',
      animation: true,
      tableDensity: 'default',
      pageSize: 20,
    };
    ElMessage.success('已恢复默认设置');
  };

  /**
   * 保存隐私设置
   */
  const savePrivacySettings = (): void => {
    // TODO: 调用API保存设置
    ElMessage.success('隐私设置已保存');
  };

  /**
   * 关闭密码对话框
   */
  const closePasswordDialog = (): void => {
    showPasswordDialog.value = false;
    passwordForm.value = {
      user_name: '',
      password: '',
      confirmPassword: '',
    };
  };

  /**
   * 处理清除数据
   */
  const handleClearData = async (): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要清除所有个人数据吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'error',
      });
      ElMessage.success('数据已清除');
    } catch {
      // 用户取消操作
    }
  };

  /**
   * 处理修改密码
   */
  const handleChangePassword = async (): Promise<void> => {
    if (!passwordFormRef.value) return;

    await passwordFormRef.value.validate(async (valid) => {
      if (!valid) return;

      isChangingPassword.value = true;
      try {
        const params: ChangePasswordParams = {
          user_name: passwordForm.value.user_name,
          password: passwordForm.value.password,
        };

        await userApi.changePassword(params);
        ElMessage.success('密码修改成功');
        closePasswordDialog();
      } catch (error) {
        ElMessage.error('密码修改失败');
        console.error('修改密码失败:', error);
      } finally {
        isChangingPassword.value = false;
      }
    });
  };

  /**
   * 处理导出数据
   */
  const handleExportData = (): void => {
    ElMessage.success('数据导出中，请稍候...');
    setTimeout(() => {
      ElMessage.success('数据导出完成');
    }, 1500);
  };

  return {
    // State
    activeTab,
    isLoading,
    isSaving,
    isChangingPassword,
    userDetail,
    securityInfo,
    deviceList,
    notificationSettings,
    preferences,
    privacySettings,
    showPasswordDialog,
    passwordForm,
    passwordFormRef,

    // Getters
    displayName,
    avatarUrl,
    menuItems,

    // Actions
    fetchUserDetail,
    handleTwoFactorChange,
    handleBindPhone,
    handleLogoutDevice,
    saveNotificationSettings,
    resetNotificationSettings,
    savePreferences,
    resetPreferences,
    savePrivacySettings,
    handleChangePassword,
    handleClearData,
    handleExportData,
    closePasswordDialog,
  };
}
