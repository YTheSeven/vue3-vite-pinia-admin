import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useMockPermissionStore } from '@/store/modules/mockPermission';

/** 用户列表项 */
interface UserItem {
  user_id: string;
  name: string;
  avatar: string;
  roles: string[];
}

/** 新增用户表单 */
interface AddUserForm {
  user_name: string;
  password: string;
  confirmPassword: string;
  roleCodes: string[];
}

/** 修改密码表单 */
interface EditPasswordForm {
  user_id: string;
  user_name: string;
  password: string;
  confirmPassword: string;
}

/** 修改角色表单 */
interface EditRoleForm {
  user_id: string;
  user_name: string;
  roleCodes: string[];
}

export function useUserManageView() {
  const mockPermissionStore = useMockPermissionStore();

  // ========== State ==========
  const isLoading = ref(false);
  const submitLoading = ref(false);
  const searchKeyword = ref('');

  // 对话框状态
  const addDialogVisible = ref(false);
  const editPasswordDialogVisible = ref(false);
  const editRoleDialogVisible = ref(false);

  // ========== Form ==========
  const addForm = ref<AddUserForm>({
    user_name: '',
    password: '',
    confirmPassword: '',
    roleCodes: ['user'],
  });

  const editPasswordForm = ref<EditPasswordForm>({
    user_id: '',
    user_name: '',
    password: '',
    confirmPassword: '',
  });

  const editRoleForm = ref<EditRoleForm>({
    user_id: '',
    user_name: '',
    roleCodes: [],
  });

  // ========== Computed ==========

  /** 模拟用户列表（从 mockPermissionStore 的 userRoles 生成） */
  const userList = computed<UserItem[]>(() => {
    return mockPermissionStore.getUserRoles.map((u) => ({
      user_id: u.username,
      name: u.username,
      avatar: '',
      roles: u.roleCodes,
    }));
  });

  /** 过滤后的用户列表 */
  const filteredUserList = computed(() => {
    if (!searchKeyword.value) return userList.value;
    const keyword = searchKeyword.value.toLowerCase();
    return userList.value.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) || user.user_id.toLowerCase().includes(keyword)
    );
  });

  /** 可用角色列表 */
  const availableRoles = computed(() => mockPermissionStore.getRoles);

  // ========== Form Rules ==========

  const validateConfirmPassword = async (_rule: unknown, value: string) => {
    if (value !== addForm.value.password) {
      return Promise.reject(new Error('两次输入的密码不一致'));
    }
    return Promise.resolve();
  };

  const validateEditConfirmPassword = async (_rule: unknown, value: string) => {
    if (value !== editPasswordForm.value.password) {
      return Promise.reject(new Error('两次输入的密码不一致'));
    }
    return Promise.resolve();
  };

  const addFormRules: FormRules<AddUserForm> = {
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
    roleCodes: [
      { required: true, message: '请至少选择一个角色', trigger: 'change', type: 'array' },
    ],
  };

  const editPasswordFormRules: FormRules<EditPasswordForm> = {
    password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      { validator: validateEditConfirmPassword, trigger: 'blur' },
    ],
  };

  const editRoleFormRules: FormRules<EditRoleForm> = {
    roleCodes: [
      { required: true, message: '请至少选择一个角色', trigger: 'change', type: 'array' },
    ],
  };

  // ========== Actions ==========

  /** 搜索 */
  const handleSearch = () => {
    // 搜索逻辑已在 computed 中实现
  };

  /** 头像加载失败 */
  const handleAvatarError = () => {
    // 使用默认头像
  };

  /** 打开新增对话框 */
  const handleAdd = () => {
    addForm.value = {
      user_name: '',
      password: '',
      confirmPassword: '',
      roleCodes: ['user'],
    };
    addDialogVisible.value = true;
  };

  /** 提交新增 */
  const handleAddSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate((valid) => {
      if (!valid) return;

      submitLoading.value = true;

      try {
        // 添加用户角色映射
        mockPermissionStore.updateUserRoles(addForm.value.user_name, addForm.value.roleCodes);
        ElMessage.success('新增用户成功');
        addDialogVisible.value = false;
      } finally {
        submitLoading.value = false;
      }
    });
  };

  /** 打开修改密码对话框 */
  const handleEditPassword = (row: UserItem) => {
    editPasswordForm.value = {
      user_id: row.user_id,
      user_name: row.name,
      password: '',
      confirmPassword: '',
    };
    editPasswordDialogVisible.value = true;
  };

  /** 提交修改密码 */
  const handleEditPasswordSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate((valid) => {
      if (!valid) return;

      submitLoading.value = true;

      try {
        // 模拟修改密码
        ElMessage.success('密码修改成功');
        editPasswordDialogVisible.value = false;
      } finally {
        submitLoading.value = false;
      }
    });
  };

  /** 打开修改角色对话框 */
  const handleEditRole = (row: UserItem) => {
    editRoleForm.value = {
      user_id: row.user_id,
      user_name: row.name,
      roleCodes: [...row.roles],
    };
    editRoleDialogVisible.value = true;
  };

  /** 提交修改角色 */
  const handleEditRoleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate((valid) => {
      if (!valid) return;

      submitLoading.value = true;

      try {
        mockPermissionStore.updateUserRoles(
          editRoleForm.value.user_name,
          editRoleForm.value.roleCodes
        );
        ElMessage.success('角色修改成功，请刷新权限或重新登录以生效');
        editRoleDialogVisible.value = false;
      } finally {
        submitLoading.value = false;
      }
    });
  };

  /** 删除用户 */
  const handleDelete = async (row: UserItem) => {
    try {
      await ElMessageBox.confirm(`确定删除用户 "${row.name}" 吗？此操作不可恢复！`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });

      // 从 userRoles 中移除
      const index = mockPermissionStore.getUserRoles.findIndex((u) => u.username === row.name);
      if (index > -1) {
        mockPermissionStore.getUserRoles.splice(index, 1);
        mockPermissionStore.saveConfig();
      }

      ElMessage.success('删除成功');
    } catch {
      // 用户取消
    }
  };

  return {
    // State
    isLoading,
    submitLoading,
    searchKeyword,
    // Dialogs
    addDialogVisible,
    editPasswordDialogVisible,
    editRoleDialogVisible,
    // Forms
    addForm,
    editPasswordForm,
    editRoleForm,
    // Rules
    addFormRules,
    editPasswordFormRules,
    editRoleFormRules,
    // Computed
    filteredUserList,
    availableRoles,
    // Actions
    handleSearch,
    handleAvatarError,
    handleAdd,
    handleAddSubmit,
    handleEditPassword,
    handleEditPasswordSubmit,
    handleEditRole,
    handleEditRoleSubmit,
    handleDelete,
  };
}
