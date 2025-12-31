import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Button, Input } from '../../components/ui'
import logoSeal from '../../assets/Logo SEAL.png'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, signUp, loading, error } = useAuthStore()
  
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    
    try {
      if (isRegister) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/')
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao processar')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoSeal} alt="SEAL" className="h-24 w-auto mx-auto mb-4" />
          <p className="text-sand text-sm uppercase tracking-widest mt-2">
            Plataforma Tática de Estrategistas
          </p>
        </div>

        {/* Form */}
        <div className="bg-surface border border-primary/30 p-8">
          <h2 className="font-display text-xl text-cream uppercase tracking-wider text-center mb-6">
            {isRegister ? 'Registro de Recruta' : 'Acesso ao QG'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email de Combate"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operador@seal.com"
              required
            />
            
            <Input
              label="Senha Tática"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />

            {(error || localError) && (
              <div className="bg-red-900/30 border border-red-800 p-3 text-red-300 text-sm">
                {error || localError}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={loading}
            >
              {isRegister ? 'Iniciar Cadastro' : 'Entrar na Operação'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sand hover:text-cream text-sm transition-colors"
            >
              {isRegister 
                ? 'Já é operador? Faça login' 
                : 'Novo recruta? Registre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
