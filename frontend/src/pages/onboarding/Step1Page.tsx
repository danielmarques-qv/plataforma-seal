import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { onboardingApi } from '../../lib/api'
import { Button } from '../../components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'

const CALENDLY_URL = 'https://calendly.com/danielmarques-quartavia/30min'

export function Step1Page() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [calendlyOpened, setCalendlyOpened] = useState(false)
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false)
  const [scheduleTime, setScheduleTime] = useState<string | null>(null)

  // Verifica se já tem agendamento
  const checkSchedule = useCallback(async () => {
    try {
      setChecking(true)
      const result = await onboardingApi.checkSchedule()
      
      if (result.has_schedule) {
        setScheduleConfirmed(true)
        setScheduleTime(result.schedule_time)
      }
    } catch (err) {
      console.error('Erro ao verificar agendamento:', err)
    } finally {
      setChecking(false)
    }
  }, [])

  // Verifica agendamento ao montar e periodicamente após abrir Calendly
  useEffect(() => {
    checkSchedule()
  }, [checkSchedule])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    
    if (calendlyOpened && !scheduleConfirmed) {
      // Polling a cada 5 segundos após abrir o Calendly
      interval = setInterval(() => {
        checkSchedule()
      }, 5000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [calendlyOpened, scheduleConfirmed, checkSchedule])

  const handleOpenCalendly = () => {
    window.open(CALENDLY_URL, '_blank')
    setCalendlyOpened(true)
  }

  const handleConfirmAndProceed = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await onboardingApi.confirmSchedule()
      
      if (result.status === 'ok') {
        await refreshProfile()
        navigate('/')
      } else {
        setError('Agendamento ainda não detectado. Por favor, complete o agendamento no Calendly.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const formatScheduleTime = (isoString: string | null) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border-2 border-primary mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
            BRIEFING DE KICKOFF
          </h1>
          <p className="text-sand">
            Olá, {profile?.full_name || 'Operador'}! Agende sua reunião de kickoff.
          </p>
        </div>

        <Card variant="highlight">
          <CardHeader>
            <CardTitle>Reunião de Alinhamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sand">
                A reunião de kickoff é fundamental para alinhar expectativas, 
                conhecer a metodologia SEAL e preparar você para as operações táticas.
              </p>

              <div className="bg-background/50 p-4 border border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-cream font-medium">Duração: 30 minutos</span>
                </div>
                <ul className="text-sand text-sm space-y-2 ml-8">
                  <li>• Apresentação da metodologia SEAL</li>
                  <li>• Análise do seu perfil Heptagrama</li>
                  <li>• Definição de metas iniciais</li>
                  <li>• Próximos passos do treinamento</li>
                </ul>
              </div>

              {scheduleConfirmed ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-400 bg-green-900/20 p-4 border border-green-800">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <span className="font-medium">Reunião agendada!</span>
                      {scheduleTime && (
                        <p className="text-sm text-green-300 mt-1">
                          {formatScheduleTime(scheduleTime)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleConfirmAndProceed}
                    size="lg" 
                    className="w-full"
                    isLoading={loading}
                  >
                    Continuar para Próxima Etapa
                  </Button>
                </div>
              ) : calendlyOpened ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-yellow-400 bg-yellow-900/20 p-4 border border-yellow-800">
                    {checking ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                    <span>Aguardando confirmação do agendamento...</span>
                  </div>
                  
                  <Button 
                    onClick={handleOpenCalendly}
                    variant="outline"
                    size="lg" 
                    className="w-full"
                  >
                    Abrir Calendly Novamente
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleOpenCalendly}
                  size="lg" 
                  className="w-full"
                >
                  Agendar Reunião de Kickoff
                </Button>
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
                        await onboardingApi.devSimulateSchedule()
                        checkSchedule()
                      } catch (err) {
                        setError('Erro ao simular agendamento')
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Simular Agendamento (DEV)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sand text-sm mt-6">
          Use o mesmo email do cadastro para que possamos identificar seu agendamento.
        </p>
      </div>
    </div>
  )
}
