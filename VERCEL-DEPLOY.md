# Vercel 部署指南

## 🎉 为什么选择 Vercel？

- ✅ **完全免费** - 个人项目永久免费
- ✅ **零配置部署** - 推送代码自动构建
- ✅ **自动 HTTPS** - 免费 SSL 证书
- ✅ **全球 CDN** - 访问速度快
- ✅ **自定义域名** - 支持绑定自己的域名
- ✅ **预览部署** - 每个 PR 都有预览链接

## 🚀 快速部署（5 分钟）

### 方法一：使用 Vercel CLI（推荐）

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

会打开浏览器，选择登录方式（推荐 GitHub）。

#### 3. 部署项目

```bash
# 在项目根目录执行
vercel

# 按照提示操作：
# ? Set up and deploy "d:\blog"? [Y/n] Y
# ? Which scope do you want to deploy to? 选择你的账号
# ? Link to existing project? [y/N] N
# ? What's your project's name? blog
# ? In which directory is your code located? ./
```

#### 4. 完成！

部署成功后会显示：

```
✅ Production: https://blog-xxx.vercel.app
```

### 方法二：通过 Vercel 网站部署

#### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

#### 2. 导入项目

1. 访问 [vercel.com](https://vercel.com/)
2. 点击 "Start Deploying"
3. 选择 "Import Git Repository"
4. 授权 GitHub 访问
5. 选择你的博客仓库
6. 点击 "Import"

#### 3. 配置项目

Vercel 会自动检测 VitePress，默认配置即可：

- **Framework Preset**: VitePress
- **Root Directory**: `./`
- **Build Command**: `npm run docs:build`
- **Output Directory**: `docs/.vitepress/dist`

点击 "Deploy"。

#### 4. 完成！

几分钟后，你的博客就上线了！

---

## 📝 配置文件

我已经为你创建了 `vercel.json` 配置文件。

### vercel.json 配置说明

```json
{
  "buildCommand": "npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "installCommand": "npm install"
}
```

---

## 🌐 自定义域名

### 1. 在 Vercel 添加域名

1. 进入项目 Dashboard
2. 点击 "Settings" → "Domains"
3. 添加你的域名：`yourdomain.com`

### 2. 配置 DNS

在你的域名服务商处添加 DNS 记录：

**方式一：使用 CNAME（推荐）**

```
类型: CNAME
名称: @
值: cname.vercel-dns.com
```

**方式二：使用 A 记录**

```
类型: A
名称: @
值: 76.76.21.21
```

### 3. 等待生效

通常 5-30 分钟，DNS 生效后自动配置 HTTPS。

---

## 🔧 环境变量

如果需要设置环境变量：

1. 项目 Dashboard → "Settings" → "Environment Variables"
2. 添加变量，例如：
   - `NODE_VERSION`: `20`
   - `NPM_VERSION`: `10`

---

## 🔄 自动部署

### 每次推送都会自动部署

```bash
# 编辑文章
code docs/notes/my-post.md

# 提交推送
git add .
git commit -m "新文章"
git push

# ✨ Vercel 自动部署！
```

### 预览部署

每个 Pull Request 都会创建预览链接：

1. 创建新分支：`git checkout -b new-feature`
2. 提交更改：`git commit -m "update"`
3. 推送：`git push origin new-feature`
4. 创建 PR
5. Vercel 会在 PR 中添加预览链接 🔗

---

## 📊 部署状态

### 查看部署历史

- 访问：https://vercel.com/你的用户名/blog
- 点击 "Deployments" 查看所有部署记录

### 回滚到之前的版本

1. 进入 "Deployments"
2. 找到想要恢复的版本
3. 点击 "⋯" → "Promote to Production"

---

## 🎨 高级配置

### 自定义构建命令

编辑 `vercel.json`：

```json
{
  "buildCommand": "npm run update:sidebar && npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist"
}
```

### 配置重定向

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### 配置头部

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 💰 费用说明

### Hobby Plan（免费）

- ✅ 无限项目
- ✅ 100GB 带宽/月
- ✅ 100 次构建/天
- ✅ 无限域名
- ✅ 自动 HTTPS

对个人博客完全够用！

### Pro Plan（$20/月）

如果免费额度不够，可以升级：

- 1TB 带宽/月
- 6000 分钟构建时间/月
- 更多高级功能

---

## 🔍 性能优化

### 1. 启用边缘缓存

Vercel 自动启用全球 CDN，无需配置。

### 2. 图片优化

使用 Vercel Image Optimization：

```vue
<!-- 使用 next/image 组件 -->
<img src="/images/photo.jpg" alt="photo" />
```

### 3. 预渲染

VitePress 默认生成静态 HTML，性能已经很好。

---

## 📈 分析统计

### 启用 Vercel Analytics

1. 项目 Dashboard → "Analytics"
2. 点击 "Enable"
3. 查看访问数据

### 或使用 Google Analytics

在 `docs/.vitepress/config.mts` 中配置：

```typescript
export default defineConfig({
  head: [
    [
      "script",
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
      },
    ],
    [
      "script",
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `,
    ],
  ],
});
```

---

## 🐛 常见问题

### 构建失败

**查看构建日志**：

- Dashboard → "Deployments" → 点击失败的部署 → 查看日志

**常见原因**：

1. 依赖安装失败 → 检查 `package.json`
2. 构建命令错误 → 检查 `vercel.json`
3. 路径问题 → 确认 `outputDirectory` 正确

### 404 错误

**原因**：路由配置问题

**解决**：VitePress 会自动处理，通常不会有问题。如果有，添加 `vercel.json`：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 域名未生效

- 等待 DNS 传播（最多 48 小时）
- 使用 [DNS 检查工具](https://dnschecker.org/) 查看状态

---

## 🎯 对比其他方案

| 方案             | 优点             | 缺点       | 适合        |
| ---------------- | ---------------- | ---------- | ----------- |
| **Vercel**       | 免费、快速、简单 | 国内有时慢 | 个人博客 ⭐ |
| **Netlify**      | 免费、功能多     | 同上       | 个人博客    |
| **GitHub Pages** | 完全免费         | 较慢       | 简单项目    |
| **自建服务器**   | 完全控制         | 需要维护   | 学习 Linux  |

---

## 📚 相关链接

- [Vercel 官方文档](https://vercel.com/docs)
- [VitePress 部署指南](https://vitepress.dev/guide/deploy)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

---

## 💡 建议

1. **新手**：先用 Vercel 免费部署，熟悉流程
2. **进阶**：如果需要完全控制，再购买服务器
3. **备份**：定期备份你的 Markdown 文件
4. **监控**：启用 Analytics 了解访问情况

---

**开始部署**：在项目根目录运行 `vercel` 即可！🚀
