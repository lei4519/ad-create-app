# 🚀 快速开始指南

## 立即开始使用新配置

### 1️⃣ 提交配置文件

```bash
# 添加所有更改
git add .

# 提交（使用约定式提交规范）
git commit -m "chore: 配置 GitHub Actions 自动部署和开发环境

- 添加 GitHub Actions workflow for dev deployment
- 配置 VSCode 开发环境（调试、任务、扩展）
- 添加 Cursor AI 项目规则
- 配置 EditorConfig 统一代码风格
- 更新项目文档"

# 推送到远程仓库
git push origin cursor/dev-deployment-github-runner-c62b
```

### 2️⃣ 查看 GitHub Actions 部署

推送后，GitHub Actions 会自动触发：

1. 访问仓库的 **Actions** 标签
2. 找到 **Dev Deployment** workflow
3. 查看运行状态和日志
4. 在运行完成后，下载构建产物（Artifacts）

### 3️⃣ 配置 VSCode

打开项目后：

1. **安装推荐扩展**
   - VSCode 会提示安装推荐扩展
   - 点击 "Install All" 安装全部

2. **测试调试功能**
   - 按 `F5` 启动调试
   - 选择 "Debug CLI" 配置
   - 观察 CLI 执行过程

3. **测试构建任务**
   - 按 `Ctrl+Shift+B` (Windows/Linux) 或 `Cmd+Shift+B` (Mac)
   - 选择 "npm: build"
   - 查看构建输出

### 4️⃣ 测试 Cursor AI

在 Cursor 中尝试以下提问：

```
"按照项目规范，帮我添加一个新的小程序模板支持"
"如何在这个项目中添加单元测试？"
"帮我写一个符合规范的 commit message"
```

Cursor AI 会根据 `.cursorrules` 中的规则提供准确建议。

## 🎯 可选配置（提升功能）

### 配置 NPM_TOKEN（启用自动发布）

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 生成 Access Token:
   - 点击头像 → Access Tokens
   - Generate New Token
   - 选择 "Automation" 类型
3. 在 GitHub 仓库中添加 Secret:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `NPM_TOKEN`
   - Value: 粘贴 token

配置后，推送到 `dev` 分支会自动发布到 npm。

### 添加分支保护规则

1. Settings → Branches → Add rule
2. Branch name pattern: `dev`
3. 勾选:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. 选择必需的状态检查: `build-and-deploy`

### 配置部署通知

#### Slack 通知
在 workflow 中添加 Slack 通知步骤：

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### Email 通知
GitHub Actions 默认会发送 email 通知给：
- Workflow 作者
- Commit 作者

可在 GitHub 设置中自定义通知偏好。

## 📖 更多文档

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南
- [.github/SETUP_SUMMARY.md](./.github/SETUP_SUMMARY.md) - 配置总结
- [.github/workflows/README.md](./.github/workflows/README.md) - Workflow 文档
- [README.md](./README.md) - 项目主文档

## 🧪 测试新功能

### 测试 GitHub Actions

创建一个测试分支：

```bash
# 创建测试分支
git checkout -b cursor/dev-test-workflow

# 做一个小改动
echo "# Test" >> test.md
git add test.md
git commit -m "test: 测试 GitHub Actions workflow"

# 推送并观察 Actions
git push origin cursor/dev-test-workflow
```

### 测试本地构建

```bash
# 清理并重新构建
npm run build

# 本地链接测试
npm link

# 测试 CLI
ad-create-app create test-project

# 清理测试项目
rm -rf test-project
```

### 测试 VSCode 调试

1. 在 `src/bin/app.ts` 中设置断点
2. 按 `F5` 启动 "Debug CLI" 配置
3. 程序会在断点处暂停
4. 使用调试控制台检查变量
5. 单步执行代码

## 💡 提示和技巧

### Git 提交规范

使用约定式提交格式：

```bash
# 新功能
git commit -m "feat: 添加 React 模板支持"

# 修复 bug
git commit -m "fix: 修复模板路径错误"

# 文档更新
git commit -m "docs: 更新安装说明"

# 代码重构
git commit -m "refactor: 重构模板生成逻辑"

# 性能优化
git commit -m "perf: 优化文件复制性能"

# 构建/工具相关
git commit -m "chore: 更新依赖版本"
```

### 查看 GitHub Actions 日志

```bash
# 使用 gh CLI
gh run list
gh run view <run-id>
gh run view <run-id> --log
```

### 手动触发 Workflow

```bash
# 使用 gh CLI
gh workflow run dev-deploy.yml --ref cursor/dev-deployment-github-runner-c62b
```

## ❓ 常见问题

### Q: Workflow 没有触发？
A: 检查：
- 分支名是否匹配 `dev` 或 `cursor/dev-*`
- 是否已推送到远程仓库
- GitHub Actions 是否已启用

### Q: 构建失败？
A: 常见原因：
- 依赖安装失败 → 检查 `package-lock.json`
- TypeScript 编译错误 → 本地运行 `npm run build`
- Node.js 版本不兼容 → 查看 workflow 日志

### Q: 如何跳过 CI？
A: 在 commit message 中添加 `[skip ci]`：
```bash
git commit -m "docs: 更新 README [skip ci]"
```

### Q: VSCode 扩展推荐没有显示？
A: 手动打开扩展面板，搜索 "Recommended" 查看推荐扩展。

## 🎉 完成！

你现在已经：
- ✅ 配置了自动化部署
- ✅ 设置了开发环境
- ✅ 启用了 AI 辅助开发
- ✅ 统一了代码规范

开始开发吧！有问题随时查看文档。🚀
