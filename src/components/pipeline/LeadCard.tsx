import { Lead } from '@/types';
import { Draggable } from '@hello-pangea/dnd';
import { 
  MessageCircle, 
  Phone, 
  Instagram, 
  Building2, 
  Calendar,
  Tag
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadCardProps {
  lead: Lead;
  index: number;
}

export function LeadCard({ lead, index }: LeadCardProps) {
  const { setSelectedLead } = useCRM();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 channel-whatsapp" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 channel-instagram" />;
      case 'phone':
        return <Phone className="h-4 w-4 channel-phone" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'whatsapp':
        return 'default';
      case 'instagram':
        return 'secondary';
      case 'website':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`lead-card ${snapshot.isDragging ? 'dragging' : ''}`}
          onClick={() => setSelectedLead(lead)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-card-foreground truncate">
                {lead.name}
              </h4>
              {lead.company && (
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3 mr-1" />
                  <span className="truncate">{lead.company}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 ml-2">
              {getChannelIcon(lead.source)}
            </div>
          </div>

          {/* Value */}
          <div className="mb-3">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(lead.value)}
            </p>
          </div>

          {/* Source and Last Contact */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant={getSourceBadgeVariant(lead.source)} className="text-xs">
              {lead.source}
            </Badge>
            {lead.lastInteraction && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {formatDistanceToNow(lead.lastInteraction, { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {lead.tags.slice(0, 2).map((tag) => (
                <div 
                  key={tag}
                  className="flex items-center text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </div>
              ))}
              {lead.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{lead.tags.length - 2} mais
                </span>
              )}
            </div>
          )}

          {/* Active Conversations Indicator */}
          {lead.conversations.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>{lead.conversations.length} conversa(s)</span>
              </div>
              {lead.conversations.some(c => c.unreadCount > 0) && (
                <div className="h-2 w-2 bg-destructive rounded-full"></div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}