
import { supabase } from '@/integrations/supabase/client';
import { GlConnection, GlideTable, ProductSyncResult } from '@/types/glsync';

/**
 * GlSync API Service
 * Provides methods for interacting with the Glide sync API
 */
export const glSyncApi = {
  /**
   * Tests a connection to Glide
   */
  async testConnection(connectionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('glsync', {
        body: {
          action: 'testConnection',
          connectionId
        }
      });

      if (error) {
        console.error('Error testing connection:', error);
        return false;
      }

      return data?.success || false;
    } catch (err) {
      console.error('Exception in testConnection:', err);
      return false;
    }
  },

  /**
   * Lists tables in a Glide app
   */
  async listGlideTables(connectionId: string): Promise<{ success: boolean, tables?: GlideTable[], error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('glsync', {
        body: {
          action: 'listGlideTables',
          connectionId
        }
      });

      if (error) {
        console.error('Error listing Glide tables:', error);
        return { success: false, error: error.message };
      }

      return {
        success: data?.success || false,
        tables: data?.tables as GlideTable[] || [],
        error: data?.error
      };
    } catch (err) {
      console.error('Exception in listGlideTables:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },

  /**
   * Synchronizes data using a specific mapping
   */
  async syncData(connectionId: string, mappingId: string): Promise<ProductSyncResult | null> {
    try {
      const { data, error } = await supabase.functions.invoke('glsync', {
        body: {
          action: 'syncData',
          connectionId,
          mappingId
        }
      });

      if (error) {
        console.error('Error syncing data:', error);
        return null;
      }

      return data as ProductSyncResult;
    } catch (err) {
      console.error('Exception in syncData:', err);
      return null;
    }
  },

  /**
   * Retries failed sync operations
   */
  async retryFailedSync(connectionId: string, mappingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('glsync', {
        body: {
          action: 'retryFailedSync',
          connectionId,
          mappingId
        }
      });

      if (error) {
        console.error('Error retrying failed sync:', error);
        return false;
      }

      return data?.success || false;
    } catch (err) {
      console.error('Exception in retryFailedSync:', err);
      return false;
    }
  },

  /**
   * Gets all connections
   */
  async getConnections(): Promise<GlConnection[]> {
    try {
      const { data, error } = await supabase
        .from('gl_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching connections:', error);
        return [];
      }

      return data as unknown as GlConnection[];
    } catch (err) {
      console.error('Exception in getConnections:', err);
      return [];
    }
  },

  /**
   * Gets a specific connection
   */
  async getConnection(id: string): Promise<GlConnection | null> {
    try {
      const { data, error } = await supabase
        .from('gl_connections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching connection:', error);
        return null;
      }

      return data as unknown as GlConnection;
    } catch (err) {
      console.error('Exception in getConnection:', err);
      return null;
    }
  },

  /**
   * Creates a new connection
   */
  async createConnection(connection: Partial<GlConnection>): Promise<GlConnection | null> {
    try {
      // Extract only the valid fields from connection
      const { app_id, api_key, app_name, status, settings } = connection;
      
      const validConnection = {
        app_id: app_id as string,
        api_key: api_key as string,
        app_name,
        status,
        settings
      };
      
      const { data, error } = await supabase
        .from('gl_connections')
        .insert([validConnection])
        .select()
        .single();

      if (error) {
        console.error('Error creating connection:', error);
        return null;
      }

      return data as unknown as GlConnection;
    } catch (err) {
      console.error('Exception in createConnection:', err);
      return null;
    }
  },

  /**
   * Updates an existing connection
   */
  async updateConnection(id: string, updates: Partial<GlConnection>): Promise<GlConnection | null> {
    try {
      const { data, error } = await supabase
        .from('gl_connections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating connection:', error);
        return null;
      }

      return data as unknown as GlConnection;
    } catch (err) {
      console.error('Exception in updateConnection:', err);
      return null;
    }
  },

  /**
   * Deletes an existing connection
   */
  async deleteConnection(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gl_connections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting connection:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception in deleteConnection:', err);
      return false;
    }
  },

  /**
   * Maps all relationships
   */
  async mapAllRelationships(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('glsync', {
        body: {
          action: 'mapRelationships'
        }
      });

      if (error) {
        console.error('Error mapping relationships:', error);
        return false;
      }

      return data?.success || false;
    } catch (err) {
      console.error('Exception in mapAllRelationships:', err);
      return false;
    }
  },

  /**
   * Gets information about Supabase tables
   */
  async getSupabaseTables(): Promise<string[]> {
    try {
      // Using the custom RPC function
      const { data, error } = await supabase
        .rpc('gl_get_user_tables');

      if (error) {
        console.error('Error fetching Supabase tables:', error);
        return [];
      }

      return data as string[];
    } catch (err) {
      console.error('Exception in getSupabaseTables:', err);
      return [];
    }
  },

  /**
   * Gets columns for a specific table
   */
  async getTableColumns(tableName: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('gl_get_table_columns', { table_name: tableName });

      if (error) {
        console.error(`Error fetching columns for table ${tableName}:`, error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception in getTableColumns:', err);
      return [];
    }
  },
  
  /**
   * Gets columns for a specific table
   */
  async getSupabaseTableColumns(tableName: string): Promise<any[]> {
    return this.getTableColumns(tableName);
  }
};
