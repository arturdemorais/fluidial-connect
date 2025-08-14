import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCRM } from '@/contexts/CRMContext';

export function Header() {
  const { getLeadCount, getTotalPipelineValue } = useCRM();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Search */}
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar leads, contatos ou empresas..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <p className="font-semibold text-foreground">{getLeadCount()}</p>
            <p className="text-xs text-muted-foreground">Leads Ativos</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {formatCurrency(getTotalPipelineValue())}
            </p>
            <p className="text-xs text-muted-foreground">Pipeline Total</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 ml-6">
          <Button size="sm" className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}