import { type LucideIcon } from 'lucide-react';

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  githubOrg: string;
  
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: {
      label: string;
      href: string;
    };
    secondaryAction: {
      label: string;
      href: string;
    };
  };

  sapling: {
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    link: string;
    linkText: string;
  };

  about: {
    title: string;
    description: string;
    features: {
      icon: LucideIcon;
      title: string;
      desc: string;
    }[];
  };

  giscus: {
    repo: `${string}/${string}`;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
    strict: "0" | "1";
    reactionsEnabled: "0" | "1";
    emitMetadata: "0" | "1";
    inputPosition: "top" | "bottom";
    theme: string;
    lang: string;
    loading: "lazy" | "eager";
  };

  nav: {
    items: {
      label: string;
      href: string;
    }[];
    github: {
      display: boolean;
      label: string;
    };
  };

  projects: {
    title: string;
    description: string;
    defaultRepoDescription: string;
  };

  comments: {
    title: string;
    subtitle: string;
  };

  footer: {
    copyright: string;
  };

  excludedRepos: string[];
}