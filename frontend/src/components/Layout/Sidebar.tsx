import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Target, 
  GraduationCap, 
  FolderDown, 
  DollarSign,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import clsx from 'clsx'
import logoSeal from '../../assets/Logo SEAL.png'

const navItems = [
  { path: '/war-room', label: 'War Room', icon: LayoutDashboard },
  { path: '/frontline', label: 'Frontline', icon: Target },
  { path: '/arsenal', label: 'Arsenal', icon: FolderDown },
  { path: '/treinamentos', label: 'Treinamentos', icon: GraduationCap },
  { path: '/comissoes', label: 'Comissões', icon: DollarSign },
]

export function Sidebar() {
  const location = useLocation()
  const { profile, signOut } = useAuthStore()

  return (
    <aside className="w-64 bg-surface border-r border-primary/30 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4 border-b border-primary/30">
        <Link to="/war-room" className="flex items-center justify-center">
          <img src={logoSeal} alt="SEAL" className="h-16 w-auto" />
        </Link>
      </div>

      {/* Profile Mini */}
      <div className="p-4 border-b border-primary/30">
        <p className="text-xs text-sand uppercase tracking-wider mb-1">Operador Logado</p>
        <p className="text-cream font-medium truncate">{profile?.full_name || 'Estrategista'}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 transition-all',
                    isActive 
                      ? 'bg-primary text-cream border-l-4 border-accent' 
                      : 'text-sand hover:bg-primary/20 hover:text-cream border-l-4 border-transparent'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium uppercase text-sm tracking-wider">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary/30">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-sand hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium uppercase text-sm tracking-wider">Encerrar Missão</span>
        </button>
      </div>
    </aside>
  )
}
