
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PurchaseOrder } from '@/types/purchaseOrder';

export function usePurchaseOrderMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Create a new purchase order
  const createPurchaseOrder = async (data: Partial<PurchaseOrder>) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Convert date to ISO string format if it exists
      const poDate = data.date instanceof Date 
        ? data.date.toISOString() 
        : typeof data.date === 'string' 
          ? new Date(data.date).toISOString() 
          : new Date().toISOString();

      const { data: newPo, error } = await supabase
        .from('gl_purchase_orders')
        .insert({
          rowid_accounts: data.vendorId || data.rowid_accounts,
          po_date: poDate,
          purchase_order_uid: data.number,
          notes: data.notes,
          payment_status: data.status || 'draft',
          glide_row_id: `PO-${Date.now()}`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Purchase Order Created',
        description: 'New purchase order has been created successfully.'
      });

      return newPo;
    } catch (err) {
      console.error('Error creating purchase order:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create purchase order',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing purchase order
  const updatePurchaseOrder = async (id: string, data: Partial<PurchaseOrder>) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Convert dates to ISO string format if they exist
      const poDate = data.date instanceof Date 
        ? data.date.toISOString() 
        : typeof data.date === 'string' 
          ? new Date(data.date).toISOString() 
          : undefined;

      const dueDate = data.dueDate instanceof Date 
        ? data.dueDate.toISOString() 
        : typeof data.dueDate === 'string' 
          ? new Date(data.dueDate).toISOString() 
          : undefined;

      const { data: updatedPo, error } = await supabase
        .from('gl_purchase_orders')
        .update({
          rowid_accounts: data.vendorId || data.rowid_accounts,
          po_date: poDate,
          purchase_order_uid: data.number,
          notes: data.notes,
          payment_status: data.status,
          date_payment_date_mddyyyy: dueDate
        })
        .eq('glide_row_id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Purchase Order Updated',
        description: 'Purchase order has been updated successfully.'
      });

      return updatedPo;
    } catch (err) {
      console.error('Error updating purchase order:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update purchase order',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPurchaseOrder,
    updatePurchaseOrder,
    isLoading,
    error
  };
}
