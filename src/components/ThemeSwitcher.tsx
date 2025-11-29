import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sliders, LayoutGrid, RefreshCw, Sun, Circle, Zap } from 'lucide-react';
import { themes, type Theme } from '../lib/themes';
import type { SceneConfig, PaletteVariation } from '../types';
import { 
  SCENES, 
  rgbStringToHex, 
  generatePaletteVariations,
  type SceneType
} from '../lib/color-utils';

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  const [selectedScene, setSelectedScene] = useState<SceneType>('normal');
  const [customPrimary, setCustomPrimary] = useState<string>('');
  const [variations, setVariations] = useState<PaletteVariation[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomColorChange = (hex: string) => {
    setCustomPrimary(hex);
    const newVariations = generatePaletteVariations(hex, selectedScene);
    setVariations(newVariations);
    
    // Auto-apply the first variation (Harmonious) for immediate feedback
    if (newVariations.length > 0) {
        applyVariation(newVariations[0]);
    }
  };

  const handleSceneChange = (sceneId: SceneType) => {
    setSelectedScene(sceneId);
    if (customPrimary) {
        const newVariations = generatePaletteVariations(customPrimary, sceneId);
        setVariations(newVariations);
        if (newVariations.length > 0) {
            applyVariation(newVariations[0]);
        }
    }
  };

  const applyVariation = (variation: PaletteVariation) => {
    const newTheme: Theme = {
      ...currentTheme,
      id: 'custom',
      name: variation.name,
      colors: variation.colors as Theme['colors']
    };
    onThemeChange(newTheme);
  };

  const getSceneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun size={18} />;
      case 'Circle': return <Circle size={18} />;
      case 'Zap': return <Zap size={18} />;
      default: return <Circle size={18} />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-4 bg-surface/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl w-[calc(100vw-3rem)] sm:w-80 max-h-[80vh] overflow-hidden flex flex-col origin-bottom-right"
          >
            {/* Header with Tabs */}
            <div className="flex border-b border-border/50 bg-surface/80">
              <button
                onClick={() => setMode('presets')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  mode === 'presets' 
                    ? 'text-primary bg-surface-hover/50 border-b-2 border-primary' 
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                <LayoutGrid size={16} />
                Presets
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  mode === 'custom' 
                    ? 'text-primary bg-surface-hover/50 border-b-2 border-primary' 
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                <Sliders size={16} />
                Customize
              </button>
            </div>

            {/* Content */}
            <div className="p-2 bg-surface/50 overflow-y-auto custom-scrollbar">
              {mode === 'presets' ? (
                <motion.div 
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  {themes.map((theme) => (
                    <motion.button
                      variants={listItemVariants}
                      key={theme.id}
                      onClick={() => {
                        onThemeChange(theme);
                        setCustomPrimary(rgbStringToHex(theme.colors.primary));
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                        currentTheme.id === theme.id
                          ? 'bg-surface-hover'
                          : 'hover:bg-surface-hover/50'
                      }`}
                    >
                      <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden shadow-sm border border-border ring-2 ring-surface">
                        <div className="absolute inset-0 grid grid-cols-2">
                          <div style={{ backgroundColor: `rgb(${theme.colors.background})` }}></div>
                          <div style={{ backgroundColor: `rgb(${theme.colors.primary})` }}></div>
                          <div style={{ backgroundColor: `rgb(${theme.colors.secondary})` }}></div>
                          <div style={{ backgroundColor: `rgb(${theme.colors.surface})` }}></div>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-text-main flex items-center justify-between">
                          {theme.name}
                          {currentTheme.id === theme.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <Check size={14} className="text-primary" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Primary Color Picker */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-inner ring-2 ring-border">
                        <input
                          type="color"
                          value={customPrimary}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customPrimary}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-mono text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scene Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Scene / Contrast
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.values(SCENES) as SceneConfig[]).map((scene) => (
                        <button
                          key={scene.id}
                          onClick={() => handleSceneChange(scene.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                            selectedScene === scene.id
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-surface border-border text-text-muted hover:border-primary/50 hover:text-text-main'
                          }`}
                        >
                          {getSceneIcon(scene.icon)}
                          <span className="text-xs font-medium capitalize">{scene.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generated Variations */}
                  {variations.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Generated Palettes
                      </label>
                      <motion.div 
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-2"
                      >
                        {variations.map((variation) => (
                          <motion.button
                            variants={listItemVariants}
                            key={variation.id}
                            onClick={() => applyVariation(variation)}
                            className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all duration-200 ${
                                currentTheme.name === variation.name
                                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                : 'bg-surface border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex gap-1">
                                {variation.previewColors.map((color, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border border-border/20" style={{ backgroundColor: color }} />
                                ))}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text-main">{variation.name}</div>
                                <div className="text-xs text-text-muted">{variation.description}</div>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      onThemeChange(themes[0]);
                      setCustomPrimary(rgbStringToHex(themes[0].colors.primary));
                      setSelectedScene('normal');
                    }}
                    className="w-full py-2 flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    <RefreshCw size={14} />
                    Reset to Default
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isOpen) {
            setCustomPrimary(rgbStringToHex(currentTheme.colors.primary));
          }
          setIsOpen(!isOpen);
        }}
        className={`p-4 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 ${
          isOpen
            ? 'bg-primary text-white border-primary'
            : 'bg-surface/80 text-text-main border-surface/50 hover:bg-surface hover:shadow-xl'
        }`}
        aria-label="Change Theme"
      >
        <Palette size={24} strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}