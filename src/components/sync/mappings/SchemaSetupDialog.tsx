import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateTableForm } from './CreateTableForm';
import { ColumnMappingEditor } from '@/components/sync/ColumnMappingEditor';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { GlideTable } from '@/types/glsync';
import GlideTableSelector from '@/components/sync/GlideTableSelector';
import { useSupabaseTables } from '@/hooks/useSupabaseTables';
import { useGlSync } from '@/hooks/useGlSync';
import { useAddMapping } from '@/hooks/useAddMapping';

interface SchemaSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  onSuccess: () => void;
}

export function SchemaSetupDialog({ 
  open, 
  onOpenChange, 
  connectionId, 
  onSuccess 
}: SchemaSetupDialogProps) {
  const [activeTab, setActiveTab] = useState('create-table');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedGlideTable, setSelectedGlideTable] = useState('');
  const [selectedGlideTableDisplayName, setSelectedGlideTableDisplayName] = useState('');
  const [columnMapping, setColumnMapping] = useState<any>({
    supabase_table: '',
    column_mappings: {}
  });
  const [isCreatingMapping, setIsCreatingMapping] = useState(false);
  
  const { toast } = useToast();
  const { tables: supabaseTables, fetchTables } = useSupabaseTables();
  const { fetchGlideTables, glideTables, isLoading: isLoadingGlideTables } = useGlSync();
  const { addMapping } = useAddMapping();

  // Handle table creation success
  const handleTableCreated = (tableName: string) => {
    setSelectedTable(tableName);
    setColumnMapping({
      supabase_table: tableName,
      column_mappings: {}
    });
    fetchTables(); // Refresh the tables list
    setActiveTab('column-mapping');
    
    toast({
      title: 'Table Created',
      description: 'Now define your column mappings to connect with Glide'
    });
  };

  // Handle column mapping updates
  const handleColumnMappingUpdate = (updatedMapping: any) => {
    setColumnMapping(updatedMapping);
  };

  // Handle Glide table selection
  const handleGlideTableChange = (tableId: string, displayName: string) => {
    setSelectedGlideTable(tableId);
    setSelectedGlideTableDisplayName(displayName);
  };

  // Create the mapping between Glide and Supabase
  const createMapping = async () => {
    if (!connectionId || !selectedGlideTable || !selectedTable) {
      toast({
        title: 'Validation Error',
        description: 'Please select both a Glide table and a Supabase table',
        variant: 'destructive'
      });
      return;
    }

    if (Object.keys(columnMapping.column_mappings).length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please define at least one column mapping',
        variant: 'destructive'
      });
      return;
    }

    setIsCreatingMapping(true);

    try {
      // Use the addMapping function from the hook, but add our column mappings
      const success = await addMapping(
        connectionId,
        selectedGlideTable,
        selectedGlideTableDisplayName,
        selectedTable,
        'to_supabase', // Default direction
        columnMapping.column_mappings
      );

      if (success) {
        toast({
          title: 'Success',
          description: 'Table mapping created successfully'
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating mapping:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create mapping',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingMapping(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Table Mapping</DialogTitle>
          <DialogDescription>
            Create a new Supabase table or define column mappings for an existing table
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="create-table">Create Table</TabsTrigger>
            <TabsTrigger value="column-mapping">Column Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="create-table" className="space-y-4 pt-4">
            <CreateTableForm
              onTableCreated={handleTableCreated}
              onCancel={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="column-mapping" className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Glide Table</h3>
                <GlideTableSelector
                  tables={glideTables}
                  value={selectedGlideTable}
                  onTableChange={handleGlideTableChange}
                  isLoading={isLoadingGlideTables}
                  placeholder="Select a Glide table"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Supabase Table</h3>
                <select
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                  value={selectedTable}
                  onChange={(e) => {
                    setSelectedTable(e.target.value);
                    setColumnMapping({
                      supabase_table: e.target.value,
                      column_mappings: {}
                    });
                  }}
                >
                  <option value="">Select a table</option>
                  {supabaseTables.map((table: any) => (
                    <option key={table.table_name} value={table.table_name}>
                      {table.table_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedTable && (
              <div className="border-t pt-4">
                <ColumnMappingEditor 
                  mapping={columnMapping}
                  onUpdate={handleColumnMappingUpdate}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={createMapping}
                disabled={isCreatingMapping || !selectedGlideTable || !selectedTable || Object.keys(columnMapping.column_mappings).length === 0}
              >
                {isCreatingMapping ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Mapping...
                  </>
                ) : (
                  'Create Mapping'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 