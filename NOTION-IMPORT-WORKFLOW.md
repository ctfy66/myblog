# 🚀 从 Notion 导入笔记 - 完整工作流

## 快速开始（推荐流程）

### 步骤 1：从 Notion 导出

1. 在 Notion 中打开要导出的页面
2. 点击右上角 `···` → `Export`
3. 选择 **Markdown & CSV**
4. 勾选 `Include subpages`（如果需要）
5. 点击 `Export`，下载 zip 文件
6. 解压到临时文件夹（如 `D:\notion-export`）

### 步骤 2：复制文件到对应分类

```bash
# 创建分类文件夹（如果还不存在）
mkdir docs\notes\你的分类名

# 复制 Notion 导出的 .md 文件
# 将解压后的 .md 文件复制到 docs\notes\你的分类名\
```

### 步骤 3：修复 Notion 格式问题

```bash
npm run fix:notion docs/notes/你的分类名
```

这个命令会：

- ✅ 移除文件名中的 Notion ID
- ✅ 修复 HTML 标签问题
- ✅ 修复标题格式
- ✅ 清理 Notion 特殊标记
- ✅ 修复图片路径

### 步骤 4：更新侧边栏

```bash
npm run update:sidebar
```

### 步骤 5：刷新浏览器查看效果 🎉

## 完整示例

假设你要导入 LeetCode 刷题笔记：

```bash
# 1. 创建分类
mkdir docs\notes\leetcode

# 2. 复制 Notion 导出的文件到这个文件夹
# （手动复制或使用文件管理器）

# 3. 修复文件
npm run fix:notion docs/notes/leetcode

# 4. 更新侧边栏
npm run update:sidebar

# 5. 完成！在浏览器中查看
```

输出示例：

```
🔧 开始修复 Notion 导出文件...

📁 处理目录: docs/notes/leetcode

✅ 刷题笔记 0f0657e805d0485eb2ca2753d4937b47.md
   → leetcode-notes.md

🎉 完成！
📊 共处理 1 个文件
```

## 常见问题

### 问题 1：文件名包含中文

**现象**：文件名是中文，如 `刷题笔记.md`

**解决**：编辑 `scripts/fix-notion-files.js` 中的 `nameMap`：

```javascript
const nameMap = {
  刷题笔记: "leetcode-notes",
  你的中文名: "英文名",
  // 添加更多映射...
};
```

然后重新运行 `npm run fix:notion`

### 问题 2：仍然有 HTML 标签错误

**现象**：修复后仍然报 "Element is missing end tag"

**原因**：Markdown 中有未闭合的尖括号 `<`

**手动修复**：

1. 打开报错的文件
2. 找到错误行（错误信息会显示行号）
3. 将 `<` 替换为 `&lt;` 或添加反引号包裹

**示例**：

```markdown
// 错误
if (root < target) {

// 修复方法 1：使用 HTML 实体
if (root &lt; target) {

// 修复方法 2：使用代码块
`if (root < target) {`
```

### 问题 3：图片不显示

**解决方法 1**：将图片放到 `docs/public/images/`

```bash
mkdir docs\public\images
# 复制图片到这个文件夹
```

然后修改 Markdown 中的图片路径：

```markdown
![图片](../images/pic.png)
```

**解决方法 2**：使用绝对路径

```markdown
![图片](/images/pic.png)
```

### 问题 4：代码块格式错乱

**原因**：Notion 导出的代码块可能缺少语言标识

**修复**：手动添加语言标识

```markdown
// 修复前
```

代码...

````

// 修复后
```javascript
代码...
````

````

## 批量导入多个笔记

### 方法 1：一次导出所有笔记

1. 在 Notion 中导出整个页面（包含所有子页面）
2. 解压后按主题分类
3. 分别复制到不同分类文件夹
4. 批量修复

```bash
# 复制到各个分类
xcopy /E /I D:\notion-export\前端 docs\notes\frontend
xcopy /E /I D:\notion-export\后端 docs\notes\backend

# 批量修复
npm run fix:notion docs/notes/frontend
npm run fix:notion docs/notes/backend

# 更新侧边栏
npm run update:sidebar
````

### 方法 2：按分类导出

1. 在 Notion 中按主题分别导出
2. 逐个处理

```bash
# 第一个分类
mkdir docs\notes\frontend
# 复制文件...
npm run fix:notion docs/notes/frontend

# 第二个分类
mkdir docs\notes\backend
# 复制文件...
npm run fix:notion docs/notes/backend

# 最后更新侧边栏
npm run update:sidebar
```

## 高级用法

### 自定义文件名映射

编辑 `scripts/fix-notion-files.js`，添加更多中文到英文的映射：

```javascript
const nameMap = {
  刷题笔记: "leetcode-notes",
  算法笔记: "algorithm-notes",
  面试题: "interview-questions",
  JavaScript基础: "javascript-basics",
  React入门: "react-intro",
  // 添加你的映射...
};
```

### 自定义分类名称

编辑 `scripts/generate-sidebar.js`，添加分类显示名称：

```javascript
const categoryNames = {
  leetcode: "LeetCode 刷题",
  interview: "面试准备",
  frontend: "前端开发",
  // 添加你的映射...
};
```

## 完整工作流脚本

创建一个批处理文件 `import-all.bat`：

```batch
@echo off
echo 🚀 开始导入 Notion 笔记...
echo.

REM 修复所有分类的文件
for /d %%d in (docs\notes\*) do (
    echo 📝 处理: %%d
    node scripts/fix-notion-files.js "%%d"
    echo.
)

echo 🔄 更新侧边栏...
call npm run update:sidebar

echo.
echo ✅ 全部完成！
pause
```

然后直接运行 `import-all.bat`

## 检查清单

导入后检查：

- [ ] 所有文件名都是英文
- [ ] 没有 Notion ID（32 位字符串）
- [ ] 图片能正常显示
- [ ] 代码块有语言标识
- [ ] 标题格式正确（`#` 后有空格）
- [ ] 左侧导航栏显示正确
- [ ] 右侧目录生成正确
- [ ] 没有 HTML 标签错误

## 需要帮助？

如果遇到其他问题：

1. 查看错误信息中的文件名和行号
2. 手动打开文件检查该行
3. 修复格式问题
4. 重新运行 `npm run update:sidebar`

---

💡 **小技巧**：第一次导入时，建议先导入一两篇笔记测试，确认没问题后再批量导入。
