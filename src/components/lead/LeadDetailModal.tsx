import { Lead } from '@/types';
import { useCRM } from '@/contexts/CRMContext';
import { useState } from 'react';
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
import { FullScreenChat } from '@/components/chat/FullScreenChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MessageCircle, 
  Clock, 
  X,
  Maximize2,
  Zap,
  Calendar,
  Phone
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailModal({ lead, open, onClose }: LeadDetailModalProps) {
  const [showFullScreenChat, setShowFullScreenChat] = useState(false);
  
  if (!lead) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (showFullScreenChat) {
    return (
      <FullScreenChat 
        lead={lead} 
        onClose={() => setShowFullScreenChat(false)}
      />
    );
  }

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

          {/* Right Side - Chat Interface Otimizada */}
          <div className="w-96 flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Conversas</h3>
                  <p className="text-sm text-muted-foreground">
                    {lead.conversations.length} canal(is) ativo(s)
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowFullScreenChat(true)}
                  title="Expandir chat"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Ações Rápidas */}
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary">
                  <Zap className="h-3 w-3 mr-1" />
                  Acelerar
                </Button>
              </div>
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