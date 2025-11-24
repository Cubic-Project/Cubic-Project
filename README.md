# Cubic-Project 官网

> **构建 Minecraft 服务器技术的未来**  
> Cubic-Project 致力于提供优质的开源工具与文档，让开服变得简单而有趣。

这是 [Cubic-Project](https://github.com/Cubic-Project) 的官方门户网站源码。本项目采用 React + TypeScript + Vite 构建，旨在展示团队的开源项目、文档（如 Sapling）以及团队动态。

## 快速开始

### 环境要求

- Node.js 
- pnpm 

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看效果。

### 构建生产版本

```bash
pnpm build
```

构建产物将生成在 `dist` 目录下。

## 配置指南

项目的主要配置位于 `siteConfig` 对象中（ `src/config.ts` ）。可根据需要修改以下内容：

### 1. 基础信息与 Hero 区域
修改 `title`、`description` 以及 `hero` 对象来更新首页的标题、标语和主推按钮。

### 2. Sapling (特色项目)
在 `sapling` 对象中配置该区域的标题、描述以及跳转链接（如指向 NitWikit）。

### 3. 项目列表 (GitHub Fetch)
项目会自动抓取 `githubOrg` 配置下的仓库。
- **排除特定仓库**：在 `excludedRepos` 数组中添加仓库名称（例如 `['NitWikit']`），这些仓库将不会出现在通用项目列表中。

## 参与贡献

欢迎提交 Pull Request 或 Issue！
Cubic-Project 是一个非官方的 Minecraft 技术团队（原 8aka-Team），我们欢迎任何人参与到项目中来，共同建设更好的社区。

## 许可证

[![License](https://img.shields.io/github/license/Cubic-Project/Cubic-Project)](./LICENSE)  

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

本项目源码遵循 MIT 协议。
文档及网站内容遵循 CC BY-NC-SA 4.0 协议。