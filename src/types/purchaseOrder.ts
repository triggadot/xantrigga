
import { EntityBase, EntityStatus, EntityWithAmount } from './common';
import { GlAccount } from './accounts';

export interface PurchaseOrder extends Omit<EntityBase, 'created_at'>, EntityWithAmount {
  number?: string;
  date?: Date | string;
  status: string;
  vendorId?: string;
  vendorName?: string;
  vendor?: GlAccount;
  notes?: string;
  lineItems: PurchaseOrderLineItem[];
  vendorPayments: VendorPayment[];
  products?: any[];
  payments?: any[];
  // Additional fields for the detail view
  subtotal?: number;
  tax?: number;
  dueDate?: Date | string;
  amountPaid?: number;
  balance?: number;
  total?: number;
  total_paid?: number;
  rowid_accounts?: string;
  glide_row_id: string;
  total_amount: number;
  created_at: string; // Required but separate from EntityBase
  updated_at?: string; // Optional for future compatibility
}

export interface PurchaseOrderLineItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  description?: string;
  productId?: string;
  productDetails?: any;
  product_name?: string;
  unit_price?: number;
  notes?: string; // Added notes field
}

export interface VendorPayment {
  id: string;
  amount: number;
  date?: Date | string;
  method?: string;
  notes?: string;
  vendorId?: string; // Add vendorId to fix type errors
}

export interface PurchaseOrderWithVendor {
  id: string;
  number: string;
  date: Date | string;
  status: string; // Changed from EntityStatus to string
  vendorId: string;
  vendorName: string;
  total: number;
  balance: number;
  totalPaid: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderFilters {
  status?: string;
  vendorId?: string;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}
