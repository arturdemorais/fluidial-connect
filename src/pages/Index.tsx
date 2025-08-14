import { useCRM } from '@/contexts/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Target,
  ArrowUpRight,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { 
    getLeadCount, 
    getTotalPipelineValue, 
    pipelineStages, 
    getLeadsByStage,
    integrations 
  } = useCRM();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const conversionRate = pipelineStages.length > 0 ? 
    (getLeadsByStage(pipelineStages[pipelineStages.length - 1].id).length / getLeadCount() * 100) : 0;

  return (
    <div className="flex-1 p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao seu CRM conversacional
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-soft transition-shadow cursor-pointer" 
              onClick={() => navigate('/pipeline')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLeadCount()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => navigate('/pipeline')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalPipelineValue())}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => navigate('/integrations')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canais Conectados</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedIntegrations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {integrations.length} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              leads → fechamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage) => {
                const stageLeads = getLeadsByStage(stage.id);
                const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
                
                return (
                  <div key={stage.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stageLeads.length} leads</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(stageValue)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/pipeline')}
            >
              Ver Pipeline Completo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lead qualificado</p>
                  <p className="text-xs text-muted-foreground">João Silva • há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova mensagem WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Maria Oliveira • há 1 hora</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Reunião agendada</p>
                  <p className="text-xs text-muted-foreground">Pedro Santos • há 30 min</p>
                </div>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/contacts')}
            >
              Ver Todas Atividades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-gradient-primary h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/pipeline')}
            >
              <Users className="h-6 w-6" />
              <span>Gerenciar Pipeline</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/contacts')}
            >
              <MessageCircle className="h-6 w-6" />
              <span>Ver Conversas</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/integrations')}
            >
              <Target className="h-6 w-6" />
              <span>Configurar Integrações</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
