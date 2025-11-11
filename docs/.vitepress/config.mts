import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { defineConfig } from "vitepress";

// 动态生成侧边栏配置
function generateSidebar() {
  const notesDir = join(__dirname, "..", "notes");
  const sidebar: any[] = [];

  try {
    // 读取 notes 目录下的所有文件夹
    const categories = readdirSync(notesDir).filter((item) => {
      const fullPath = join(notesDir, item);
      return statSync(fullPath).isDirectory();
    });

    categories.sort();

    categories.forEach((category) => {
      const categoryPath = join(notesDir, category);
      const files = readdirSync(categoryPath)
        .filter((file) => file.endsWith(".md") && file !== "index.md")
        .sort();

      if (files.length === 0) return;

      const items = files.map((file) => {
        const filePath = join(categoryPath, file);
        const filename = file.replace(/\.md$/, "");

        // 尝试从文件中提取标题
        let title = filename;
        try {
          const content = readFileSync(filePath, "utf-8");
          const match = content.match(/^#\s+(.+)$/m);
          if (match) title = match[1].trim();
        } catch (err) {}

        return {
          text: title,
          link: `/notes/${category}/${filename}`,
        };
      });

      // 格式化分类名称
      const categoryText = category
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      sidebar.push({
        text: categoryText,
        collapsed: false,
        items: items,
      });
    });
  } catch (err) {
    console.error("生成侧边栏失败:", err);
  }

  return sidebar;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "我的博客",
  description: "个人技术笔记",
  lang: "zh-CN",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "GitHub", link: "https://github.com/ctfy66" },
    ],

    sidebar: {
      "/": generateSidebar(),
    },

    outline: {
      level: [2, 3],
      label: "目录",
    },

    socialLinks: [],

    footer: {
      message: "基于 VitePress 构建",
      copyright: "Copyright © 2025",
    },
  },

  // 自定义 head 标签
  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
  ],
});
