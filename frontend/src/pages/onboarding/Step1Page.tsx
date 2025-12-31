import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { profileApi } from '../../lib/api'
import { Button } from '../../components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'

export function Step1Page() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kickoffScheduled, setKickoffScheduled] = useState(false)

  const handleScheduleKickoff = () => {
    // Link externo para agendamento (Calendly, Google Calendar, etc.)
    window.open('https://calendly.com/seu-link-kickoff', '_blank')
    setKickoffScheduled(true)
  }

  const handleConfirmKickoff = async () => {
    setError('')
    setLoading(true)

    try {
      await profileApi.completeStep1()
      await refreshProfile()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar kickoff')
    } finally {
      setLoading(false)
    }
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

              {!kickoffScheduled ? (
                <Button 
                  onClick={handleScheduleKickoff}
                  size="lg" 
                  className="w-full"
                >
                  Agendar Reunião de Kickoff
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-400 bg-green-900/20 p-4 border border-green-800">
                    <CheckCircle className="w-6 h-6" />
                    <span>Link de agendamento aberto! Confirme quando concluir.</span>
                  </div>
                  
                  <Button 
                    onClick={handleConfirmKickoff}
                    size="lg" 
                    className="w-full"
                    isLoading={loading}
                  >
                    Confirmar Agendamento Realizado
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

        <p className="text-center text-sand text-sm mt-6">
          Após confirmar o agendamento, você avançará para a próxima fase.
        </p>
      </div>
    </div>
  )
}
