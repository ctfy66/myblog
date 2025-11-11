# 自动化部署配置完成总结

## 🎉 已完成的配置

### 📁 新增文件列表

#### 1. GitHub Actions 工作流

```
.github/workflows/
├── deploy.yml              # 方案一：直接部署（推荐）
└── deploy-webhook.yml      # 方案二：Webhook 触发
```

#### 2. 服务器部署文件

```
server/
├── webhook-server.js       # Webhook 服务器（Node.js）
├── deploy.sh              # 自动部署脚本（Bash）
├── ecosystem.config.js    # PM2 进程管理配置
├── nginx.conf             # Nginx 配置示例
├── package.json           # Webhook 服务依赖
├── .env.example           # 环境变量模板
├── test-deployment.sh     # 部署测试脚本（Bash）
└── test-webhook.ps1       # Webhook 测试脚本（PowerShell）
```

#### 3. 文档文件

```
├── DEPLOYMENT.md          # 完整部署指南（必读）
├── QUICK-DEPLOY.md        # 快速部署参考
├── README.md              # 项目说明（已更新）
└── .gitignore             # Git 忽略配置（已创建）
```

---

## 🚀 两种部署方案对比

### 方案一：GitHub Actions 直接部署 ⭐ 推荐

**工作流程**：

```
本地推送 → GitHub Actions 构建 → SSH 部署到服务器
```

**优点**：

- ✅ 配置简单，只需设置 SSH 密钥
- ✅ 无需服务器额外运行服务
- ✅ GitHub 提供免费构建资源
- ✅ 构建失败有通知

**适合**：个人博客、小型项目

**配置文件**：`.github/workflows/deploy.yml`

---

### 方案二：Webhook 触发部署

**工作流程**：

```
本地推送 → GitHub 触发 Webhook → 服务器拉取代码并构建
```

**优点**：

- ✅ 服务器端完全控制
- ✅ 可执行复杂部署逻辑
- ✅ 支持自定义脚本
- ✅ 更详细的日志记录

**适合**：需要复杂部署流程的项目

**配置文件**：

- `.github/workflows/deploy-webhook.yml`
- `server/webhook-server.js`
- `server/deploy.sh`

---

## 📝 接下来要做什么？

### 🔴 必须完成的配置

#### 1️⃣ 选择部署方案

**方案一（GitHub Actions）**：

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/blog_deploy

# 2. 添加公钥到服务器
# 将 ~/.ssh/blog_deploy.pub 的内容添加到服务器的 ~/.ssh/authorized_keys

# 3. 在 GitHub 设置 Secrets
# Settings → Secrets → Actions → New repository secret
# 添加：
#   - SSH_PRIVATE_KEY（私钥内容）
#   - REMOTE_HOST（服务器 IP）
#   - REMOTE_USER（SSH 用户名）
#   - REMOTE_TARGET（/var/www/html/blog/）
```

**方案二（Webhook）**：

```bash
# 在服务器上执行：

# 1. 克隆项目
cd /var/www
git clone https://github.com/your-username/blog.git
cd blog && npm install

# 2. 配置 Webhook 服务
cd server && npm install
cp .env.example .env
nano .env  # 修改配置

# 3. 启动服务
chmod +x deploy.sh
pm2 start ecosystem.config.js
pm2 save && pm2 startup

# 4. 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/blog
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. 在 GitHub 设置 Secrets
# 添加：
#   - WEBHOOK_URL（http://your-domain.com/webhook）
#   - WEBHOOK_SECRET（与 .env 中相同）
```

#### 2️⃣ 配置服务器 Nginx

```bash
# 编辑配置文件
sudo nano /etc/nginx/sites-available/blog

# 修改以下内容：
#   - server_name: 改为你的域名
#   - root: 确认路径正确
#   - 如果使用 Webhook，保留 /webhook 配置

# 启用并重载
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3️⃣ 测试部署

```bash
# 本地推送测试
git add .
git commit -m "测试自动部署"
git push origin main

# 查看部署状态
# 方案一：https://github.com/your-username/blog/actions
# 方案二：pm2 logs blog-webhook
```

---

## 🟡 可选但推荐的配置

### 1. 配置 HTTPS（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 2. 设置定时备份

```bash
# 创建备份脚本
sudo nano /root/backup-blog.sh

# 添加以下内容：
#!/bin/bash
tar -czf /backup/blog-$(date +%Y%m%d).tar.gz /var/www/blog
find /backup -name "blog-*.tar.gz" -mtime +7 -delete

# 设置定时任务
sudo crontab -e
# 添加：每天凌晨 2 点备份
0 2 * * * /root/backup-blog.sh
```

### 3. 配置监控

```bash
# 安装监控工具
npm install -g pm2-logrotate

# 配置日志轮转
pm2 install pm2-logrotate
```

---

## 📋 日常使用流程

### 本地编写和发布

```bash
# 1. 创建或编辑文章
code docs/notes/my-article.md

# 2. 本地预览（可选）
npm run docs:dev

# 3. 提交并推送
git add .
git commit -m "新增文章：xxx"
git push origin main

# 4. 等待自动部署（1-3 分钟）
# ✨ 完成！访问你的网站查看更新
```

### 检查部署状态

**方案一（GitHub Actions）**：

```bash
# 访问 GitHub Actions 页面
https://github.com/your-username/blog/actions
```

**方案二（Webhook）**：

```bash
# SSH 登录服务器
ssh user@your-server

# 查看 Webhook 日志
pm2 logs blog-webhook

# 查看部署日志
tail -f /var/log/blog-deploy.log

# 查看服务状态
pm2 status
```

---

## 🔧 常用维护命令

### 服务器命令

```bash
# PM2 进程管理
pm2 status                 # 查看状态
pm2 restart blog-webhook   # 重启服务
pm2 logs blog-webhook      # 查看日志
pm2 stop blog-webhook      # 停止服务

# Nginx 管理
sudo nginx -t              # 测试配置
sudo systemctl reload nginx # 重载配置
sudo systemctl status nginx # 查看状态

# 手动部署
cd /var/www/blog/server
./deploy.sh

# 查看日志
tail -f /var/log/blog-deploy.log
tail -f /var/log/nginx/error.log
```

### 本地命令

```bash
# 构建测试
npm run docs:build

# 清理并构建
npm run build:clean

# 更新侧边栏
npm run update:sidebar

# 测试部署（需要 Git Bash）
bash server/test-deployment.sh
```

---

## 🐛 故障排查

### 问题 1：推送后没有自动部署

**检查清单**：

- [ ] GitHub Actions 是否运行？（查看 Actions 标签）
- [ ] Secrets 是否正确配置？
- [ ] 分支名是否为 `main`？
- [ ] workflow 文件是否在 `.github/workflows/` 目录？

### 问题 2：GitHub Actions 构建失败

**常见原因**：

- SSH 密钥错误
- 服务器无法连接
- 目标路径权限问题

**解决方法**：

```bash
# 测试 SSH 连接
ssh -i ~/.ssh/blog_deploy user@your-server

# 检查目标目录权限
ls -la /var/www/html/
```

### 问题 3：Webhook 服务无响应

**检查步骤**：

```bash
# 1. 检查服务状态
pm2 status

# 2. 查看日志
pm2 logs blog-webhook --lines 50

# 3. 测试健康检查
curl http://localhost:3000/health

# 4. 重启服务
pm2 restart blog-webhook
```

### 问题 4：网站显示 404 或内容未更新

**解决步骤**：

```bash
# 1. 清除浏览器缓存（Ctrl+Shift+R）

# 2. 检查文件是否存在
ls -la /var/www/html/blog/

# 3. 检查 Nginx 配置
sudo nginx -t
cat /etc/nginx/sites-enabled/blog

# 4. 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 📚 相关文档

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 完整的部署指南（详细版）
- **[QUICK-DEPLOY.md](./QUICK-DEPLOY.md)** - 快速部署参考（精简版）
- **[README.md](./README.md)** - 项目总览和使用说明

---

## 🎯 总结

### ✅ 你现在拥有：

1. **两套完整的自动化部署方案**

   - GitHub Actions 直接部署
   - Webhook 触发部署

2. **完善的文档体系**

   - 详细的配置说明
   - 故障排查指南
   - 日常使用流程

3. **服务器部署工具**

   - Webhook 服务器
   - 自动部署脚本
   - Nginx 配置模板

4. **测试工具**
   - 部署测试脚本
   - Webhook 测试脚本

### 🚀 下一步：

1. **选择一个部署方案**（推荐方案一）
2. **按照文档配置服务器和 GitHub**
3. **推送代码测试部署**
4. **开始写博客！**

---

**配置过程中遇到问题？**

- 查看详细文档：`DEPLOYMENT.md`
- 检查故障排查部分
- 确保所有配置文件都正确设置

**祝你部署顺利！** 🎉
