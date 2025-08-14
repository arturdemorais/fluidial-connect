import { PipelineBoard } from '@/components/pipeline/PipelineBoard';
import { LeadDetailModal } from '@/components/lead/LeadDetailModal';
import { useCRM } from '@/contexts/CRMContext';

export default function Pipeline() {
  const { selectedLead, setSelectedLead } = useCRM();

  return (
    <>
      <PipelineBoard />
      <LeadDetailModal 
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </>
  );
}