/**
 * 自动生成侧边栏配置脚本
 * 扫描 docs/notes 目录，自动生成 VitePress 侧边栏配置
 *
 * 使用方法：
 * node scripts/generate-sidebar.js
 */

const fs = require("fs");
const path = require("path");

// 配置：分类名称映射（可选，用于自定义显示名称）
const categoryNames = {
  frontend: "前端开发",
  backend: "后端开发",
  algorithms: "算法与数据结构",
  database: "数据库",
  devops: "DevOps",
  "design-patterns": "设计模式",
  tools: "工具与效率",
  "computer-science": "计算机科学",
  test: "测试分类", // 测试用
  // 在这里添加更多映射...
};

// 从文件名生成友好的标题
function generateTitle(filename) {
  // 移除 .md 扩展名
  let title = filename.replace(/\.md$/, "");

  // 将短横线和下划线转为空格
  title = title.replace(/[-_]/g, " ");

  // 首字母大写
  title = title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return title;
}

// 从文件内容中提取一级标题
function extractTitleFromContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^#\s+(.+)$/m);
    if (match) {
      return match[1].trim();
    }
  } catch (err) {
    console.warn(`警告: 无法读取文件 ${filePath}`);
  }
  return null;
}

// 扫描目录并生成侧边栏配置
function generateSidebar(notesDir) {
  const sidebar = [];

  // 读取 notes 目录下的所有文件夹
  const categories = fs.readdirSync(notesDir).filter((item) => {
    const fullPath = path.join(notesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  // 按字母顺序排序分类
  categories.sort();

  categories.forEach((category) => {
    const categoryPath = path.join(notesDir, category);
    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".md") && file !== "index.md");

    if (files.length === 0) {
      console.log(`⚠️  分类 "${category}" 下没有笔记文件，跳过`);
      return;
    }

    // 按文件名排序
    files.sort();

    const items = files.map((file) => {
      const filePath = path.join(categoryPath, file);
      const filename = file.replace(/\.md$/, "");

      // 优先使用文件内容中的标题，否则使用文件名生成
      const title = extractTitleFromContent(filePath) || generateTitle(file);

      return {
        text: title,
        link: `/notes/${category}/${filename}`,
      };
    });

    // 获取分类的显示名称
    const categoryText = categoryNames[category] || generateTitle(category);

    sidebar.push({
      text: categoryText,
      collapsed: false,
      items: items,
    });

    console.log(`✅ 分类 "${categoryText}" - ${items.length} 篇笔记`);
  });

  return sidebar;
}

// 更新配置文件
function updateConfig(sidebar) {
  const configPath = path.join(
    __dirname,
    "..",
    "docs",
    ".vitepress",
    "config.mts"
  );
  let config = fs.readFileSync(configPath, "utf-8");

  // 格式化侧边栏配置为字符串
  let sidebarStr;
  if (sidebar.length === 0) {
    // 如果没有分类，使用空数组和注释
    sidebarStr = `[
        // 这里添加你的笔记分类
      ]`;
  } else {
    sidebarStr = JSON.stringify(sidebar, null, 6)
      .replace(/"text":/g, "text:")
      .replace(/"link":/g, "link:")
      .replace(/"collapsed":/g, "collapsed:")
      .replace(/"items":/g, "items:")
      .replace(/"/g, "'");
  }

  // 替换 sidebar 配置
  const sidebarRegex = /sidebar:\s*{[\s\S]*?"\/"\s*:\s*\[[\s\S]*?\],[\s\S]*?},/;
  const newSidebarConfig = `sidebar: {
      "/": ${sidebarStr},
    },`;

  if (sidebarRegex.test(config)) {
    config = config.replace(sidebarRegex, newSidebarConfig);
  } else {
    console.error("❌ 无法找到 sidebar 配置位置");
    return false;
  }

  fs.writeFileSync(configPath, config, "utf-8");
  return true;
}

// 主函数
function main() {
  console.log("🚀 开始生成侧边栏配置...\n");

  const notesDir = path.join(__dirname, "..", "docs", "notes");

  if (!fs.existsSync(notesDir)) {
    console.error("❌ notes 目录不存在");
    process.exit(1);
  }

  const sidebar = generateSidebar(notesDir);

  console.log("\n📝 更新配置文件...");
  if (updateConfig(sidebar)) {
    if (sidebar.length === 0) {
      console.log("✅ 配置文件已清空");
      console.log("💡 提示: 在 docs/notes/ 下创建文件夹并添加 .md 文件");
    } else {
      console.log("✅ 配置文件更新成功！\n");
      console.log("📊 统计信息:");
      console.log(`   - 分类数量: ${sidebar.length}`);
      const totalNotes = sidebar.reduce(
        (sum, cat) => sum + cat.items.length,
        0
      );
      console.log(`   - 笔记总数: ${totalNotes}`);
      console.log("\n🎉 完成！刷新浏览器查看效果。");
    }
  } else {
    console.error("❌ 配置文件更新失败");
    process.exit(1);
  }
}

// 运行
main();
