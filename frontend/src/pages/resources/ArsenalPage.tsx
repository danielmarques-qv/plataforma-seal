import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { FolderDown, FileText, BookOpen, FileSpreadsheet, Download } from 'lucide-react'
import { resourcesApi, type Resource } from '../../lib/api'
import { Button } from '../../components/ui'
import { Card, CardContent } from '../../components/ui'
import clsx from 'clsx'

const CATEGORIES = [
  { id: 'ALL', label: 'Todos', icon: FolderDown },
  { id: 'SCRIPT', label: 'Scripts', icon: FileText },
  { id: 'PLAYBOOK', label: 'Playbooks', icon: BookOpen },
  { id: 'TEMPLATE', label: 'Templates', icon: FileSpreadsheet },
  { id: 'GUIDE', label: 'Guias', icon: BookOpen },
]

export function ArsenalPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const { data: arsenal, isLoading } = useQuery({
    queryKey: ['arsenal'],
    queryFn: () => resourcesApi.getArsenal(),
  })

  const downloadMutation = useMutation({
    mutationFn: (id: number) => resourcesApi.download(id),
    onSuccess: (data) => {
      window.open(data.file_url, '_blank')
    },
  })

  const getAllResources = (): Resource[] => {
    if (!arsenal) return []
    return [
      ...(arsenal.SCRIPT || []),
      ...(arsenal.PLAYBOOK || []),
      ...(arsenal.TEMPLATE || []),
      ...(arsenal.GUIDE || []),
    ]
  }

  const getFilteredResources = (): Resource[] => {
    if (activeCategory === 'ALL') return getAllResources()
    if (!arsenal) return []
    return arsenal[activeCategory as keyof typeof arsenal] as Resource[] || []
  }

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return cat?.icon || FileText
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-sand">Carregando Arsenal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
          ARSENAL
        </h1>
        <p className="text-sand">
          Scripts, Playbooks e documentos de apoio • {arsenal?.total_count || 0} recursos disponíveis
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 border transition-all',
                activeCategory === cat.id
                  ? 'bg-primary text-cream border-primary'
                  : 'bg-surface text-sand border-primary/30 hover:border-primary'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredResources().map((resource) => {
          const Icon = getCategoryIcon(resource.category)
          return (
            <Card key={resource.id}>
              <CardContent className="p-0">
                {/* Thumbnail / Icon */}
                <div className="h-32 bg-background/50 flex items-center justify-center border-b border-primary/30">
                  {resource.thumbnail_url ? (
                    <img 
                      src={resource.thumbnail_url} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="w-16 h-16 text-primary/50" />
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-primary uppercase tracking-wider">
                      {resource.category}
                    </span>
                    {resource.file_type && (
                      <span className="text-xs text-sand bg-background px-2 py-1">
                        {resource.file_type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-cream font-medium mb-2">{resource.title}</h3>
                  
                  {resource.description && (
                    <p className="text-sand text-sm mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-sand">
                      {resource.download_count} downloads
                    </span>
                    <Button
                      size="sm"
                      onClick={() => downloadMutation.mutate(resource.id)}
                      isLoading={downloadMutation.isPending}
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {getFilteredResources().length === 0 && (
        <div className="text-center py-16">
          <FolderDown className="w-16 h-16 text-sand/30 mx-auto mb-4" />
          <p className="text-sand">Nenhum recurso encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  )
}
