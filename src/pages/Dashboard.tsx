import { useCRM } from '@/contexts/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Target,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  Phone,
  AlertTriangle,
  Zap,
  DollarSign,
  Activity,
  Timer,
  Trophy,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { 
    leads,
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

  // Métricas avançadas para vendas
  const getHotLeads = () => leads.filter(lead => 
    lead.lastInteraction && 
    (Date.now() - lead.lastInteraction.getTime()) < 24 * 60 * 60 * 1000 &&
    lead.stage.id !== 'won' && lead.stage.id !== 'lost'
  );

  const getColdLeads = () => leads.filter(lead => 
    lead.lastInteraction && 
    (Date.now() - lead.lastInteraction.getTime()) > 3 * 24 * 60 * 60 * 1000 &&
    lead.stage.id !== 'won' && lead.stage.id !== 'lost'
  );

  const getFollowUpToday = () => leads.filter(lead => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return lead.followUpDate && 
           lead.followUpDate >= today && 
           lead.followUpDate < tomorrow;
  });

  const getOverdueFollowups = () => leads.filter(lead => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return lead.followUpDate && lead.followUpDate < today;
  });

  const hotLeads = getHotLeads();
  const coldLeads = getColdLeads();
  const followUpToday = getFollowUpToday();
  const overdueFollowups = getOverdueFollowups();
  
  const conversionRate = pipelineStages.length > 0 ? 
    (getLeadsByStage('won').length / getLeadCount() * 100) : 0;

  const avgDealSize = getLeadCount() > 0 ? getTotalPipelineValue() / getLeadCount() : 0;

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      {/* Header com Ações Críticas */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Cockpit de Vendas
          </h1>
          <p className="text-muted-foreground mt-1">
            Sua central de controle para alta performance
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            className="bg-gradient-primary"
            onClick={() => navigate('/pipeline')}
          >
            <Zap className="h-4 w-4 mr-2" />
            Acelerar Pipeline
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/contacts')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Central de Conversas
          </Button>
        </div>
      </div>

      {/* Alertas Críticos - Primeira coisa que vendedor vê */}
      {(overdueFollowups.length > 0 || coldLeads.length > 5) && (
        <Card className="border-orange-200 bg-orange-50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Ação Imediata Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {overdueFollowups.length > 0 && (
                <Badge variant="destructive" className="text-sm">
                  {overdueFollowups.length} follow-ups atrasados
                </Badge>
              )}
              {coldLeads.length > 5 && (
                <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800">
                  {coldLeads.length} leads esfriando há 3+ dias
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas de Performance - Foco em ação */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card className="hover:shadow-soft transition-shadow cursor-pointer col-span-2" 
              onClick={() => navigate('/pipeline')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Ativo</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(getTotalPipelineValue())}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {getLeadCount()} oportunidades ativas
            </div>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-soft transition-shadow cursor-pointer ${hotLeads.length > 0 ? 'border-green-200 bg-green-50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Quentes</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{hotLeads.length}</div>
            <p className="text-xs text-green-600 mt-1">
              Ativos nas últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-soft transition-shadow cursor-pointer ${followUpToday.length > 0 ? 'border-blue-200 bg-blue-50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Hoje</CardTitle>
            <Timer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{followUpToday.length}</div>
            <p className="text-xs text-blue-600 mt-1">
              Agendados para hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <Progress value={conversionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgDealSize)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por oportunidade
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Funil de Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance do Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage) => {
                const stageLeads = getLeadsByStage(stage.id);
                const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
                const percentage = getLeadCount() > 0 ? (stageLeads.length / getLeadCount()) * 100 : 0;
                
                return (
                  <div key={stage.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="font-medium">{stage.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {stageLeads.length}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatCurrency(stageValue)}</div>
                        <div className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% do total
                        </div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas do Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Prioridades Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUpToday.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(lead.value)} • {lead.stage.name}
                    </p>
                  </div>
                </div>
              ))}
              
              {overdueFollowups.slice(0, 3).map((lead) => (
                <div key={`overdue-${lead.id}`} className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{lead.name}</p>
                    <p className="text-xs text-red-600">
                      Atrasado • {formatCurrency(lead.value)}
                    </p>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => navigate('/pipeline')}
              >
                Ver Todas as Tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Estratégicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          className="bg-gradient-primary h-auto p-6 flex flex-col items-center space-y-3"
          onClick={() => navigate('/pipeline')}
        >
          <Target className="h-8 w-8" />
          <div className="text-center">
            <div className="font-semibold">Acelerar Pipeline</div>
            <div className="text-xs opacity-90">Mover leads quentes</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto p-6 flex flex-col items-center space-y-3 border-blue-200 hover:bg-blue-50"
          onClick={() => navigate('/contacts')}
        >
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <div className="text-center">
            <div className="font-semibold">Central de Conversas</div>
            <div className="text-xs text-muted-foreground">Responder leads</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto p-6 flex flex-col items-center space-y-3 border-green-200 hover:bg-green-50"
          onClick={() => navigate('/contacts')}
        >
          <Phone className="h-8 w-8 text-green-600" />
          <div className="text-center">
            <div className="font-semibold">Calls Agendadas</div>
            <div className="text-xs text-muted-foreground">Próximas reuniões</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto p-6 flex flex-col items-center space-y-3 border-purple-200 hover:bg-purple-50"
          onClick={() => navigate('/integrations')}
        >
          <Activity className="h-8 w-8 text-purple-600" />
          <div className="text-center">
            <div className="font-semibold">Automações</div>
            <div className="text-xs text-muted-foreground">Configurar fluxos</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;