/**
 * Webhook 服务器
 * 接收 GitHub 推送通知，自动拉取代码并构建部署
 */

const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// 配置
const CONFIG = {
  port: process.env.WEBHOOK_PORT || 3000,
  secret: process.env.WEBHOOK_SECRET || "your-webhook-secret",
  projectPath: process.env.PROJECT_PATH || "/var/www/blog",
  logPath: process.env.LOG_PATH || "/var/log/blog-deploy.log",
};

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(CONFIG.logPath, logMessage);
}

// 验证 Webhook 签名
function verifySignature(req) {
  const signature = req.headers["x-webhook-secret"];
  return signature === CONFIG.secret;
}

// 执行命令
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log(`执行: ${description}`);
    exec(command, { cwd: CONFIG.projectPath }, (error, stdout, stderr) => {
      if (error) {
        log(`❌ 错误: ${error.message}`);
        log(`stderr: ${stderr}`);
        reject(error);
        return;
      }
      if (stdout) log(`输出: ${stdout}`);
      if (stderr) log(`stderr: ${stderr}`);
      log(`✅ 完成: ${description}`);
      resolve(stdout);
    });
  });
}

// 部署流程
async function deploy() {
  try {
    log("==================== 开始部署 ====================");

    // 1. 拉取最新代码
    await runCommand("git fetch origin main", "获取远程更新");
    await runCommand("git reset --hard origin/main", "重置到最新版本");

    // 2. 安装依赖（如有更新）
    await runCommand("npm ci", "安装依赖");

    // 3. 生成侧边栏
    await runCommand("npm run update:sidebar", "生成侧边栏");

    // 4. 构建项目
    await runCommand("npm run docs:build", "构建 VitePress");

    // 5. 部署到 nginx 目录（可选）
    const distPath = path.join(CONFIG.projectPath, "docs/.vitepress/dist");
    const nginxPath = "/var/www/html/blog";
    await runCommand(
      `rsync -av --delete ${distPath}/ ${nginxPath}/`,
      "同步到 Nginx"
    );

    // 6. 重启服务
    await runCommand("sudo nginx -s reload", "重载 Nginx");

    log("==================== 部署完成 ====================");
    return { success: true, message: "部署成功" };
  } catch (error) {
    log(`==================== 部署失败 ====================`);
    log(`错误: ${error.message}`);
    return { success: false, message: error.message };
  }
}

// Webhook 端点
app.post("/webhook", async (req, res) => {
  log("收到 Webhook 请求");

  // 验证签名
  if (!verifySignature(req)) {
    log("❌ 签名验证失败");
    return res.status(401).json({ error: "未授权" });
  }

  const { repository, branch, commit, author, message } = req.body;
  log(`仓库: ${repository}`);
  log(`分支: ${branch}`);
  log(`提交: ${commit}`);
  log(`作者: ${author}`);
  log(`消息: ${message}`);

  // 立即响应，避免 GitHub 超时
  res.json({ message: "已接收，开始部署" });

  // 异步执行部署
  deploy().catch((error) => {
    log(`部署过程中出错: ${error.message}`);
  });
});

// 健康检查端点
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    project: CONFIG.projectPath,
  });
});

// 手动触发部署端点
app.post("/deploy", async (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).json({ error: "未授权" });
  }

  log("手动触发部署");
  const result = await deploy();
  res.json(result);
});

// 启动服务器
app.listen(CONFIG.port, () => {
  log(`🚀 Webhook 服务器启动在端口 ${CONFIG.port}`);
  log(`项目路径: ${CONFIG.projectPath}`);
  log(`日志路径: ${CONFIG.logPath}`);
});

// 错误处理
process.on("uncaughtException", (error) => {
  log(`未捕获的异常: ${error.message}`);
  log(error.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  log(`未处理的 Promise 拒绝: ${reason}`);
});
