<template>
  <div class="p-5 max-w-3xl mx-auto">
    <!-- ==================== 示例 1: 用户信息展示 ==================== -->
    <section
      class="mb-8 p-5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800"
    >
      <h2
        class="mt-0 text-gray-800 dark:text-gray-200 text-lg border-b-2 border-blue-500 pb-2.5 mb-4 font-semibold"
      >
        示例 1: 基本数据获取
      </h2>
      <div v-if="userLoading" class="text-blue-500 p-2.5 text-center">加载中...</div>
      <div v-else-if="userError" class="text-red-600 p-2.5 bg-red-100 dark:bg-red-900/30 rounded">
        加载失败: {{ userError.message }}
      </div>
      <div v-else-if="userInfo" class="text-center">
        <img :src="userInfo.avatar" alt="avatar" class="w-20 h-20 rounded-full mb-2.5 mx-auto" />
        <h3 class="font-medium text-gray-800 dark:text-gray-200">
          {{ userInfo.nickname || userInfo.username }}
        </h3>
      </div>
    </section>

    <!-- ==================== 示例 2: 登录表单 ==================== -->
    <section
      class="mb-8 p-5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800"
    >
      <h2
        class="mt-0 text-gray-800 dark:text-gray-200 text-lg border-b-2 border-blue-500 pb-2.5 mb-4 font-semibold"
      >
        示例 2: 表单提交
      </h2>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-2.5">
        <input
          v-model="loginParams.username"
          placeholder="用户名"
          class="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-slate-400"
        />
        <input
          v-model="loginParams.password"
          type="password"
          placeholder="密码"
          class="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-slate-400"
        />
        <button
          :disabled="loginLoading"
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {{ loginLoading ? '登录中...' : '登录' }}
        </button>
        <p v-if="loginError" class="text-red-600 p-2.5 bg-red-100 dark:bg-red-900/30 rounded">
          {{ loginError.message }}
        </p>
      </form>
    </section>

    <!-- ==================== 示例 3: 搜索场景 ==================== -->
    <section
      class="mb-8 p-5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800"
    >
      <h2
        class="mt-0 text-gray-800 dark:text-gray-200 text-lg border-b-2 border-blue-500 pb-2.5 mb-4 font-semibold"
      >
        示例 3: 搜索场景
      </h2>
      <div class="flex gap-2.5 mb-2.5">
        <input
          v-model="searchKeyword"
          placeholder="搜索用户..."
          :disabled="searchLoading"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-slate-800 placeholder:text-gray-400 dark:placeholder:text-slate-400"
        />
        <button
          @click="doSearch(searchKeyword)"
          class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 transition-colors"
        >
          搜索
        </button>
      </div>
      <!-- 搜索结果展示 -->
      <div v-if="searchResults">
        <p class="text-gray-600 dark:text-gray-400 mb-2">搜索结果: {{ searchResults.total }} 条</p>
        <div
          v-for="user in searchResults.list"
          :key="user.id"
          class="p-2.5 border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 mb-1.5 rounded text-gray-800 dark:text-gray-200"
        >
          {{ user.username }}
        </div>
      </div>
    </section>

    <!-- ==================== 示例 4: 分页请求 ==================== -->
    <section
      class="mb-8 p-5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800"
    >
      <h2
        class="mt-0 text-gray-800 dark:text-gray-200 text-lg border-b-2 border-blue-500 pb-2.5 mb-4 font-semibold"
      >
        示例 4: 分页请求
      </h2>
      <div class="flex justify-between mb-2.5 text-gray-500 dark:text-gray-400 text-sm">
        <span>第 {{ page }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页</span>
        <span>每页 {{ pageSize }} 条，共 {{ total }} 条</span>
      </div>
      <div class="flex gap-2.5 mb-4">
        <button
          :disabled="page <= 1 || listLoading"
          @click="handlePageChange(page - 1)"
          class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          上一页
        </button>
        <button
          :disabled="isLastPage || listLoading"
          @click="handlePageChange(page + 1)"
          class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          下一页
        </button>
        <button
          :disabled="listLoading"
          @click="pageRequest.refresh()"
          class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          刷新
        </button>
      </div>
      <div v-if="isEmpty && !listLoading" class="text-gray-500 dark:text-gray-400 p-5 text-center">
        暂无数据
      </div>
      <div v-else class="border-t border-gray-200 dark:border-slate-600 pt-2.5">
        <div
          v-for="user in userList"
          :key="user.id"
          class="p-2.5 border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 mb-1.5 rounded text-gray-800 dark:text-gray-200"
        >
          {{ user.username }}
        </div>
        <div v-if="listLoading" class="text-blue-500 p-2.5 text-center">加载中...</div>
        <button
          v-if="!isLastPage && !listLoading"
          @click="pageRequest.loadMore()"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 transition-colors"
        >
          加载更多
        </button>
      </div>
    </section>

    <!-- ==================== 示例 5: 多个请求并行 ==================== -->
    <section
      class="mb-8 p-5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800"
    >
      <h2
        class="mt-0 text-gray-800 dark:text-gray-200 text-lg border-b-2 border-blue-500 pb-2.5 mb-4 font-semibold"
      >
        示例 5: 多个请求并行
      </h2>
      <div v-if="allLoading" class="text-blue-500 p-2.5 text-center">加载中...</div>
      <div v-else>
        <div class="bg-white dark:bg-slate-700 p-4 rounded">
          <h4 class="my-2 text-gray-600 dark:text-gray-400 font-medium">用户信息:</h4>
          <p class="mb-2 text-gray-800 dark:text-gray-200">
            {{ allData.userInfo?.username || '未获取' }}
          </p>
          <h4 class="my-2 text-gray-600 dark:text-gray-400 font-medium">用户列表:</h4>
          <p class="text-gray-800 dark:text-gray-200">
            {{ allData.userList?.list?.length || 0 }} 条数据
          </p>
        </div>
      </div>
    </section>

    <!-- ==================== 示例 6: 条件请求 ==================== -->
    <section
      class="mb-8 p-5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800"
    >
      <h2
        class="mt-0 text-gray-800 dark:text-gray-200 text-lg border-b-2 border-blue-500 pb-2.5 mb-4 font-semibold"
      >
        示例 6: 条件请求
      </h2>
      <label class="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
        <input v-model="shouldFetch" type="checkbox" class="w-4.5 h-4.5 accent-blue-500" />
        <span>启用自动获取 ({{ shouldFetch ? '已开启' : '已关闭' }})</span>
      </label>
      <div v-if="conditionalLoading" class="text-blue-500 p-2.5 text-center">加载中...</div>
      <div
        v-else-if="conditionalData"
        class="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded text-green-800 dark:text-green-200"
      >
        <p>用户: {{ conditionalData.username }}</p>
      </div>
      <p v-else class="text-gray-500 dark:text-gray-400 italic">勾选上方复选框触发请求</p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import {
    useRequest,
    usePageRequest,
    useFormSubmit,
    useManualRequest,
  } from '@/composables/useRequest';
  import { userApi } from '@/api';
  import type { UserInfo, LoginParams, LoginResult, PageResult } from '@/types/api';

  // ==================== 示例 1: 基本数据获取 ====================
  const userRequest = useRequest<UserInfo>(() => userApi.getUserInfo(), {
    immediate: true,
    onSuccess: (data) => {
      console.log('获取用户信息成功:', data);
    },
    onError: (err) => {
      console.error('获取用户信息失败:', err);
    },
  });
  const userLoading = computed(() => userRequest.loading.value);
  const userInfo = computed(() => userRequest.data.value);
  const userError = computed(() => userRequest.error.value);

  // ==================== 示例 2: 手动触发请求 ====================
  const loginParams = ref<LoginParams>({
    username: '',
    password: '',
  });

  const loginSubmit = useFormSubmit<LoginResult, LoginParams>((params) => userApi.login(params), {
    successMsg: '登录成功',
    onSuccess: (data) => {
      // 保存 token
      localStorage.setItem('token', data.token);
    },
  });
  const loginLoading = computed(() => loginSubmit.loading.value);
  const loginError = computed(() => loginSubmit.error.value);

  const handleLogin = async () => {
    await loginSubmit.submit(loginParams.value);
  };

  // ==================== 示例 3: 搜索场景 ====================
  const searchKeyword = ref('');

  const searchRequest = useManualRequest<PageResult<UserInfo>, string>(
    (keyword) => userApi.getUserList({ keyword, page: 1, size: 20 }),
    {
      onSuccess: (data) => {
        console.log('搜索结果:', data);
      },
    }
  );
  const searchLoading = computed(() => searchRequest.loading.value);
  const searchResults = computed(() => searchRequest.data.value);

  const doSearch = (keyword: string) => {
    void searchRequest.execute(keyword);
  };

  // 防抖搜索
  const debouncedSearchRequest = useRequest<PageResult<UserInfo>>(
    () => userApi.getUserList({ keyword: searchKeyword.value, page: 1, size: 20 }),
    {
      immediate: false,
      debounce: 300,
    }
  );

  watch(searchKeyword, () => {
    void debouncedSearchRequest.send();
  });

  // ==================== 示例 4: 分页请求 ====================
  const pageRequest = usePageRequest<UserInfo>(
    (p, s) => userApi.getUserList({ page: p, size: s }),
    {
      pageSize: 10,
      onSuccess: (data) => {
        console.log('获取列表成功:', data);
      },
    }
  );
  const listLoading = computed(() => pageRequest.loading.value);
  const userList = computed(() => pageRequest.list.value);
  const total = computed(() => pageRequest.total.value);
  const page = computed(() => pageRequest.page.value);
  const pageSize = computed(() => pageRequest.pageSize.value);
  const isLastPage = computed(() => pageRequest.isLastPage.value);
  const isEmpty = computed(() => pageRequest.isEmpty.value);

  const handlePageChange = (newPage: number) => {
    void pageRequest.send(newPage);
  };

  // ==================== 示例 5: 多个请求并行 ====================
  const request1 = useRequest<UserInfo>(() => userApi.getUserInfo());
  const request2 = useRequest<PageResult<UserInfo>>(() =>
    userApi.getUserList({ page: 1, size: 10 })
  );

  const allLoading = computed(() => request1.loading.value || request2.loading.value);
  const allData = computed(() => ({
    userInfo: request1.data.value,
    userList: request2.data.value,
  }));

  // ==================== 示例 6: 条件请求 ====================
  const shouldFetch = ref(false);

  const conditionalRequest = useRequest<UserInfo>(() => userApi.getUserInfo(), {
    immediate: false,
  });
  const conditionalLoading = computed(() => conditionalRequest.loading.value);
  const conditionalData = computed(() => conditionalRequest.data.value);

  watch(shouldFetch, (val) => {
    if (val) {
      void conditionalRequest.send();
    }
  });
</script>
