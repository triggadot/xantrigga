
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlideTable } from "@/types/glsync";
import { Loader2 } from "lucide-react";

export interface GlideTableSelectorProps {
  value: string;
  onTableChange: (tableId: string, displayName?: string) => void;
  onAddTable?: (table: GlideTable) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  tables?: GlideTable[];
}

export function GlideTableSelector({
  value,
  onTableChange,
  onAddTable,
  disabled = false,
  isLoading = false,
  placeholder = "Select a table",
  tables = []
}: GlideTableSelectorProps) {
  const handleSelectChange = (newValue: string) => {
    if (newValue === 'add-new') {
      if (onAddTable) {
        // Create a blank table for the dialog
        onAddTable({ id: '', display_name: '' });
      }
    } else {
      // Find the selected table to get its display name
      const selectedTable = tables.find(table => table.id === newValue);
      onTableChange(newValue, selectedTable?.display_name);
    }
  };
  
  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={handleSelectChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Loading tables...</span>
            </div>
          ) : tables.length === 0 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              No tables found
            </div>
          ) : (
            <>
              {tables.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  {table.display_name}
                </SelectItem>
              ))}
              {onAddTable && (
                <SelectItem value="add-new" className="text-primary font-medium">
                  + Add new table
                </SelectItem>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
