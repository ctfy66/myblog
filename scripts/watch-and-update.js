/**
 * 文件监听脚本 - 自动更新侧边栏
 * 监听 docs/notes 目录的变化，自动重新生成侧边栏配置
 *
 * 使用方法：
 * node scripts/watch-and-update.js
 *
 * 或在开发时同时运行：
 * npm run docs:dev (一个终端)
 * node scripts/watch-and-update.js (另一个终端)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const notesDir = path.join(__dirname, "..", "docs", "notes");

console.log("👀 开始监听 notes 目录变化...");
console.log(`📁 监听路径: ${notesDir}\n`);

let isUpdating = false;

// 更新侧边栏配置的函数
function updateSidebar() {
  if (isUpdating) return;

  isUpdating = true;
  console.log("\n🔄 检测到文件变化，重新生成侧边栏...");

  try {
    execSync("node scripts/generate-sidebar.js", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
  } catch (err) {
    console.error("❌ 更新失败:", err.message);
  }

  // 防抖：等待1秒后才允许下次更新
  setTimeout(() => {
    isUpdating = false;
  }, 1000);
}

// 监听目录变化
fs.watch(notesDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;

  // 只关注 .md 文件的变化
  if (filename.endsWith(".md")) {
    console.log(`📝 文件变化: ${filename}`);
    updateSidebar();
  }

  // 关注文件夹的创建和删除
  if (eventType === "rename") {
    const fullPath = path.join(notesDir, filename);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`📁 文件夹变化: ${filename}`);
        updateSidebar();
      }
    } catch (err) {
      // 文件/文件夹被删除
      console.log(`🗑️  删除: ${filename}`);
      updateSidebar();
    }
  }
});

console.log("✅ 监听已启动");
console.log("💡 提示: 在 docs/notes/ 下添加/删除文件或文件夹，配置会自动更新");
console.log("⏹️  按 Ctrl+C 停止监听\n");

// 初始化时运行一次
updateSidebar();
