import { useQuery } from '@tanstack/react-query'
import { DollarSign, Clock, CheckCircle } from 'lucide-react'
import { commissionsApi } from '../../lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import clsx from 'clsx'

export function CommissionsPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['commissions-summary'],
    queryFn: () => commissionsApi.getSummary(),
  })

  const { data: rules } = useQuery({
    queryKey: ['commissions-rules'],
    queryFn: () => commissionsApi.getRules(),
  })

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Carregando comissões...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
          COMISSÕES
        </h1>
        <p className="text-sand">
          Extrato e regras de comissionamento
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card variant="highlight">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sand text-sm uppercase tracking-wider mb-1">Total Ganho</p>
            <p className="font-display text-3xl text-cream">
              R$ {(summary?.total_earned || 0).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-sand text-sm uppercase tracking-wider mb-1">Pendente</p>
            <p className="font-display text-3xl text-cream">
              R$ {(summary?.total_pending || 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-sand text-xs mt-1">{summary?.pending_count || 0} comissões</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-sand text-sm uppercase tracking-wider mb-1">Pago</p>
            <p className="font-display text-3xl text-cream">
              R$ {(summary?.total_paid || 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-sand text-xs mt-1">{summary?.paid_count || 0} comissões</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Regras de Comissionamento */}
        <Card>
          <CardHeader>
            <CardTitle>Regras de Comissionamento</CardTitle>
          </CardHeader>
          <CardContent>
            {rules && (
              <div className="space-y-4">
                <p className="text-sand text-sm">{rules.description}</p>
                
                <div className="space-y-3">
                  {rules.tiers.map((tier) => (
                    <div 
                      key={tier.tier}
                      className="bg-background/50 border border-primary/30 p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cream font-medium">{tier.name}</span>
                        <span className="font-display text-primary text-lg">
                          {tier.commission_rate}%
                        </span>
                      </div>
                      <p className="text-sand text-xs">
                        {tier.min_sales} - {tier.max_sales || '∞'} vendas
                      </p>
                      {tier.bonus && (
                        <p className="text-green-400 text-xs mt-1">
                          🎁 {tier.bonus}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extrato de Comissões */}
        <Card>
          <CardHeader>
            <CardTitle>Extrato de Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {summary?.commissions && summary.commissions.length > 0 ? (
                summary.commissions.map((commission) => (
                  <div 
                    key={commission.id}
                    className="flex items-center justify-between p-3 bg-background/50 border border-primary/30"
                  >
                    <div>
                      <p className="text-cream text-sm">
                        {commission.description || 'Comissão de venda'}
                      </p>
                      <p className="text-sand text-xs">
                        {new Date(commission.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-cream">
                        R$ {commission.amount.toLocaleString('pt-BR')}
                      </p>
                      <span className={clsx(
                        'text-xs px-2 py-0.5',
                        commission.status === 'PAID' ? 'text-green-400 bg-green-900/30' :
                        commission.status === 'APPROVED' ? 'text-blue-400 bg-blue-900/30' :
                        commission.status === 'CANCELLED' ? 'text-red-400 bg-red-900/30' :
                        'text-yellow-400 bg-yellow-900/30'
                      )}>
                        {commission.status === 'PAID' ? 'PAGO' :
                         commission.status === 'APPROVED' ? 'APROVADO' :
                         commission.status === 'CANCELLED' ? 'CANCELADO' : 'PENDENTE'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sand">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma comissão registrada ainda.</p>
                  <p className="text-xs mt-1">Suas comissões aparecerão aqui.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
