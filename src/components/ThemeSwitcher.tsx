import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { themes, type Theme } from '../lib/themes';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-4 p-2 bg-surface/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl min-w-[280px] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/50 mb-2">
              <h3 className="text-sm font-semibold text-text-main">Theme Collection</h3>
              <p className="text-xs text-text-muted">Select your preferred ambiance</p>
            </div>
            <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme);
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
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
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