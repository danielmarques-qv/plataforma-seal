import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredStep?: number
}

export function ProtectedRoute({ children, requiredStep }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Verificando credenciais...</p>
        </div>
      </div>
    )
  }

  // Não autenticado - redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Verifica step mínimo se especificado
  if (requiredStep !== undefined && profile) {
    if (profile.onboarding_step < requiredStep) {
      // Redireciona para o step correto
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
