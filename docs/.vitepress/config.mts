import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "我的博客",
  description: "个人技术笔记",
  lang: "zh-CN",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "GitHub", link: "https://github.com/yourusername" },
    ],

    sidebar: {
      "/": [
        {
          text: "Leetcode",
          collapsed: false,
          items: [
            {
              text: "刷题笔记",
              link: "/notes/leetcode/leetcode-notes",
            },
          ],
        },
      ],
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
