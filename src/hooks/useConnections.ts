
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Connection {
  id: string;
  app_name: string;
  app_id: string;
}

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchConnections = async () => {
    if (connections.length > 0) return connections; // Don't fetch if we already have connections
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gl_connections')
        .select('id, app_name, app_id')
        .order('app_name', { ascending: true });
      
      if (error) throw error;
      setConnections(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load connections',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return { connections, isLoading, fetchConnections };
}
