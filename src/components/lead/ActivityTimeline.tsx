import { Activity } from '@/types';
import { 
  Clock, 
  Plus, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  FileText,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'stage_changed':
        return <ArrowRight className="h-4 w-4 text-orange-500" />;
      case 'message_sent':
      case 'message_received':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'call_made':
        return <Phone className="h-4 w-4 text-purple-500" />;
      case 'note_added':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'field_updated':
        return <Edit className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'border-blue-200 bg-blue-50';
      case 'stage_changed':
        return 'border-orange-200 bg-orange-50';
      case 'message_sent':
      case 'message_received':
        return 'border-green-200 bg-green-50';
      case 'call_made':
        return 'border-purple-200 bg-purple-50';
      case 'note_added':
        return 'border-gray-200 bg-gray-50';
      case 'field_updated':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="font-medium text-foreground mb-2">Nenhuma atividade registrada</h3>
        <p className="text-sm text-muted-foreground">
          As atividades do lead aparecerão aqui conforme forem sendo realizadas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Timeline de Atividades</h3>
        <span className="text-sm text-muted-foreground">
          {activities.length} atividade(s)
        </span>
      </div>

      <div className="space-y-4">
        {sortedActivities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full border-2 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              {index < sortedActivities.length - 1 && (
                <div className="w-px h-8 bg-border mt-2" />
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <time className="text-xs text-muted-foreground">
                  {format(activity.timestamp, "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                </time>
              </div>
              
              {activity.metadata && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {JSON.stringify(activity.metadata, null, 2)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Button */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Plus className="h-4 w-4 mr-2" />
          <span>Adicionar atividade manual (em desenvolvimento)</span>
        </div>
      </div>
    </div>
  );
}