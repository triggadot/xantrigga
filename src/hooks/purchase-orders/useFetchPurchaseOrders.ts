
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PurchaseOrderFilters, PurchaseOrderWithVendor } from '@/types/purchaseOrder';
import { useToast } from '@/hooks/use-toast';
import { 
  PurchaseOrderRow,
  hasProperty, 
  asNumber,
  asDate,
  isJsonRecord
} from '@/types/supabase';

export function useFetchPurchaseOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all purchase orders with optional filters
  const fetchPurchaseOrders = async (filters?: PurchaseOrderFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, ensure the materialized view is refreshed
      const { error: refreshError } = await supabase.rpc('refresh_materialized_view_secure', {
        view_name: 'mv_purchase_order_vendor_details'
      });
      
      if (refreshError) {
        console.warn('Could not refresh materialized view:', refreshError.message);
        // Continue anyway as the view might still have recent enough data
      }
      
      // Build the base query - using the materialized view
      let query = supabase
        .from('mv_purchase_order_vendor_details')
        .select('*');
      
      // Apply filters if provided
      if (filters) {
        if (filters.search) {
          query = query.or(`purchase_order_uid.ilike.%${filters.search}%,vendor_name.ilike.%${filters.search}%`);
        }
        
        if (filters.status) {
          query = query.eq('payment_status', filters.status);
        }
        
        if (filters.vendorId) {
          query = query.eq('vendor_id', filters.vendorId);
        }
        
        if (filters.fromDate) {
          query = query.gte('po_date', filters.fromDate.toISOString());
        }
        
        if (filters.toDate) {
          query = query.lte('po_date', filters.toDate.toISOString());
        }
      }
      
      // Execute the query
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      // Format the data to match PurchaseOrderWithVendor interface
      const formattedData: PurchaseOrderWithVendor[] = (data || []).map((row) => {
        // Convert the raw data to PurchaseOrderRow
        const po = row as unknown as PurchaseOrderRow;
        
        return {
          id: po.glide_row_id || '',
          number: po.purchase_order_uid || po.glide_row_id || '',
          date: asDate(po.po_date) || asDate(po.created_at) || new Date(),
          status: (po.payment_status || 'draft') as PurchaseOrderWithVendor['status'],
          vendorId: po.vendor_id ? String(po.vendor_id) : '',
          vendorName: po.vendor_name || 'Unknown Vendor',
          total: asNumber(po.total_amount),
          balance: asNumber(po.balance),
          productCount: asNumber(po.product_count) || asNumber(po.product_count_calc) || 0,
          totalPaid: asNumber(po.total_paid),
          createdAt: asDate(po.created_at) || new Date(),
          updatedAt: asDate(po.updated_at) || asDate(po.created_at) || new Date()
        };
      });
      
      return { data: formattedData, error: null };
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      toast({
        title: "Error fetching purchase orders",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { data: [], error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchPurchaseOrders,
    isLoading,
    error
  };
}
