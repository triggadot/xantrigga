
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePurchaseOrderDetail } from './usePurchaseOrderDetail';
import { useProductOperations } from './useProductOperations';
import { usePaymentOperations } from './usePaymentOperations';
import { PurchaseOrder, PurchaseOrderFilters, PurchaseOrderWithVendor } from '@/types/purchaseOrder';
import { hasProperty } from '@/types/supabase';

export function usePurchaseOrdersView() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getPurchaseOrder } = usePurchaseOrderDetail();
  const { deleteProduct, addProduct, updateProduct } = useProductOperations();
  const { deletePayment, addPayment, updatePayment } = usePaymentOperations();
  
  const fetchPurchaseOrders = useCallback(async (filters?: PurchaseOrderFilters): Promise<PurchaseOrderWithVendor[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use a simpler query builder approach to avoid excessive type instantiation
      let query = supabase.from('gl_purchase_orders');
      
      // Start with a simple string query instead of complex builder
      const queryStr = '*, vendor:gl_accounts!gl_purchase_orders_sb_accounts_id_fkey(*)';
      query = query.select(queryStr);
      
      // Apply filters if provided
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          query = query.eq('payment_status', filters.status);
        }
        
        if (filters.vendorId) {
          // Use vendor_id for filtering with new schema
          query = query.eq('vendor_id', filters.vendorId);
        }
        
        if (filters.fromDate) {
          const fromDate = filters.fromDate instanceof Date 
            ? filters.fromDate.toISOString()
            : new Date(filters.fromDate).toISOString();
          query = query.gte('date', fromDate);
        }
        
        if (filters.toDate) {
          const toDate = filters.toDate instanceof Date 
            ? filters.toDate.toISOString()
            : new Date(filters.toDate).toISOString();
          query = query.lte('date', toDate);
        }
        
        if (filters.search) {
          // Simple search by PO number or vendor name via join
          query = query.or(`uid.ilike.%${filters.search}%`);
        }
      }
      
      // Order by date descending
      query = query.order('created_at', { ascending: false });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      if (!data) return [];
      
      // Map to PurchaseOrderWithVendor format - cast records for simpler processing
      const results: PurchaseOrderWithVendor[] = [];
      for (const item of data) {
        const po = item as Record<string, any>;
        results.push(mapPurchaseOrderData(po));
      }
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching purchase orders';
      setError(errorMessage);
      console.error('Error fetching purchase orders:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    fetchPurchaseOrders,
    getPurchaseOrder,
    deleteProduct,
    addProduct,
    updateProduct,
    deletePayment,
    addPayment,
    updatePayment,
    isLoading,
    error
  };
}

const mapPurchaseOrderData = (po: Record<string, any>): PurchaseOrderWithVendor => {
  // Safely get vendor name with null checks
  let vendorName = 'Unknown Vendor';
  
  if (po.vendor && 
      typeof po.vendor === 'object' && 
      po.vendor !== null) {
    if (hasProperty(po.vendor, 'name')) {
      vendorName = po.vendor.name || 'Unknown Vendor';
    } else if (hasProperty(po.vendor, 'account_name')) {
      // Fallback to old column name if name is not found
      vendorName = po.vendor.account_name || 'Unknown Vendor';
    }
  }
  
  return {
    id: String(po.glide_row_id || ''),
    number: String(po.uid || (po.id ? po.id.substring(0, 8) : '') || ''),
    date: po.date ? new Date(po.date) : new Date(po.created_at),
    status: String(po.payment_status || 'draft'),
    vendorId: String(po.vendor_id || po.sb_accounts_id || ''),
    vendorName: String(vendorName),
    total: Number(po.total_amount || 0),
    balance: Number(po.balance || 0),
    totalPaid: Number(po.total_paid || 0),
    productCount: Number(po.product_count || 0),
    createdAt: new Date(po.created_at),
    updatedAt: po.updated_at ? new Date(po.updated_at) : new Date()
  };
};
