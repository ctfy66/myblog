# 🤖 自动化侧边栏更新

## 功能说明

自动扫描 `docs/notes/` 目录，根据文件夹和 Markdown 文件自动生成侧边栏配置。

### ✨ 特性

- 🗂️ **自动识别分类** - 每个文件夹 = 一个分类
- 📝 **自动提取标题** - 优先使用文件中的 `# 标题`
- 🔄 **实时监听** - 文件变化时自动更新配置
- 🎨 **智能命名** - 支持自定义分类显示名称
- 📊 **统计信息** - 显示分类数和笔记总数

## 使用方法

### 方法 1：手动更新（推荐日常使用）

每次添加新笔记后运行：

```bash
npm run update:sidebar
```

### 方法 2：自动监听（开发时使用）

开启后会自动监听文件变化并更新配置：

```bash
npm run watch
```

建议在开发时开两个终端：

```bash
# 终端 1 - 运行开发服务器
npm run docs:dev

# 终端 2 - 监听文件变化
npm run watch
```

### 方法 3：直接运行脚本

```bash
node scripts/generate-sidebar.js
```

## 📁 目录结构规则

### 基本结构

```
docs/notes/
├── frontend/           # 分类文件夹
│   ├── react.md       # 笔记文件
│   └── vue.md
├── backend/
│   ├── nodejs.md
│   └── python.md
└── database/
    └── mysql.md
```

### 规则说明

1. **分类 = 文件夹**

   - `docs/notes/` 下的每个文件夹都是一个分类
   - 文件夹名用英文小写，用短横线连接：`design-patterns`

2. **笔记 = Markdown 文件**

   - 每个 `.md` 文件都是一篇笔记
   - 文件名用英文小写，用短横线连接：`react-hooks.md`
   - `index.md` 会被忽略

3. **标题提取**
   - 优先使用文件中的一级标题 `# 标题`
   - 如果没有，则从文件名自动生成

## 🎨 自定义分类名称

编辑 `scripts/generate-sidebar.js` 中的 `categoryNames` 对象：

```javascript
const categoryNames = {
  frontend: "前端开发", // 文件夹名 -> 显示名称
  backend: "后端开发",
  algorithms: "算法与数据结构",
  database: "数据库",
  devops: "DevOps",
  "design-patterns": "设计模式",
  // 添加你的自定义映射...
};
```

## 📝 示例工作流

### 添加新分类和笔记

```bash
# 1. 创建新分类文件夹
mkdir docs\notes\machine-learning

# 2. 添加笔记
echo "# PyTorch 入门" > docs\notes\machine-learning\pytorch-intro.md

# 3. 更新侧边栏
npm run update:sidebar

# 4. 查看效果
# 刷新浏览器，左侧导航栏会出现新分类
```

### 从 Notion 导入后更新

```bash
# 1. 导入 Notion 笔记
node scripts/import-notion.js D:\notion-export frontend

# 2. 自动更新侧边栏
npm run update:sidebar

# 完成！所有笔记都会出现在导航栏中
```

## 🔍 脚本功能详解

### generate-sidebar.js

**功能**：扫描目录并生成侧边栏配置

**处理逻辑**：

1. 扫描 `docs/notes/` 下的所有文件夹（分类）
2. 扫描每个分类下的 `.md` 文件（笔记）
3. 提取文件标题（优先使用文件内容的 `# 标题`）
4. 生成侧边栏配置对象
5. 更新 `config.mts` 文件

**输出示例**：

```
🚀 开始生成侧边栏配置...

✅ 分类 "前端开发" - 3 篇笔记
✅ 分类 "后端开发" - 2 篇笔记

📝 更新配置文件...
✅ 配置文件更新成功！

📊 统计信息:
   - 分类数量: 2
   - 笔记总数: 5

🎉 完成！刷新浏览器查看效果。
```

### watch-and-update.js

**功能**：监听文件变化，自动运行 generate-sidebar.js

**监听内容**：

- `.md` 文件的创建、修改、删除
- 文件夹的创建、删除

**防抖机制**：1 秒内只更新一次，避免频繁更新

## 💡 提示

### 文件命名建议

- ✅ 推荐：`react-hooks.md`, `python-basics.md`
- ❌ 避免：`React Hooks.md`, `Python基础.md`
- 原因：URL 友好，不会有编码问题

### 中文标题

文件名用英文，但在文件内容中使用中文标题：

```markdown
<!-- docs/notes/frontend/react-hooks.md -->

# React Hooks 详解

本文介绍 React Hooks...
```

侧边栏会显示：**React Hooks 详解**

### 分类顺序

分类按字母顺序排列，如果想自定义顺序：

1. 可以在文件夹名前加数字：`01-frontend`, `02-backend`
2. 在 `categoryNames` 中映射显示名称

## ⚠️ 注意事项

1. **配置文件格式**

   - 脚本会自动更新 `config.mts` 中的 `sidebar` 配置
   - 确保配置文件格式正确

2. **文件变化**

   - 添加/删除文件后需要运行更新脚本
   - 或者使用 watch 模式自动更新

3. **构建前更新**
   - 部署前记得运行 `npm run update:sidebar`
   - 确保所有笔记都在侧边栏中

## 🚀 高级用法

### 集成到 Git Hook

在 `.husky/pre-commit` 中添加：

```bash
npm run update:sidebar
git add docs/.vitepress/config.mts
```

每次提交前自动更新侧边栏配置。

### 配合 CI/CD

在构建脚本中添加：

```bash
npm run update:sidebar
npm run docs:build
```

确保部署时侧边栏是最新的。

---

💡 **建议**：日常写作时使用 `npm run watch`，部署前运行 `npm run update:sidebar` 确保同步。
