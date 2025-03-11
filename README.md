# Path-Fixer

一个用于修复 iOS DocC 文档中绝对路径问题的命令行工具。

## 问题背景

iOS 使用 DocC 生成的文档在不同环境下部署时，由于绝对路径的问题，可能导致资源无法正确加载。这个工具可以自动修复这些路径问题。

## 安装

```bash
# 全局安装
npm install -g path-fixer

# 或使用 pnpm
pnpm add -g path-fixer
```

## 使用方法

```bash
# 基本用法
path-fixer fix ./SlothCreator.doccarchive --base-url=/SlothCreator.doccarchive

# 显示详细日志
path-fixer fix ./SlothCreator.doccarchive --base-url=/SlothCreator.doccarchive --verbose

# 查看帮助
path-fixer --help

# 查看版本
path-fixer --version
```

### 参数说明

- `fix <docArchivePath>`: 指定要修复的 DocC 文档路径
- `--base-url <baseUrl>`: 设置基础 URL 前缀，默认为空
- `--verbose`: 显示详细日志信息，默认为 false

## 工作原理

该工具会扫描指定目录中的所有 HTML 文件，执行以下替换操作：

1. 替换 HTML 文件中的 `baseUrl = "/"` 为用户指定的 `baseUrl` 值
2. 替换以下模式的绝对路径引用：
```
"/js/file.js" -> "/your-base-url/js/file.js"
"/css/style.css" -> "/your-base-url/css/style.css"
```

工具会确保替换后的 `baseUrl` 前后都有且仅有一个斜杠，例如：
- 如果用户输入 `--base-url=my-docs`，将被标准化为 `/my-docs`
- 如果用户输入 `--base-url=/my-docs/`，将被标准化为 `/my-docs`

该工具会直接修改原始文件。**请在运行工具之前备份重要文件**。

### 日志级别

工具提供两种日志级别：

1. **默认模式**: 只显示基本信息和错误
2. **详细模式 (--verbose)**: 显示处理过程中的详细信息，包括每个文件的处理状态

## 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/path-fixer.git
cd path-fixer

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 发布流程

项目使用 GitHub Actions 自动化发布流程。发布新版本时，请遵循以下步骤：

1. 更新 `package.json` 中的版本号
2. 提交更改并推送到主分支
3. 创建一个新的 Git 标签，格式为 `v*`（例如 `v1.0.1`）
4. 推送标签到 GitHub

```bash
# 示例发布流程
git add .
git commit -m "feat: 添加新功能"
npm version patch  # 或 minor 或 major
git push
git push --tags
```

当标签推送到 GitHub 后，GitHub Actions 会自动构建并发布包到 npm。

## 代码结构

项目的主要代码文件：

- `src/index.ts`: 命令行入口点和主要逻辑
- `src/replacer.ts`: 文件路径替换功能
- `src/logger.ts`: 日志处理功能

## 许可证

ISC 