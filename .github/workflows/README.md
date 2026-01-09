# GitHub Actions Workflows

## Dev Deployment Workflow

### 触发条件

- 推送到 `dev` 分支或 `cursor/dev-*` 分支
- 针对 `dev` 分支的 Pull Request
- 手动触发（workflow_dispatch）

### 工作流程

#### 1. Build and Deploy Job

- 在多个 Node.js 版本上运行测试（14.x, 16.x, 18.x）
- 检出代码
- 安装依赖
- 构建项目
- 运行测试（如果存在）
- 归档构建产物（仅 Node.js 14.x）

#### 2. Publish Dev Job

只在推送到 `dev` 分支时执行：

- 构建项目
- 发布到 npm（使用 `dev` tag，需要配置 `NPM_TOKEN` secret）
- 创建 GitHub Pre-release（需要配置 `GITHUB_TOKEN`）

### 配置 Secrets

要启用完整功能，需要在 GitHub 仓库设置中配置以下 Secrets：

1. **NPM_TOKEN**（可选）
   - 用于发布包到 npm
   - 在 [npmjs.com](https://www.npmjs.com/) 生成 Access Token
   - 设置路径：Settings → Secrets and variables → Actions → New repository secret

2. **GITHUB_TOKEN**（自动提供）
   - 用于创建 GitHub Release
   - 此 token 由 GitHub Actions 自动提供，无需手动配置

### 手动触发

1. 进入 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Dev Deployment" workflow
4. 点击 "Run workflow" 按钮
5. 选择要运行的分支
6. 点击绿色的 "Run workflow" 按钮

### 查看构建产物

构建产物会作为 Artifacts 上传，保留 7 天：

1. 进入 GitHub Actions 运行详情页面
2. 滚动到页面底部的 "Artifacts" 部分
3. 下载 `dist-{commit-sha}` 文件

### 注意事项

- 发布到 npm 和创建 GitHub Release 的步骤设置为 `continue-on-error: true`，即使失败也不会影响整体部署
- 只有 Node.js 14.x 的构建产物会被上传为 Artifact
- dev 发布会使用 `--tag dev` 标记，不会影响主版本

### 示例：安装 dev 版本

```bash
# 从 npm 安装 dev 版本
npm install ad-create-app@dev --global

# 或者使用 yarn
yarn global add ad-create-app@dev
```

### 自定义配置

如需修改 workflow 配置，编辑 `.github/workflows/dev-deploy.yml` 文件。

常见自定义项：

- Node.js 版本：修改 `strategy.matrix.node-version`
- 触发分支：修改 `on.push.branches`
- 产物保留时间：修改 `retention-days`
- 添加部署到其他平台的步骤
