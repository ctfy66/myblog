/**
 * 清理 Notion 导出文件的脚本
 * 修复常见的 Markdown 格式问题
 *
 * 使用方法：
 * node scripts/fix-notion-files.js <目录路径>
 * 例如：node scripts/fix-notion-files.js docs/notes/leetcode
 */

const fs = require("fs");
const path = require("path");

// 清理文件名：移除 Notion ID
function cleanFileName(filename) {
  // 移除 Notion 的 32 位 ID (例如：0f0657e805d0485eb2ca2753d4937b47)
  let cleaned = filename.replace(/\s+[a-f0-9]{32}(\.md)?$/, ".md");

  // 转换中文到拼音或英文（这里简单处理，你可以根据需要调整）
  const nameMap = {
    刷题笔记: "leetcode-notes",
    算法笔记: "algorithm-notes",
    面试题: "interview-questions",
    // 添加更多映射...
  };

  for (const [chinese, english] of Object.entries(nameMap)) {
    if (cleaned.includes(chinese)) {
      cleaned = english + ".md";
      break;
    }
  }

  // 如果还有中文，转为拼音或提示
  if (/[\u4e00-\u9fa5]/.test(cleaned)) {
    console.log(`⚠️  警告: 文件名包含中文: ${cleaned}`);
    console.log(`   建议手动重命名为英文`);
  }

  return cleaned;
}

// 修复 Markdown 内容
function fixMarkdownContent(content) {
  let fixed = content;

  // 1. 修复代码块中的空行问题（Notion 导出常见问题）
  fixed = fixed.replace(
    /```(\w+)\s*\n\s*\n([\s\S]*?)```/g,
    (match, lang, code) => {
      // 移除代码块开始后的多余空行
      const cleanCode = code
        .split("\n")
        .map((line) => line.trimEnd()) // 移除行尾空格
        .join("\n")
        .replace(/^\n+/, "") // 移除开头的空行
        .replace(/\n+$/, "\n"); // 移除结尾多余的空行，保留一个
      return "```" + lang + "\n" + cleanCode + "```";
    }
  );

  // 2. 修复 HTML 标签问题
  // 转义小于号（避免被识别为 HTML 标签）
  fixed = fixed.replace(/^(\s*)(if|for|while).*<(?![\s\S]*>)/gm, (match) => {
    return match.replace(/</g, "&lt;");
  });

  // 3. 修复代码块中的尖括号
  fixed = fixed.replace(/```[\s\S]*?```/g, (codeBlock) => {
    // 在代码块内部，确保尖括号不被解析为 HTML
    return codeBlock;
  });

  // 4. 移除 Notion 的 [Untitled] 标记
  fixed = fixed.replace(/\[Untitled\]/g, "");

  // 5. 修复没有空格的标题
  fixed = fixed
    .split("\n")
    .map((line) => {
      if (/^#{1,6}[^#\s]/.test(line)) {
        return line.replace(/^(#{1,6})/, "$1 ");
      }
      return line;
    })
    .join("\n");

  // 6. 移除 Notion 数据库属性块
  fixed = fixed.replace(/^---\n[\s\S]*?\n---\n/m, "");

  // 7. 修复图片路径
  fixed = fixed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
    if (!imgPath.startsWith("http")) {
      const cleanPath = imgPath.replace(/^\.\//, "");
      return `![${alt}](${cleanPath})`;
    }
    return match;
  });

  return fixed;
}

// 处理单个文件
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const fixed = fixMarkdownContent(content);

    // 检查是否需要重命名
    const dir = path.dirname(filePath);
    const oldName = path.basename(filePath);
    const newName = cleanFileName(oldName);

    if (oldName !== newName) {
      const newPath = path.join(dir, newName);

      // 写入修复后的内容到新文件
      fs.writeFileSync(newPath, fixed, "utf-8");

      // 删除旧文件
      fs.unlinkSync(filePath);

      console.log(`✅ ${oldName}`);
      console.log(`   → ${newName}`);
      return newName;
    } else {
      // 只更新内容
      fs.writeFileSync(filePath, fixed, "utf-8");
      console.log(`✅ 修复内容: ${oldName}`);
      return oldName;
    }
  } catch (err) {
    console.error(`❌ 处理失败: ${filePath}`);
    console.error(`   错误: ${err.message}`);
    return null;
  }
}

// 处理目录
function processDirectory(dirPath) {
  console.log(`\n📁 处理目录: ${dirPath}\n`);

  if (!fs.existsSync(dirPath)) {
    console.error(`❌ 目录不存在: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  let count = 0;

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归处理子目录
      processDirectory(fullPath);
    } else if (file.endsWith(".md")) {
      const result = processFile(fullPath);
      if (result) count++;
    }
  });

  return count;
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("❌ 用法: node fix-notion-files.js <目录路径>");
    console.log("示例: node scripts/fix-notion-files.js docs/notes/leetcode");
    process.exit(1);
  }

  const targetDir = args[0];

  console.log("🔧 开始修复 Notion 导出文件...");

  const count = processDirectory(targetDir);

  console.log("\n🎉 完成！");
  console.log(`📊 共处理 ${count} 个文件`);
  console.log("\n💡 下一步:");
  console.log("   1. 运行: npm run update:sidebar");
  console.log("   2. 刷新浏览器查看效果");
}

main();
