#!/bin/bash

#############################################
# 博客自动部署脚本
# 用途：在服务器上自动拉取代码并构建部署
#############################################

# 配置
PROJECT_PATH="/var/www/blog"
NGINX_PATH="/var/www/html/blog"
LOG_FILE="/var/log/blog-deploy.log"
BRANCH="main"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN:${NC} $1" | tee -a "$LOG_FILE"
}

# 错误处理
set -e
trap 'error "部署失败于第 $LINENO 行"' ERR

log "==================== 开始部署 ===================="

# 进入项目目录
cd "$PROJECT_PATH" || exit 1
log "工作目录: $(pwd)"

# 1. 检查 Git 状态
log "检查 Git 状态..."
git status

# 2. 保存本地更改（如果有）
if [ -n "$(git status --porcelain)" ]; then
    warn "发现本地更改，正在保存..."
    git stash
fi

# 3. 拉取最新代码
log "拉取最新代码..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# 4. 检查 package.json 是否有更新
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    log "package.json 有更新，重新安装依赖..."
    npm ci
else
    log "package.json 无更新，跳过依赖安装"
fi

# 5. 生成侧边栏
log "生成侧边栏配置..."
npm run update:sidebar

# 6. 构建项目
log "构建 VitePress 项目..."
npm run docs:build

# 7. 同步到 Nginx 目录
log "同步构建文件到 Nginx..."
rsync -av --delete "$PROJECT_PATH/docs/.vitepress/dist/" "$NGINX_PATH/"

# 8. 设置正确的权限
log "设置文件权限..."
sudo chown -R www-data:www-data "$NGINX_PATH"
sudo chmod -R 755 "$NGINX_PATH"

# 9. 重载 Nginx
log "重载 Nginx 配置..."
sudo nginx -t && sudo nginx -s reload

# 10. 清理构建缓存（可选）
log "清理缓存..."
rm -rf "$PROJECT_PATH/docs/.vitepress/cache"

log "==================== 部署完成 ===================="
log "访问地址: http://your-domain.com"
log ""

# 显示最新提交信息
log "最新提交:"
git log -1 --pretty=format:"%h - %an, %ar : %s"
echo ""
