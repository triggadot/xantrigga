
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BusinessMetrics {
  total_invoices: number;
  total_estimates: number;
  total_purchase_orders: number;
  total_products: number;
  total_customers: number;
  total_vendors: number;
  total_invoice_amount: number;
  total_payments_received: number;
  total_outstanding_balance: number;
  total_purchase_amount: number;
  total_payments_made: number;
  total_purchase_balance: number;
}

export interface StatusMetrics {
  category: string;
  total_count: number;
  paid_count: number;
  unpaid_count: number;
  draft_count: number;
  total_amount: number;
  total_paid: number;
  balance_amount: number;
}

export function useBusinessMetrics() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [statusMetrics, setStatusMetrics] = useState<StatusMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBusinessMetrics();
  }, []);

  const fetchBusinessMetrics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch invoice and purchase order metrics from relevant functions
      const { data: invoiceMetricsData, error: invoiceError } = await supabase
        .rpc('gl_get_invoice_metrics');
      
      if (invoiceError) throw invoiceError;
      
      // These are single row results, not arrays
      const invoiceMetrics = invoiceMetricsData || {
        invoice_count: 0,
        estimate_count: 0,
        total_invoice_amount: 0,
        total_payments_received: 0, 
        total_outstanding_balance: 0
      };
      
      const { data: poMetricsData, error: poError } = await supabase
        .rpc('gl_get_purchase_order_metrics');
      
      if (poError) throw poError;
      
      // These are single row results, not arrays
      const poMetrics = poMetricsData || {
        po_count: 0,
        total_purchase_amount: 0,
        total_payments_made: 0,
        total_purchase_balance: 0
      };
      
      // Fetch account stats (customers and vendors)
      const { data: accountStatsData, error: accountError } = await supabase
        .rpc('gl_get_account_stats');
      
      if (accountError) throw accountError;
      
      // These are single row results, not arrays
      const accountStats = accountStatsData || {
        customer_count: 0,
        vendor_count: 0
      };
      
      // Count products
      const { count: productCount, error: productError } = await supabase
        .from('gl_products')
        .select('id', { count: 'exact', head: true });
      
      if (productError) throw productError;
      
      // Combine all metrics into one object
      const combinedMetrics: BusinessMetrics = {
        total_invoices: invoiceMetrics.invoice_count || 0,
        total_estimates: invoiceMetrics.estimate_count || 0,
        total_purchase_orders: poMetrics.po_count || 0,
        total_products: productCount || 0,
        total_customers: accountStats.customer_count || 0,
        total_vendors: accountStats.vendor_count || 0,
        total_invoice_amount: invoiceMetrics.total_invoice_amount || 0,
        total_payments_received: invoiceMetrics.total_payments_received || 0,
        total_outstanding_balance: invoiceMetrics.total_outstanding_balance || 0,
        total_purchase_amount: poMetrics.total_purchase_amount || 0,
        total_payments_made: poMetrics.total_payments_made || 0,
        total_purchase_balance: poMetrics.total_purchase_balance || 0
      };
      
      setMetrics(combinedMetrics);
      
      // Fetch document status from gl_current_status view
      const { data: docStatusData, error: statusError } = await supabase
        .from('gl_current_status')
        .select('category, total_count, paid_count, unpaid_count, draft_count, total_amount, total_paid, balance_amount');
      
      if (statusError) throw statusError;
      
      if (docStatusData) {
        // Explicitly type the docStatusData as StatusMetrics[] to avoid type errors
        setStatusMetrics(docStatusData as StatusMetrics[]);
      }
      
    } catch (error: any) {
      console.error('Unexpected error fetching business metrics:', error);
      setError(error.message || 'An unexpected error occurred');
      toast({
        title: 'Error',
        description: 'Failed to fetch business metrics. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    metrics,
    statusMetrics,
    isLoading,
    error,
    refreshMetrics: fetchBusinessMetrics
  };
}
