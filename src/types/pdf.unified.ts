/**
 * @file pdf.unified.ts
 * Unified type definitions for PDF generation system.
 * This file serves as the single source of truth for all PDF-related types.
 * It ensures consistency between frontend and edge function implementations.
 */

/**
 * Document types supported by the PDF generation system
 * @enum {string}
 */
export enum DocumentType {
  /** Invoice document type */
  INVOICE = 'invoice',
  /** Estimate document type */
  ESTIMATE = 'estimate',
  /** Purchase order document type */
  PURCHASE_ORDER = 'purchase_order',  // Standardized to match backend value
}

/**
 * Legacy document type strings used in older components
 * @type {string[]}
 */
export type LegacyDocumentTypeString = 'invoice' | 'purchaseOrder' | 'estimate';

/**
 * Type guard to check if a string is a valid DocumentType
 * @param {string} type - The type to check
 * @returns {boolean} True if the type is a valid DocumentType
 */
export function isValidDocumentType(type: string): type is DocumentType {
  return Object.values(DocumentType).includes(type as DocumentType);
}

/**
 * Type guard to check if a string is a valid legacy document type string
 * @param {string} type - The type to check
 * @returns {boolean} True if the type is a valid legacy document type string
 */
export function isLegacyDocumentTypeString(type: string): type is LegacyDocumentTypeString {
  return ['invoice', 'purchaseOrder', 'estimate'].includes(type);
}

/**
 * PDF error types for categorizing failures
 * @enum {string}
 */
export enum PDFErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  FETCH_ERROR = 'FETCH_ERROR',  // For client-side fetch errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Document type configuration for database interactions and storage
 * @interface DocumentTypeConfig
 */
export interface DocumentTypeConfig {
  /** Table name for the main document */
  tableName: string;
  /** Table name for line items if any */
  linesTableName?: string;
  /** Field to use for the document identifier */
  uidField: string;
  /** Field referencing the account (using Glidebase pattern) */
  accountRefField: string;
  /** Storage folder path */
  storageFolder: string;
  /** Additional relations for specific document types */
  additionalRelations?: {
    /** Table name of the related entity */
    tableName: string;
    /** Field in the related entity referencing the document */
    referenceField: string;
  }[];
}

/**
 * Configuration for each document type including table names and field mappings
 * Following the Glidebase pattern of using glide_row_id for relationships
 * @type {Record<DocumentType, DocumentTypeConfig>}
 */
export const documentTypeConfig: Record<DocumentType, DocumentTypeConfig> = {
  [DocumentType.INVOICE]: {
    tableName: 'gl_invoices',
    linesTableName: 'gl_invoice_lines',
    uidField: 'invoice_uid',
    accountRefField: 'rowid_accounts',
    storageFolder: 'Invoices',
    additionalRelations: [
      {
        tableName: 'gl_shipping_records',
        referenceField: 'rowid_invoices'
      },
      {
        tableName: 'gl_customer_payments',
        referenceField: 'rowid_invoices'
      }
    ]
  },
  [DocumentType.ESTIMATE]: {
    tableName: 'gl_estimates',
    linesTableName: 'gl_estimate_lines',
    uidField: 'estimate_uid',
    accountRefField: 'rowid_accounts',
    storageFolder: 'Estimates',
    additionalRelations: [
      {
        tableName: 'gl_customer_credits',
        referenceField: 'rowid_estimates'
      }
    ]
  },
  [DocumentType.PURCHASE_ORDER]: {
    tableName: 'gl_purchase_orders',
    linesTableName: 'gl_purchase_order_lines',
    uidField: 'purchase_order_uid',
    accountRefField: 'rowid_accounts',
    storageFolder: 'PurchaseOrders',
    additionalRelations: [
      {
        tableName: 'gl_vendor_payments',
        referenceField: 'rowid_purchase_orders'
      }
    ]
  }
};

/**
 * Base interface for account data matching database schema
 * @interface Account
 */
export interface Account {
  id: string;
  glide_row_id?: string;
  account_name?: string;
  client_type?: string;
  accounts_uid?: string;
  date_added_client?: string;
  email_of_who_added?: string;
  photo?: string;
  account_address?: string;
  account_city?: string;
  account_state?: string;
  account_zip?: string;
  account_email?: string;
  account_phone?: string;
  balance?: number;
  customer_balance?: number;
  vendor_balance?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for invoice line items matching database schema
 * @interface InvoiceLine
 */
export interface InvoiceLine {
  id: string;
  glide_row_id: string;
  renamed_product_name?: string;
  date_of_sale?: string;
  rowid_invoices?: string;
  rowid_products?: string;
  qty_sold?: number;
  selling_price?: number;
  product_sale_note?: string;
  user_email_of_added?: string;
  product_name_display?: string;
  line_total?: number;
  created_at?: string;
  updated_at?: string;
  // Frontend aliases and computed fields
  quantity?: number;  // Alias for qty_sold
  price?: number;     // Alias for selling_price
  total?: number;     // Alias for line_total
  product?: {
    vendor_product_name?: string;
    new_product_name?: string;
  };
}

/**
 * Interface for invoice data matching database schema
 * @interface Invoice
 */
export interface Invoice {
  id: string;
  glide_row_id: string;
  rowid_accounts?: string;
  invoice_date?: string;
  is_a_sample?: boolean;
  invoice_uid?: string;
  glide_pdf_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  total_amount?: number;
  total_paid?: number;
  balance?: number;
  status?: string;
  supabase_pdf_url?: string;
  // Frontend aliases and computed fields
  invoice_order_date?: string;  // Alias for invoice_date
  invoice_ship_date?: string;
  shipping_cost?: number;
  invoice_notes?: string;       // Alias for notes
  payment_terms?: string;
  account?: Account;
  lines?: InvoiceLine[];
  customer_payments?: Array<{
    id: string;
    payment_amount?: number;
    date_of_payment?: string;
    type_of_payment?: string;
    payment_note?: string;
  }>;
}

/**
 * Interface for purchase order line items matching database schema
 * @interface PurchaseOrderLineItem
 */
export interface PurchaseOrderLineItem {
  id: string;
  glide_row_id?: string;
  rowid_purchase_orders?: string;
  rowid_products?: string;
  qty_purchased?: number;
  unit_price?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  line_total?: number;
  // Frontend aliases and computed fields
  quantity?: number;         // Alias for qty_purchased
  unitPrice?: number;        // Alias for unit_price
  total?: number;            // Alias for line_total
  description?: string;      // Alias for notes
  productId?: string;        // Alias for rowid_products
  product_name?: string;
  new_product_name?: string;
  vendor_product_name?: string;
  display_name?: string;
  samples?: boolean;
  fronted?: boolean;
  category?: string;
  total_units?: number;
}

/**
 * Interface for purchase order data matching database schema
 * @interface PurchaseOrder
 */
export interface PurchaseOrder {
  id: string;
  glide_row_id: string;
  po_date?: string;
  rowid_accounts?: string;
  purchase_order_uid?: string;
  date_payment_date_mddyyyy?: string;
  docs_shortlink?: string;
  created_at?: string;
  updated_at?: string;
  pdf_link?: string;
  total_amount?: number;
  total_paid?: number;
  balance?: number;
  payment_status?: string;
  product_count?: number;
  supabase_pdf_url?: string;
  // Frontend aliases and computed fields
  po_status?: string;     // Alias for payment_status
  po_notes?: string;
  shipping_cost?: number;
  account?: Account;
  lineItems?: PurchaseOrderLineItem[];
  vendorPayments?: Array<{
    id: string;
    amount?: number;
    date?: string;
    method?: string;
    notes?: string;
  }>;
}

/**
 * Interface for estimate line items matching database schema
 * @interface EstimateLine
 */
export interface EstimateLine {
  id: string;
  glide_row_id: string;
  rowid_estimates?: string;
  rowid_products?: string;
  qty_sold?: number;
  selling_price?: number;
  estimate_item_notes?: string;
  created_at?: string;
  updated_at?: string;
  line_total?: number;
  product_name_display?: string;
  // Frontend aliases and computed fields
  quantity?: number;  // Alias for qty_sold
  price?: number;     // Alias for selling_price
  total?: number;     // Alias for line_total
  product?: {
    vendor_product_name?: string;
    new_product_name?: string;
  };
}

/**
 * Interface for estimate data matching database schema
 * @interface Estimate
 */
export interface Estimate {
  id: string;
  glide_row_id: string;
  rowid_invoices?: string;
  rowid_accounts?: string;
  estimate_date?: string;
  is_a_sample?: boolean;
  date_invoice_created_date?: string;
  add_note?: boolean;
  valid_final_create_invoice_clicked?: boolean;
  glide_pdf_url?: string;
  glide_pdf_url2?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  total_amount?: number;
  total_credits?: number;
  balance?: number;
  estimate_uid?: string;
  status?: string;
  supabase_pdf_url?: string;
  // Frontend aliases and computed fields
  estimate_notes?: string;  // Alias for notes
  account?: Account;
  lines?: EstimateLine[];
  customer_credits?: Array<{
    id: string;
    payment_amount?: number;
    date_of_payment?: string;
    payment_type?: string;
    payment_note?: string;
  }>;
}

/**
 * Interface for PDF generation failure record
 * @interface PDFGenerationFailure
 */
export interface PDFGenerationFailure {
  id: number;
  document_type: string;
  document_id: string;
  error_message: string | null;
  error_type?: PDFErrorType;
  retry_count: number;
  first_attempt: string;
  last_attempt: string;
  next_attempt: string;
  resolved: boolean;
  resolved_at?: string | null;
  requires_manual_intervention: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Result for PDF retry operations
 * @interface RetryResult
 */
export interface RetryResult {
  id: number;
  documentType: string;
  documentId: string;
  success: boolean;
  retryCount: number;
  requiresManualIntervention?: boolean;
  message?: string;
  error?: string;
  url?: string;
}

/**
 * Options for PDF generation operations
 * @interface PDFGenerationOptions
 */
export interface PDFGenerationOptions {
  forceRegenerate?: boolean;
  overwriteExisting?: boolean;
  downloadAfterGeneration?: boolean;
  showPreview?: boolean;
}

/**
 * Options for PDF scanning operations
 * @interface PDFScanOptions
 */
export interface PDFScanOptions {
  batchSize?: number;
  forceRegenerate?: boolean;
  overwriteExisting?: boolean;
}

/**
 * Options for PDF retry operations
 * @interface PDFRetryOptions
 */
export interface PDFRetryOptions {
  maxRetries?: number;
  batchSize?: number;
}

/**
 * Error details for PDF operations
 * @interface PDFError
 */
export interface PDFError {
  type: PDFErrorType;
  message: string;
  details?: Record<string, any>;
}

/**
 * Standardized result for PDF operations
 * @interface PDFOperationResult
 */
export interface PDFOperationResult {
  success: boolean;
  url?: string;
  blob?: Blob;
  error?: PDFError;
  message?: string;
}

/**
 * Status for batch PDF generation jobs
 * @type {string}
 */
export type BatchJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Interface for batch PDF generation job
 * @interface BatchPDFJob
 */
export interface BatchPDFJob {
  id: string;
  documentType: DocumentType;
  documentIds: string[];
  status: BatchJobStatus;
  createdAt: string;
  completedAt?: string;
  results?: Array<{
    documentId: string;
    success: boolean;
    url?: string;
    error?: string;
  }>;
  totalDocuments: number;
  completedDocuments: number;
  failedDocuments: number;
}

/**
 * Creates a standardized error result for PDF operations
 * @param {PDFErrorType} type - The type of error that occurred
 * @param {string} message - Human-readable error message
 * @param {Record<string, any>} [details] - Additional error details
 * @returns {PDFOperationResult} Error result object
 */
export function createPDFError(type: PDFErrorType, message: string, details?: Record<string, any>): PDFOperationResult {
  return { 
    success: false, 
    error: { type, message, details } 
  };
}

/**
 * Standardizes document type format for internal processing
 * @param {string | DocumentType | LegacyDocumentTypeString} type - Document type to normalize
 * @returns {DocumentType} Normalized DocumentType value
 * @throws {Error} If the document type is invalid or unsupported
 */
export function normalizeDocumentType(type: string | DocumentType | LegacyDocumentTypeString): DocumentType {
  // Handle null/undefined cases
  if (!type) {
    throw new Error('Document type cannot be empty');
  }

  // If it's already a DocumentType enum value, return it directly
  if (Object.values(DocumentType).includes(type as DocumentType)) {
    return type as DocumentType;
  }

  // Handle string values
  if (typeof type === 'string') {
    // Normalize to lowercase without spaces
    const normalizedType = type.toLowerCase().trim().replace(/\s+/g, '');
    
    // Map of various input formats to our enum values
    const typeMap: Record<string, DocumentType> = {
      // Invoice variations
      'invoice': DocumentType.INVOICE,
      'invoices': DocumentType.INVOICE,
      
      // Estimate variations
      'estimate': DocumentType.ESTIMATE,
      'estimates': DocumentType.ESTIMATE,
      
      // Purchase order variations (including legacy 'purchaseOrder' format)
      'purchaseorder': DocumentType.PURCHASE_ORDER,
      'purchaseorders': DocumentType.PURCHASE_ORDER,
      'purchase-order': DocumentType.PURCHASE_ORDER,
      'purchase-orders': DocumentType.PURCHASE_ORDER,
      'purchase_order': DocumentType.PURCHASE_ORDER,
      'purchase_orders': DocumentType.PURCHASE_ORDER,
      'po': DocumentType.PURCHASE_ORDER,
    };

    // Special case for legacy camelCase 'purchaseOrder'
    if (normalizedType === 'purchaseorder' || type === 'purchaseOrder') {
      return DocumentType.PURCHASE_ORDER;
    }
    
    // Look up in our map
    if (typeMap[normalizedType]) {
      return typeMap[normalizedType];
    }
  }
  
  // Not found or invalid type
  throw new Error(`Unsupported document type: ${type}. Must be one of: ${Object.values(DocumentType).join(', ')}`);
}

/**
 * Converts a DocumentType enum value to its corresponding legacy string format
 * Used for backward compatibility with older components
 * @param {DocumentType} type - The DocumentType enum value to convert
 * @returns {LegacyDocumentTypeString} The legacy string format
 */
export function toLegacyDocumentTypeString(type: DocumentType): LegacyDocumentTypeString {
  switch (type) {
    case DocumentType.INVOICE:
      return 'invoice';
    case DocumentType.ESTIMATE:
      return 'estimate';
    case DocumentType.PURCHASE_ORDER:
      return 'purchaseOrder';
    default:
      // This should never happen if all enum values are handled
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled document type: ${exhaustiveCheck}`);
  }
}

/**
 * Gets the correct backend key format for a document type
 * @param {DocumentType | string} documentType - The document type to convert
 * @returns {string} The backend key format (e.g., 'purchase_order' for PURCHASE_ORDER)
 */
export function getBackendDocumentTypeKey(documentType: DocumentType | string): string {
  const normalized = normalizeDocumentType(documentType);
  return normalized.toLowerCase();
}

/**
 * Type to map document types to their corresponding interfaces
 */
export type DocumentTypeMap = {
  [DocumentType.INVOICE]: Invoice;
  [DocumentType.PURCHASE_ORDER]: PurchaseOrder;
  [DocumentType.ESTIMATE]: Estimate;
};
