#!/bin/bash

# 自动部署测试脚本
# 用于本地测试部署流程

echo "🧪 博客部署测试脚本"
echo "===================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 测试函数
test_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 已安装"
        return 0
    else
        echo -e "${RED}✗${NC} $1 未安装"
        return 1
    fi
}

echo ""
echo "📦 检查依赖..."
test_command "node"
test_command "npm"
test_command "git"

echo ""
echo "📁 检查项目结构..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json 存在"
else
    echo -e "${RED}✗${NC} package.json 不存在"
fi

if [ -d "docs" ]; then
    echo -e "${GREEN}✓${NC} docs 目录存在"
else
    echo -e "${RED}✗${NC} docs 目录不存在"
fi

echo ""
echo "🔧 检查配置文件..."
if [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${GREEN}✓${NC} GitHub Actions 配置存在"
else
    echo -e "${YELLOW}!${NC} GitHub Actions 配置不存在"
fi

if [ -d "server" ]; then
    echo -e "${GREEN}✓${NC} server 目录存在"
    if [ -f "server/webhook-server.js" ]; then
        echo -e "${GREEN}✓${NC} Webhook 服务器存在"
    fi
else
    echo -e "${YELLOW}!${NC} server 目录不存在"
fi

echo ""
echo "🏗️  尝试构建项目..."
if npm run docs:build; then
    echo -e "${GREEN}✓${NC} 构建成功"
    
    if [ -d "docs/.vitepress/dist" ]; then
        file_count=$(find docs/.vitepress/dist -type f | wc -l)
        echo -e "${GREEN}✓${NC} 生成了 $file_count 个文件"
    fi
else
    echo -e "${RED}✗${NC} 构建失败"
fi

echo ""
echo "📊 项目信息："
echo "  - Node 版本: $(node --version)"
echo "  - npm 版本: $(npm --version)"
if [ -f "package.json" ]; then
    echo "  - 项目名称: $(grep '"name"' package.json | head -1 | cut -d'"' -f4)"
fi

echo ""
echo "===================="
echo "✅ 测试完成！"
echo ""
echo "下一步："
echo "  1. 确保所有依赖已安装"
echo "  2. 配置 GitHub Secrets"
echo "  3. 推送代码触发自动部署"
echo ""
echo "详细说明请查看: DEPLOYMENT.md"
