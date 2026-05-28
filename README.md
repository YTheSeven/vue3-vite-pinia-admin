# Vue3 + Vite + Pinia + Element Plus Admin

基于 Vue3 + Vite + Pinia + Element Plus + Tailwind CSS 的管理后台模板，集成 AI 辅助设计系统。

## 技术栈

- **Vue 3.5** - 组合式 API
- **Vite 8** - 极速开发体验
- **Pinia 3** - 状态管理
- **Element Plus 2.14** - UI 组件库（自动导入）
- **Tailwind CSS 4.3** - 原子化 CSS
- **TypeScript 6** - 类型安全

## Element Plus Pro Skill

本项目集成了 **Element Plus Pro Skill**，一个智能设计辅助系统。

### 功能特点

- **自动设计生成**：自然语言描述 → 完整设计方案
- **智能组件匹配**：根据风格自动推荐组件
- **代码模板生成**：一键输出 Vue 页面代码
- **Tailwind 整合**：每个组件都有最佳样式类

### 触发方式

| 你说                   | 系统自动执行               |
| ---------------------- | -------------------------- |
| "设计一个用户管理后台" | → 生成设计系统 + 组件方案  |
| "ElTable 怎么用"       | → 返回组件详情文档         |
| "Glassmorphism 风格"   | → 匹配玻璃态组件           |
| "生成登录页代码"       | → 输出完整 Vue 文件        |
| "做个科技感仪表盘"     | → Glassmorphism + 数据组件 |

### 智能路由

系统会自动识别你的意图并调用相应工具：

```python
# 设计类请求
"设计..." / "做个..." / "创建..."
  → generate_complete_design
  → 设计系统 + 组件 + 代码

# 组件查询
"ElTable 怎么用" / "button 详情"
  → search_element_components
  → Props/Events/Slots/Tailwind 类

# 风格匹配
"Glassmorphism" / "Dark Mode"
  → match_components_to_style
  → 风格对应的组件组合

# 代码生成
"生成代码" / "给我模板"
  → generate_page_template
  → 完整 Vue 页面代码
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173/

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
src/
├── views/
│   └── DemoView.vue          # Element Plus 演示页面
├── components/
│   └── HelloWorld.vue
├── App.vue
├── main.ts
├── auto-imports.d.ts         # 自动导入类型声明
└── components.d.ts           # 组件类型声明
```

## Element Plus 自动导入配置

```typescript
// vite.config.ts
plugins: [
  vue(),
  AutoImport({
    resolvers: [ElementPlusResolver()],
    imports: ['vue', 'vue-router', 'pinia'],
    dts: 'src/auto-imports.d.ts',
  }),
  Components({
    resolvers: [ElementPlusResolver()],
    dts: 'src/components.d.ts',
  }),
];
```

无需手动 import，直接使用：

```vue
<template>
  <el-button type="primary">按钮</el-button>
  <el-table :data="tableData" />
</template>
```

## Element Plus Pro Skill 配置

### 文件位置

```
/home/ytheseven/.agents/skills/element-plus-pro/
├── data/
│   └── components.csv          # 30+ 组件数据库
├── scripts/
│   ├── search.py               # 组件查询
│   └── auto_router.py          # 智能路由
├── mcp-integrated-server.js    # MCP 服务
└── skill.yaml                  # 配置
```

### MCP 配置

项目已配置 `.vscode/mcp.json`：

```json
{
  "servers": {
    "element-plus-pro": {
      "type": "stdio",
      "command": "node",
      "args": ["/home/ytheseven/.agents/skills/element-plus-pro/mcp-integrated-server.js"]
    }
  }
}
```

### 设计风格支持

| 风格          | 特点                 | 组件示例                             |
| ------------- | -------------------- | ------------------------------------ |
| Glassmorphism | 毛玻璃、透明、层次感 | ElCard: bg-white/80 backdrop-blur-md |
| Minimalism    | 简洁、留白、清晰     | ElButton: rounded-lg shadow-sm       |
| Neumorphism   | 柔和阴影、拟物       | ElCard: shadow-[4px_4px_10px_...]    |
| Dark Mode     | 深色主题、护眼       | ElMenu: bg-slate-900 text-white      |

## 使用示例

### 示例 1：设计仪表盘

**你说：** "设计一个销售数据仪表盘，要有科技感"

**系统返回：**

```
## 完整设计方案

### 1. 设计系统
风格: Glassmorphism
主色: #2563EB
字体: Fira Code / Fira Sans

### 2. 推荐组件组合
- ElCard (glass效果)
- ElTable (数据展示)
- ElMenu (侧边导航)
- ElDialog (详情弹窗)

### 3. Tailwind 样式
- ElCard: bg-white/80 backdrop-blur-md border border-white/20
- ElTable: bg-white/60 backdrop-blur-sm
- ElMenu: bg-slate-900/80 backdrop-blur-md
```

### 示例 2：查询组件

**你说：** "ElTable 怎么用"

**系统返回：**

```
### ElTable
- **类别:** Data
- **适用场景:** 数据展示、表格列表
- **主要 Props:** data|columns|stripe|border|height
- **事件:** selection-change|row-click|sort-change
- **推荐 Tailwind 类:** overflow-x-auto rounded-lg shadow-sm
```

### 示例 3：生成代码

**你说：** "生成用户管理页面代码"

**系统返回：**

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <el-card class="bg-white rounded-xl shadow-md p-6">
      <el-table :data="tableData" class="overflow-x-auto rounded-lg"> ... </el-table>
    </el-card>
  </div>
</template>
```

## 开发工作流

1. **描述需求**：用自然语言描述想要的页面
2. **获取方案**：系统自动生成设计系统 + 组件推荐
3. **调整风格**：说"换个风格"可切换设计方案
4. **生成代码**：确认后一键输出完整 Vue 代码
5. **复制使用**：将代码复制到 src/views/ 下即可运行

## 最佳实践

1. **使用自动导入**：无需手动 import Element Plus 组件
2. **Tailwind 优先**：组件 class 使用 Tailwind 工具类
3. **Skill 辅助**：不确定用什么组件时直接问
4. **风格统一**：同一项目保持设计风格一致
5. **响应式设计**：使用 Tailwind 响应式类（md: lg:）

## 可用脚本

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览生产构建
pnpm lint         # 运行 Oxlint 检查
pnpm fmt          # 格式化代码
```

## 参考资料

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vite 文档](https://vitejs.dev/)

## License

MIT
