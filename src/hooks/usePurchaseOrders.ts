
import { useState, useCallback } from 'react';
import { useFetchPurchaseOrders } from './purchase-orders/useFetchPurchaseOrders';
import { usePurchaseOrderDetail } from './purchase-orders/usePurchaseOrderDetail';
import { usePurchaseOrderMutation } from './purchase-orders/usePurchaseOrderMutation';
import { PurchaseOrderFilters, PurchaseOrder } from '@/types/purchaseOrder';
import { useToast } from '@/hooks/use-toast';

export function usePurchaseOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  
  // Import functionality from smaller hooks
  const { fetchPurchaseOrders: baseFetchPurchaseOrders } = useFetchPurchaseOrders();
  const { getPurchaseOrder } = usePurchaseOrderDetail();
  const { createPurchaseOrder, updatePurchaseOrder } = usePurchaseOrderMutation();

  // Wrapper function that updates loading and error states
  const fetchPurchaseOrders = useCallback(async (filters?: PurchaseOrderFilters) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await baseFetchPurchaseOrders(filters);
      if (result.error) {
        throw result.error;
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching purchase orders';
      setError(errorMessage);
      console.error('Error in usePurchaseOrders.fetchPurchaseOrders:', err);
      
      toast({
        title: "Error fetching purchase orders",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { data: [], error: err };
    } finally {
      setIsLoading(false);
    }
  }, [baseFetchPurchaseOrders, toast]);

  // We need a proper wrapper for getPurchaseOrder
  const getPurchaseOrderWrapper = useCallback(async (id: string): Promise<PurchaseOrder | null> => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await getPurchaseOrder(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching purchase order';
      setError(errorMessage);
      console.error('Error in usePurchaseOrders.getPurchaseOrder:', err);
      
      toast({
        title: "Error fetching purchase order",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getPurchaseOrder, toast]);

  return {
    fetchPurchaseOrders,
    getPurchaseOrder: getPurchaseOrderWrapper,
    createPurchaseOrder,
    updatePurchaseOrder,
    isLoading,
    error
  };
}
