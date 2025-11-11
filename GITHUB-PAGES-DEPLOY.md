# GitHub Pages 部署指南

## 🎯 为什么选择 GitHub Pages？

- ✅ 完全免费
- ✅ GitHub 原生支持
- ✅ 配置超简单
- ✅ 自动 HTTPS（使用 github.io 域名）
- ⚠️ 国内访问可能较慢

## 🚀 快速部署

### 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 推送代码，自动部署

GitHub Actions 工作流已经配置好了（`.github/workflows/deploy-github-pages.yml`）。

## 🌐 访问地址

- 默认地址：`https://你的用户名.github.io/blog/`
- 自定义域名：在 Settings → Pages 中配置

## 📝 自定义域名

1. 在域名服务商添加 CNAME 记录：

   ```
   类型: CNAME
   名称: @
   值: 你的用户名.github.io
   ```

2. 在 Settings → Pages → Custom domain 输入你的域名

3. 勾选 "Enforce HTTPS"

## 🔄 工作流程

```bash
# 编辑文章
code docs/notes/my-post.md

# 提交推送
git add .
git commit -m "新文章"
git push

# ✨ GitHub Actions 自动部署！
```

## ⚙️ 配置说明

工作流配置在 `.github/workflows/deploy-github-pages.yml`：

- 触发条件：推送到 main 分支
- 构建步骤：安装依赖 → 生成侧边栏 → 构建 VitePress
- 部署到 gh-pages 分支

## 🎯 优缺点

### 优点

- 完全免费
- 简单易用
- GitHub 原生集成

### 缺点

- 国内访问慢（可用 CDN 加速）
- 每月 100GB 流量限制
- 构建时间可能较长

## 💡 加速访问（可选）

使用 CDN 加速：

- Cloudflare CDN
- jsDelivr CDN
- 国内 CDN 服务

---

详细配置请参考 [GitHub Pages 文档](https://docs.github.com/en/pages)
