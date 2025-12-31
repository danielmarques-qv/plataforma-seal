import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSignature, Play, CheckCircle, Lock } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { profileApi, trainingApi } from '../../lib/api'
import { Button } from '../../components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { useQuery } from '@tanstack/react-query'

export function Step2Page() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contractSigned, setContractSigned] = useState(false)

  // Buscar módulos de treinamento disponíveis para step 2
  const { data: trainingData } = useQuery({
    queryKey: ['training-step2'],
    queryFn: () => trainingApi.getOverview(),
  })

  const availableModules = trainingData?.modules.filter(m => !m.is_locked) || []

  const handleSignContract = () => {
    // Link externo para DocuSign ou similar
    window.open('https://docusign.com/seu-contrato', '_blank')
    setContractSigned(true)
  }

  const handleConfirmContract = async () => {
    setError('')
    setLoading(true)

    try {
      await profileApi.completeStep2()
      await refreshProfile()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border-2 border-primary mb-4">
            <FileSignature className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
            ENGAJAMENTO TÁTICO
          </h1>
          <p className="text-sand">
            {profile?.full_name}, assista aos treinamentos iniciais e assine o contrato.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Treinamentos Iniciais */}
          <Card>
            <CardHeader>
              <CardTitle>Treinamentos Iniciais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableModules.length > 0 ? (
                  availableModules.map((module) => (
                    <div 
                      key={module.id}
                      className="flex items-center gap-3 p-3 bg-background/50 border border-primary/30 hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                        {module.is_completed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Play className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-cream text-sm font-medium">{module.title}</p>
                        <p className="text-sand text-xs">{module.duration_minutes} min</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sand">
                    <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Treinamentos serão liberados em breve</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contrato */}
          <Card variant="highlight">
            <CardHeader>
              <CardTitle>Contrato de Estrategista</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sand text-sm">
                  O contrato formaliza sua parceria como Estrategista SEAL e 
                  estabelece as regras de comissionamento e conduta.
                </p>

                <div className="bg-background/50 p-4 border border-primary/30">
                  <h4 className="text-cream font-medium mb-3">O contrato inclui:</h4>
                  <ul className="text-sand text-sm space-y-2">
                    <li>• Termos de parceria comercial</li>
                    <li>• Tabela de comissões</li>
                    <li>• Código de conduta</li>
                    <li>• Política de privacidade</li>
                  </ul>
                </div>

                {!contractSigned ? (
                  <Button 
                    onClick={handleSignContract}
                    size="lg" 
                    className="w-full"
                  >
                    Assinar Contrato de Estrategista
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-400 bg-green-900/20 p-4 border border-green-800">
                      <CheckCircle className="w-6 h-6" />
                      <span>Contrato aberto para assinatura!</span>
                    </div>
                    
                    <Button 
                      onClick={handleConfirmContract}
                      size="lg" 
                      className="w-full"
                      isLoading={loading}
                    >
                      Confirmar Assinatura e Entrar
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/30 border border-red-800 p-3 text-red-300 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sand text-sm mt-8">
          Após assinar o contrato, você terá acesso completo à plataforma SEAL.
        </p>
      </div>
    </div>
  )
}
