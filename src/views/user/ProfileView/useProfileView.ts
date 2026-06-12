import type { Ref, ComputedRef } from 'vue';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { userApi } from '@/api/modules/user';
import { goodsApi } from '@/api/modules/goods';
import type { UpdateUserParams, ChangePasswordParams } from '@/types/modules/user';
import { useUserStore } from '@/store/modules/user';

interface UserFormState {
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
  gender: 0 | 1 | 2;
  birthday: string;
}

interface PasswordFormState {
  user_name: string;
  password: string;
  confirmPassword: string;
}

interface UseProfileViewReturn {
  // 状态
  isLoading: Ref<boolean>;
  isSaving: Ref<boolean>;
  isChangingPassword: Ref<boolean>;
  isUploadingAvatar: Ref<boolean>;
  userForm: Ref<UserFormState>;
  passwordForm: Ref<PasswordFormState>;

  // 计算属性
  isFormDirty: ComputedRef<boolean>;
  avatarUrl: ComputedRef<string>;

  // 方法
  fetchUserDetail: (id: string) => Promise<void>;
  updateUserInfo: (id: string) => Promise<void>;
  changePassword: () => Promise<void>;
  resetForm: () => void;
  resetPasswordForm: () => void;
  uploadAvatar: (file: File) => Promise<void>;
}

const DEFAULT_AVATAR = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

const createDefaultUserForm = (): UserFormState => ({
  nickname: '',
  avatar: '',
  email: '',
  phone: '',
  bio: '',
  gender: 0,
  birthday: '',
});

const createDefaultPasswordForm = (): PasswordFormState => ({
  user_name: '',
  password: '',
  confirmPassword: '',
});

export function useProfileView(): UseProfileViewReturn {
  const userStore = useUserStore();

  // ========== State ==========
  const isLoading = ref<boolean>(false);
  const isSaving = ref<boolean>(false);
  const isChangingPassword = ref<boolean>(false);
  const isUploadingAvatar = ref<boolean>(false);
  const userForm = ref<UserFormState>(createDefaultUserForm());
  const passwordForm = ref<PasswordFormState>(createDefaultPasswordForm());

  // ========== 初始化：从 store 读取用户数据 ==========
  const initUserForm = (): void => {
    const storeUserInfo = userStore.userInfo;
    if (storeUserInfo) {
      userForm.value = {
        nickname: storeUserInfo.nickname,
        avatar: storeUserInfo.avatar,
        email: storeUserInfo.email,
        phone: storeUserInfo.phone,
        bio: storeUserInfo.bio,
        gender: storeUserInfo.gender,
        birthday: storeUserInfo.birthday,
      };
    }
  };

  // 立即初始化
  initUserForm();

  // ========== Getters ==========
  const isFormDirty = computed<boolean>(() => {
    const storeUserInfo = userStore.userInfo;
    if (!storeUserInfo) return false;
    return (
      userForm.value.nickname !== storeUserInfo.nickname ||
      userForm.value.avatar !== storeUserInfo.avatar ||
      userForm.value.email !== storeUserInfo.email ||
      userForm.value.phone !== storeUserInfo.phone ||
      userForm.value.bio !== storeUserInfo.bio ||
      userForm.value.gender !== storeUserInfo.gender ||
      userForm.value.birthday !== storeUserInfo.birthday
    );
  });

  const avatarUrl = computed<string>(() => userForm.value.avatar || DEFAULT_AVATAR);

  // ========== Actions ==========

  /**
   * 刷新用户详情（从 API 获取最新数据并更新 store）
   */
  const fetchUserDetail = async (): Promise<void> => {
    isLoading.value = true;
    try {
      await userStore.fetchUserInfo();
      // 从 store 更新表单
      initUserForm();
      ElMessage.success('刷新成功');
    } catch (error) {
      ElMessage.error('获取用户信息失败');
      console.error('获取用户详情失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 更新用户信息
   */
  const updateUserInfo = async (id: string): Promise<void> => {
    if (!isFormDirty.value) {
      ElMessage.info('没有需要保存的修改');
      return;
    }

    isSaving.value = true;
    try {
      const params: UpdateUserParams = {
        nickname: userForm.value.nickname,
        avatar: userForm.value.avatar,
        email: userForm.value.email,
        phone: userForm.value.phone,
        bio: userForm.value.bio,
        gender: userForm.value.gender,
        birthday: userForm.value.birthday,
      };

      await userApi.updateUser(id, params);
      ElMessage.success('保存成功');

      // 同步更新 store 中的用户信息
      if (userStore.userInfo) {
        userStore.setUserInfo({
          ...userStore.userInfo,
          ...params,
        });
      }
    } catch (error) {
      ElMessage.error('保存失败');
      console.error('更新用户信息失败:', error);
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * 重置表单
   */
  const resetForm = (): void => {
    initUserForm();
  };

  /**
   * 重置密码表单
   */
  const resetPasswordForm = (): void => {
    passwordForm.value = createDefaultPasswordForm();
  };

  /**
   * 修改密码
   */
  const changePassword = async (): Promise<void> => {
    const { user_name, password, confirmPassword } = passwordForm.value;

    if (!user_name || !password) {
      ElMessage.warning('请填写完整信息');
      return;
    }

    if (password !== confirmPassword) {
      ElMessage.error('两次输入的密码不一致');
      return;
    }

    isChangingPassword.value = true;
    try {
      const params: ChangePasswordParams = {
        user_name,
        password,
      };

      await userApi.changePassword(params);
      ElMessage.success('密码修改成功');
      resetPasswordForm();
    } catch (error) {
      ElMessage.error('密码修改失败');
      console.error('修改密码失败:', error);
    } finally {
      isChangingPassword.value = false;
    }
  };

  /**
   * 上传头像
   */
  const uploadAvatar = async (file: File): Promise<void> => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请上传图片文件');
      return;
    }

    // 验证文件大小（最大 2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      ElMessage.error('图片大小不能超过 2MB');
      return;
    }

    isUploadingAvatar.value = true;
    try {
      const result = await goodsApi.uploadFile(file);
      if (result.url) {
        userForm.value.avatar = result.url;
        ElMessage.success('头像上传成功');
      } else {
        ElMessage.error('上传失败，请重试');
      }
    } catch (error) {
      ElMessage.error('头像上传失败');
      console.error('上传头像失败:', error);
    } finally {
      isUploadingAvatar.value = false;
    }
  };

  return {
    // State
    isLoading,
    isSaving,
    isChangingPassword,
    isUploadingAvatar,
    userForm,
    passwordForm,

    // Getters
    isFormDirty,
    avatarUrl,

    // Actions
    fetchUserDetail,
    updateUserInfo,
    changePassword,
    resetForm,
    resetPasswordForm,
    uploadAvatar,
  };
}
