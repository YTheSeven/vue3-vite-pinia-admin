import type { FormInstance, FormRules } from 'element-plus';
import type { ChangePasswordParams, RegisterParams, UserInfo } from '@/types/modules/user';
import type { Ref, ComputedRef } from 'vue';

import { userApi } from '@/api/modules/user';

/** 新增用户表单 */
export interface AddUserForm {
  user_name: string;
  password: string;
  confirmPassword: string;
}

/** 修改密码表单 */
export interface EditPasswordForm {
  user_name: string;
  password: string;
  confirmPassword: string;
}

/** useUserManageView 返回类型 */
export interface UseUserManageViewReturn {
  // 加载状态
  isLoading: Ref<boolean>;
  submitLoading: Ref<boolean>;

  // 数据
  userList: Ref<UserInfo[]>;
  searchKeyword: Ref<string>;
  filteredUserList: ComputedRef<UserInfo[]>;

  // 新增用户相关
  addDialogVisible: Ref<boolean>;
  addForm: Ref<AddUserForm>;
  addFormRules: FormRules;
  handleAdd: () => void;
  handleAddSubmit: (formRef: FormInstance | undefined) => Promise<void>;

  // 修改密码相关
  editDialogVisible: Ref<boolean>;
  editForm: Ref<EditPasswordForm>;
  editFormRules: FormRules;
  handleEdit: (row: UserInfo) => void;
  handleEditSubmit: (formRef: FormInstance | undefined) => Promise<void>;

  // 删除相关
  handleDelete: (row: UserInfo) => Promise<void>;

  // 其他
  initData: () => Promise<void>;
  handleAvatarError: (e: Event) => void;
  handleSearch: () => void;
}

/**
 * 用户管理页面业务逻辑 Hook
 * @returns 用户管理相关的状态和方法
 */
export function useUserManageView(): UseUserManageViewReturn {
  // ==================== 加载状态 ====================
  const isLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);

  // ==================== 数据管理 ====================
  const userList = ref<UserInfo[]>([]);
  const searchKeyword = ref<string>('');

  // 过滤后的用户列表
  const filteredUserList = computed<UserInfo[]>(() => {
    if (!searchKeyword.value) return userList.value;
    const keyword = searchKeyword.value.toLowerCase();
    return userList.value.filter((user) => user.name.toLowerCase().includes(keyword));
  });

  // ==================== API 调用 ====================
  /** 获取用户列表 */
  const initData = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const data = await userApi.getUserList({ page: 1, page_size: 100 });
      userList.value = data.list ?? [];
    } catch (error) {
      ElMessage.error('获取用户列表失败');
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  /** 头像加载失败处理 */
  const handleAvatarError = (e: Event): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  /** 搜索处理 */
  const handleSearch = (): void => {
    // 搜索功能已通过计算属性实现
  };

  // ==================== 新增用户 ====================
  const addDialogVisible = ref<boolean>(false);
  const addForm = ref<AddUserForm>({
    user_name: '',
    password: '',
    confirmPassword: '',
  });

  /** 新增用户确认密码验证 */
  const validateConfirmPassword = async (
    _rule: unknown,
    value: string,
    callbackFn: (error?: Error) => void
  ): Promise<void> => {
    if (value !== addForm.value.password) {
      callbackFn(new Error('两次输入的密码不一致'));
    } else {
      callbackFn();
    }
  };

  const addFormRules: FormRules = {
    user_name: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' },
    ],
  };

  /** 打开新增用户对话框 */
  const handleAdd = (): void => {
    addForm.value = {
      user_name: '',
      password: '',
      confirmPassword: '',
    };
    addDialogVisible.value = true;
  };

  /** 提交新增用户 */
  const handleAddSubmit = async (formRef: FormInstance | undefined): Promise<void> => {
    if (!formRef) return;

    await formRef.validate(async (valid) => {
      if (!valid) return;

      submitLoading.value = true;
      try {
        const params: RegisterParams = {
          user_name: addForm.value.user_name,
          password: addForm.value.password,
        };
        await userApi.register(params);
        ElMessage.success('新增用户成功');
        addDialogVisible.value = false;
        await initData();
      } catch (error) {
        ElMessage.error('新增用户失败');
        console.error(error);
      } finally {
        submitLoading.value = false;
      }
    });
  };

  // ==================== 修改密码 ====================
  const editDialogVisible = ref<boolean>(false);
  const editForm = ref<EditPasswordForm>({
    user_name: '',
    password: '',
    confirmPassword: '',
  });

  /** 修改密码确认密码验证 */
  const validateEditConfirmPassword = async (
    _rule: unknown,
    value: string,
    callbackFn: (error?: Error) => void
  ): Promise<void> => {
    if (value !== editForm.value.password) {
      callbackFn(new Error('两次输入的密码不一致'));
    } else {
      callbackFn();
    }
  };

  const editFormRules: FormRules = {
    password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      { validator: validateEditConfirmPassword, trigger: 'blur' },
    ],
  };

  /** 打开修改密码对话框 */
  const handleEdit = (row: UserInfo): void => {
    editForm.value = {
      user_name: row.name,
      password: '',
      confirmPassword: '',
    };
    editDialogVisible.value = true;
  };

  /** 提交修改密码 */
  const handleEditSubmit = async (formRef: FormInstance | undefined): Promise<void> => {
    if (!formRef) return;

    await formRef.validate(async (valid) => {
      if (!valid) return;

      submitLoading.value = true;
      try {
        const params: ChangePasswordParams = {
          user_name: editForm.value.user_name,
          password: editForm.value.password,
        };
        await userApi.changePassword(params);
        ElMessage.success('修改密码成功');
        editDialogVisible.value = false;
      } catch (error) {
        ElMessage.error('修改密码失败');
        console.error(error);
      } finally {
        submitLoading.value = false;
      }
    });
  };

  // ==================== 删除用户 ====================
  const handleDelete = async (row: UserInfo): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定删除用户 "${row.name}" 吗？此操作不可恢复！`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });

      submitLoading.value = true;
      try {
        await userApi.deleteUser({ id: String(row.user_id) });
        ElMessage.success('删除成功');
        await initData();
      } catch (error) {
        ElMessage.error('删除失败');
        console.error(error);
      } finally {
        submitLoading.value = false;
      }
    } catch {
      // 用户取消操作
    }
  };

  // ==================== 生命周期 ====================
  onMounted(async () => {
    await initData();
  });

  return {
    // 加载状态
    isLoading,
    submitLoading,

    // 数据
    userList,
    searchKeyword,
    filteredUserList,

    // 新增用户
    addDialogVisible,
    addForm,
    addFormRules,
    handleAdd,
    handleAddSubmit,

    // 修改密码
    editDialogVisible,
    editForm,
    editFormRules,
    handleEdit,
    handleEditSubmit,

    // 删除
    handleDelete,

    // 其他
    initData,
    handleAvatarError,
    handleSearch,
  };
}
