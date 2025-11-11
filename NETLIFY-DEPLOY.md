# Netlify 部署指南

## 🎯 为什么选择 Netlify？

- ✅ 完全免费（个人项目）
- ✅ 自动部署
- ✅ 免费 HTTPS
- ✅ 全球 CDN
- ✅ 表单处理功能

## 🚀 快速部署

### 方法一：Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化并部署
netlify init

# 按提示操作即可
```

### 方法二：通过网站部署（推荐）

1. 访问 [netlify.com](https://www.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub，授权访问
4. 选择你的博客仓库
5. 配置构建设置：
   - **Build command**: `npm run docs:build`
   - **Publish directory**: `docs/.vitepress/dist`
6. 点击 "Deploy site"

## 📝 配置文件

`netlify.toml` 配置说明：

- 自动运行 `update:sidebar` 生成侧边栏
- 构建 VitePress 项目
- 配置重定向规则

## 🌐 自定义域名

1. 进入 Site settings → Domain management
2. 点击 "Add custom domain"
3. 输入域名，按提示配置 DNS
4. 自动配置 HTTPS

## 🔄 持续部署

每次推送到 main 分支，Netlify 会自动构建部署。

## 📊 其他功能

- **表单处理**：内置表单后端
- **函数**：Serverless Functions
- **分析**：访问统计
- **A/B 测试**：Split Testing

---

详细配置请参考 [Netlify 文档](https://docs.netlify.com/)
