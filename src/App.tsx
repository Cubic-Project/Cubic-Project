import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Github, ExternalLink, Code2, ChevronRight, Star, GitFork, Terminal, BookOpen, Menu, X } from 'lucide-react';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Giscus from '@giscus/react';
import { siteConfig } from './config';
import { themes, type Theme } from './lib/themes';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Logo } from './components/Logo';

// Types
interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

const mobileMenuVariants: Variants = {
  closed: { 
    opacity: 0, 
    height: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: { 
    opacity: 1, 
    height: 'auto',
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const mobileItemVariants: Variants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 }
};

function App() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [currentTheme]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`https://api.github.com/orgs/${siteConfig.githubOrg}/repos?sort=updated&direction=desc`);
        const filtered = response.data.filter((repo: Repository) => 
          !siteConfig.excludedRepos.includes(repo.name) && !repo.archived
        );
        setRepos(filtered);
      } catch (error) {
        console.error('Error fetching repos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMobileMenuOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary selection:text-white overflow-hidden">
        <Helmet>
          <title>{siteConfig.title}</title>
          <meta name="description" content={siteConfig.description} />
          <meta property="og:title" content={siteConfig.title} />
          <meta property="og:description" content={siteConfig.description} />
          <meta property="og:type" content="website" />
        </Helmet>

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-colors duration-300">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 text-xl font-bold tracking-tight">
              <Logo />
              <span className="text-text-main transition-colors duration-300">{siteConfig.title}</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {siteConfig.nav.items.map((item: { label: string; href: string }) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-text-muted hover:text-primary transition-colors duration-300 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
            {siteConfig.nav.github.display && (
              <a
                href={`https://github.com/${siteConfig.githubOrg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-background hover:bg-surface border border-border transition-all duration-300 text-sm font-medium text-text-main"
              >
                <Github size={18} />
                <span>{siteConfig.nav.github.label}</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-text-main hover:bg-surface rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-[73px] left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-border/50 z-40 md:hidden overflow-hidden"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                {siteConfig.nav.items.map((item: { label: string; href: string }) => (
                  <motion.button
                    key={item.label}
                    variants={mobileItemVariants}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left py-3 px-4 rounded-xl hover:bg-surface-hover text-text-main font-medium transition-colors"
                  >
                    {item.label}
                  </motion.button>
                ))}
                {siteConfig.nav.github.display && (
                  <motion.a
                    variants={mobileItemVariants}
                    href={`https://github.com/${siteConfig.githubOrg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-surface-hover text-text-main font-medium transition-colors"
                  >
                    <Github size={20} />
                    <span>{siteConfig.nav.github.label}</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section id="hero" className="relative pt-40 pb-32 px-6 z-10">
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold mb-8 tracking-wide uppercase">
                {siteConfig.hero.badge}
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-text-main">
                构建 <span className="text-gradient">Minecraft</span> <br />
                服务器技术的未来
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                {siteConfig.hero.description}
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => scrollToSection('projects')} className="btn-primary flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
                  <Code2 size={20} className="group-hover:rotate-12 transition-transform" />
                  {siteConfig.hero.primaryAction.label}
                </button>
                <button onClick={() => scrollToSection('sapling')} className="btn-secondary flex items-center justify-center gap-2 group">
                  <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
                  {siteConfig.hero.secondaryAction.label}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Sapling Section */}
        <section id="sapling" className="py-24 px-6 relative z-10 bg-surface/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="group relative bg-background border border-border rounded-3xl p-8 md:p-12 overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-xl shadow-primary/5"
            >
              <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 text-secondary font-bold tracking-wider uppercase mb-4 text-xs">
                    <Star className="fill-secondary" size={12} />
                    {siteConfig.sapling.subtitle}
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-text-main">{siteConfig.sapling.title}</h2>
                  <p className="text-text-muted text-lg mb-8 leading-relaxed font-light">
                    {siteConfig.sapling.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {siteConfig.sapling.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 rounded-md bg-surface border border-border text-text-muted text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={siteConfig.sapling.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {siteConfig.sapling.linkText} <ChevronRight size={18} />
                  </a>
                </div>
                
                <div className="flex-1 flex justify-center items-center">
                  <motion.div 
                    className="relative w-64 h-64 md:w-80 md:h-80 animate-float"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
                    <div className="relative w-full h-full bg-background border border-border/50 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <span className="text-9xl filter drop-shadow-sm">🌱</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-main">{siteConfig.projects.title}</h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto font-light">
                {siteConfig.projects.description}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-hover border border-border rounded-xl p-6 flex flex-col h-full group shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-surface text-text-main group-hover:bg-primary group-hover:text-white transition-colors">
                        <Terminal size={20} />
                      </div>
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-primary transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    <h3 className="text-lg font-bold text-text-main mb-3 group-hover:text-primary transition-colors">
                      {repo.name}
                    </h3>
                    
                    <p className="text-text-muted text-sm mb-6 flex-grow line-clamp-3 leading-relaxed font-light">
                      {repo.description || siteConfig.projects.defaultRepoDescription}
                    </p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-border/50 text-xs text-text-muted">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
                          <Star size={14} /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <GitFork size={14} /> {repo.forks_count}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface border border-border">
                        Public
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 relative z-10 bg-surface/30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-main">{siteConfig.about.title}</h2>
              <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed font-light">
                {siteConfig.about.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {siteConfig.about.features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="p-8 bg-background border border-border rounded-2xl text-center hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-surface flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-text-main">{item.title}</h3>
                  {item.desc && <p className="text-text-muted leading-relaxed text-sm font-light">{item.desc}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4 text-text-main">{siteConfig.comments.title}</h2>
              <p className="text-text-muted">{siteConfig.comments.subtitle}</p>
            </div>
            <Giscus
              id="comments"
              repo={siteConfig.giscus.repo}
              repoId={siteConfig.giscus.repoId}
              category={siteConfig.giscus.category}
              categoryId={siteConfig.giscus.categoryId}
              mapping={siteConfig.giscus.mapping}
              strict={siteConfig.giscus.strict}
              reactionsEnabled={siteConfig.giscus.reactionsEnabled}
              emitMetadata={siteConfig.giscus.emitMetadata}
              inputPosition={siteConfig.giscus.inputPosition}
              theme={currentTheme.type === 'dark' ? 'dark' : 'light'}
              lang={siteConfig.giscus.lang}
              loading={siteConfig.giscus.loading}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-surface relative z-10 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3 text-lg font-bold">
                <Logo />
                <span className="text-text-main transition-colors duration-300">{siteConfig.title}</span>
              </div>
              
              <div className="text-text-muted text-sm font-light transition-colors duration-300">
                &copy; {new Date().getFullYear()} {siteConfig.title}. {siteConfig.footer.copyright}
              </div>

            </div>
          </div>
        </footer>
        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      </div>
    </HelmetProvider>
  );
}

export default App;
