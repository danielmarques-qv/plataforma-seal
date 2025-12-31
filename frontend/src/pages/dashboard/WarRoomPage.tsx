import { useQuery } from '@tanstack/react-query'
import { Target, TrendingUp, Play } from 'lucide-react'
import { profileApi, trainingApi } from '../../lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { HypeCounter, ProgressBar, HeptagramChart } from '../../components/Dashboard'

export function WarRoomPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => profileApi.getDashboardStats(),
  })

  const { data: pendingModules } = useQuery({
    queryKey: ['pending-modules'],
    queryFn: () => trainingApi.getPending(),
  })

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Carregando dados táticos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
          WAR ROOM
        </h1>
        <p className="text-sand">
          Central de comando e controle do Operador {stats?.operador}
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Famílias Salvas - Contador Hype */}
        <div className="lg:col-span-1">
          <HypeCounter 
            count={stats?.familias_salvas || 0} 
            operatorName={stats?.operador || 'Operador'}
          />
        </div>

        {/* Progresso Financeiro */}
        <div className="lg:col-span-2">
          <Card variant="highlight">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <CardTitle>Evolução de Remuneração</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ProgressBar
                  current={stats?.comissao_atual || 0}
                  goal={stats?.meta_financeira || 1}
                  label="Progresso em direção ao sonho"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 p-4 border border-primary/30">
                    <p className="text-sand text-xs uppercase tracking-wider mb-1">Comissão Atual</p>
                    <p className="font-display text-2xl text-cream">
                      R$ {(stats?.comissao_atual || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-background/50 p-4 border border-primary/30">
                    <p className="text-sand text-xs uppercase tracking-wider mb-1">Meta do Sonho</p>
                    <p className="font-display text-2xl text-primary">
                      R$ {(stats?.meta_financeira || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Segunda Linha */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Missões Atuais (Vídeos Pendentes) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <CardTitle>Missões Atuais</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingModules && pendingModules.length > 0 ? (
                pendingModules.slice(0, 4).map((module) => (
                  <div 
                    key={module.id}
                    className="flex items-center gap-3 p-3 bg-background/50 border border-primary/30 hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-cream text-sm font-medium">{module.title}</p>
                      <p className="text-sand text-xs">{module.duration_minutes} min</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sand">
                  <p>Todas as missões completadas! 🎖️</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Perfil Tático (Heptagrama) */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil Tático</CardTitle>
          </CardHeader>
          <CardContent>
            <HeptagramChart scores={stats?.heptagram_scores || {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
