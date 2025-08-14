import { useCRM } from '@/contexts/CRMContext';
import { PipelineColumn } from './PipelineColumn';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

export function PipelineBoard() {
  const { pipelineStages, updateLeadStage } = useCRM();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update lead stage
    updateLeadStage(draggableId, destination.droppableId);
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Pipeline de Vendas</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seus leads através do funil de vendas
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
          {pipelineStages.map((stage) => (
            <PipelineColumn key={stage.id} stage={stage} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}