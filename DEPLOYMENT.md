# 部署配置说明

## 概述

本项目已配置 GitHub Actions 自动化部署流程，支持 dev 环境的自动构建、测试和发布。

## 📁 新增文件

### GitHub Actions 配置
- `.github/workflows/dev-deploy.yml` - Dev 环境部署 workflow
- `.github/workflows/README.md` - Workflow 使用文档

### 开发环境配置
- `.cursorrules` - Cursor AI 项目规则
- `.editorconfig` - 编辑器配置（跨编辑器一致性）
- `.vscode/settings.json` - VSCode 工作区设置
- `.vscode/extensions.json` - VSCode 推荐扩展
- `.vscode/launch.json` - VSCode 调试配置
- `.vscode/tasks.json` - VSCode 任务配置

### 更新的文件
- `.gitignore` - 更新忽略规则（保留 .vscode 以共享配置）

## 🚀 GitHub Actions Workflow 功能

### 触发条件
- 推送到 `dev` 分支
- 推送到 `cursor/dev-*` 分支（如当前的 `cursor/dev-deployment-github-runner-c62b`）
- 对 `dev` 分支的 Pull Request
- 手动触发（通过 GitHub UI）

### 工作流程

#### 1️⃣ 构建和测试 (build-and-deploy)
- 多版本测试：Node.js 14.x、16.x、18.x
- 安装依赖（npm ci）
- 构建项目（npm run build）
- 运行测试（npm test --if-present）
- 归档构建产物（仅 Node.js 14.x，保留 7 天）

#### 2️⃣ 发布到 Dev (publish-dev)
仅在推送到 `dev` 分支时执行：
- 发布到 npm（使用 `dev` tag）
- 创建 GitHub Pre-release

## ⚙️ 配置 GitHub Secrets（可选）

要启用完整功能，需要配置以下 Secrets：

### NPM_TOKEN（可选）
用于自动发布包到 npm。

**配置步骤：**
1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → Access Tokens → Generate New Token
3. 选择 "Automation" 类型
4. 复制生成的 token
5. 在 GitHub 仓库中：Settings → Secrets and variables → Actions → New repository secret
6. Name: `NPM_TOKEN`，Value: 粘贴 token

### GITHUB_TOKEN（自动提供）
用于创建 GitHub Release，由 GitHub Actions 自动提供，无需配置。

## 🎯 使用指南

### 手动触发部署

1. 访问 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Dev Deployment** workflow
4. 点击 **Run workflow** 按钮
5. 选择要部署的分支
6. 点击绿色的 **Run workflow** 按钮

### 查看部署状态

1. 在 Actions 页面可以看到所有运行记录
2. 点击具体的运行查看详细日志
3. 在 Summary 页面底部可以下载构建产物（Artifacts）

### 下载构建产物

构建产物会自动上传，保留 7 天：

1. 进入具体的 Actions 运行页面
2. 滚动到 **Artifacts** 部分
3. 下载 `dist-{commit-sha}.zip`

### 安装 dev 版本（配置 NPM_TOKEN 后）

```bash
# 全局安装 dev 版本
npm install ad-create-app@dev --global

# 或使用 yarn
yarn global add ad-create-app@dev

# 使用
ad-create-app create my-project
```

## 🛠️ VSCode 开发环境

### 推荐扩展

打开项目后，VSCode 会提示安装推荐的扩展：

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - TypeScript 支持
- **GitHub Actions** - workflow 语法高亮和验证
- **EditorConfig** - 编辑器配置支持

### 调试配置

按 `F5` 或点击调试面板的启动按钮：

- **Debug CLI** - 调试 CLI 工具（自动运行 `create test-project`）
- **Debug Current TS File** - 调试当前打开的 TypeScript 文件

### 任务快捷键

- `Ctrl+Shift+B` (Windows/Linux) 或 `Cmd+Shift+B` (Mac) - 运行构建任务

## 📝 开发工作流

### 开发模式
```bash
npm run dev  # 启动 TypeScript watch 模式
```

### 构建项目
```bash
npm run build  # 编译 TypeScript 到 dist/
```

### 本地测试
```bash
npm link  # 创建全局链接
ad-create-app create test-project  # 测试 CLI
```

## 🔄 部署流程示例

### 场景 1：开发新功能
```bash
# 1. 创建功能分支
git checkout -b cursor/dev-new-feature

# 2. 开发和测试
npm run dev
# ... 编写代码 ...

# 3. 提交代码
git add .
git commit -m "feat: 添加新功能"

# 4. 推送代码
git push origin cursor/dev-new-feature
# GitHub Actions 自动运行构建和测试
```

### 场景 2：合并到 dev 分支
```bash
# 1. 创建 Pull Request 到 dev 分支
# GitHub Actions 会自动运行测试

# 2. 合并 PR 后
# GitHub Actions 会：
#   - 运行完整测试
#   - 构建项目
#   - 发布到 npm（dev tag）
#   - 创建 GitHub Pre-release
```

## 🎨 Cursor AI 配置

`.cursorrules` 文件定义了 Cursor AI 在本项目中的行为规则：

- 项目概述和技术栈
- 代码规范和命名约定
- 项目结构说明
- Git 提交规范
- CI/CD 流程
- 开发注意事项

Cursor AI 会自动读取这些规则，提供更准确的代码建议。

## 📊 工作流程监控

### 查看 Actions 状态

可以在 README.md 中添加状态徽章：

```markdown
![Dev Deployment](https://github.com/YOUR_USERNAME/ad-create-app/workflows/Dev%20Deployment/badge.svg?branch=dev)
```

### 通知设置

在 GitHub 仓库设置中可以配置：
- Email 通知
- Slack 集成
- Webhook 通知

## 🔧 故障排查

### 构建失败
1. 查看 Actions 日志
2. 检查依赖版本是否兼容
3. 确保 `package-lock.json` 已提交
4. 验证 TypeScript 编译错误

### 发布失败
1. 检查 NPM_TOKEN 是否正确配置
2. 验证包名是否可用
3. 检查 npm registry 访问权限
4. 查看详细错误日志

### 测试失败
1. 在本地运行测试确认
2. 检查 Node.js 版本兼容性
3. 查看具体失败的测试用例

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [npm 发布指南](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [EditorConfig](https://editorconfig.org/)

## 🎉 总结

现在你的项目已经配置了：

✅ GitHub Actions 自动化部署  
✅ 多版本 Node.js 测试  
✅ 自动发布到 npm (dev tag)  
✅ VSCode 开发环境配置  
✅ Cursor AI 项目规则  
✅ 统一的代码格式化配置  

推送代码到 `dev` 或 `cursor/dev-*` 分支，即可自动触发部署流程！
