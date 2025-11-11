# 🚀 5 分钟快速开始

> 最简单的方式开始使用自动化部署

## 📋 前提条件

- ✅ 有一台 Linux 服务器（Ubuntu/Debian/CentOS）
- ✅ 服务器已安装 Nginx
- ✅ 有 SSH 访问权限
- ✅ GitHub 账号

## ⚡ 快速配置（推荐方案）

### 第 1 步：生成 SSH 密钥（2 分钟）

在你的 **Windows 电脑** 上打开 PowerShell：

```powershell
# 生成密钥（按回车接受默认选项）
ssh-keygen -t ed25519 -C "github-deploy" -f $HOME\.ssh\blog_deploy

# 查看公钥（需要添加到服务器）
Get-Content $HOME\.ssh\blog_deploy.pub

# 查看私钥（需要添加到 GitHub）
Get-Content $HOME\.ssh\blog_deploy
```

### 第 2 步：配置服务器（1 分钟）

SSH 登录到服务器，执行：

```bash
# 添加公钥（粘贴上面的公钥内容）
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# 粘贴公钥，保存退出（Ctrl+X, Y, Enter）

# 设置权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 创建网站目录
sudo mkdir -p /var/www/html/blog
sudo chown $USER:$USER /var/www/html/blog
```

### 第 3 步：配置 Nginx（1 分钟）

```bash
# 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/blog
```

粘贴以下内容（**修改域名**）：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改成你的域名

    root /var/www/html/blog;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 第 4 步：配置 GitHub Secrets（1 分钟）

1. 打开你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`，添加以下 4 个密钥：

| Name              | Value                     | 示例                                     |
| ----------------- | ------------------------- | ---------------------------------------- |
| `SSH_PRIVATE_KEY` | 私钥内容（第 1 步获取的） | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `REMOTE_HOST`     | 服务器 IP 或域名          | `123.45.67.89`                           |
| `REMOTE_USER`     | SSH 用户名                | `ubuntu` 或 `root`                       |
| `REMOTE_TARGET`   | 部署目标路径              | `/var/www/html/blog/`                    |

### 第 5 步：推送测试 ✨

在本地项目中：

```bash
# 提交所有文件
git add .
git commit -m "配置自动部署"
git push origin main
```

然后：

1. 访问 `https://github.com/你的用户名/blog/actions`
2. 查看部署进度（通常 1-2 分钟完成）
3. 完成后访问你的网站：`http://your-domain.com`

## 🎉 完成！

现在你可以：

```bash
# 编写文章
code docs/notes/my-first-post.md

# 提交并自动部署
git add .
git commit -m "新文章"
git push

# ✨ 网站自动更新！
```

## 🔍 检查部署状态

- **查看构建日志**：`https://github.com/你的用户名/blog/actions`
- **测试 SSH 连接**：`ssh -i ~/.ssh/blog_deploy user@your-server`
- **查看网站文件**：`ls -la /var/www/html/blog/`

## 🐛 遇到问题？

### SSH 连接失败

```bash
# 测试连接
ssh -i ~/.ssh/blog_deploy -v user@your-server

# 检查服务器日志
sudo tail -f /var/log/auth.log
```

### 部署失败

- 检查 GitHub Actions 日志
- 确认所有 Secrets 配置正确
- 确认服务器目录有写权限

### 网站打不开

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 检查文件是否存在
ls -la /var/www/html/blog/
```

## 📚 下一步

- 🔐 [配置 HTTPS](./DEPLOYMENT.md#配置-https)
- 🎨 [自定义主题](./docs/.vitepress/config.mts)
- 📝 [从 Notion 导入](./IMPORT-GUIDE.md)
- 🚀 [使用 Webhook 方案](./DEPLOYMENT.md#方案二webhook-触发部署)

## 💡 提示

- 第一次部署可能需要 2-3 分钟
- 后续推送通常 1 分钟内完成
- 记得清除浏览器缓存查看更新
- 推荐使用 HTTPS（Let's Encrypt 免费）

---

**详细文档**：

- 完整部署指南：`DEPLOYMENT.md`
- 项目结构说明：`PROJECT-STRUCTURE.md`
- 配置完成总结：`SETUP-COMPLETE.md`

**遇到问题**？查看 `DEPLOYMENT.md` 的故障排查部分！
