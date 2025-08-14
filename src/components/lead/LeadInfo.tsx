import { Lead, CustomField } from '@/types';
import { useCRM } from '@/contexts/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Tag, 
  Edit,
  Save
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadInfoProps {
  lead: Lead;
}

export function LeadInfo({ lead }: LeadInfoProps) {
  const { account, updateLead } = useCRM();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);

  const handleSave = () => {
    updateLead(lead.id, editedLead);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };

  const getCustomFieldValue = (fieldId: string) => {
    const customFieldValue = lead.customFields.find(cf => cf.fieldId === fieldId);
    return customFieldValue?.value || '';
  };

  const renderCustomFieldInput = (field: CustomField) => {
    const value = getCustomFieldValue(field.id);

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value as string}
            onChange={(e) => {
              const newCustomFields = editedLead.customFields.filter(cf => cf.fieldId !== field.id);
              newCustomFields.push({ fieldId: field.id, value: e.target.value });
              setEditedLead({ ...editedLead, customFields: newCustomFields });
            }}
            disabled={!isEditing}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value as number}
            onChange={(e) => {
              const newCustomFields = editedLead.customFields.filter(cf => cf.fieldId !== field.id);
              newCustomFields.push({ fieldId: field.id, value: Number(e.target.value) });
              setEditedLead({ ...editedLead, customFields: newCustomFields });
            }}
            disabled={!isEditing}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value as string}
            onChange={(e) => {
              const newCustomFields = editedLead.customFields.filter(cf => cf.fieldId !== field.id);
              newCustomFields.push({ fieldId: field.id, value: e.target.value });
              setEditedLead({ ...editedLead, customFields: newCustomFields });
            }}
            disabled={!isEditing}
            rows={3}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value as string}
            onValueChange={(newValue) => {
              const newCustomFields = editedLead.customFields.filter(cf => cf.fieldId !== field.id);
              newCustomFields.push({ fieldId: field.id, value: newValue });
              setEditedLead({ ...editedLead, customFields: newCustomFields });
            }}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecionar ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value ? format(new Date(value as Date), 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const newCustomFields = editedLead.customFields.filter(cf => cf.fieldId !== field.id);
              newCustomFields.push({ fieldId: field.id, value: new Date(e.target.value) });
              setEditedLead({ ...editedLead, customFields: newCustomFields });
            }}
            disabled={!isEditing}
          />
        );
      
      default:
        return <Input value={value as string} disabled />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informações Básicas</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editedLead.name}
                onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex">
                <Mail className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={editedLead.email}
                  onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <div className="flex">
                <Phone className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={editedLead.phone}
                  onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <div className="flex">
                <Building2 className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                <Input
                  id="company"
                  value={editedLead.company || ''}
                  onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="value">Valor do Negócio</Label>
            <Input
              id="value"
              type="number"
              value={editedLead.value}
              onChange={(e) => setEditedLead({ ...editedLead, value: Number(e.target.value) })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
            {lead.tags.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhuma tag adicionada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Fields */}
      {account.customFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campos Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {account.customFields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>
                  {field.name}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {renderCustomFieldInput(field)}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Canais de Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lead.contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={contact.primary ? 'default' : 'secondary'}>
                    {contact.type}
                  </Badge>
                  <span className="font-medium">{contact.value}</span>
                  {contact.verified && (
                    <Badge variant="outline" className="text-xs">
                      Verificado
                    </Badge>
                  )}
                </div>
                {contact.primary && (
                  <Badge variant="default" className="text-xs">
                    Principal
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}