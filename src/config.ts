import { Terminal, BookOpen, Users } from 'lucide-react';
import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  // 网站基础配置
  title: 'Cubic-Project',
  description: '构建 Minecraft 服务器技术的未来。Cubic-Project 致力于提供优质的开源工具与文档，让开服变得简单而有趣。',
  url: 'https://cubic-project.github.io', // 替换为实际的 URL
  githubOrg: 'Cubic-Project',
  
  // 首页 Hero 区域配置
  hero: {
    badge: '原 8aka-Team 全新升级',
    title: '构建 Minecraft 服务器技术的未来',
    description: 'Cubic-Project 致力于提供优质的开源工具与文档，让开服变得简单而有趣。我们是一群热爱技术的玩家，为社区贡献力量。',
    primaryAction: {
      label: '探索项目',
      href: '#projects'
    },
    secondaryAction: {
      label: '阅读文档',
      href: '#sapling'
    }
  },

  // Sapling 特色项目区域配置
  sapling: {
    title: 'Sapling',
    subtitle: 'Featured Project',
    description: '原 NitWikit / 笨蛋MC开服教程。Sapling 是一个综合性的 Minecraft 服务器搭建与管理指南。无论你是零基础的新手，还是经验丰富的腐竹，都能在这里找到所需的知识。',
    tags: ['文档', '教程', 'Minecraft', 'Java & Bedrock'],
    link: 'https://nitwikit.8aka.org',
    linkText: '开始阅读'
  },

  // 关于我们区域配置
  about: {
    title: '关于 Cubic-Project',
    description: 'Cubic-Project 是一个专注于 Minecraft 服务器技术的非官方团队。我们的前身是 8aka-Team，经过组织重组后以全新的面貌继续活跃于社区。',
    features: [
      {
        icon: Terminal,
        title: "技术驱动",
        desc: "我们使用前沿的技术栈构建工具，致力于提供最佳的用户体验。"
      },
      {
        icon: BookOpen,
        title: "知识共享",
        desc: "我们相信知识应该被分享。我们的文档和教程旨在帮助更多人。"
      },
      {
        icon: Users,
        title: "社区共建",
        desc: "我们欢迎任何人参与到项目中来，共同建设更好的 Minecraft 社区。"
      }
    ]
  },

  // Giscus 评论系统配置
  giscus: {
    repo: "Cubic-Project/cubic", // 替换为实际的 repo
    repoId: "", // 替换为实际的 repo ID
    category: "General",
    categoryId: "", // 替换为实际的 category ID
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    theme: "light",
    lang: "zh-CN",
    loading: "lazy"
  },

  // 导航栏配置
  nav: {
    items: [
      { label: '首页', href: 'hero' },
      { label: 'Sapling', href: 'sapling' },
      { label: '项目列表', href: 'projects' },
      { label: '关于我们', href: 'about' }
    ],
    github: {
      display: true,
      label: 'GitHub'
    }
  },

  // 项目列表区域配置
  projects: {
    title: '开源项目',
    description: '我们通过 GitHub 贡献代码，以下是我们最新的开源项目。',
    defaultRepoDescription: '暂无描述'
  },

  // 评论区配置
  comments: {
    title: '留言板',
    subtitle: '欢迎留下您的建议与反馈'
  },

  // 页脚配置
  footer: {
    copyright: 'All rights reserved.'
  },

  // 在项目列表中排除的仓库名称
  excludedRepos: ['NitWikit']
};
