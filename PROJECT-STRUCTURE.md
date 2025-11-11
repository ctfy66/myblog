# 📁 博客项目完整结构

```
blog/
│
├── 📄 README.md                    # 项目说明文档
├── 📄 package.json                 # 项目依赖配置
├── 📄 .gitignore                   # Git 忽略文件配置
│
├── 📚 文档文件/
│   ├── QUICK-START.md              # 快速开始指南
│   ├── DEPLOYMENT.md               # 完整部署文档 ⭐
│   ├── QUICK-DEPLOY.md             # 快速部署参考
│   ├── SETUP-COMPLETE.md           # 配置完成总结
│   ├── AUTO-UPDATE.md              # 自动更新说明
│   ├── IMPORT-GUIDE.md             # Notion 导入指南
│   └── NOTION-IMPORT-WORKFLOW.md   # Notion 工作流程
│
├── 🤖 GitHub Actions/
│   └── .github/workflows/
│       ├── deploy.yml              # 方案一：直接部署 ⭐ 推荐
│       └── deploy-webhook.yml      # 方案二：Webhook 触发
│
├── 🖥️ 服务器部署/
│   └── server/
│       ├── webhook-server.js       # Webhook 服务器（Node.js）
│       ├── deploy.sh               # 自动部署脚本（Bash）
│       ├── ecosystem.config.js     # PM2 配置
│       ├── nginx.conf              # Nginx 配置模板
│       ├── package.json            # 服务器依赖
│       ├── .env.example            # 环境变量模板
│       ├── test-deployment.sh      # 部署测试（Bash）
│       └── test-webhook.ps1        # Webhook 测试（PowerShell）
│
├── 📝 内容目录/
│   └── docs/
│       ├── index.md                # 首页
│       ├── .vitepress/             # VitePress 配置
│       │   ├── config.mts          # 站点配置
│       │   ├── theme/              # 主题配置
│       │   ├── dist/               # 构建输出（Git 忽略）
│       │   └── cache/              # 构建缓存（Git 忽略）
│       └── notes/                  # 笔记文章
│           ├── index.md            # 笔记首页
│           └── leetcode/           # LeetCode 笔记
│               └── leetcode-notes.md
│
└── 🔧 脚本工具/
    └── scripts/
        ├── generate-sidebar.js     # 生成侧边栏配置
        ├── auto-import.js          # Notion 自动导入
        ├── watch-and-update.js     # 监听文件变化
        ├── import-notion.js        # Notion 导入工具
        └── fix-notion-files.js     # 修复 Notion 文件
```

## 🎯 关键文件说明

### 📌 必读文档

| 文件                | 用途         | 重要程度   |
| ------------------- | ------------ | ---------- |
| `README.md`         | 项目总览     | ⭐⭐⭐     |
| `DEPLOYMENT.md`     | 详细部署指南 | ⭐⭐⭐⭐⭐ |
| `QUICK-DEPLOY.md`   | 快速部署参考 | ⭐⭐⭐⭐   |
| `SETUP-COMPLETE.md` | 配置完成总结 | ⭐⭐⭐⭐   |

### 🚀 部署相关

#### GitHub Actions（方案一）

```
.github/workflows/deploy.yml
```

- 推送代码 → GitHub 构建 → 自动部署
- 需要配置 GitHub Secrets
- **推荐使用**

#### Webhook 服务（方案二）

```
server/webhook-server.js
server/deploy.sh
server/ecosystem.config.js
```

- 推送代码 → Webhook 触发 → 服务器构建
- 需要服务器运行 Node.js 服务
- 更灵活，可自定义

### ⚙️ 配置文件

| 文件                         | 说明                 |
| ---------------------------- | -------------------- |
| `server/nginx.conf`          | Nginx 配置模板       |
| `server/.env.example`        | Webhook 环境变量模板 |
| `server/ecosystem.config.js` | PM2 进程管理配置     |
| `docs/.vitepress/config.mts` | VitePress 站点配置   |

### 🧪 测试脚本

| 文件                        | 平台      | 用途              |
| --------------------------- | --------- | ----------------- |
| `server/test-deployment.sh` | Linux/Mac | 测试部署流程      |
| `server/test-webhook.ps1`   | Windows   | 测试 Webhook 服务 |

## 📊 工作流程图

### 方案一：GitHub Actions 直接部署

```
┌──────────┐
│ 本地开发  │ 编写 Markdown 文章
└─────┬────┘
      │ git add, commit, push
      ▼
┌──────────────┐
│ GitHub 仓库  │ 接收推送
└──────┬───────┘
       │ 触发 Actions
       ▼
┌────────────────────┐
│ GitHub Actions     │
│ 1. 安装依赖        │
│ 2. 生成侧边栏      │
│ 3. 构建 VitePress  │
│ 4. SSH 部署        │
└────────┬───────────┘
         │ rsync 文件
         ▼
┌─────────────────┐
│ 服务器           │
│ /var/www/html/  │
│     blog/       │
└────────┬────────┘
         │ Nginx 服务
         ▼
    🌐 网站上线
```

### 方案二：Webhook 触发部署

```
┌──────────┐
│ 本地开发  │ 编写 Markdown 文章
└─────┬────┘
      │ git add, commit, push
      ▼
┌──────────────┐
│ GitHub 仓库  │ 接收推送
└──────┬───────┘
       │ 触发 Webhook
       ▼
┌────────────────────┐
│ Webhook 服务器      │
│ (localhost:3000)   │
└────────┬───────────┘
         │ 执行 deploy.sh
         ▼
┌─────────────────────┐
│ 部署脚本             │
│ 1. git pull         │
│ 2. npm install      │
│ 3. 生成侧边栏       │
│ 4. npm run build    │
│ 5. rsync 到 nginx   │
│ 6. reload nginx     │
└────────┬────────────┘
         │
         ▼
    🌐 网站上线
```

## 🎯 快速导航

### 想要...

- **开始写博客** → 查看 `QUICK-START.md`
- **部署到服务器** → 查看 `DEPLOYMENT.md`
- **快速部署** → 查看 `QUICK-DEPLOY.md`
- **配置说明** → 查看 `SETUP-COMPLETE.md`
- **从 Notion 导入** → 查看 `IMPORT-GUIDE.md`
- **自定义主题** → 查看 `docs/.vitepress/config.mts`

### 遇到问题...

- **部署失败** → `DEPLOYMENT.md` 的故障排查章节
- **构建错误** → 检查 `package.json` 依赖
- **服务器配置** → `server/nginx.conf` 示例
- **Webhook 不工作** → `server/test-webhook.ps1` 测试

## 💡 使用建议

### 新手用户

1. 阅读 `README.md` 了解项目
2. 跟随 `QUICK-DEPLOY.md` 快速部署
3. 使用**方案一（GitHub Actions）**

### 进阶用户

1. 阅读 `DEPLOYMENT.md` 了解细节
2. 使用**方案二（Webhook）** 获得更多控制
3. 自定义 `deploy.sh` 脚本

### 日常使用

```bash
# 编辑文章
code docs/notes/new-article.md

# 提交推送
git add . && git commit -m "新文章" && git push

# 等待自动部署 ✨
```

## 🔐 敏感信息保护

### ⚠️ 不要提交到 Git：

- `server/.env` - 环境变量配置
- `node_modules/` - 依赖包
- `docs/.vitepress/dist/` - 构建产物
- `docs/.vitepress/cache/` - 构建缓存
- `*.log` - 日志文件

### ✅ 已在 `.gitignore` 中配置

## 🛠️ 维护建议

### 定期执行

```bash
# 更新依赖
npm update

# 清理缓存
npm run clean

# 检查安全漏洞
npm audit

# 备份服务器数据
# 见 SETUP-COMPLETE.md 的备份部分
```

---

**提示**：这个项目结构支持两种部署方案，你可以根据需求选择。推荐先使用方案一（GitHub Actions），简单快捷！

**详细配置步骤请查看**: `DEPLOYMENT.md` 📖
