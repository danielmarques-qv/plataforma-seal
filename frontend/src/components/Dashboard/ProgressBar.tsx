interface ProgressBarProps {
  current: number
  goal: number
  label?: string
}

export function ProgressBar({ current, goal, label }: ProgressBarProps) {
  const percentage = goal > 0 ? Math.min(100, (current / goal) * 100) : 0
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-sand uppercase tracking-wider">{label}</span>
          <span className="text-cream font-display">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-4 bg-background border border-primary/30 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-sand">
        <span>R$ {current.toLocaleString('pt-BR')}</span>
        <span>Meta: R$ {goal.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}
