# 博客自动化部署指南

本文档详细说明如何配置自动化部署，让你只需在本地提交代码，服务器就能自动更新。

## 📋 目录

- [部署方案概述](#部署方案概述)
- [方案一：GitHub Actions 直接部署](#方案一github-actions-直接部署)
- [方案二：Webhook 触发部署](#方案二webhook-触发部署)
- [服务器配置](#服务器配置)
- [本地工作流程](#本地工作流程)
- [故障排查](#故障排查)

## 🎯 部署方案概述

提供两种自动化部署方案：

### 方案一：GitHub Actions 直接部署（推荐）

- ✅ 无需额外服务器配置
- ✅ 构建在 GitHub 服务器上完成
- ✅ 直接推送构建结果到服务器
- ❌ 需要配置 SSH 密钥

### 方案二：Webhook 触发部署

- ✅ 服务器端构建，资源可控
- ✅ 更灵活的部署控制
- ✅ 可以执行自定义脚本
- ❌ 需要运行 Webhook 服务

## 🚀 方案一：GitHub Actions 直接部署

### 1. 生成 SSH 密钥对

在你的**本地电脑**上执行：

```bash
# 生成新的 SSH 密钥（不要设置密码）
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/blog_deploy

# 查看公钥（需要添加到服务器）
cat ~/.ssh/blog_deploy.pub

# 查看私钥（需要添加到 GitHub Secrets）
cat ~/.ssh/blog_deploy
```

### 2. 配置服务器

登录你的服务器，执行以下命令：

```bash
# 添加公钥到服务器（替换为上面生成的公钥内容）
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 创建网站目录
sudo mkdir -p /var/www/html/blog
sudo chown $USER:$USER /var/www/html/blog

# 安装 Nginx（如果还没安装）
sudo apt update
sudo apt install nginx -y
```

### 3. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/blog
```

添加以下内容（替换 `your-domain.com` 为你的域名）：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/html/blog;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 4. 配置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets：

1. 访问你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

添加以下 Secrets：

| Secret 名称       | 值                                   | 说明                        |
| ----------------- | ------------------------------------ | --------------------------- |
| `SSH_PRIVATE_KEY` | 私钥内容（`cat ~/.ssh/blog_deploy`） | SSH 私钥                    |
| `REMOTE_HOST`     | 服务器 IP 或域名                     | 例如：`123.45.67.89`        |
| `REMOTE_USER`     | SSH 用户名                           | 通常是 `root` 或 `ubuntu`   |
| `REMOTE_TARGET`   | 部署目标路径                         | 例如：`/var/www/html/blog/` |

### 5. 测试部署

推送代码到 GitHub：

```bash
git add .
git commit -m "配置自动部署"
git push origin main
```

然后在 GitHub 仓库的 `Actions` 标签页查看部署进度。

## 🎣 方案二：Webhook 触发部署

### 1. 服务器准备

登录服务器，克隆项目：

```bash
# 安装 Node.js（如果还没安装）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 克隆项目
cd /var/www
git clone https://github.com/your-username/blog.git
cd blog

# 安装依赖
npm install

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 进入 server 目录
cd server
npm install
```

### 2. 配置环境变量

创建环境变量文件：

```bash
nano /var/www/blog/server/.env
```

添加以下内容：

```env
WEBHOOK_PORT=3000
WEBHOOK_SECRET=your-very-secure-secret-here
PROJECT_PATH=/var/www/blog
LOG_PATH=/var/log/blog-deploy.log
```

### 3. 设置部署脚本权限

```bash
# 设置脚本可执行权限
chmod +x /var/www/blog/server/deploy.sh

# 创建日志文件
sudo touch /var/log/blog-deploy.log
sudo chown $USER:$USER /var/log/blog-deploy.log
```

### 4. 启动 Webhook 服务

```bash
cd /var/www/blog/server

# 使用 PM2 启动服务
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs blog-webhook
```

### 5. 配置 Nginx 反向代理

编辑 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/blog
```

添加 Webhook 端点：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 网站静态文件
    location / {
        root /var/www/html/blog;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Webhook 端点
    location /webhook {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. 配置 GitHub Secrets（Webhook 方案）

添加以下 Secrets：

| Secret 名称      | 值                               | 说明         |
| ---------------- | -------------------------------- | ------------ |
| `WEBHOOK_URL`    | `http://your-domain.com/webhook` | Webhook 地址 |
| `WEBHOOK_SECRET` | 与服务器 `.env` 中相同的密钥     | 验证密钥     |

### 7. 启用 GitHub Workflow

确保使用 `.github/workflows/deploy-webhook.yml` 文件。

## 💻 本地工作流程

配置完成后，你的日常工作流程非常简单：

```bash
# 1. 编辑你的笔记/博客
# 在 docs/notes/ 目录下编辑 markdown 文件

# 2. 添加到 Git
git add .

# 3. 提交更改
git commit -m "添加新博客：XXX"

# 4. 推送到 GitHub
git push origin main

# ✨ 就这么简单！服务器会自动更新
```

### 查看部署状态

- **方案一**：在 GitHub 仓库的 `Actions` 标签页查看
- **方案二**：SSH 登录服务器查看日志

  ```bash
  # 查看 Webhook 日志
  pm2 logs blog-webhook

  # 查看部署日志
  tail -f /var/log/blog-deploy.log
  ```

## 🔧 服务器常用命令

```bash
# 查看 Webhook 服务状态
pm2 status

# 重启 Webhook 服务
pm2 restart blog-webhook

# 查看日志
pm2 logs blog-webhook

# 手动执行部署脚本
cd /var/www/blog/server
./deploy.sh

# 查看 Nginx 状态
sudo systemctl status nginx

# 重载 Nginx
sudo nginx -s reload
```

## 🐛 故障排查

### 问题 1：GitHub Actions 部署失败

**检查清单：**

- [ ] SSH 密钥是否正确配置
- [ ] 服务器是否能通过 SSH 连接
- [ ] 目标路径是否有写入权限
- [ ] GitHub Secrets 是否正确设置

**调试方法：**

```bash
# 在本地测试 SSH 连接
ssh -i ~/.ssh/blog_deploy user@your-server

# 检查目标目录权限
ls -la /var/www/html/
```

### 问题 2：Webhook 服务无响应

**检查清单：**

- [ ] PM2 服务是否正在运行：`pm2 status`
- [ ] 端口是否被占用：`netstat -tlnp | grep 3000`
- [ ] Nginx 配置是否正确：`sudo nginx -t`
- [ ] 防火墙是否开放端口

**调试方法：**

```bash
# 重启服务
pm2 restart blog-webhook

# 查看详细日志
pm2 logs blog-webhook --lines 100

# 测试 Webhook（本地）
curl -X POST http://localhost:3000/health
```

### 问题 3：构建成功但网站未更新

**检查清单：**

- [ ] Nginx 是否重载：`sudo systemctl status nginx`
- [ ] 文件权限是否正确：`ls -la /var/www/html/blog`
- [ ] 浏览器缓存是否清除：`Ctrl+Shift+R`

**调试方法：**

```bash
# 检查构建输出
ls -la /var/www/blog/docs/.vitepress/dist/

# 检查 Nginx 日志
sudo tail -f /var/log/nginx/error.log
```

### 问题 4：Git 权限问题

**解决方法：**

```bash
# 在服务器上配置 Git（首次需要）
cd /var/www/blog
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# 如果遇到权限问题
sudo chown -R $USER:$USER /var/www/blog
```

## 📊 性能优化建议

1. **启用 Nginx 缓存**：静态资源设置长期缓存
2. **使用 CDN**：将静态资源托管到 CDN
3. **启用 HTTP/2**：提升传输速度
4. **压缩资源**：确保 gzip 或 brotli 压缩启用
5. **图片优化**：使用 WebP 格式，压缩图片大小

## 🔒 安全建议

1. **使用 HTTPS**：配置 SSL 证书（推荐使用 Let's Encrypt）
2. **限制 SSH 访问**：只允许密钥登录，禁用密码
3. **定期更新**：保持系统和软件包更新
4. **备份数据**：定期备份重要文件
5. **监控日志**：定期检查访问日志和错误日志

## 📚 更多资源

- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)

## 💡 提示

如果你的博客项目还比较简单，推荐使用 **方案一（GitHub Actions）**，配置更简单，维护成本更低。

如果你需要更复杂的部署逻辑（比如数据库备份、多环境部署等），可以使用 **方案二（Webhook）**。

---

**祝部署顺利！有问题随时查阅本文档。** 🎉
