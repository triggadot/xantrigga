
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GlSyncStatus, GlRecentLog, GlSyncStats } from '@/types/glsync';
import { useToast } from '@/hooks/use-toast';

export function useGlSyncStatus(mappingId?: string) {
  const [syncStatus, setSyncStatus] = useState<GlSyncStatus | null>(null);
  const [recentLogs, setRecentLogs] = useState<GlRecentLog[]>([]);
  const [syncStats, setSyncStats] = useState<GlSyncStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSyncStatus = useCallback(async (): Promise<void> => {
    if (!mappingId) {
      setSyncStatus(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log('Fetching sync status for mapping ID:', mappingId);
      const { data, error } = await supabase
        .from('gl_mapping_status')
        .select('*')
        .eq('mapping_id', mappingId)
        .single();
      
      if (error) {
        // If no data found, don't treat as error, just return null
        if (error.code === 'PGRST116') {
          setSyncStatus(null);
          setIsLoading(false);
          return;
        }
        console.error('Error fetching sync status:', error);
        throw new Error(error.message);
      }
      
      setSyncStatus(data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: 'Error fetching sync status',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [mappingId, toast]);

  const fetchRecentLogs = useCallback(async (): Promise<void> => {
    try {
      if (mappingId) {
        // Fetch recent logs for a specific mapping
        const { data, error } = await supabase
          .from('gl_sync_logs')
          .select('*')
          .eq('mapping_id', mappingId)
          .order('started_at', { ascending: false })
          .limit(5);
        
        if (error) throw new Error(error.message);
        
        // Convert the logs to GlRecentLog format
        const formattedLogs: GlRecentLog[] = (data || []).map(log => {
          // If we have a specific mapping ID, get the mapping info to fill in the GlRecentLog fields
          return {
            id: log.id,
            status: log.status,
            message: log.message,
            records_processed: log.records_processed,
            started_at: log.started_at,
            glide_table: syncStatus?.glide_table || null,
            glide_table_display_name: syncStatus?.glide_table_display_name || null,
            supabase_table: syncStatus?.supabase_table || null,
            app_name: syncStatus?.app_name || null,
            sync_direction: syncStatus?.sync_direction || null
          };
        });
        
        setRecentLogs(formattedLogs);
      } else {
        // Fetch global recent logs
        const { data, error } = await supabase
          .from('gl_recent_logs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(10);
        
        if (error) throw new Error(error.message);
        setRecentLogs(data || []);
      }
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      toast({
        title: 'Error fetching recent logs',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [mappingId, syncStatus, toast]);

  const fetchSyncStats = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('gl_sync_stats')
        .select('*')
        .order('sync_date', { ascending: false })
        .limit(7);
      
      if (error) throw new Error(error.message);
      setSyncStats(data || []);
    } catch (error) {
      console.error('Error fetching sync stats:', error);
      // Don't show a toast for stats errors - less critical
    }
  }, []);

  const refreshData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await Promise.all([
      fetchSyncStatus(),
      fetchRecentLogs(),
      fetchSyncStats()
    ]);
    setIsLoading(false);
  }, [fetchSyncStatus, fetchRecentLogs, fetchSyncStats]);

  // Set up realtime subscription for live updates
  const setupRealtimeSubscription = useCallback(() => {
    if (!mappingId) return () => {};
    
    // Subscribe to changes on the mapping_status view
    const syncStatusChannel = supabase
      .channel('gl_status_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'gl_mapping_status', filter: `mapping_id=eq.${mappingId}` }, 
        () => {
          // Refresh status when it changes
          fetchSyncStatus();
        }
      )
      .subscribe();
    
    // Also subscribe to sync logs which can affect status
    const syncLogsChannel = supabase
      .channel('gl_log_changes_for_status')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'gl_sync_logs', filter: `mapping_id=eq.${mappingId}` }, 
        () => {
          // Refresh status and logs when new logs are added
          fetchSyncStatus();
          fetchRecentLogs();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(syncStatusChannel);
      supabase.removeChannel(syncLogsChannel);
    };
  }, [fetchSyncStatus, fetchRecentLogs, mappingId]);

  useEffect(() => {
    refreshData();
    
    // Set up realtime subscription
    const cleanup = setupRealtimeSubscription();
    
    return cleanup;
  }, [refreshData, setupRealtimeSubscription]);

  return {
    syncStatus,
    recentLogs,
    syncStats,
    isLoading,
    hasError,
    errorMessage,
    refreshStatus: fetchSyncStatus,
    refreshData
  };
}
