import { 
  BarChart3, 
  Users, 
  Settings, 
  Zap,
  Home
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Pipeline', href: '/pipeline', icon: BarChart3 },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Integrações', href: '/integrations', icon: Zap },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="bg-gradient-primary rounded-lg p-2">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <span className="ml-3 text-lg font-semibold text-sidebar-foreground">
          CRM Pro
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-semibold'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">CS</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">Carlos Silva</p>
            <p className="text-xs text-sidebar-foreground/60">Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}