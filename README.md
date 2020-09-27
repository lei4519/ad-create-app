# 项目生成工具

## 安装

```shell
cnpm i git+https://gitlab.leju.com/utils/ad-create-app.git --global
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