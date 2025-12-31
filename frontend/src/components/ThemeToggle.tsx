import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-surface border-2 border-primary hover:bg-primary/20 transition-all duration-200 flex items-center justify-center shadow-lg"
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-sand hover:text-cream transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-primary hover:text-accent transition-colors" />
      )}
    </button>
  )
}
