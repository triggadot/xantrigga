
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GlConnection, GlMapping } from '@/types/glsync';
import { useConnections } from '@/hooks/useConnections';
import { useSupabaseTables } from '@/hooks/useSupabaseTables';
import MappingFormContainer from './MappingFormContainer';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection?: GlConnection;
  mapping: GlMapping;
  onSuccess: () => void;
}

const EditMappingDialog = ({ 
  open, 
  onOpenChange,
  connection,
  mapping,
  onSuccess 
}: EditMappingDialogProps) => {
  const { connections, isLoading: isLoadingConnections, fetchConnections } = useConnections();
  const { tables: supabaseTables, isLoading: isLoadingSupabaseTables, fetchTables: fetchSupabaseTables } = useSupabaseTables();
  const isMobile = useIsMobile();
  
  // Fetch data when dialog is opened
  useEffect(() => {
    if (open) {
      fetchConnections();
      fetchSupabaseTables();
    }
  }, [open]);

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  // Extract table names for the form
  const tableNames = supabaseTables.map(table => table.table_name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'p-3' : 'p-4'} overflow-y-auto`}>
        <DialogHeader className="mb-2">
          <DialogTitle>Edit Mapping</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-1">
          <MappingFormContainer
            mapping={mapping}
            isEditing={true}
            connections={connections}
            supabaseTables={tableNames}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMappingDialog;
