import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Play, CheckCircle, Lock, Clock } from 'lucide-react'
import { trainingApi } from '../../lib/api'
import { Button } from '../../components/ui'
import { Card, CardContent } from '../../components/ui'
import { ProgressBar } from '../../components/Dashboard'
import clsx from 'clsx'

export function TrainingPage() {
  const queryClient = useQueryClient()

  const { data: overview, isLoading } = useQuery({
    queryKey: ['training-overview'],
    queryFn: () => trainingApi.getOverview(),
  })

  const completeMutation = useMutation({
    mutationFn: (moduleId: number) => trainingApi.completeModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-overview'] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Carregando treinamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
          TREINAMENTOS
        </h1>
        <p className="text-sand">
          Módulos de capacitação tática
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-display text-cream">{overview?.total_modules || 0}</p>
              <p className="text-sand text-sm">Total de Módulos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display text-green-400">{overview?.completed_modules || 0}</p>
              <p className="text-sand text-sm">Completados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display text-primary">{overview?.available_modules || 0}</p>
              <p className="text-sand text-sm">Disponíveis</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display text-sand">{overview?.locked_modules || 0}</p>
              <p className="text-sand text-sm">Bloqueados</p>
            </div>
          </div>
          
          <ProgressBar
            current={overview?.completed_modules || 0}
            goal={overview?.available_modules || 1}
            label="Progresso do Treinamento"
          />
        </CardContent>
      </Card>

      {/* Modules List */}
      <div className="space-y-4">
        {overview?.modules.map((module) => (
          <Card 
            key={module.id}
            className={clsx(
              module.is_locked && 'opacity-60'
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                {/* Thumbnail */}
                <div className="w-48 h-32 bg-background/50 flex items-center justify-center border-r border-primary/30 flex-shrink-0">
                  {module.thumbnail_url ? (
                    <img 
                      src={module.thumbnail_url} 
                      alt={module.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={clsx(
                      'w-16 h-16 rounded-full flex items-center justify-center',
                      module.is_locked ? 'bg-sand/20' : module.is_completed ? 'bg-green-900/30' : 'bg-primary/20'
                    )}>
                      {module.is_locked ? (
                        <Lock className="w-8 h-8 text-sand/50" />
                      ) : module.is_completed ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <Play className="w-8 h-8 text-primary" />
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-primary uppercase tracking-wider">
                          Módulo {module.order_index}
                        </span>
                        {module.is_completed && (
                          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5">
                            COMPLETO
                          </span>
                        )}
                        {module.is_locked && (
                          <span className="text-xs text-sand bg-sand/20 px-2 py-0.5">
                            BLOQUEADO
                          </span>
                        )}
                      </div>
                      <h3 className="text-cream font-medium text-lg">{module.title}</h3>
                      {module.description && (
                        <p className="text-sand text-sm mt-1">{module.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sand text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration_minutes} min</span>
                      </div>
                      
                      {!module.is_locked && !module.is_completed && (
                        <Button
                          size="sm"
                          onClick={() => {
                            if (module.video_url) {
                              window.open(module.video_url, '_blank')
                            }
                            completeMutation.mutate(module.id)
                          }}
                        >
                          <Play className="w-4 h-4" />
                          Assistir
                        </Button>
                      )}
                      
                      {module.is_completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (module.video_url) {
                              window.open(module.video_url, '_blank')
                            }
                          }}
                        >
                          Rever
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
