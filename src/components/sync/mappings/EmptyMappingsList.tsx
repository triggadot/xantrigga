
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AddMappingButton } from './AddMappingButton';
import { CreateSchemaButton } from './CreateSchemaButton';

interface EmptyMappingsListProps {
  connectionId?: string;
  onMappingCreated?: () => Promise<void>;
}

export const EmptyMappingsList: React.FC<EmptyMappingsListProps> = ({ 
  connectionId,
  onMappingCreated 
}) => {
  // Create an async function to wrap the sync handler
  const handleMappingCreated = async () => {
    if (onMappingCreated) {
      await onMappingCreated();
    }
    return Promise.resolve();
  };
  
  return (
    <Card className="shadow-none">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Mappings Found</h3>
          <p className="text-muted-foreground">
            Create a mapping to sync data between Glide and Supabase.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <AddMappingButton 
            onSuccess={handleMappingCreated}
            connectionId={connectionId}
          />
          
          <CreateSchemaButton onMappingCreated={handleMappingCreated} />
        </div>
      </CardContent>
    </Card>
  );
};
