import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { ThemeToggle } from './components/ThemeToggle'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds - evita cache excessivo
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // Aplica o tema ao carregar
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        <RouterProvider router={router} />
        <ThemeToggle />
      </AppInitializer>
    </QueryClientProvider>
  )
}

export default App
