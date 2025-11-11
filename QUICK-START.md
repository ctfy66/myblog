# 🎯 一键导入 Notion 笔记

## 最简单的方法

只需要一条命令！

```bash
npm run import <你的Notion导出文件>
```

## 使用步骤

### 1. 从 Notion 导出

- 在 Notion 中导出页面（Markdown & CSV 格式）
- 下载 zip 文件到任意位置（比如桌面或下载文件夹）

### 2. 运行导入命令

```bash
# 方式 1：直接导入 zip 文件（推荐）
npm run import D:\Downloads\notion-export.zip

# 方式 2：解压后导入文件夹
npm run import D:\Downloads\notion-export
```

### 3. 完成！

脚本会自动：

- ✅ 解压 zip 文件（如果需要）
- ✅ 智能识别分类
- ✅ 清理文件名（移除 Notion ID）
- ✅ 修复格式问题
- ✅ 创建分类文件夹
- ✅ 复制并处理所有文件
- ✅ 更新侧边栏配置
- ✅ 清理临时文件

刷新浏览器就能看到你的笔记！

## 示例

```bash
# 导入 LeetCode 笔记
npm run import D:\Desktop\leetcode-notes.zip

# 导入所有笔记
npm run import D:\Downloads\我的笔记.zip
```

输出示例：

```
🚀 Notion 笔记一键导入工具

📦 检测到 zip 文件，开始解压...
✅ 解压完成: D:\...\notion-temp-xxx

📝 开始处理文件...

📁 创建分类: leetcode
  ✅ 刷题笔记 0f0657e805d0485eb2ca2753d4937b47.md → leetcode-notes.md

✨ 文件处理完成！
📊 统计: 1 个分类, 1 个文件

🔄 更新侧边栏配置...
✅ 配置文件更新成功！

🎉 全部完成！
💡 刷新浏览器查看效果
🧹 已清理临时文件
```

## 智能识别

脚本会自动识别笔记的分类：

| Notion 文件夹名    | 识别为分类 |
| ------------------ | ---------- |
| LeetCode、刷题     | leetcode   |
| 前端、React、Vue   | frontend   |
| 后端、Python、Java | backend    |
| 算法               | algorithms |
| 数据库             | database   |
| 面试               | interview  |
| ...                | ...        |

如果无法识别，会使用文件夹名创建新分类。

## 自定义映射

编辑 `scripts/auto-import.js` 添加你的分类映射：

```javascript
const categoryMap = {
  你的中文名: "english-name",
  // 添加更多...
};
```

## 对比传统方式

### 传统方式（麻烦）：

```bash
# 1. 解压 zip
# 2. 手动创建文件夹
mkdir docs\notes\leetcode
# 3. 复制文件
# 4. 修复格式
npm run fix:notion docs/notes/leetcode
# 5. 更新侧边栏
npm run update:sidebar
```

### 现在（简单）：

```bash
npm run import D:\Downloads\notion-export.zip
```

一条命令搞定！✨

## 常见问题

### Q: 分类识别错误怎么办？

A: 可以手动移动文件到正确的分类文件夹，然后运行：

```bash
npm run update:sidebar
```

### Q: 支持批量导入吗？

A: 支持！把所有笔记放在一个 Notion 页面下，一起导出即可。

### Q: 可以重复导入吗？

A: 可以，但会覆盖同名文件。建议先备份。

### Q: zip 解压失败？

A: 手动解压后，直接导入文件夹：

```bash
npm run import D:\Downloads\解压后的文件夹
```

---

💡 **提示**：第一次使用建议先导入一两篇笔记测试，确认效果后再批量导入。
