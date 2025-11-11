# 📝 我的博客

基于 VitePress 构建的个人博客系统，支持自动化部署和 Notion 导入。

## ✨ 特性

- 🚀 **自动化部署** - 推送到 GitHub 自动更新到服务器
- 📝 **Markdown 支持** - 使用 Markdown 编写文章
- 🎨 **主题美化** - 基于 VitePress 的现代化界面
- 📦 **Notion 导入** - 支持从 Notion 导入笔记
- 🔍 **全文搜索** - 内置搜索功能
- 📱 **响应式设计** - 完美支持移动端

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产构建
npm run docs:preview
```

### 📁 项目结构

```
blog/
├── docs/                    # 文档目录
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.mts      # 站点配置
│   │   └── theme/          # 主题配置
│   ├── notes/              # 笔记文章
│   │   └── leetcode/       # LeetCode 笔记
│   └── index.md            # 首页
├── scripts/                # 脚本工具
│   ├── generate-sidebar.js     # 生成侧边栏
│   ├── auto-import.js          # Notion 自动导入
│   ├── watch-and-update.js     # 监听文件变化
│   └── fix-notion-files.js     # 修复 Notion 文件
├── server/                 # 服务器相关
│   ├── webhook-server.js       # Webhook 服务器
│   ├── deploy.sh              # 部署脚本
│   ├── ecosystem.config.js    # PM2 配置
│   └── nginx.conf             # Nginx 配置
├── .github/workflows/      # GitHub Actions
│   ├── deploy.yml             # 直接部署配置
│   └── deploy-webhook.yml     # Webhook 部署配置
└── package.json

```

## 🚀 自动化部署

### 方案一：GitHub Actions（推荐）

**特点**：配置简单，无需服务器额外配置

```bash
# 1. 配置 GitHub Secrets
#    - SSH_PRIVATE_KEY
#    - REMOTE_HOST
#    - REMOTE_USER
#    - REMOTE_TARGET

# 2. 推送代码即可自动部署
git add .
git commit -m "更新文章"
git push origin main
```

### 方案二：Webhook 触发

**特点**：更灵活，可执行复杂部署逻辑

```bash
# 1. 服务器安装依赖
cd server
npm install
pm2 start ecosystem.config.js

# 2. 配置 GitHub Webhook
# 3. 推送代码触发部署
```

📖 **详细部署指南**: 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 日常使用

### 添加新文章

1. 在 `docs/notes/` 目录下创建 Markdown 文件
2. 编写文章内容
3. 提交并推送到 GitHub

```bash
# 创建新文章
code docs/notes/my-new-post.md

# 提交更改
git add .
git commit -m "新增文章：XXX"
git push origin main

# ✨ 服务器自动更新！
```

### 从 Notion 导入

```bash
# 自动导入 Notion 笔记
npm run import

# 修复导入的文件格式
npm run fix:notion
```

### 更新侧边栏

```bash
# 自动生成侧边栏配置
npm run update:sidebar
```

### 监听文件变化

```bash
# 开发时自动更新侧边栏
npm run watch
```

## 🛠️ 可用脚本

| 命令                     | 说明             |
| ------------------------ | ---------------- |
| `npm run docs:dev`       | 启动开发服务器   |
| `npm run docs:build`     | 构建生产版本     |
| `npm run docs:preview`   | 预览构建结果     |
| `npm run update:sidebar` | 生成侧边栏配置   |
| `npm run watch`          | 监听并自动更新   |
| `npm run fix:notion`     | 修复 Notion 文件 |
| `npm run import`         | 导入 Notion 笔记 |

## 📚 文档

- [快速开始](./QUICK-START.md) - 5 分钟入门指南
- [部署指南](./DEPLOYMENT.md) - 完整部署文档
- [快速部署](./QUICK-DEPLOY.md) - 快速部署参考
- [Notion 导入](./IMPORT-GUIDE.md) - Notion 导入教程
- [自动更新](./AUTO-UPDATE.md) - 自动化工作流程

## 🔧 配置

### VitePress 配置

配置文件：`docs/.vitepress/config.mts`

```typescript
export default defineConfig({
  title: "我的博客",
  description: "个人技术博客",
  themeConfig: {
    // 导航栏、侧边栏等配置
  },
});
```

### 服务器配置

Nginx 配置示例：`server/nginx.conf`
Webhook 配置：`server/.env.example`

## 🐛 故障排查

### 构建失败

```bash
# 清除缓存
rm -rf docs/.vitepress/cache
rm -rf node_modules
npm install
```

### 部署失败

```bash
# 检查 GitHub Actions 日志
# 访问: https://github.com/your-username/blog/actions

# 或检查服务器日志
pm2 logs blog-webhook
tail -f /var/log/blog-deploy.log
```

### 侧边栏未更新

```bash
# 重新生成侧边栏
npm run update:sidebar
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

ISC License

## 🔗 相关链接

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法](https://www.markdownguide.org/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**Made with ❤️ using VitePress**
