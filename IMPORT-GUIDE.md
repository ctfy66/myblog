# 📥 导入 Notion 笔记指南

## 快速开始

### 步骤 1：从 Notion 导出笔记

1. 在 Notion 中打开要导出的页面
2. 点击右上角 `···` → `Export`
3. 选择格式：**Markdown & CSV**
4. 勾选 `Include subpages`（如果需要）
5. 点击 `Export` 下载 zip 文件
6. 解压到任意位置（比如 `D:\notion-export`）

### 步骤 2：运行导入脚本

在博客目录下打开终端，运行：

```bash
# 导入到前端分类
node scripts/import-notion.js D:\notion-export frontend

# 导入到后端分类
node scripts/import-notion.js D:\notion-export backend

# 导入到算法分类
node scripts/import-notion.js D:\notion-export algorithms
```

### 步骤 3：更新侧边栏配置

导入后，需要在 `docs/.vitepress/config.mts` 中添加新文章到侧边栏。

例如，导入了 `typescript-advanced.md`，在配置文件中添加：

```typescript
{
  text: "前端开发",
  items: [
    // ... 现有文章
    { text: "TypeScript 进阶", link: "/notes/frontend/typescript-advanced" }
  ]
}
```

## 手动导入（如果脚本不适用）

### 简单 3 步：

1. **复制文件**

   - 将 `.md` 文件复制到 `docs/notes/分类名/`
   - 将图片复制到相应位置

2. **调整文件名**

   - 建议使用英文短横线命名：`my-article.md`
   - 避免空格和特殊字符

3. **修复内容**
   - 检查图片路径是否正确
   - 检查标题格式（`# 标题` 需要有空格）
   - 移除 Notion 特有的标记

## Notion 导出常见问题

### 问题 1：图片不显示

**原因**：Notion 导出的图片路径可能不正确

**解决**：

- 将图片放在 `docs/public/images/` 文件夹
- 修改 Markdown 中的图片路径为 `/images/图片名.png`

### 问题 2：文件名太长或有特殊字符

**原因**：Notion 会在文件名后加上 32 位 ID

**解决**：重命名文件，去掉 ID 部分

- 原始：`我的笔记 a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.md`
- 改为：`my-note.md`

### 问题 3：标题格式错误

**原因**：Notion 导出的标题可能缺少空格

**解决**：确保标题格式正确

```markdown
# 正确格式（# 后有空格）

## 二级标题

#错误格式（没有空格）
```

## 批量导入多个笔记

如果有很多笔记要导入：

1. **按主题分批导出**

   - 前端相关的笔记 → 导出为 `frontend-notes.zip`
   - 后端相关的笔记 → 导出为 `backend-notes.zip`

2. **分别解压到不同文件夹**

   ```
   D:\imports\
   ├── frontend\
   ├── backend\
   └── algorithms\
   ```

3. **分批运行导入脚本**
   ```bash
   node scripts/import-notion.js D:\imports\frontend frontend
   node scripts/import-notion.js D:\imports\backend backend
   node scripts/import-notion.js D:\imports\algorithms algorithms
   ```

## 创建新分类

如果想创建新的分类（比如"数据库"）：

1. **创建文件夹**

   ```bash
   mkdir docs\notes\database
   ```

2. **导入笔记**

   ```bash
   node scripts/import-notion.js D:\notion-export database
   ```

3. **在配置中添加新分类**
   编辑 `docs/.vitepress/config.mts`：
   ```typescript
   {
     text: "数据库",
     collapsed: false,
     items: [
       { text: "MySQL 基础", link: "/notes/database/mysql-basics" },
       { text: "Redis 入门", link: "/notes/database/redis-intro" }
     ]
   }
   ```

## 需要帮助？

如果你遇到问题，可以：

1. 把 Notion 导出的文件发给我看看
2. 告诉我文件的具体结构
3. 我可以帮你手动处理或调整脚本

---

💡 **提示**：第一次导入建议先用一两篇笔记测试，确认效果后再批量导入。
