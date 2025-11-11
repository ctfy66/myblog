/**
 * PM2 配置文件
 * 用于管理 Webhook 服务器进程
 */

module.exports = {
  apps: [
    {
      name: "blog-webhook",
      script: "./webhook-server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        WEBHOOK_PORT: 3000,
        WEBHOOK_SECRET: "your-webhook-secret-here",
        PROJECT_PATH: "/var/www/blog",
        LOG_PATH: "/var/log/blog-deploy.log",
      },
      error_file: "/var/log/blog-webhook-error.log",
      out_file: "/var/log/blog-webhook-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
