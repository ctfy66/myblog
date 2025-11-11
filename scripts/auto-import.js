/**
 * 一键导入 Notion 笔记 - 完全自动化
 *
 * 使用方法：
 * node scripts/auto-import.js <Notion导出的zip文件路径或解压后的文件夹>
 *
 * 示例：
 * node scripts/auto-import.js D:\Downloads\notion-export.zip
 * node scripts/auto-import.js D:\Downloads\notion-export
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 分类名称映射（中文 -> 英文）
const categoryMap = {
  前端: "frontend",
  后端: "backend",
  算法: "algorithms",
  数据库: "database",
  LeetCode: "leetcode",
  刷题: "leetcode",
  面试: "interview",
  计算机基础: "computer-science",
  网络: "network",
  操作系统: "operating-system",
  设计模式: "design-patterns",
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  React: "react",
  Vue: "vue",
  Node: "nodejs",
  // 添加更多映射...
};

// 文件名映射
const filenameMap = {
  刷题笔记: "leetcode-notes",
  算法笔记: "algorithm-notes",
  面试题: "interview-questions",
  // 添加更多映射...
};

// 清理文件名
function cleanFileName(filename) {
  // 移除 Notion ID
  let cleaned = filename.replace(/\s+[a-f0-9]{32}(\.md)?$/, ".md");

  // 应用文件名映射
  for (const [chinese, english] of Object.entries(filenameMap)) {
    if (cleaned.includes(chinese)) {
      return english + ".md";
    }
  }

  // 转换空格和特殊字符
  cleaned = cleaned
    .replace(/\.md$/, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .toLowerCase();

  // 如果有中文，尝试智能转换
  if (/[\u4e00-\u9fa5]/.test(cleaned)) {
    // 简单音译或使用时间戳
    cleaned = `note-${Date.now()}`;
  }

  return cleaned + ".md";
}

// 智能识别分类
function guessCategory(folderName, filePath) {
  const lowerName = folderName.toLowerCase();
  const content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8").toLowerCase()
    : "";

  // 检查文件夹名映射
  for (const [chinese, english] of Object.entries(categoryMap)) {
    if (folderName.includes(chinese) || lowerName.includes(english)) {
      return english;
    }
  }

  // 根据内容关键词判断
  if (content.includes("leetcode") || content.includes("算法题")) {
    return "leetcode";
  }
  if (content.includes("react") || content.includes("vue")) {
    return "frontend";
  }
  if (content.includes("python") || content.includes("java")) {
    return "backend";
  }

  // 默认使用文件夹名（清理后）
  return lowerName.replace(/[^\w-]/g, "-").replace(/^-+|-+$/g, "");
}

// 修复 Markdown 内容
function fixMarkdownContent(content) {
  let fixed = content;

  // 1. 修复代码块中的空行问题（Notion 常见问题）
  fixed = fixed.replace(
    /```(\w+)\s*\n\s*\n([\s\S]*?)```/g,
    (match, lang, code) => {
      // 移除代码块开始后的空行，并清理多余的空行
      const cleanCode = code
        .split("\n")
        .filter(
          (line) =>
            line.trim() !== "" ||
            code.split("\n").filter((l) => l.trim() !== "").length > 0
        )
        .join("\n")
        .replace(/\n{3,}/g, "\n\n"); // 最多保留一个空行
      return "```" + lang + "\n" + cleanCode.trim() + "\n```";
    }
  );

  // 2. 修复行内的尖括号（不在代码块中的）
  const lines = fixed.split("\n");
  const fixedLines = [];
  let inCodeBlock = false;

  for (let line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      fixedLines.push(line);
      continue;
    }

    if (!inCodeBlock && !line.trim().startsWith("`") && !line.includes("`")) {
      // 不在代码块或行内代码中，转义尖括号
      line = line.replace(/([^`])<([^>]*?)(?![^`]*`)/g, "$1&lt;$2");
    }

    fixedLines.push(line);
  }
  fixed = fixedLines.join("\n");

  // 3. 移除 Notion 标记
  fixed = fixed.replace(/\[Untitled\]/g, "");

  // 4. 修复标题
  fixed = fixed
    .split("\n")
    .map((line) => {
      if (/^#{1,6}[^#\s]/.test(line)) {
        return line.replace(/^(#{1,6})/, "$1 ");
      }
      return line;
    })
    .join("\n");

  // 5. 移除属性块
  fixed = fixed.replace(/^---\n[\s\S]*?\n---\n/m, "");

  return fixed;
}

// 处理单个文件
function processFile(sourcePath, targetDir, categoryName) {
  try {
    const content = fs.readFileSync(sourcePath, "utf-8");
    const fixed = fixMarkdownContent(content);

    const originalName = path.basename(sourcePath);
    const newName = cleanFileName(originalName);
    const targetPath = path.join(targetDir, newName);

    fs.writeFileSync(targetPath, fixed, "utf-8");

    console.log(`  ✅ ${originalName} → ${newName}`);
    return true;
  } catch (err) {
    console.error(`  ❌ 失败: ${path.basename(sourcePath)} - ${err.message}`);
    return false;
  }
}

// 解压 zip 文件（如果需要）
function extractZip(zipPath) {
  const extractDir = path.join(
    path.dirname(zipPath),
    "notion-temp-" + Date.now()
  );

  try {
    // 使用 PowerShell 解压（Windows）
    const cmd = `powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}'"`;
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ 解压完成: ${extractDir}`);
    return extractDir;
  } catch (err) {
    console.error("❌ 解压失败，请手动解压后再运行脚本");
    console.error(`   错误: ${err.message}`);
    process.exit(1);
  }
}

// 递归处理目录
function processDirectory(
  sourceDir,
  notesDir,
  processedCategories = new Set()
) {
  const items = fs.readdirSync(sourceDir);
  let stats = { files: 0, categories: 0 };

  for (const item of items) {
    const itemPath = path.join(sourceDir, item);
    const itemStat = fs.statSync(itemPath);

    if (itemStat.isDirectory()) {
      // 递归处理子文件夹
      const subStats = processDirectory(
        itemPath,
        notesDir,
        processedCategories
      );
      stats.files += subStats.files;
      stats.categories += subStats.categories;
    } else if (item.endsWith(".md")) {
      // 找到 Markdown 文件
      const categoryName = guessCategory(path.basename(sourceDir), itemPath);
      const categoryDir = path.join(notesDir, categoryName);

      // 创建分类目录
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        if (!processedCategories.has(categoryName)) {
          console.log(`\n📁 创建分类: ${categoryName}`);
          processedCategories.add(categoryName);
          stats.categories++;
        }
      }

      // 处理文件
      if (processFile(itemPath, categoryDir, categoryName)) {
        stats.files++;
      }
    }
  }

  return stats;
}

// 主函数
function main() {
  console.log("🚀 Notion 笔记一键导入工具\n");

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("❌ 用法: node auto-import.js <zip文件或文件夹路径>");
    console.log("\n示例:");
    console.log(
      "  node scripts/auto-import.js D:\\Downloads\\notion-export.zip"
    );
    console.log("  node scripts/auto-import.js D:\\Downloads\\notion-export");
    process.exit(1);
  }

  let sourcePath = args[0];

  // 检查路径是否存在
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ 路径不存在: ${sourcePath}`);
    process.exit(1);
  }

  // 如果是 zip 文件，先解压
  if (sourcePath.endsWith(".zip")) {
    console.log("📦 检测到 zip 文件，开始解压...\n");
    sourcePath = extractZip(sourcePath);
  }

  const notesDir = path.join(__dirname, "..", "docs", "notes");

  console.log("📝 开始处理文件...");
  const stats = processDirectory(sourcePath, notesDir);

  console.log("\n✨ 文件处理完成！");
  console.log(`📊 统计: ${stats.categories} 个分类, ${stats.files} 个文件\n`);

  // 更新侧边栏
  console.log("🔄 更新侧边栏配置...");
  try {
    execSync("node scripts/generate-sidebar.js", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
  } catch (err) {
    console.error("❌ 更新侧边栏失败");
  }

  console.log("\n🎉 全部完成！");
  console.log("💡 刷新浏览器查看效果");

  // 清理临时文件
  if (sourcePath.includes("notion-temp-")) {
    try {
      fs.rmSync(sourcePath, { recursive: true, force: true });
      console.log("🧹 已清理临时文件");
    } catch (err) {
      // 忽略清理错误
    }
  }
}

main();
