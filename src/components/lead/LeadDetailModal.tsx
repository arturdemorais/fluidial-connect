import { Lead } from '@/types';
import { useCRM } from '@/contexts/CRMContext';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LeadInfo } from './LeadInfo';
import { ChatInterface } from './ChatInterface';
import { ActivityTimeline } from './ActivityTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MessageCircle, 
  Clock, 
  X 
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailModal({ lead, open, onClose }: LeadDetailModalProps) {
  if (!lead) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0">
        <div className="flex h-full">
          {/* Left Side - Lead Information */}
          <div className="flex-1 border-r border-border">
            <SheetHeader className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-xl font-bold">
                    {lead.name}
                  </SheetTitle>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge 
                      style={{ backgroundColor: lead.stage.color }}
                      className="text-white"
                    >
                      {lead.stage.name}
                    </Badge>
                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(lead.value)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Tabs defaultValue="info" className="h-full">
                <TabsList className="grid w-full grid-cols-3 m-4">
                  <TabsTrigger value="info" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Informações
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Notas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="px-4 pb-4">
                  <LeadInfo lead={lead} />
                </TabsContent>

                <TabsContent value="timeline" className="px-4 pb-4">
                  <ActivityTimeline activities={lead.activities} />
                </TabsContent>

                <TabsContent value="notes" className="px-4 pb-4">
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Funcionalidade de notas em desenvolvimento</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="w-96 flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-lg">Conversas</h3>
              <p className="text-sm text-muted-foreground">
                {lead.conversations.length} canal(is) ativo(s)
              </p>
            </div>
            
            <div className="flex-1">
              <ChatInterface lead={lead} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}