<template>
  <div class="profile">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="profile-avatar">
            <el-avatar :size="100" :src="userInfo.avatar" />
            <h3>{{ userInfo.nickname }}</h3>
            <p>{{ userInfo.username }}</p>
            <el-tag type="success">{{ userInfo.role }}</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本资料</span>
              <el-button type="primary" @click="handleSave">保存修改</el-button>
            </div>
          </template>

          <el-form :model="userInfo" label-width="100px">
            <el-form-item label="昵称">
              <el-input v-model="userInfo.nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input
                v-model="userInfo.bio"
                type="textarea"
                :rows="4"
                placeholder="请输入个人简介"
              />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>

          <el-form :model="passwordForm" label-width="100px">
            <el-form-item label="原密码">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="passwordForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const userInfo = reactive({
    username: userStore.userInfo?.username || '',
    nickname: userStore.userInfo?.nickname || '',
    avatar:
      userStore.userInfo?.avatar ||
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    email: userStore.userInfo?.email || 'user@example.com',
    phone: userStore.userInfo?.phone || '13800138000',
    role: userStore.getUserRoles[0] || 'user',
    bio: '这是一个个人简介示例',
  });

  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    ElMessage.success('保存成功');
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      ElMessage.error('两次输入的密码不一致');
      return;
    }
    ElMessage.success('密码修改成功');
  };
</script>

<style scoped>
  .profile {
    .profile-avatar {
      text-align: center;
      padding: 20px;

      h3 {
        margin: 15px 0 5px;
        font-size: 18px;
      }

      p {
        margin: 5px 0 15px;
        color: #909399;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
