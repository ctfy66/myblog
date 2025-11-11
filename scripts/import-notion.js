/**
 * Notion 笔记导入脚本
 * 用法：node scripts/import-notion.js <notion-export-folder> <target-category>
 *
 * 示例：
 * node scripts/import-notion.js ./notion-export frontend
 * node scripts/import-notion.js ./notion-export backend
 * node scripts/import-notion.js ./notion-export algorithms
 */

const fs = require("fs");
const path = require("path");

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(
    "❌ 用法: node import-notion.js <notion-export-folder> <target-category>"
  );
  console.log("示例: node import-notion.js ./notion-export frontend");
  process.exit(1);
}

const [sourceFolder, category] = args;
const targetFolder = path.join(__dirname, "..", "docs", "notes", category);

// 检查源文件夹是否存在
if (!fs.existsSync(sourceFolder)) {
  console.log(`❌ 源文件夹不存在: ${sourceFolder}`);
  process.exit(1);
}

// 创建目标文件夹（如果不存在）
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
  console.log(`✅ 创建目标文件夹: ${targetFolder}`);
}

// 处理 Notion 导出的 Markdown 文件
function processNotionMarkdown(content) {
  // 1. 移除 Notion 的特殊标记
  content = content.replace(/\[Untitled\]/g, "");

  // 2. 修复图片路径
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imgPath) => {
      // 如果是相对路径，保持相对路径
      if (!imgPath.startsWith("http")) {
        // 确保图片路径正确
        const cleanPath = imgPath.replace(/^\.\//, "");
        return `![${alt}](${cleanPath})`;
      }
      return match;
    }
  );

  // 3. 修复标题格式（Notion 有时会导出奇怪的标题）
  content = content
    .split("\n")
    .map((line) => {
      // 修复没有空格的标题
      if (/^#{1,6}[^#\s]/.test(line)) {
        return line.replace(/^(#{1,6})/, "$1 ");
      }
      return line;
    })
    .join("\n");

  // 4. 移除 Notion 的数据库属性块
  content = content.replace(/---\n[\s\S]*?\n---\n/, "");

  return content;
}

// 复制文件并处理
function copyFiles(source, target) {
  const files = fs.readdirSync(source);
  let count = 0;

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      // 递归处理子文件夹
      const newTarget = path.join(target, file);
      if (!fs.existsSync(newTarget)) {
        fs.mkdirSync(newTarget, { recursive: true });
      }
      count += copyFiles(sourcePath, newTarget);
    } else if (file.endsWith(".md")) {
      // 处理 Markdown 文件
      let content = fs.readFileSync(sourcePath, "utf-8");
      content = processNotionMarkdown(content);

      // 清理文件名（移除 Notion 的 ID）
      let cleanFileName = file
        .replace(/\s+[a-f0-9]{32}\.md$/, ".md") // 移除 Notion ID
        .replace(/\s+/g, "-") // 空格转为短横线
        .toLowerCase();

      const targetPath = path.join(target, cleanFileName);
      fs.writeFileSync(targetPath, content, "utf-8");
      console.log(`✅ 导入: ${cleanFileName}`);
      count++;
    } else if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file)) {
      // 复制图片文件
      const targetPath = path.join(target, file);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`📷 复制图片: ${file}`);
    }
  });

  return count;
}

// 开始导入
console.log("🚀 开始导入 Notion 笔记...");
console.log(`📁 源文件夹: ${sourceFolder}`);
console.log(`📁 目标文件夹: ${targetFolder}`);
console.log("");

const importedCount = copyFiles(sourceFolder, targetFolder);

console.log("");
console.log(`✨ 导入完成！共导入 ${importedCount} 个文件`);
console.log("");
console.log("📝 下一步:");
console.log("1. 检查导入的文件是否正确");
console.log("2. 在 docs/.vitepress/config.mts 中添加新文章到侧边栏");
console.log("3. 运行 npm run docs:dev 预览效果");
