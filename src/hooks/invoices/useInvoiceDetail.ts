
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceWithDetails, InvoiceLineItem, InvoicePayment } from '@/types/invoice';

// Type guard to check if account object is valid
const isValidAccount = (account: any): account is { account_name: string } => {
  return account && 
         typeof account === 'object' && 
         account !== null &&
         'account_name' in account;
};

// Type guard to check if product details are valid
const isValidProductDetails = (productDetails: any): productDetails is { display_name: string } => {
  return productDetails && 
         typeof productDetails === 'object' && 
         productDetails !== null &&
         'display_name' in productDetails &&
         !('error' in productDetails);
};

export function useInvoiceDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get a single invoice with all related details
  const getInvoice = async (id: string): Promise<InvoiceWithDetails | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get invoice details
      const { data: invoice, error: invoiceError } = await supabase
        .from('gl_invoices')
        .select(`
          *,
          account:rowid_accounts(*)
        `)
        .eq('id', id)
        .single();
        
      if (invoiceError) throw invoiceError;
      
      // Get invoice line items
      const { data: lineItems, error: lineItemsError } = await supabase
        .from('gl_invoice_lines')
        .select(`
          *,
          productDetails:rowid_products(*)
        `)
        .eq('rowid_invoices', invoice.glide_row_id);
        
      if (lineItemsError) throw lineItemsError;
      
      // Get payments
      const { data: payments, error: paymentsError } = await supabase
        .from('gl_customer_payments')
        .select('*')
        .eq('rowid_invoices', invoice.glide_row_id);
        
      if (paymentsError) throw paymentsError;
      
      // Get customer name using type guard
      let accountName = 'Unknown Customer';
      if (isValidAccount(invoice.account)) {
        accountName = invoice.account.account_name;
      }

      const mappedLineItems: InvoiceLineItem[] = lineItems.map(item => {
        let productName = 'Unknown Product';
        
        // Use type guard to validate product details
        if (isValidProductDetails(item.productDetails)) {
          productName = item.productDetails.display_name;
        }
                           
        return {
          id: item.id,
          invoiceId: invoice.id,
          productId: item.rowid_products || '',
          description: item.renamed_product_name || '',
          productName: item.renamed_product_name || productName,
          quantity: Number(item.qty_sold || 0),
          unitPrice: Number(item.selling_price || 0),
          total: Number(item.line_total || 0),
          notes: item.product_sale_note,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          productDetails: isValidProductDetails(item.productDetails) ? item.productDetails : null
        };
      });

      const mappedPayments: InvoicePayment[] = payments.map(payment => ({
        id: payment.id,
        invoiceId: invoice.id,
        accountId: payment.rowid_accounts || '',
        date: new Date(payment.date_of_payment || payment.created_at),
        amount: Number(payment.payment_amount || 0),
        paymentMethod: payment.type_of_payment || '',
        notes: payment.payment_note || '',
        paymentDate: new Date(payment.date_of_payment || payment.created_at),
        createdAt: new Date(payment.created_at),
        updatedAt: new Date(payment.updated_at)
      }));
      
      // Create a default due date if not provided
      const dueDate = invoice.due_date ? new Date(invoice.due_date) : undefined;
      
      return {
        id: invoice.id,
        invoiceNumber: invoice.glide_row_id || 'Unknown',
        customerId: invoice.rowid_accounts,
        customerName: accountName,
        invoiceDate: new Date(invoice.invoice_order_date || invoice.created_at),
        dueDate: dueDate,
        status: (invoice.payment_status as "draft" | "sent" | "overdue" | "paid" | "partial") || "draft",
        total: Number(invoice.total_amount || 0),
        amountPaid: Number(invoice.total_paid || 0),
        balance: Number(invoice.balance || 0),
        notes: invoice.notes,
        createdAt: new Date(invoice.created_at),
        updatedAt: new Date(invoice.updated_at),
        lineItems: mappedLineItems,
        payments: mappedPayments,
        subtotal: Number(invoice.total_amount || 0)
      };
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getInvoice,
    isLoading,
    error
  };
}
