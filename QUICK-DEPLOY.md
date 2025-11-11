# 快速部署指南

## 🚀 开始使用（5 分钟配置）

### 选择你的部署方案

#### ⭐ 推荐：方案一 - GitHub Actions（最简单）

**适合场景**：个人博客、小型项目

**优点**：

- ✅ 无需配置服务器环境
- ✅ GitHub 自动构建
- ✅ 配置简单

**快速配置步骤**：

1. **生成 SSH 密钥**（本地执行）

   ```powershell
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/blog_deploy
   ```

2. **添加公钥到服务器**

   ```bash
   # 在服务器上执行
   cat >> ~/.ssh/authorized_keys
   # 粘贴公钥内容，Ctrl+D 保存
   ```

3. **在 GitHub 添加 Secrets**

   - 进入仓库 Settings → Secrets → Actions
   - 添加 4 个 Secrets：
     - `SSH_PRIVATE_KEY`：私钥内容
     - `REMOTE_HOST`：服务器 IP
     - `REMOTE_USER`：SSH 用户名
     - `REMOTE_TARGET`：`/var/www/html/blog/`

4. **推送代码测试**

   ```bash
   git add .
   git commit -m "配置自动部署"
   git push origin main
   ```

5. **查看部署状态**
   - GitHub 仓库 → Actions 标签

---

#### 🔧 方案二 - Webhook 服务（更灵活）

**适合场景**：需要自定义部署逻辑

**优点**：

- ✅ 服务器端控制
- ✅ 可执行复杂脚本
- ✅ 更好的错误处理

**快速配置步骤**：

1. **服务器准备**

   ```bash
   # 克隆项目
   cd /var/www
   git clone https://github.com/your-username/blog.git
   cd blog
   npm install

   # 安装 PM2
   sudo npm install -g pm2

   # 配置 Webhook 服务
   cd server
   npm install
   cp .env.example .env
   nano .env  # 修改配置
   ```

2. **启动服务**

   ```bash
   chmod +x deploy.sh
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **配置 Nginx**

   ```bash
   sudo cp server/nginx.conf /etc/nginx/sites-available/blog
   sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **GitHub 配置**
   - 添加 Secrets：
     - `WEBHOOK_URL`：`http://your-domain.com/webhook`
     - `WEBHOOK_SECRET`：与 `.env` 中相同
   - 使用 `.github/workflows/deploy-webhook.yml`

---

## 📝 日常使用

配置完成后，你的工作流程非常简单：

```bash
# 1. 编写笔记
code docs/notes/my-new-post.md

# 2. 提交并推送
git add .
git commit -m "新增文章"
git push

# 3. 等待自动部署完成 ✨
```

## 🔍 检查部署状态

**方案一（GitHub Actions）**：

- 访问：`https://github.com/your-username/blog/actions`

**方案二（Webhook）**：

```bash
# SSH 登录服务器
pm2 logs blog-webhook
# 或
tail -f /var/log/blog-deploy.log
```

## 🆘 遇到问题？

查看完整文档：`DEPLOYMENT.md`

常见问题：

- SSH 连接失败 → 检查密钥和权限
- 构建失败 → 查看 Actions 日志
- 网站未更新 → 清除浏览器缓存
- Webhook 无响应 → 检查 PM2 服务状态

## 📚 相关文件

```
.github/workflows/
  ├── deploy.yml           # 方案一：GitHub Actions 配置
  └── deploy-webhook.yml   # 方案二：Webhook 配置

server/
  ├── webhook-server.js    # Webhook 服务器
  ├── deploy.sh           # 部署脚本
  ├── ecosystem.config.js # PM2 配置
  ├── nginx.conf          # Nginx 配置示例
  └── .env.example        # 环境变量模板

DEPLOYMENT.md           # 完整部署文档（必读）
QUICK-DEPLOY.md        # 本文件
```

---

**提示**：首次配置建议完整阅读 `DEPLOYMENT.md`，后续查阅本文件即可。
