
import { supabase } from '@/integrations/supabase/client';
import { 
  GlConnection, 
  GlMapping, 
  GlSyncLog, 
  GlSyncStatus,
  GlRecentLog,
  SyncRequestPayload,
  ProductSyncResult,
  GlideTable,
  GlSyncRecord
} from '@/types/glsync';

export const glSyncApi = {
  // Connection management
  async getConnections(): Promise<GlConnection[]> {
    const { data, error } = await supabase
      .from('gl_connections')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as GlConnection[];
  },

  async getConnection(id: string): Promise<GlConnection> {
    const { data, error } = await supabase
      .from('gl_connections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data as GlConnection;
  },

  async addConnection(connection: Omit<GlConnection, 'id' | 'created_at'>): Promise<GlConnection> {
    const { data, error } = await supabase
      .from('gl_connections')
      .insert(connection)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as GlConnection;
  },

  async updateConnection(id: string, connection: Partial<GlConnection>): Promise<GlConnection> {
    const { data, error } = await supabase
      .from('gl_connections')
      .update(connection)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as GlConnection;
  },

  async deleteConnection(id: string): Promise<void> {
    const { error } = await supabase
      .from('gl_connections')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  // Mapping management
  async getMappings(connectionId?: string): Promise<GlMapping[]> {
    let query = supabase.from('gl_mappings').select('*');
    
    if (connectionId) {
      query = query.eq('connection_id', connectionId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      if (error.code === '42P01') {
        return [];
      }
      throw new Error(error.message);
    }
    
    return (data || []).map(mapping => ({
      ...mapping,
      column_mappings: mapping.column_mappings as unknown as Record<string, { 
        glide_column_name: string;
        supabase_column_name: string;
        data_type: 'string' | 'number' | 'boolean' | 'date-time' | 'image-uri' | 'email-address';
      }>
    })) as GlMapping[];
  },

  async getMapping(id: string): Promise<GlMapping> {
    const { data, error } = await supabase
      .from('gl_mappings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      ...data,
      column_mappings: data.column_mappings as unknown as Record<string, { 
        glide_column_name: string;
        supabase_column_name: string;
        data_type: 'string' | 'number' | 'boolean' | 'date-time' | 'image-uri' | 'email-address';
      }>
    } as GlMapping;
  },

  async addMapping(mapping: Omit<GlMapping, 'id' | 'created_at'>): Promise<GlMapping> {
    const { data, error } = await supabase
      .from('gl_mappings')
      .insert({
        connection_id: mapping.connection_id,
        glide_table: mapping.glide_table,
        glide_table_display_name: mapping.glide_table_display_name,
        supabase_table: mapping.supabase_table,
        column_mappings: mapping.column_mappings as any,
        sync_direction: mapping.sync_direction,
        enabled: mapping.enabled
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      ...data,
      column_mappings: data.column_mappings as unknown as Record<string, { 
        glide_column_name: string;
        supabase_column_name: string;
        data_type: 'string' | 'number' | 'boolean' | 'date-time' | 'image-uri' | 'email-address';
      }>
    } as GlMapping;
  },

  async updateMapping(id: string, mapping: Partial<GlMapping>): Promise<GlMapping> {
    const updateData: any = { ...mapping };
    if (mapping.column_mappings) {
      updateData.column_mappings = mapping.column_mappings;
    }
    
    const { data, error } = await supabase
      .from('gl_mappings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      ...data,
      column_mappings: data.column_mappings as unknown as Record<string, { 
        glide_column_name: string;
        supabase_column_name: string;
        data_type: 'string' | 'number' | 'boolean' | 'date-time' | 'image-uri' | 'email-address';
      }>
    } as GlMapping;
  },

  async deleteMapping(id: string): Promise<void> {
    const { error } = await supabase
      .from('gl_mappings')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  // Get Supabase table columns
  async getSupabaseTableColumns(tableName: string): Promise<{ column_name: string, data_type: string }[]> {
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: tableName });
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Sync logs
  async getSyncLogs(mappingId?: string, limit: number = 20): Promise<GlSyncLog[]> {
    let query = supabase
      .from('gl_sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (mappingId) {
      query = query.eq('mapping_id', mappingId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      if (error.code === '42P01') {
        return [];
      }
      throw new Error(error.message);
    }
    return data as GlSyncLog[];
  },

  // Get sync status for all mappings
  async getSyncStatus(): Promise<GlSyncStatus[]> {
    const { data, error } = await supabase
      .from('gl_mapping_status')
      .select('*')
      .order('last_sync_started_at', { ascending: false });
    
    if (error) {
      if (error.code === '42P01') {
        return [];
      }
      throw new Error(error.message);
    }
    return data as unknown as GlSyncStatus[];
  },

  // Get recent sync logs with additional info
  async getRecentLogs(limit: number = 20): Promise<GlRecentLog[]> {
    const { data, error } = await supabase
      .from('gl_recent_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      if (error.code === '42P01') {
        return [];
      }
      throw new Error(error.message);
    }
    return data as GlRecentLog[];
  },

  // Edge function interaction
  async callSyncFunction(payload: SyncRequestPayload): Promise<any> {
    const { data, error } = await supabase.functions.invoke('glsync', {
      body: payload,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async testConnection(connectionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.callSyncFunction({
        action: 'testConnection',
        connectionId,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async listGlideTables(connectionId: string): Promise<{ tables: GlideTable[] } | { error: string }> {
    try {
      return await this.callSyncFunction({
        action: 'listGlideTables',
        connectionId,
      });
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  async getGlideTableColumns(connectionId: string, tableId: string): Promise<{ columns: any[] } | { error: string }> {
    try {
      return await this.callSyncFunction({
        action: 'getColumnMappings',
        connectionId,
        tableId,
      });
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async syncData(connectionId: string, mappingId: string): Promise<{ success: boolean; recordsProcessed?: number; failedRecords?: number; errors?: any[]; error?: string }> {
    try {
      const result = await this.callSyncFunction({
        action: 'syncData',
        connectionId,
        mappingId,
      });
      
      return { 
        success: result.success ?? true, 
        recordsProcessed: result.recordsProcessed,
        failedRecords: result.failedRecords,
        errors: result.errors
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async getSyncErrors(mappingId: string): Promise<GlSyncRecord[]> {
    try {
      const { data, error } = await supabase
        .rpc('gl_get_sync_errors', { p_mapping_id: mappingId, p_limit: 100 });
      
      if (error) throw new Error(error.message);
      
      if (!data) return [];
      
      return data.map((record: any) => ({
        type: record.error_type,
        message: record.error_message,
        record: record.record_data,
        timestamp: record.created_at,
        retryable: record.retryable
      })) as GlSyncRecord[];
    } catch (error) {
      console.error('Error fetching sync errors:', error);
      return [];
    }
  }
};
