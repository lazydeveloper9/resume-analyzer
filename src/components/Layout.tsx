import React, { ReactNode } from 'react';
import { Moon, Sun, FileText } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-600 rounded-lg text-white shadow-lg shadow-brand-500/30">
              <FileText size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
              ResuMate AI
            </span>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800">
        <p>© {new Date().getFullYear()} ResuMate AI. Developed by Meow Meow.</p>
      </footer>
    </div>
  );
};