
import { supabase } from '@/integrations/supabase/client';
import { ProductSyncResult } from '@/types/glsync';
import { BaseSyncService } from './base-sync';

export class ProductsSyncService extends BaseSyncService {
  async sync(): Promise<ProductSyncResult> {
    try {
      console.log(`Starting products sync for mapping ${this.mappingId}`);
      
      // Create sync log entry
      const { data: logData, error: logError } = await supabase
        .from('gl_sync_logs')
        .insert({
          mapping_id: this.mappingId,
          status: 'started',
          message: 'Starting products sync'
        })
        .select('id')
        .single();

      if (logError) throw new Error(`Failed to create sync log: ${logError.message}`);
      const logId = logData.id;

      // Call the simplified edge function to sync data
      const { data, error } = await supabase.functions.invoke('glsync', {
        body: {
          action: 'syncData',
          connectionId: this.connectionId,
          mappingId: this.mappingId,
        },
      });

      if (error) throw new Error(error.message);
      
      console.log('Sync result:', data);
      
      return {
        success: data.success ?? false,
        recordsProcessed: data.recordsProcessed || 0,
        failedRecords: data.failedRecords || 0,
        errors: data.errors || [],
      };
    } catch (error) {
      console.error('Error in products sync:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        recordsProcessed: 0,
        failedRecords: 1
      };
    }
  }
}
