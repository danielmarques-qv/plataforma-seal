import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSignature, Play, CheckCircle, Lock, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { profileApi, trainingApi, onboardingApi } from '../../lib/api'
import { Button } from '../../components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface TrainingModule {
  id: number
  title: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  duration_minutes: number
  is_completed: boolean
  is_locked: boolean
}

export function Step2Page() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuthStore()
  const queryClient = useQueryClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contractSigned, setContractSigned] = useState(false)
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)

  // Buscar módulos de treinamento disponíveis para step 2
  const { data: trainingData, refetch: refetchTraining } = useQuery({
    queryKey: ['training-step2'],
    queryFn: () => trainingApi.getOverview(),
  })

  const availableModules = trainingData?.modules.filter((m: TrainingModule) => !m.is_locked) || []
  const allModulesCompleted = availableModules.length > 0 && availableModules.every((m: TrainingModule) => m.is_completed)

  // Mutation para marcar módulo como concluído
  const completeModuleMutation = useMutation({
    mutationFn: (moduleId: number) => trainingApi.completeModule(moduleId),
    onSuccess: () => {
      refetchTraining()
      queryClient.invalidateQueries({ queryKey: ['training-step2'] })
    }
  })

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

        {/* Modal de Vídeo */}
        {selectedModule && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-surface border-2 border-primary max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b border-primary/30">
                <h3 className="font-display text-xl text-cream">{selectedModule.title}</h3>
                <button 
                  onClick={() => setSelectedModule(null)}
                  className="text-sand hover:text-cream transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4">
                {selectedModule.video_url ? (
                  <div className="aspect-video bg-black mb-4">
                    <iframe
                      src={selectedModule.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-background flex items-center justify-center mb-4">
                    <p className="text-sand">Vídeo não disponível</p>
                  </div>
                )}
                
                {selectedModule.description && (
                  <p className="text-sand mb-4">{selectedModule.description}</p>
                )}
                
                <div className="flex gap-4">
                  {selectedModule.is_completed ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>Módulo concluído</span>
                    </div>
                  ) : (
                    <Button
                      onClick={async () => {
                        await completeModuleMutation.mutateAsync(selectedModule.id)
                        setSelectedModule({ ...selectedModule, is_completed: true })
                      }}
                      isLoading={completeModuleMutation.isPending}
                    >
                      Marcar como Concluído
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={() => setSelectedModule(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Treinamentos Iniciais */}
          <Card>
            <CardHeader>
              <CardTitle>
                Treinamentos Iniciais
                {availableModules.length > 0 && (
                  <span className="text-sm font-normal text-sand ml-2">
                    ({availableModules.filter((m: TrainingModule) => m.is_completed).length}/{availableModules.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableModules.length > 0 ? (
                  availableModules.map((module: TrainingModule) => (
                    <div 
                      key={module.id}
                      onClick={() => setSelectedModule(module)}
                      className="flex items-center gap-3 p-3 bg-background/50 border border-primary/30 hover:border-primary transition-colors cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-12 bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {module.thumbnail_url ? (
                          <img 
                            src={module.thumbnail_url} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                        ) : module.is_completed ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <Play className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm font-medium truncate">{module.title}</p>
                        <p className="text-sand text-xs">{module.duration_minutes} min</p>
                      </div>
                      {module.is_completed && (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sand">
                    <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Treinamentos serão liberados em breve</p>
                  </div>
                )}

                {/* DEV ONLY - Botão de teste para treinamentos */}
                {import.meta.env.VITE_DEV_MODE === 'true' && availableModules.length > 0 && !allModulesCompleted && (
                  <div className="border-t border-primary/30 pt-3 mt-3">
                    <Button 
                      onClick={async () => {
                        try {
                          await onboardingApi.devCompleteTraining()
                          refetchTraining()
                        } catch (err) {
                          console.error('Erro ao completar treinamentos:', err)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      🛠️ Completar Todos (DEV)
                    </Button>
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

                {!allModulesCompleted ? (
                  <div className="bg-yellow-900/20 border border-yellow-800 p-4 text-yellow-300 text-sm">
                    <Lock className="w-5 h-5 inline mr-2" />
                    Complete todos os treinamentos para liberar o contrato.
                  </div>
                ) : !contractSigned ? (
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

                {/* DEV ONLY - Botão de teste */}
                {import.meta.env.VITE_DEV_MODE === 'true' && (
                  <div className="border-t border-primary/30 pt-4 mt-4">
                    <p className="text-sand text-xs mb-2">🛠️ Modo Desenvolvimento:</p>
                    <Button 
                      onClick={async () => {
                        try {
                          setLoading(true)
                          await onboardingApi.devSimulateContract()
                          await refreshProfile()
                          navigate('/')
                        } catch (err) {
                          setError('Erro ao simular assinatura')
                        } finally {
                          setLoading(false)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      isLoading={loading}
                    >
                      Simular Assinatura (DEV)
                    </Button>
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
