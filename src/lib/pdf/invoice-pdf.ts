import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { 
  formatCurrency, 
  formatShortDate, 
  generateFilename,
  PDFErrorType,
  PDFOperationResult,
  createPDFError,
  createPDFSuccess
} from './common';
import { saveAs } from 'file-saver';

export type Invoice = Database['public']['Tables']['gl_invoices']['Row'];
export type InvoiceLine = Database['public']['Tables']['gl_invoice_lines']['Row'] & {
  product?: {
    display_name: string;
    id: string;
    glide_row_id: string;
  };
};

export interface InvoiceWithDetails extends Invoice {
  lines: InvoiceLine[];
  account?: Database['public']['Tables']['gl_accounts']['Row'];
}

export async function fetchInvoiceForPDF(invoiceId: string): Promise<InvoiceWithDetails | null> {
  try {
    let { data: invoiceData, error: invoiceError } = await supabase
      .from('gl_invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();

    if (!invoiceData) {
      const { data, error } = await supabase
        .from('gl_invoices')
        .select('*')
        .eq('glide_row_id', invoiceId)
        .maybeSingle();
      
      invoiceData = data;
      invoiceError = error;
    }

    if (invoiceError || !invoiceData) return null;

    const invoiceWithDetails: InvoiceWithDetails = {
      ...invoiceData,
      total_amount: Number(invoiceData.total_amount) || 0,
      total_paid: Number(invoiceData.total_paid) || 0,
      balance: Number(invoiceData.balance) || 0,
      tax_rate: Number(invoiceData.tax_rate) || 0,
      tax_amount: Number(invoiceData.tax_amount) || 0,
      lines: []
    };

    const productsMap = new Map();
    const { data: productsData } = await supabase.from('gl_products').select('*');
    
    if (productsData) {
      productsData.forEach((product: any) => {
        productsMap.set(product.glide_row_id, {
          display_name: product.vendor_product_name || product.main_new_product_name || 'Unknown Product',
          id: product.id,
          glide_row_id: product.glide_row_id
        });
      });
    }

    const { data: linesData } = await supabase
      .from('gl_invoice_lines')
      .select('*, product_name_display')
      .eq('rowid_invoices', invoiceData.glide_row_id);

    if (linesData?.length) {
      invoiceWithDetails.lines = linesData.map((line: any) => ({
        ...line,
        qty_sold: Number(line.qty_sold) || 0,
        selling_price: Number(line.selling_price) || 0,
        line_total: Number(line.line_total) || 0,
        product: line.rowid_products ? productsMap.get(line.rowid_products) : null
      }));
    }

    if (invoiceData.rowid_accounts) {
      const { data: accountData } = await supabase
        .from('gl_accounts')
        .select('*')
        .eq('glide_row_id', invoiceData.rowid_accounts)
        .single();
      
      if (accountData) invoiceWithDetails.account = accountData;
    }

    return invoiceWithDetails;
  } catch (error) {
    console.error('Exception fetching invoice data:', error);
    return null;
  }
}

export function generateInvoicePDF(invoice: InvoiceWithDetails): jsPDF {
  const doc = new jsPDF({
    compress: true, 
    putOnlyUsedFonts: true
  });
  const themeColor = [0, 51, 102];
  
  // Header
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 15, 20);
  
  // Invoice meta
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${invoice.invoice_uid || ''}`, 15, 28);
  doc.text(`Date: ${formatShortDate(invoice.invoice_order_date || new Date())}`, 195, 28, { align: 'right' });
  
  // Divider
  doc.setDrawColor(...themeColor);
  doc.setLineWidth(1.5);
  doc.line(15, 32, 195, 32);
  
  // Start product table immediately after the header
  const tableStartY = 45;
  
  // Table styles with better centering and consistent padding
  const tableStyles = {
    theme: 'striped',
    headStyles: {
      fillColor: themeColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      halign: 'left' // Default alignment for headers
    },
    bodyStyles: {
      textColor: [50, 50, 50],
      fontSize: 9,
      fontStyle: 'normal',
      cellPadding: { top: 2, right: 3, bottom: 2, left: 3 }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { halign: 'left' },     // Product - left aligned
      1: { halign: 'center' },   // Qty - center aligned
      2: { halign: 'right' },    // Price - right aligned
      3: { halign: 'right' }     // Total - right aligned
    },
    head: [
      [
        { content: 'Product', styles: { halign: 'left' } },
        { content: 'Qty', styles: { halign: 'center' } },
        { content: 'Price', styles: { halign: 'right' } },
        { content: 'Total', styles: { halign: 'right' } }
      ]
    ],
    margin: { top: 5, right: 10, bottom: 5, left: 15 },
    tableWidth: 180 // Make table use more space
  };
  
  // Table data
  const rows = invoice.lines?.map(line => [
    line.product_name_display || line.renamed_product_name || (line.product?.display_name || ''),
    line.qty_sold || 0,
    formatCurrency(line.selling_price || 0),
    formatCurrency(line.line_total || 0)
  ]) || [];
  
  // Add table
  autoTable(doc, {
    ...tableStyles,
    body: rows,
    startY: tableStartY
  });
  
  // Calculate total quantity
  const totalQuantity = invoice.lines?.reduce((total, line) => 
    total + (Math.round(Number(line.qty_sold) || 0)), 0) || 0;
  
  // Totals section with better fonts and alignment
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  let currentY = finalY;
  
  // Set up totals section with improved typography
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  // Draw totals using a standardized function with better alignment
  const addTotalLine = (label: string, amount: number, isBold = false) => {
    // Use proper spacing and fonts
    if (isBold) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
    }
    
    // Use consistent spacing for right-aligned values
    doc.text(`${label}:`, 150, currentY, { align: 'right' });
    doc.text(formatCurrency(amount), 195, currentY, { align: 'right' });
    
    // Reset font and add consistent spacing
    doc.setFont('helvetica', 'normal');
    currentY += 8;
  };
  
  // Add totals with enhanced legibility
  addTotalLine(`Subtotal (${totalQuantity} item${totalQuantity === 1 ? '' : 's'})`, invoice.total_amount || 0);
  addTotalLine('Payments', invoice.total_paid || 0);
  
  // Make balance due stand out
  const balance = invoice.balance || 0;
  if (balance < 0) {
    doc.setTextColor(0, 100, 0); // Dark green
  } else if (balance > 0) {
    doc.setTextColor(150, 0, 0); // Dark red
  }
  
  // Draw balance due line with enhanced visibility
  addTotalLine('Balance Due', balance, true);
  doc.setTextColor(0, 0, 0); // Reset text color
  
  // Notes section with better formatting
  if (invoice.invoice_notes) {
    currentY += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 15, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 6;
    doc.setFontSize(9);
    
    const splitNotes = doc.splitTextToSize(invoice.invoice_notes, 175);
    doc.text(splitNotes, 15, currentY);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60); // Darker gray for better contrast
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${doc.getNumberOfPages()}`, 195, 287, { align: 'right' });
  }
  
  return doc;
}

export async function generateAndStoreInvoicePDF(
  invoiceId: string | any,
  download = false
): Promise<PDFOperationResult> {
  try {
    const id = typeof invoiceId === 'object' 
      ? (invoiceId.id || invoiceId.glide_row_id || '') 
      : String(invoiceId);
    
    const invoice = await fetchInvoiceForPDF(id);
    if (!invoice) {
      return createPDFError(PDFErrorType.FETCH_ERROR, `Failed to fetch invoice: ${id}`);
    }
    
    const pdfDoc = generateInvoicePDF(invoice);
    const pdfBlob = pdfDoc.output('blob');
    
    // Generate filename using invoice_uid and date
    const filename = invoice.invoice_uid 
      ? `${invoice.invoice_uid}-${formatShortDate(invoice.invoice_date || new Date(), 'YYYYMMDD')}.pdf`
      : generateFilename('INV', invoice.id || id, invoice.invoice_date || new Date());
    
    if (download) {
      try {
        saveAs(pdfBlob, filename);
      } catch (error) {
        console.error('Download error:', error);
      }
    }
    
    return createPDFSuccess(URL.createObjectURL(pdfBlob));
  } catch (error) {
    return createPDFError(
      PDFErrorType.GENERATION_ERROR, 
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}