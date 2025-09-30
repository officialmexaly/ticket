"use client"

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-8 h-8 rounded-lg
        transition-all duration-300 ease-in-out
        bg-card hover:bg-accent text-foreground
        border border-border shadow-sm
        hover:scale-105 active:scale-95
        hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`
            absolute inset-0 w-4 h-4 transition-all duration-300 ease-in-out
            ${isDark
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
        <Moon
          className={`
            absolute inset-0 w-4 h-4 transition-all duration-300 ease-in-out
            ${isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
            }
          `}
        />
      </div>
    </button>
  );
}