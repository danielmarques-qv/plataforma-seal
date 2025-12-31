import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Step0Page, Step1Page, Step2Page } from '../pages'

export function OnboardingRouter() {
  const { profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  // Redireciona baseado no onboarding_step
  switch (profile.onboarding_step) {
    case 0:
      return <Step0Page />
    case 1:
      return <Step1Page />
    case 2:
      return <Step2Page />
    case 3:
    default:
      // Step 3 = Operacional - redireciona para War Room
      return <Navigate to="/war-room" replace />
  }
}
