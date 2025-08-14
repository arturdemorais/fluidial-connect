import { Lead, Conversation, Message } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Instagram,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatInterfaceProps {
  lead: Lead;
}

export function ChatInterface({ lead }: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    lead.conversations[0] || null
  );
  const [newMessage, setNewMessage] = useState('');

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Simulate sending a message (in real app, this would call an API)
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (lead.conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-medium text-foreground mb-2">Nenhuma conversa ativa</h3>
          <p className="text-sm text-muted-foreground">
            As conversas aparecerão aqui quando o lead entrar em contato
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Channel Tabs */}
      <Tabs value={selectedConversation?.id} onValueChange={(value) => {
        const conv = lead.conversations.find(c => c.id === value);
        setSelectedConversation(conv || null);
      }}>
        <TabsList className="grid w-full grid-cols-auto m-2 h-auto">
          {lead.conversations.map((conversation) => (
            <TabsTrigger 
              key={conversation.id} 
              value={conversation.id}
              className="flex items-center space-x-2 relative"
            >
              {getChannelIcon(conversation.channel)}
              <span className="text-xs">{getChannelName(conversation.channel)}</span>
              {conversation.unreadCount > 0 && (
                <Badge className="h-4 w-4 p-0 text-[10px] absolute -top-1 -right-1">
                  {conversation.unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {lead.conversations.map((conversation) => (
          <TabsContent key={conversation.id} value={conversation.id} className="flex-1 flex flex-col m-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversation.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
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
              <p className="text-xs text-muted-foreground mt-2">
                Conectado via {getChannelName(conversation.channel)}
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.sender === 'user';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center justify-between mt-1 text-xs ${
          isSent ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              {format(message.timestamp, 'HH:mm', { locale: ptBR })}
            </span>
          </div>
          {isSent && (
            <Badge 
              variant="secondary" 
              className={`text-[10px] h-4 px-1 ${
                message.status === 'read' ? 'bg-green-100 text-green-700' : 
                message.status === 'delivered' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-gray-100 text-gray-700'
              }`}
            >
              {message.status === 'read' ? 'Lida' : 
               message.status === 'delivered' ? 'Entregue' : 
               'Enviada'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}