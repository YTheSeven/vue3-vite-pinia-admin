import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useMockPermissionStore } from '@/store/modules/mockPermission';
import type { RoleConfig } from '@/store/modules/mockPermission';

/** 角色表单数据 */
interface RoleForm {
  name: string;
  code: string;
  description: string;
  menus: string[];
  permissions: string[];
}

/** 菜单项 */
interface MenuItem {
  name: string;
  title: string;
  icon: string;
}

/** 可用菜单列表 */
const AVAILABLE_MENUS: MenuItem[] = [
  { name: 'Dashboard', title: '首页', icon: 'HomeFilled' },
  { name: 'OrderList', title: '订单列表', icon: 'List' },
  { name: 'OrderDetail', title: '订单详情', icon: 'Document' },
  { name: 'GoodsManage', title: '商品管理', icon: 'Goods' },
  { name: 'UserManage', title: '用户管理', icon: 'UserFilled' },
  { name: 'RoleManage', title: '角色管理', icon: 'User' },
  { name: 'PermissionManage', title: '权限管理', icon: 'Lock' },
  { name: 'Profile', title: '个人资料', icon: 'User' },
];

/** 可用权限列表 */
const AVAILABLE_PERMISSIONS = [
  { code: 'user:manage', name: '用户管理' },
  { code: 'role:manage', name: '角色管理' },
  { code: 'permission:manage', name: '权限管理' },
  { code: 'order:view', name: '订单查看' },
  { code: 'order:edit', name: '订单编辑' },
  { code: 'order:delete', name: '订单删除' },
  { code: 'goods:manage', name: '商品管理' },
  { code: 'profile:view', name: '个人资料查看' },
  { code: 'profile:edit', name: '个人资料编辑' },
  { code: 'settings:manage', name: '系统设置' },
];

export function useRoleManageView() {
  const mockPermissionStore = useMockPermissionStore();

  // ========== State ==========
  const dialogVisible = ref(false);
  const dialogTitle = ref('新增角色');
  const isEdit = ref(false);
  const currentRoleId = ref('');
  const submitLoading = ref(false);
  const formRef = ref<FormInstance>();

  // ========== Form ==========
  const form = ref<RoleForm>({
    name: '',
    code: '',
    description: '',
    menus: [],
    permissions: [],
  });

  const formRules: FormRules<RoleForm> = {
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    ],
    code: [
      { required: true, message: '请输入角色编码', trigger: 'blur' },
      {
        pattern: /^[a-z][a-z0-9_]*$/,
        message: '只能使用小写字母、数字和下划线，且以小写字母开头',
        trigger: 'blur',
      },
    ],
  };

  // ========== Computed ==========
  const roleList = computed<RoleConfig[]>(() => mockPermissionStore.getRoles);

  const availableMenus = computed(() => AVAILABLE_MENUS);

  const availablePermissions = computed(() => AVAILABLE_PERMISSIONS);

  // ========== Actions ==========

  /** 打开新增对话框 */
  const handleAdd = () => {
    isEdit.value = false;
    currentRoleId.value = '';
    dialogTitle.value = '新增角色';
    form.value = {
      name: '',
      code: '',
      description: '',
      menus: [],
      permissions: [],
    };
    dialogVisible.value = true;
  };

  /** 打开编辑对话框 */
  const handleEdit = (row: RoleConfig) => {
    isEdit.value = true;
    currentRoleId.value = row.id;
    dialogTitle.value = '编辑角色';
    form.value = {
      name: row.name,
      code: row.code,
      description: row.description,
      menus: [...row.menus],
      permissions: [...row.permissions],
    };
    dialogVisible.value = true;
  };

  /** 删除角色 */
  const handleDelete = async (row: RoleConfig) => {
    try {
      await ElMessageBox.confirm(`确定删除角色 "${row.name}" 吗？此操作不可恢复！`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });

      // 检查是否有用户使用此角色
      const usersWithRole = mockPermissionStore.getUserRoles.filter((u) =>
        u.roleCodes.includes(row.code)
      );
      if (usersWithRole.length > 0) {
        await ElMessageBox.confirm(
          `有 ${usersWithRole.length} 个用户正在使用此角色，删除后这些用户将失去该角色权限。是否继续？`,
          '警告',
          {
            confirmButtonText: '继续删除',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
      }

      mockPermissionStore.deleteRole(row.id);
      ElMessage.success('删除成功');
    } catch {
      // 用户取消
    }
  };

  /** 提交表单 */
  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate((valid) => {
      if (!valid) return;

      submitLoading.value = true;

      try {
        if (isEdit.value) {
          // 编辑模式
          mockPermissionStore.updateRolePermissions(
            currentRoleId.value,
            form.value.menus,
            form.value.permissions
          );
          // 更新其他字段
          const role = mockPermissionStore.getRoles.find((r) => r.id === currentRoleId.value);
          if (role) {
            role.name = form.value.name;
            role.code = form.value.code;
            role.description = form.value.description;
            mockPermissionStore.saveConfig();
          }
          ElMessage.success('修改成功，请刷新权限以生效');
        } else {
          // 新增模式
          mockPermissionStore.addRole({
            name: form.value.name,
            code: form.value.code,
            description: form.value.description,
            menus: form.value.menus,
            permissions: form.value.permissions,
          });
          ElMessage.success('新增成功');
        }

        dialogVisible.value = false;
      } finally {
        submitLoading.value = false;
      }
    });
  };

  /** 关闭对话框 */
  const handleDialogClose = () => {
    formRef.value?.resetFields();
  };

  return {
    // State
    dialogVisible,
    dialogTitle,
    isEdit,
    submitLoading,
    formRef,
    // Form
    form,
    formRules,
    // Computed
    roleList,
    availableMenus,
    availablePermissions,
    // Actions
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleDialogClose,
  };
}
