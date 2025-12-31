import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { useAuthStore } from './stores/authStore'

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

  useEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </QueryClientProvider>
  )
}

export default App
