
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProductSyncResult } from '@/types/glsync';
import { glSyncApi } from '@/services/glsync';

export function useGlSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Validates a mapping configuration
   */
  const validateMappingConfig = async (mappingId: string) => {
    try {
      return await glSyncApi.validateMapping(mappingId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred validating the mapping';
      toast({
        title: 'Validation Error',
        description: message,
        variant: 'destructive',
      });
      return { isValid: false, message };
    }
  };

  /**
   * Syncs data based on the provided mapping
   */
  const syncData = async (connectionId: string, mappingId?: string): Promise<ProductSyncResult> => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await glSyncApi.syncData(connectionId, mappingId);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Sync Completed',
        description: `Processed ${result.recordsProcessed} records with ${result.failedRecords} errors.`,
      });

      return {
        success: true,
        recordsProcessed: result.recordsProcessed || 0,
        failedRecords: result.failedRecords || 0
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during sync';
      setError(message);

      toast({
        title: 'Sync Error',
        description: message,
        variant: 'destructive',
      });

      return {
        success: false,
        error: message,
        recordsProcessed: 0,
        failedRecords: 0
      };
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Retries a failed sync
   */
  const retryFailedSync = async (connectionId: string, mappingId: string): Promise<boolean> => {
    setIsRetrying(true);
    setError(null);

    try {
      // Create a new sync log entry for the retry
      const { success, error: createError } = await glSyncApi.retryFailedSync(mappingId);

      if (!success) {
        throw new Error(createError);
      }

      // Start the sync
      const syncResult = await syncData(connectionId, mappingId);

      if (!syncResult.success) {
        throw new Error(syncResult.error);
      }

      toast({
        title: 'Retry Successful',
        description: `Successfully processed ${syncResult.recordsProcessed} records.`,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during retry';
      setError(message);

      toast({
        title: 'Retry Failed',
        description: message,
        variant: 'destructive',
      });

      return false;
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    syncData,
    retryFailedSync,
    validateMappingConfig,
    isSyncing,
    isRetrying,
    error
  };
}
