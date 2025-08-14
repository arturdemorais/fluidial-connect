import { useCRM } from '@/contexts/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  MessageCircle, 
  Instagram, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Integrations() {
  const { integrations } = useCRM();

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-green-500" />;
      case 'instagram':
        return <Instagram className="h-6 w-6 text-pink-500" />;
      case 'phone':
        return <Phone className="h-6 w-6 text-blue-500" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const totalIntegrations = integrations.length;

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
            <p className="text-muted-foreground mt-1">
              Conecte seus canais de comunicação
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nova Integração
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedIntegrations}</div>
            <p className="text-xs text-muted-foreground">
              de {totalIntegrations} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 min</div>
            <p className="text-xs text-muted-foreground">atrás</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operacional</div>
            <p className="text-xs text-muted-foreground">Todos os sistemas funcionando</p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-soft transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Integration Icon */}
                  <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-lg">
                    {getIntegrationIcon(integration.type)}
                  </div>

                  {/* Integration Info */}
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {integration.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                      {integration.lastSync && (
                        <span className="text-sm text-muted-foreground">
                          • Última sync: {format(integration.lastSync, 'HH:mm', { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {integration.status === 'connected' ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-gradient-primary" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Conectar
                    </Button>
                  )}
                </div>
              </div>

              {/* Integration Details */}
              {integration.status === 'connected' && integration.config && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(integration.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error State */}
              {integration.status === 'error' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Erro na conexão. Verifique as configurações e tente novamente.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Integrations */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integrações Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Telegram', icon: MessageCircle, description: 'Conecte com Telegram Bot API' },
              { name: 'Facebook Messenger', icon: MessageCircle, description: 'Integração com Facebook Messenger' },
              { name: 'Email', icon: MessageCircle, description: 'SMTP/IMAP para emails' },
            ].map((available) => (
              <div key={available.name} className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center">
                <available.icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium text-foreground">{available.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{available.description}</p>
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  Em breve
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}