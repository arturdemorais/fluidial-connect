import { useCRM } from '@/contexts/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign,
  Clock,
  Zap,
  Users,
  Calendar
} from 'lucide-react';

export function PerformanceMetrics() {
  const { leads, pipelineStages, getTotalPipelineValue } = useCRM();

  // Métricas avançadas
  const getMetrics = () => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(l => l.stage.id === 'won').length;
    const lostLeads = leads.filter(l => l.stage.id === 'lost').length;
    const activeLeads = leads.filter(l => l.stage.id !== 'won' && l.stage.id !== 'lost').length;
    
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    const avgDealSize = wonLeads > 0 ? 
      leads.filter(l => l.stage.id === 'won').reduce((sum, lead) => sum + lead.value, 0) / wonLeads : 0;
    
    // Velocity (tempo médio no pipeline)
    const avgVelocity = 15; // Mock - seria calculado com datas reais
    
    // Leads por etapa
    const stageMetrics = pipelineStages.map(stage => {
      const stageLeads = leads.filter(l => l.stage.id === stage.id);
      const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
      return {
        ...stage,
        count: stageLeads.length,
        value: stageValue,
        percentage: totalLeads > 0 ? (stageLeads.length / totalLeads) * 100 : 0
      };
    });

    return {
      totalLeads,
      wonLeads,
      lostLeads,
      activeLeads,
      conversionRate,
      avgDealSize,
      avgVelocity,
      stageMetrics
    };
  };

  const metrics = getMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {metrics.conversionRate.toFixed(1)}%
            </div>
            <Progress value={metrics.conversionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 25%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.avgDealSize)}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Velocidade Média</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.avgVelocity} dias
            </div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              +3 dias vs meta
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeLeads}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Em {pipelineStages.length - 2} etapas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Etapa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Performance por Etapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.stageMetrics.map((stage) => (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium">{stage.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stage.count} leads
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{formatCurrency(stage.value)}</div>
                    <div className="text-xs text-muted-foreground">
                      {stage.percentage.toFixed(1)}% do pipeline
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={stage.percentage} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground min-w-[3rem]">
                    {stage.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Insights de Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Conversion rate acima da média do mercado (18%)
              </p>
              <p className="text-xs text-green-700">
                Continue focando na qualificação inicial dos leads
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Velocidade do pipeline pode melhorar
              </p>
              <p className="text-xs text-orange-700">
                Considere automatizar follow-ups na etapa de "Proposta"
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Ticket médio em crescimento
              </p>
              <p className="text-xs text-blue-700">
                Estratégia de upselling está funcionando bem
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}