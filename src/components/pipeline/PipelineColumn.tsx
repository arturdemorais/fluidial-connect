import { PipelineStage } from '@/types';
import { useCRM } from '@/contexts/CRMContext';
import { LeadCard } from './LeadCard';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PipelineColumnProps {
  stage: PipelineStage;
}

export function PipelineColumn({ stage }: PipelineColumnProps) {
  const { getLeadsByStage, getTotalValueByStage } = useCRM();
  
  const leads = getLeadsByStage(stage.id);
  const totalValue = getTotalValueByStage(stage.id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="pipeline-column">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="font-semibold text-foreground">{stage.name}</h3>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Total Value */}
      <div className="mb-4 p-3 bg-accent/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Valor Total</p>
        <p className="font-bold text-lg text-accent-foreground">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-accent/30 rounded-lg p-2' : ''
            }`}
            style={{ minHeight: '400px' }}
          >
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {provided.placeholder}
            
            {/* Add Lead Button */}
            <Button
              variant="ghost"
              className="w-full h-auto p-4 border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/20 text-muted-foreground hover:text-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Lead
            </Button>
          </div>
        )}
      </Droppable>
    </div>
  );
}