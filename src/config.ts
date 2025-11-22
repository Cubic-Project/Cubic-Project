import { Terminal, BookOpen, Users } from 'lucide-react';

export const siteConfig = {
  title: 'Cubic-Project',
  description: '构建 Minecraft 服务器技术的未来。Cubic-Project 致力于提供优质的开源工具与文档，让开服变得简单而有趣。',
  url: 'https://cubic-project.github.io', // Replace with actual URL
  githubOrg: 'Cubic-Project',
  
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

  sapling: {
    title: 'Sapling',
    subtitle: 'Featured Project',
    description: '原 NitWikit / 笨蛋MC开服教程。Sapling 是一个综合性的 Minecraft 服务器搭建与管理指南。无论你是零基础的新手，还是经验丰富的腐竹，都能在这里找到所需的知识。',
    tags: ['文档', '教程', 'Minecraft', 'Java & Bedrock'],
    link: 'https://nitwikit.8aka.org',
    linkText: '开始阅读'
  },

  about: {
    title: '关于 Cubic-Project',
    description: 'Cubic-Project 是一个专注于 Minecraft 服务器技术的非官方团队。我们的前身是 8aka-Team，经过组织重组后以全新的面貌继续活跃于社区。',
    features: [
      {
        icon: Terminal,
        title: "技术驱动",
        desc: ""
      },
      {
        icon: BookOpen,
        title: "知识共享",
        desc: ""
      },
      {
        icon: Users,
        title: "社区共建",
        desc: ""
      }
    ]
  },

  giscus: {
    repo: "Cubic-Project/cubic-site", // Replace with actual repo for comments
    repoId: "R_kgDOQawMgg", // Replace with actual repo ID
    category: "General",
    categoryId: "DIC_kwDOQawMgs4ClC_l", // Replace with actual category ID
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    theme: "light",
    lang: "zh-CN",
    loading: "lazy"
  } as const,

  excludedRepos: ['NitWikit']
};