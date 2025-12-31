import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading,
  className,
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-display uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-primary text-cream border-2 border-primary hover:bg-accent hover:border-accent',
    outline: 'bg-transparent text-cream border-2 border-primary hover:bg-primary',
    ghost: 'bg-transparent text-sand hover:text-cream hover:bg-primary/20',
    danger: 'bg-red-900/50 text-red-300 border-2 border-red-800 hover:bg-red-900',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⟳</span>
          Processando...
        </>
      ) : children}
    </button>
  )
}
