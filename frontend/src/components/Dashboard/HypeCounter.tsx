import { Users } from 'lucide-react'

interface HypeCounterProps {
  count: number
  operatorName: string
}

export function HypeCounter({ count, operatorName }: HypeCounterProps) {
  return (
    <div className="bg-surface border border-primary p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary/20 border-2 border-primary flex items-center justify-center">
          <Users className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <p className="text-sand uppercase tracking-widest text-sm mb-2">
        Famílias Salvas pelo SEAL
      </p>
      
      <p className="font-display text-6xl text-cream mb-2">
        {count}
      </p>
      
      <p className="text-primary font-display uppercase tracking-wider">
        {operatorName}
      </p>
    </div>
  )
}
