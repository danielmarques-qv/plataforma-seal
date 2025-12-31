import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Phone, Mail, DollarSign, Trash2, GripVertical } from 'lucide-react'
import { crmApi, type Lead, type CreateLeadData } from '../../lib/api'
import { Button, Input } from '../../components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import clsx from 'clsx'

const COLUMNS = [
  { id: 'RADAR', label: 'RADAR', description: 'Leads Identificados', color: 'border-blue-600' },
  { id: 'COMBATE', label: 'COMBATE', description: 'Em Negociação', color: 'border-yellow-600' },
  { id: 'EXTRAÇÃO', label: 'EXTRAÇÃO', description: 'Proposta Enviada', color: 'border-orange-600' },
  { id: 'RESGATE', label: 'RESGATE', description: 'Família Salva', color: 'border-green-600' },
]

export function FrontlinePage() {
  const queryClient = useQueryClient()
  const [showNewLead, setShowNewLead] = useState(false)
  const [newLead, setNewLead] = useState<CreateLeadData>({ name: '', phone: '', potential_value: 0 })
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  const { data: board, isLoading } = useQuery({
    queryKey: ['crm-board'],
    queryFn: () => crmApi.getBoard(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateLeadData) => crmApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-board'] })
      setShowNewLead(false)
      setNewLead({ name: '', phone: '', potential_value: 0 })
    },
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => crmApi.moveLead(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-board'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => crmApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-board'] })
    },
  })

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (draggedLead && draggedLead.status !== columnId) {
      moveMutation.mutate({ id: draggedLead.id, status: columnId })
    }
    setDraggedLead(null)
  }

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (newLead.name) {
      createMutation.mutate(newLead)
    }
  }

  const getColumnLeads = (columnId: string): Lead[] => {
    if (!board) return []
    return board[columnId as keyof typeof board] as Lead[] || []
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Carregando Frontline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
            FRONTLINE CRM
          </h1>
          <p className="text-sand">
            Pipeline Tático • {board?.total_count || 0} leads • {board?.families_saved || 0} famílias salvas
          </p>
        </div>
        <Button onClick={() => setShowNewLead(true)}>
          <Plus className="w-4 h-4" />
          Novo Lead
        </Button>
      </div>

      {/* Modal Novo Lead */}
      {showNewLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Identificar Novo Alvo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLead} className="space-y-4">
                <Input
                  label="Nome"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  required
                />
                <Input
                  label="Telefone"
                  value={newLead.phone || ''}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
                <Input
                  label="Valor Potencial"
                  type="number"
                  value={newLead.potential_value || ''}
                  onChange={(e) => setNewLead({ ...newLead, potential_value: Number(e.target.value) })}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowNewLead(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>
                    Adicionar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={clsx(
              'bg-surface border-t-4 flex flex-col',
              column.color
            )}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-primary/30">
              <h3 className="font-display text-cream uppercase tracking-wider">
                {column.label}
              </h3>
              <p className="text-sand text-xs">{column.description}</p>
              <p className="text-primary font-display mt-1">
                {getColumnLeads(column.id).length} leads
              </p>
            </div>

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {getColumnLeads(column.id).map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead)}
                  className={clsx(
                    'bg-background border border-primary/30 p-3 cursor-grab active:cursor-grabbing',
                    'hover:border-primary transition-colors',
                    draggedLead?.id === lead.id && 'opacity-50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-sand/50" />
                      <span className="text-cream font-medium text-sm">{lead.name}</span>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(lead.id)}
                      className="text-sand hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-1 text-xs text-sand">
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                    {lead.potential_value > 0 && (
                      <div className="flex items-center gap-2 text-primary">
                        <DollarSign className="w-3 h-3" />
                        <span>R$ {lead.potential_value.toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
