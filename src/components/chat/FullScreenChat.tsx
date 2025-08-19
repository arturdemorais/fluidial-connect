import { Lead, Conversation, Message } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Instagram,
  Clock,
  User,
  Calendar,
  DollarSign,
  Tag,
  MoreVertical,
  Paperclip,
  Smile,
  Zap,
  Star,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Video,
  Archive
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FullScreenChatProps {
  lead: Lead;
  onClose: () => void;
  onUpdateLead?: (updates: Partial<Lead>) => void;
}

export function FullScreenChat({ lead, onClose, onUpdateLead }: FullScreenChatProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    lead.conversations[0] || null
  );
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'instagram':
        return 'Instagram';
      case 'phone':
        return 'Telefone';
      default:
        return channel;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Simular envio de mensagem
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  const quickReplies = [
    "Oi! Obrigado pelo interesse 😊",
    "Posso agendar uma call para hoje?",
    "Vou enviar a proposta personalizada",
    "Qual o melhor horário para conversar?",
    "Tem alguma dúvida específica?",
    "Vamos fechar hoje? 🚀"
  ];

  if (lead.conversations.length === 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-medium text-foreground mb-2">Nenhuma conversa ativa</h3>
          <p className="text-sm text-muted-foreground mb-4">
            As conversas aparecerão aqui quando o lead entrar em contato
          </p>
          <Button onClick={onClose}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex">
      {/* Sidebar com info do lead */}
      <div className="w-80 border-r border-border bg-accent/30">
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge style={{ backgroundColor: lead.stage.color }} className="text-white">
                  {lead.stage.name}
                </Badge>
                <span className="font-semibold text-green-600">
                  {formatCurrency(lead.value)}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* Ações Rápidas */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <PhoneCall className="h-4 w-4 mr-2" />
                Ligar Agora
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Agendar Call
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Follow-up
              </Button>
              <Button size="sm" className="w-full justify-start bg-gradient-primary">
                <Zap className="h-4 w-4 mr-2" />
                Acelerar Venda
              </Button>
            </CardContent>
          </Card>

          {/* Informações do Lead */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.phone || 'Não informado'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.source || 'Origem não identificada'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {lead.lastInteraction ? 
                    `Último contato: ${format(lead.lastInteraction, 'dd/MM/yyyy HH:mm', { locale: ptBR })}` :
                    'Sem interação recente'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline de Atividades */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lead.activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-xs font-medium">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(activity.timestamp, 'dd/MM HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      {/* Área principal de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header do chat */}
        <div className="border-b border-border p-4">
          <Tabs value={selectedConversation?.id} onValueChange={(value) => {
            const conv = lead.conversations.find(c => c.id === value);
            setSelectedConversation(conv || null);
          }}>
            <TabsList className="grid w-full grid-cols-auto h-auto bg-transparent">
              {lead.conversations.map((conversation) => (
                <TabsTrigger 
                  key={conversation.id} 
                  value={conversation.id}
                  className="flex items-center space-x-2 relative data-[state=active]:bg-accent"
                >
                  {getChannelIcon(conversation.channel)}
                  <span className="text-sm font-medium">{getChannelName(conversation.channel)}</span>
                  {conversation.unreadCount > 0 && (
                    <Badge className="h-5 w-5 p-0 text-[10px] absolute -top-1 -right-1">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Área de mensagens */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {selectedConversation?.messages.map((message) => (
              <MessageBubbleExpanded key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Respostas rápidas */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Respostas Rápidas</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Input de mensagem */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Conectado via {selectedConversation ? getChannelName(selectedConversation.channel) : 'Canal'}
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Star className="h-3 w-3 mr-1" />
                  Favoritar
                </Button>
                <Button variant="ghost" size="sm">
                  <Archive className="h-3 w-3 mr-1" />
                  Arquivar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleExpandedProps {
  message: Message;
}

function MessageBubbleExpanded({ message }: MessageBubbleExpandedProps) {
  const isSent = message.sender === 'user';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className={`flex items-center justify-between mt-2 text-xs ${
          isSent ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              {format(message.timestamp, 'HH:mm', { locale: ptBR })}
            </span>
          </div>
          {isSent && (
            <div className="flex items-center space-x-1">
              {message.status === 'read' && <CheckCircle2 className="h-3 w-3 text-green-300" />}
              {message.status === 'delivered' && <CheckCircle2 className="h-3 w-3 text-white/50" />}
              {message.status === 'sent' && <Clock className="h-3 w-3 text-white/50" />}
              <span className="text-[10px]">
                {message.status === 'read' ? 'Lida' : 
                 message.status === 'delivered' ? 'Entregue' : 
                 'Enviada'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}