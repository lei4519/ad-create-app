# 项目生成工具

![Dev Deployment](https://img.shields.io/badge/deployment-GitHub%20Actions-blue)
![Node Version](https://img.shields.io/badge/node-14.x%20%7C%2016.x%20%7C%2018.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)

快速创建小程序和 H5-Vue 项目的 CLI 工具。

## 安装

### 从 GitLab 安装（稳定版）
```shell
cnpm i git+https://gitlab.leju.com/utils/ad-create-app.git --global
```

### 从 npm 安装（dev 版本）
```shell
npm install ad-create-app@dev --global
```

## 使用

```shell
ad-create-app create 项目名称
```


## 模版

### 小程序框架模版

- [enhance-wxapp 框架](https://gitlab.leju.com/librarys/enhance-weapp)

- scss -> wxss 编译

- [微信 API Promise化](https://developers.weixin.qq.com/miniprogram/dev/extended/utils/api-promise.html)

  - 使用时引入`import wxp from 'modules/wxPromiseApi'`

- eslint、prettrer代码风格检查/修复

- [git commit 提交消息规范检查](https://gitlab.leju.com/document/docs/blob/master/docs/git-commit.md)

#### scss 编译

```js
npm run sass2wxss
```

##### scss编译 注意事项

1. 编译过程中会自动处理 `px` -> `rpx` 的转换，开发时不需要再手动处理

2. 使用`@import`导入scss文件时，不要加`.scss`后缀 ⚠️ 。

3. 共用的scss变量、mixins、function需要定义在`_`开头的文件中（例：`_var.scss`），非`_`开头的scss文件中定义的变量等，只能在当前文件中使用，别的文件通过`@import`导入时无法获取到scss变量等。

  - 原因如下

    - sass处理在`@import`时，会直接将引用文件的内容复制到当前文件中，原因是css不支持`@import`语法。

    - 所以`@import`不能交由sass处理，而是绕过sass直接编译出来给wxss进行解析。

    - 所以无法获取到sass变量等相关信息，因为现在处理`@import`的是wxss。

    - 但是如果全部不给sass解析，那变量等功能就无法使用了，所以在编译时排除掉了`_`开头的sass文件，这些文件依旧会由sass解析，并且不会被编译成wxss。

### Vue模版（暂不支持）
### React模版（暂不支持）

## 开发

### 本地开发
```shell
# 克隆项目
git clone <repository-url>

# 安装依赖
npm install

# 开发模式（TypeScript watch）
npm run dev

# 构建
npm run build

# 本地测试
npm link
ad-create-app create test-project
```

### VSCode 开发环境
项目已配置完整的 VSCode 开发环境：
- 代码格式化和 ESLint 集成
- TypeScript 智能提示
- 调试配置（按 F5 启动）
- 构建任务（Ctrl/Cmd+Shift+B）

首次打开项目时，请安装推荐的扩展。

## 部署

项目使用 GitHub Actions 进行自动化部署。

### 自动部署触发条件
- 推送到 `dev` 分支
- 推送到 `cursor/dev-*` 分支
- 对 `dev` 分支的 Pull Request
- 手动触发

### 查看部署状态
访问 GitHub Actions 页面查看构建和部署状态。

📖 详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 贡献

### Git 提交规范
本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```
feat: 添加 React 模板支持
fix: 修复小程序模板路径错误
docs: 更新 README 安装说明
```

## 相关链接

- [enhance-wxapp 框架](https://gitlab.leju.com/librarys/enhance-weapp)
- [Git Commit 规范](https://gitlab.leju.com/document/docs/blob/master/docs/git-commit.md)
- [部署文档](./DEPLOYMENT.md)

## 许可

ISC License