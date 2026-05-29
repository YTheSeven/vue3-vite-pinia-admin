<template>
  <div class="icon-demo">
    <h2>Element Plus 图标自动导入示例</h2>

    <!-- 方式1: 直接使用图标组件 (自动导入) -->
    <div class="section">
      <h3>方式1: 直接使用图标组件</h3>
      <div class="icon-list">
        <i-ep-edit />
        <i-ep-delete />
        <i-ep-search />
        <i-ep-setting />
        <i-ep-user />
        <i-ep-home-filled />
      </div>
    </div>

    <!-- 方式2: 在 Element Plus 组件中使用 -->
    <div class="section">
      <h3>方式2: 在 Element Plus 组件中使用</h3>
      <div class="button-group">
        <el-button type="primary">
          <i-ep-edit style="margin-right: 4px" />
          编辑
        </el-button>
        <el-button type="danger">
          <i-ep-delete style="margin-right: 4px" />
          删除
        </el-button>
        <el-button>
          <i-ep-search style="margin-right: 4px" />
          搜索
        </el-button>
      </div>
    </div>

    <!-- 方式3: 不同尺寸和颜色 -->
    <div class="section">
      <h3>方式3: 不同尺寸和颜色</h3>
      <div class="icon-sizes">
        <i-ep-star class="small" />
        <i-ep-star class="medium" />
        <i-ep-star class="large" />
        <i-ep-star class="xlarge" />
      </div>
      <div class="icon-colors">
        <i-ep-notification class="red" />
        <i-ep-circle-check-filled class="green" />
        <i-ep-warning class="yellow" />
        <i-ep-info-filled class="blue" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 图标组件会自动导入，无需手动引入
</script>

<style scoped>
  .icon-demo {
    padding: 20px;
  }

  .section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
  }

  h2 {
    margin-bottom: 20px;
    color: #303133;
  }

  h3 {
    margin-bottom: 15px;
    color: #606266;
    font-size: 16px;
  }

  .icon-list {
    display: flex;
    gap: 20px;
    font-size: 24px;
    color: #409eff;
  }

  .button-group {
    display: flex;
    gap: 10px;
  }

  .icon-sizes {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;
  }

  .small {
    font-size: 16px;
    color: #909399;
  }

  .medium {
    font-size: 24px;
    color: #606266;
  }

  .large {
    font-size: 32px;
    color: #303133;
  }

  .xlarge {
    font-size: 48px;
    color: #409eff;
  }

  .icon-colors {
    display: flex;
    gap: 20px;
    font-size: 32px;
  }

  .red {
    color: #f56c6c;
  }

  .green {
    color: #67c23a;
  }

  .yellow {
    color: #e6a23c;
  }

  .blue {
    color: #409eff;
  }
</style>
